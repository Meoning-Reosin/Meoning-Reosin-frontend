/**
 * 관련 장소 찾기 (S14, S15).
 *
 * 백엔드에 '관련 장소' API 가 아직 없어서, 기준 장소의 카테고리마다 GET /places?category_id= 를 불러
 * 같은 카테고리를 가진 장소를 모은다. 겹치는 카테고리가 많은 장소가 앞에 온다.
 * TODO(백엔드): 추천 API(카테고리 점수 / RAG 연관 설명)가 생기면 그걸로 바꾼다.
 */
import { listPlaces } from '../api/places.js'

/**
 * @returns {Promise<Array<{place, shared: Array<{category_id, name}>}>>}
 */
export async function findRelatedPlaces(origin) {
  const byId = new Map()
  const lists = await Promise.all(
    origin.categories.map((category) =>
      listPlaces({ category_id: category.category_id, size: 100 }).then((data) => [category, data.items ?? []]),
    ),
  )
  for (const [category, places] of lists) {
    for (const place of places) {
      if (place.place_id === origin.place_id) continue
      const entry = byId.get(place.place_id) ?? { place, shared: [] }
      entry.shared.push(category)
      byId.set(place.place_id, entry)
    }
  }
  return [...byId.values()].sort((a, b) => b.shared.length - a.shared.length)
}
