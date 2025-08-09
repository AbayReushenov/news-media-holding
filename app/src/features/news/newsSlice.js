import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { fetchPostsPage } from '../../shared/api/posts'
import { PAGE_SIZE } from './constants'

export const fetchPosts = createAsyncThunk(
  'news/fetchPosts',
  async ({ skip }, { rejectWithValue }) => {
    try {
      return await fetchPostsPage({ skip, limit: PAGE_SIZE })
    } catch (error) {
      return rejectWithValue(error?.message || 'Unknown error')
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
        const existingIds = new Set(state.items.map((p) => p.id))
        const newUniquePosts = posts.filter((p) => !existingIds.has(p.id))

        if (state.items.length === 0) {
          state.items = newUniquePosts
          state.minSkip = skip
          state.skip = skip + PAGE_SIZE
          state.lastChange = null
        } else if (skip < state.minSkip) {
          state.items = [...newUniquePosts, ...state.items]
          state.minSkip = Math.min(state.minSkip, skip)
          state.lastChange = 'prepend'
        } else {
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
