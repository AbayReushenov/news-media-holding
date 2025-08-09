import { retry } from '../lib/retry'
import { API_BASE_URL } from './constants'
import { PAGE_SIZE } from '../../features/news/constants'

function parseError(e) {
  if (e?.message) return e.message
  try {
    return JSON.stringify(e)
  } catch {
    return 'Unknown error'
  }
}

export async function fetchPostsPage({ skip, limit = PAGE_SIZE }) {
  return retry(async () => {
    const url = `${API_BASE_URL}/posts?limit=${limit}&skip=${skip}&sortBy=id&order=asc`
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error(`Request failed: ${res.status}`)
    }
    const data = await res.json()
    const posts = Array.isArray(data?.posts) ? data.posts : []
    posts.sort((a, b) => (a?.id ?? 0) - (b?.id ?? 0))
    return {
      posts,
      total: Number.isFinite(data?.total) ? data.total : 0,
      skip: Number.isFinite(data?.skip) ? data.skip : skip,
    }
  }).catch((e) => {
    throw new Error(parseError(e))
  })
}
