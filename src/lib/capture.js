/**
 * 사진 인식 흐름에서 화면끼리 주고받는 값.
 *
 * - 고른 사진: 촬영(S09)·갤러리 → 미리보기(S10-A) → 실패(S11) 화면이 같은 사진을 쓴다.
 *   File 은 주소나 저장소에 넣을 수 없어서 메모리에 둔다 (새로고침하면 사라짐).
 * - 사진 접근 동의(S09-A): 브라우저에 기억한다.
 *   로그인했으면 Capture 화면이 PATCH /users/me/consents 로 camera, photo_training 도 보낸다.
 */
import { local } from './storage.js'

export const MAX_IMAGE_MB = 10 // 백엔드 RECOGNITION_MAX_IMAGE_MB 와 같게

// --- 고른 사진 ---
let photo = null // { file: File|Blob, url: string, source: 'camera'|'gallery' }

export function setCapturedPhoto(file, source) {
  if (photo) URL.revokeObjectURL(photo.url)
  photo = { file, url: URL.createObjectURL(file), source }
  return photo
}

export const getCapturedPhoto = () => photo

// --- 사진 접근 동의 ---
export const photoAccessAgreed = () => local.get('photo_access', false)

export function agreePhotoAccess(training) {
  local.set('photo_access', true)
  local.set('photo_training', Boolean(training))
}

/**
 * 기기의 사진 선택 창(또는 휴대폰 카메라 앱)을 연다. 버튼을 누른 순간에 불러야 브라우저가 막지 않는다.
 * @param {{camera?: boolean, onPick: (file: File) => void, onError: (message: 'type'|'size') => void}} options
 */
export function openPhotoPicker({ camera = false, onPick, onError }) {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  if (camera) input.capture = 'environment'
  input.onchange = () => {
    const file = input.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return onError('type')
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) return onError('size')
    onPick(file)
  }
  input.click()
}
