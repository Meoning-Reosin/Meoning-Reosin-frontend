/**
 * 화면 주소(라우트) 목록. 주석의 S00 은 스토리보드 V2 화면 ID.
 *
 * 첫 진입: /opening(S01) → /language(S02) → /location(S06) → /privacy-consent(S06-A) → /(S07)
 * 이번 탭에서 첫 진입을 안 마쳤으면 홈(/)에 들어올 때 오프닝(또는 언어 선택)으로 보낸다.
 */
import { Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './components/AppShell.jsx'
import { entryDone, introPlayed } from './lib/entryFlow.js'
import ComingSoon from './pages/ComingSoon.jsx'
import Home from './pages/Home.jsx'
import Language from './pages/Language.jsx'
import LocationConsent from './pages/LocationConsent.jsx'
import Menu from './pages/Menu.jsx'
import Opening from './pages/Opening.jsx'
import PrivacyConsent from './pages/PrivacyConsent.jsx'

/** 첫 진입을 마친 뒤에만 홈을 보여 준다. */
function EntryGate({ children }) {
  if (entryDone()) return children
  return <Navigate to={introPlayed() ? '/language' : '/opening'} replace />
}

// 아직 옮기지 않은 화면: [주소, 제목 [한, 영], 옮길 브랜치]
const COMING_SOON = [
  ['/places', ['관광지', 'Places'], 'place'],
  ['/capture', ['사진 촬영', 'Capture'], 'recognition'],
  ['/itineraries', ['내 여행 일정', 'My walks'], 'itinerary'],
  ['/profile', ['마이페이지', 'Profile'], 'auth'],
  ['/favorites', ['내 찜 목록', 'My favorites'], 'bookmark'],
  ['/events', ['서울 행사 소식', 'Seoul events'], 'home'],
  ['/community', ['전체 공개 코스', 'Community walks'], 'public-course'],
  ['/settings', ['서비스 설정', 'Service settings'], 'auth'],
]

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        {/* 첫 진입: S01 오프닝, S02 언어 선택, S06 위치 동의, S06-A 개인정보 동의 */}
        <Route path="/opening" element={<Opening />} />
        <Route path="/language" element={<Language />} />
        <Route path="/location" element={<LocationConsent />} />
        <Route path="/privacy-consent" element={<PrivacyConsent />} />

        {/* S07 홈, S07-A 전체 메뉴 */}
        <Route index element={<EntryGate><Home /></EntryGate>} />
        <Route path="/menu" element={<Menu />} />

        {COMING_SOON.map(([path, title, branch]) => (
          <Route key={path} path={path} element={<ComingSoon title={title} branch={branch} />} />
        ))}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
