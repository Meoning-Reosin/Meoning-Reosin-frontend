/**
 * S07-A 전체 메뉴. 아직 안 만든 화면으로 가는 줄은 '준비 중' 화면이 뜬다.
 * TODO(auth 브랜치): 로그인 상태면 맨 아래에 '로그아웃' 줄을 보여 준다.
 */
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'

function MenuRow({ label, sub = '', onClick }) {
  return (
    <button className="listbutton" onClick={onClick}>
      <span>{label}</span>
      <span className="small">{sub}　›</span>
    </button>
  )
}

export default function Menu() {
  const { lang, t } = useLanguage()
  const navigate = useNavigate()
  const go = (to, state) => () => navigate(to, { state })

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
    [
      'Settings',
      [
        { label: t('서비스 설정', 'Service settings'), onClick: go('/settings') },
        // 프로토타입은 서비스 설정 안에 있었다. 설정 화면(auth 브랜치)이 생기면 그쪽으로 옮겨도 된다.
        { label: t('콘텐츠 출처', 'Content credits'), onClick: go('/credits') },
      ],
    ],
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
      </main>
    </>
  )
}
