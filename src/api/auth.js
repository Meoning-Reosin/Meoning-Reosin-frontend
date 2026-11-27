// 회원 API (명세 5~10, 40~43). 로그인 자체는 GOOGLE_LOGIN_URL 로 페이지를 이동시켜 시작한다.
import { request } from './client.js'

export { GOOGLE_LOGIN_URL } from './client.js'

/** 가입 마치기 (구글 로그인 후 처음 온 사람). body: {agree_terms, agree_privacy, agree_location, ...} */
export const signup = (body) => request('/auth/oauth/signup', { method: 'POST', body })

export const logout = () => request('/auth/logout', { method: 'POST' })

/** 내 정보. 로그인 안 했으면 ApiError(401) */
export const getMe = () => request('/users/me')

/** body: {nickname?, language?} */
export const updateMe = (body) => request('/users/me', { method: 'PATCH', body })

export const deleteAccount = () => request('/users/me', { method: 'DELETE' })

export const getConsents = () => request('/users/me/consents')

export const updateConsents = (body) => request('/users/me/consents', { method: 'PATCH', body })
