/**
 * 첫 진입 흐름: 오프닝(S01) → 언어 선택(S02) → 위치정보 동의(S06) → 개인정보 동의(S06-A) → 홈(S07)
 *
 * 프로토타입과 같은 규칙
 * - 오프닝 영상은 탭(세션)마다 한 번만 튼다. 이미 봤으면 언어 선택부터.
 * - 위치를 '항상 허용' 했으면 위치 동의 화면을 건너뛴다.
 * - 개인정보 동의를 이미 골랐으면(동의/거부) 그 화면도 건너뛴다.
 */
import { local, session } from './storage.js'

// --- 오프닝 ---
export const introPlayed = () => session.get('intro_played', false)
export const markIntroPlayed = () => session.set('intro_played', true)

// --- 첫 진입을 마쳤는지 (이번 탭에서) ---
export const entryDone = () => session.get('entry_done', false)
export const markEntryDone = () => session.set('entry_done', true)

// --- 위치 동의: 'always' 는 계속 기억하고, 'once' 는 이번 탭에서만 ---
export function locationChoice() {
  return local.get('location_choice', '') || session.get('location_choice', '')
}

export function setLocationChoice(choice) {
  local.set('location_choice', choice === 'always' ? 'always' : '')
  session.set('location_choice', choice === 'once' ? 'once' : '')
  if (choice === 'denied') local.set('location_choice', 'denied')
}

export const locationAlwaysAllowed = () => locationChoice() === 'always'
export const locationAllowed = () => ['always', 'once'].includes(locationChoice())

// --- 개인정보 수집·이용 동의 (S06-A): 'agreed' | 'declined' | '' ---
// TODO(auth 브랜치): 로그인 후 가입 마치기(API 6)에 이 값을 agree_privacy 로 보낸다.
export const privacyConsent = () => local.get('privacy_consent', '')
export const setPrivacyConsent = (value) => local.set('privacy_consent', value)

/** 언어 선택 다음에 갈 화면 */
export function nextAfterLanguage() {
  if (!locationAlwaysAllowed()) return '/location'
  return nextAfterLocation()
}

/** 위치 동의 다음에 갈 화면 */
export function nextAfterLocation() {
  if (privacyConsent()) return finishEntry()
  return '/privacy-consent'
}

/** 첫 진입을 끝내고 홈으로. '다시 보지 않기'를 안 골랐으면 홈에서 온보딩(S03~S05)을 띄운다. */
export function finishEntry() {
  markEntryDone()
  if (!local.get('skip_tutorial', false)) session.set('coach_pending', true)
  return '/'
}

// --- 온보딩 (S03~S05): 홈 위에 뜨는 3단계 안내 ---
export const coachPending = () => session.get('coach_pending', false)

export function finishCoach(skipNextTime) {
  session.set('coach_pending', false)
  local.set('skip_tutorial', skipNextTime)
}
