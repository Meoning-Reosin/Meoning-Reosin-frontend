/**
 * 백엔드 호출 공통 처리.
 *
 * - 주소 앞부분(/api/v1)을 붙인다.
 * - 로그인은 쿠키(wcc_access, wcc_refresh)로 하므로 credentials: 'include' 로 쿠키를 함께 보낸다.
 * - 화면 언어를 Accept-Language 헤더로 보낸다 (백엔드가 ko/en 으로 답한다).
 * - 401(로그인 만료)이면 /auth/refresh 로 토큰을 한 번 새로 받고 다시 시도한다.
 * - 실패하면 백엔드 오류 형식 {"detail": {"code", "message"}} 을 ApiError 로 던진다.
 */

const API_BASE = (import.meta.env.VITE_API_BASE ?? '/api/v1').replace(/\/$/, '')

let language = 'ko'

/** 화면 언어가 바뀌면 호출한다. 이후 요청은 이 언어로 답을 받는다. */
export function setApiLanguage(lang) {
  language = lang
}

export class ApiError extends Error {
  constructor(status, code, message) {
    super(message)
    this.status = status
    this.code = code
  }
}

function buildUrl(path, query) {
  const url = API_BASE + path
  if (!query) return url
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== '') params.append(key, value)
  }
  const text = params.toString()
  return text ? `${url}?${text}` : url
}

async function send(path, { method = 'GET', query, body } = {}) {
  const headers = { 'Accept-Language': language }
  let payload = body
  // FormData(사진 업로드)는 브라우저가 Content-Type 을 직접 정하게 둔다.
  if (body !== undefined && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
    payload = JSON.stringify(body)
  }
  return fetch(buildUrl(path, query), { method, headers, body: payload, credentials: 'include' })
}

async function toError(response) {
  let code = 'UNKNOWN'
  let message = `요청에 실패했어요 (${response.status})`
  try {
    const data = await response.json()
    if (data?.detail?.code) {
      code = data.detail.code
      message = data.detail.message ?? message
    }
  } catch {
    // 본문이 JSON 이 아니면 기본 문구를 쓴다.
  }
  return new ApiError(response.status, code, message)
}

/**
 * 백엔드를 부른다. 성공하면 JSON(204면 null)을 돌려준다.
 * @param {string} path  예: '/places'
 * @param {{method?: string, query?: object, body?: object|FormData, retry?: boolean}} options
 */
export async function request(path, options = {}) {
  let response = await send(path, options)

  const canRefresh = options.retry !== false && !path.startsWith('/auth/')
  if (response.status === 401 && canRefresh) {
    const refreshed = await send('/auth/refresh', { method: 'POST' })
    if (refreshed.ok) response = await send(path, options)
  }

  if (!response.ok) throw await toError(response)
  if (response.status === 204) return null
  return response.json()
}

/** 구글 로그인 시작 주소. 이 주소로 페이지를 이동시키면 된다 (fetch 아님). */
export const GOOGLE_LOGIN_URL = `${API_BASE}/auth/oauth/google/start`
