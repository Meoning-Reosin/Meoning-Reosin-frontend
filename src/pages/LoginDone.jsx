/**
 * 로그인 후 돌아오는 화면 (화면 ID 없음). 주소: /login/done
 * 백엔드 콜백이 로그인 쿠키를 심고 여기로 보낸다. 내 정보를 확인한 뒤 원래 가려던 곳으로 보낸다.
 * Google 화면에서 취소하면 ?login_error=access_denied 가 붙어서 온다.
 */
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { takeLoginNext, useAuth } from '../auth/AuthContext.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import notify from '../lib/notify.js'

export default function LoginDone() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { refreshUser } = useAuth()

  useEffect(() => {
    let cancelled = false
    async function finish() {
      if (params.get('login_error')) {
        navigate('/login?login_error=1', { replace: true })
        return
      }
      const me = await refreshUser()
      if (cancelled) return
      if (me) {
        notify(t('Google로 로그인했어요.', 'Signed in with Google.'))
        navigate(takeLoginNext(), { replace: true })
      } else {
        notify(t('로그인하지 못했어요. 다시 시도해 주세요.', 'Could not sign in. Please try again.'))
        navigate('/login', { replace: true })
      }
    }
    finish()
    return () => {
      cancelled = true
    }
    // 한 번만 실행
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <main className="pad">
      <p className="small">{t('로그인을 확인하고 있어요…', 'Checking your sign-in…')}</p>
    </main>
  )
}
