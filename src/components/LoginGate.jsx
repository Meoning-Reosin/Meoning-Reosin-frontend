/**
 * 로그인해야 볼 수 있는 화면의 안쪽을 감싼다.
 *   <LoginGate next="/itineraries">...로그인했을 때 보여 줄 내용...</LoginGate>
 * 로그인 확인 중이면 '불러오는 중', 로그인 안 했으면 안내 문구와 로그인 버튼(누르면 S17-P 창).
 */
import { useAuth } from '../auth/AuthContext.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'

export default function LoginGate({ next, message, children }) {
  const { t } = useLanguage()
  const { user, loading, requireLogin } = useAuth()

  if (loading) return <p className="small">{t('불러오는 중…', 'Loading…')}</p>
  if (!user)
    return (
      <>
        <p>{message || t('로그인하면 여행 일정을 만들고 저장할 수 있어요.', 'Sign in to create and save your walks.')}</p>
        <button className="primary" onClick={() => requireLogin(next)}>
          {t('로그인', 'Sign in')}
        </button>
      </>
    )
  return children
}
