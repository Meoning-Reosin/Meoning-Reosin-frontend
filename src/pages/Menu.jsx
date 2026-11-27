/**
 * S07-A 전체 메뉴. 아직 안 만든 화면으로 가는 줄은 '준비 중' 화면이 뜬다.
 * 로그인 상태면 맨 아래에 '로그아웃' 줄이 나온다.
 */
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'
import Header from '../components/Header.jsx'
import MenuRow from '../components/MenuRow.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import notify from '../lib/notify.js'

export default function Menu() {
  const { lang, t } = useLanguage()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const go = (to, state) => () => navigate(to, { state })

  async function signOut() {
    try {
      await logout()
      notify(t('로그아웃했어요.', 'Signed out.'))
    } catch {
      notify(t('로그아웃을 완료하지 못했어요.', 'Could not sign out.'))
    }
  }

  const groups = [
    [
      'Language',
      [
        {
          label: t('언어 선택', 'Language selection'),
          sub: lang === 'ko' ? '한국어' : 'English',
          onClick: go('/language', { fromMenu: true }),
        },
      ],
    ],
    [
      'My Page',
      [
        { label: t('마이페이지', 'Profile'), onClick: go('/profile') },
        { label: t('내 찜 목록', 'My favorites'), onClick: go('/favorites') },
        { label: t('내 여행 일정', 'My walks'), onClick: go('/itineraries') },
      ],
    ],
    [
      'Explore Seoul',
      [
        { label: t('서울 축제', 'Seoul events'), onClick: go('/events') },
        { label: t('이용자 추천 코스', 'Community walks'), onClick: go('/community') },
      ],
    ],
    ['Settings', [{ label: t('서비스 설정', 'Service settings'), onClick: go('/settings') }]],
  ]

  return (
    <>
      <Header title="Menu" logo={false} home />
      <main className="pad bottomspace">
        {groups.map(([label, rows]) => (
          <section key={label} className="sw-menu-group">
            <h2 className="english-title">{label}</h2>
            {rows.map((row) => (
              <MenuRow key={row.label} {...row} />
            ))}
          </section>
        ))}
        {user && (
          <div className="sw-menu-account">
            <MenuRow label={t('로그아웃', 'Sign out')} onClick={signOut} />
          </div>
        )}
      </main>
    </>
  )
}
