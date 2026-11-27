/**
 * S17 로그인 · 회원가입. 주소: /login
 * 'Google로 계속하기'를 누르면 백엔드 로그인 시작 주소로 페이지를 옮긴다 (API 5, 리다이렉트 방식).
 *   → Google 화면 → 백엔드 콜백 → 기존 회원은 /login/done, 처음 온 사람은 /signup 으로 돌아온다.
 *   (백엔드 .env 의 FRONTEND_URL, FRONTEND_SIGNUP_URL 이 이 두 주소여야 한다)
 * 로그인 후 돌아갈 곳은 state.next (없으면 마이페이지).
 */
import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { GOOGLE_LOGIN_URL } from '../api/auth.js'
import { saveLoginNext, useAuth } from '../auth/AuthContext.jsx'
import Header from '../components/Header.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import notify from '../lib/notify.js'

export default function Login() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const location = useLocation()
  const next = location.state?.next
  const error = new URLSearchParams(location.search).get('login_error')

  useEffect(() => {
    if (error) notify(t('로그인을 취소했어요.', 'Sign-in was cancelled.'))
  }, [error, t])

  if (user) return <Navigate to={next || '/profile'} replace />

  function continueWithGoogle() {
    saveLoginNext(next)
    window.location.href = GOOGLE_LOGIN_URL
  }

  return (
    <>
      <Header />
      <main className="pad bottomspace">
        <h1>{t('로그인 · 회원가입', 'Sign in or join')}</h1>
        <p>{t('일정 저장과 프로필 편집은 로그인 후 이용할 수 있어요.', 'Sign in to save plans and edit your profile.')}</p>
        <section className="auth-panel">
          <p>Google</p>
          <button className="primary" onClick={continueWithGoogle}>
            {t('Google로 계속하기', 'Continue with Google')}
          </button>
          <p className="small">
            {t(
              '처음이면 약관 동의 후 가입이 끝나요. 지금은 테스트 사용자로 등록된 Google 계정만 로그인돼요.',
              'First-time users agree to the terms to finish joining. Only registered test accounts can sign in for now.',
            )}
          </p>
        </section>
      </main>
    </>
  )
}
