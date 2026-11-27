/**
 * 화면 아래에 잠깐 떴다 사라지는 안내 문구 (프로토타입 notify, .toast 스타일).
 *   notify(t('링크를 복사했어요.', 'Link copied.'))
 */
let timer = null

export default function notify(message) {
  document.querySelector('.toast')?.remove()
  const toast = document.createElement('div')
  toast.className = 'toast'
  toast.setAttribute('role', 'status')
  toast.textContent = message
  ;(document.getElementById('app') || document.body).append(toast)
  clearTimeout(timer)
  timer = setTimeout(() => toast.remove(), 2700)
}
