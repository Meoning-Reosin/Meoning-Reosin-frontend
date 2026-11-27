// 찜 API (명세 20~22). 로그인 필요.
import { request } from './client.js'

export const listBookmarks = (query) => request('/bookmarks', { query })

/** 돌려받는 값: {place_id, bookmark_count} */
export const addBookmark = (placeId) => request('/bookmarks', { method: 'POST', body: { place_id: placeId } })

export const removeBookmark = (placeId) => request(`/bookmarks/${placeId}`, { method: 'DELETE' })
