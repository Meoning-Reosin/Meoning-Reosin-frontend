/**
 * 하단 메뉴 5칸 (프로토타입 v20Nav): 홈 · 관광지 · 촬영 · 내 일정 · 마이페이지
 *
 * app.css 규칙상 #screen 의 "바로 아래 자식"이어야 화면 아래 여백이 맞는다.
 * 그래서 각 화면 컴포넌트의 맨 마지막에 <BottomNav /> 를 둔다.
 * 프로토타입 CSS 가 `.sw-tabs button` 을 꾸미므로 링크(a)가 아니라 버튼으로 만든다.
 */
import { useLayoutEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import Icon from './icons.jsx'

const ENTRIES = [
  { to: '/', icon: 'home', ko: '홈', en: 'Home' },
  { to: '/places', icon: 'map', ko: '관광지', en: 'Places' },
  { to: '/capture', icon: 'cam', ko: '촬영', en: 'Capture' },
  { to: '/itineraries', icon: 'plan', ko: '내 일정', en: 'My walks' },
  { to: '/profile', icon: 'person', ko: '마이페이지', en: 'Profile' },
]

function isActive(to, pathname) {
  return to === '/' ? pathname === '/' : pathname === to || pathname.startsWith(to + '/')
}

export default function BottomNav() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const ref = useRef(null)

  // 하단 메뉴 높이를 --tab-safe 로 알려 준다 (해치 버튼, 지도 높이 계산에 쓰임).
  useLayoutEffect(() => {
    const nav = ref.current
    const root = document.documentElement
    const update = () => root.style.setProperty('--tab-safe', Math.ceil(nav.getBoundingClientRect().height) + 'px')
    update()
    const observer = new ResizeObserver(update)
    observer.observe(nav)
    return () => {
      observer.disconnect()
      root.style.removeProperty('--tab-safe')
    }
  }, [])

  return (
    <nav ref={ref} className="nav sw-tabs" aria-label={t('하단 메뉴', 'Main navigation')}>
      {ENTRIES.map((entry) => {
        const active = isActive(entry.to, pathname)
        return (
          <button
            key={entry.to}
            id={`tab-${entry.icon}`}
            className={active ? 'active' : undefined}
            aria-current={active ? 'page' : undefined}
            onClick={() => navigate(entry.to)}
          >
            <span className={entry.icon === 'cam' ? 'cam-tab' : undefined}>
              <Icon name={entry.icon} />
            </span>
            {t(entry.ko, entry.en)}
          </button>
        )
      })}
    </nav>
  )
}
