import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const PAGE_SIZE = 10

export const fetchPosts = createAsyncThunk(
  'news/fetchPosts',
  async ({ skip }, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://dummyjson.com/posts?limit=${PAGE_SIZE}&skip=${skip}&sortBy=id&order=asc`)
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`)
      }
      const data = await response.json()
      // Ensure deterministic ascending order by id
      const sortedPosts = (data.posts ?? []).slice().sort((a, b) => a.id - b.id)
      return {
        posts: sortedPosts,
        total: data.total ?? 0,
        skip: data.skip ?? skip,
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Unknown error')
    }
  }
)

const initialState = {
  items: [],
  total: 0,
  skip: 0, // next skip to fetch downward
  minSkip: 0, // minimal skip currently loaded (for potential upward loading)
  isLoading: false,
  error: null,
  hasMore: true,
  firstPageRequested: false,
  reachedTop: true, // we start at the top-most page
  lastChange: null, // 'prepend' | 'append' | null
}

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.isLoading = true
        state.error = null
        if (action.meta?.arg?.skip === 0) {
          state.firstPageRequested = true
        }
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        const { posts, total, skip } = action.payload
        // Deduplicate by id while preserving order
        const existingIds = new Set(state.items.map((p) => p.id))
        const newUniquePosts = posts.filter((p) => !existingIds.has(p.id))

        if (state.items.length === 0) {
          state.items = newUniquePosts
          state.minSkip = skip // should be 0 on first page
          state.skip = skip + PAGE_SIZE
          state.reachedTop = skip === 0
          state.lastChange = null
        } else if (skip < state.minSkip) {
          // Prepend earlier page
          state.items = [...newUniquePosts, ...state.items]
          state.minSkip = Math.min(state.minSkip, skip)
          state.reachedTop = skip === 0
          state.lastChange = 'prepend'
        } else {
          // Append next page
          state.items = [...state.items, ...newUniquePosts]
          state.skip = Math.max(state.skip, skip + PAGE_SIZE)
          state.lastChange = 'append'
        }

        state.total = total
        state.isLoading = false
        state.hasMore = state.items.length < total
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || 'Failed to load posts'
      })
  },
})

export const { reset } = newsSlice.actions
export default newsSlice.reducer
export const selectNews = (state) => state.news
