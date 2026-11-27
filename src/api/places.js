// 관광지·카테고리·코스 API (명세 11~13, 16, 17, 32, 33). 로그인 없이도 부를 수 있다.
import { request } from './client.js'

/** query: {q, category_id, group, sort: 'distance'|'bookmarks'|'name', lat, lng, page, size} */
export const listPlaces = (query) => request('/places', { query })

export const getPlace = (placeId) => request(`/places/${placeId}`)

export const getOperatingInfo = (placeId) => request(`/places/${placeId}/operating-info`)

export const getScript = (placeId) => request(`/places/${placeId}/script`)

/** group: 'history' | 'sns' | 'content' | 'festival' */
export const listCategories = (group) => request('/categories', { query: { group } })

/** query: {category_id, group, page, size} */
export const listCourses = (query) => request('/courses', { query })

export const getCourse = (courseId) => request(`/courses/${courseId}`)
