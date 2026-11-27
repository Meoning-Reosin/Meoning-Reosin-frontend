// 사진 인식 API (명세 1). 사진 1장과 (있으면) 현재 위치를 보낸다.
import { request } from './client.js'

/** image: input[type=file] 에서 고른 File */
export function recognize(image, { lat, lng } = {}) {
  const form = new FormData()
  form.append('image', image)
  if (lat != null && lng != null) {
    form.append('lat', lat)
    form.append('lng', lng)
  }
  return request('/recognitions', { method: 'POST', body: form })
}
