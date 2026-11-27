// 여행 일정 API (명세 23~31). 로그인 필요.
import { request } from './client.js'

/** placeId 를 주면 각 일정에 contains_place(이미 담겼는지)가 함께 온다. */
export const listItineraries = ({ placeId, page, size } = {}) =>
  request('/itineraries', { query: { place_id: placeId, page, size } })

/** body: {title?, travel_date?} */
export const createItinerary = (body = {}) => request('/itineraries', { method: 'POST', body })

/** lat/lng 를 주면 장소까지 거리가 함께 온다. */
export const getItinerary = (itineraryId, { lat, lng } = {}) =>
  request(`/itineraries/${itineraryId}`, { query: { lat, lng } })

/** body: {title?, travel_date?} */
export const updateItinerary = (itineraryId, body) =>
  request(`/itineraries/${itineraryId}`, { method: 'PATCH', body })

export const deleteItinerary = (itineraryId) => request(`/itineraries/${itineraryId}`, { method: 'DELETE' })

/** 같은 장소를 두 번 담으면 ApiError(409) */
export const addPlaceToItinerary = ({ itineraryId, placeId, memo }) =>
  request('/itineraries/items', { method: 'POST', body: { itinerary_id: itineraryId, place_id: placeId, memo } })

/** itineraryId 를 안 주면 코스 이름으로 새 일정을 만들어 담는다. */
export const addCourseToItinerary = ({ courseId, itineraryId }) =>
  request('/itineraries/courses', { method: 'POST', body: { course_id: courseId, itinerary_id: itineraryId } })

/** body: {visit_order?, memo?, visited?} */
export const updateItineraryItem = (itineraryId, itemId, body) =>
  request(`/itineraries/${itineraryId}/items/${itemId}`, { method: 'PATCH', body })

export const removeItineraryItem = (itineraryId, itemId) =>
  request(`/itineraries/${itineraryId}/items/${itemId}`, { method: 'DELETE' })
