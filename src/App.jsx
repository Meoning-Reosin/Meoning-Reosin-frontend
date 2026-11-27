/**
 * 화면 주소(라우트) 목록. 주석의 S00 은 스토리보드 V2 화면 ID.
 *
 * 첫 진입: /opening(S01) → /language(S02) → /location(S06) → /privacy-consent(S06-A) → /(S07)
 * 이번 탭에서 첫 진입을 안 마쳤으면 홈(/)에 들어올 때 오프닝(또는 언어 선택)으로 보낸다.
 */
import { Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './components/AppShell.jsx'
import { entryDone, introPlayed } from './lib/entryFlow.js'
import Account from './pages/Account.jsx'
import CameraPage from './pages/CameraPage.jsx'
import Capture from './pages/Capture.jsx'
import ComingSoon from './pages/ComingSoon.jsx'
import CourseDetail from './pages/CourseDetail.jsx'
import Courses from './pages/Courses.jsx'
import Credits from './pages/Credits.jsx'
import Events from './pages/Events.jsx'
import Home from './pages/Home.jsx'
import Language from './pages/Language.jsx'
import LocationConsent from './pages/LocationConsent.jsx'
import Login from './pages/Login.jsx'
import LoginDone from './pages/LoginDone.jsx'
import Menu from './pages/Menu.jsx'
import Opening from './pages/Opening.jsx'
import PhotoReview from './pages/PhotoReview.jsx'
import PlaceDetail from './pages/PlaceDetail.jsx'
import Places from './pages/Places.jsx'
import PrivacyConsent from './pages/PrivacyConsent.jsx'
import Profile from './pages/Profile.jsx'
import RecognitionFailed from './pages/RecognitionFailed.jsx'
import RelatedPlaces from './pages/RelatedPlaces.jsx'
import Relation from './pages/Relation.jsx'
import Search from './pages/Search.jsx'
import Settings from './pages/Settings.jsx'
import Signup from './pages/Signup.jsx'

/** 첫 진입을 마친 뒤에만 홈을 보여 준다. */
function EntryGate({ children }) {
  if (entryDone()) return children
  return <Navigate to={introPlayed() ? '/language' : '/opening'} replace />
}

// 아직 옮기지 않은 화면: [주소, 제목 [한, 영], 옮길 브랜치]
const COMING_SOON = [
  ['/itineraries', ['내 여행 일정', 'My walks'], 'itinerary'],
  ['/favorites', ['내 찜 목록', 'My favorites'], 'bookmark'],
  ['/community', ['전체 공개 코스', 'Community walks'], 'public-course'],
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

        {/* S07 홈(+ S03~S05 온보딩), S07-A 전체 메뉴, S07-E 서울 행사 소식, S08 장소 검색 */}
        <Route index element={<EntryGate><Home /></EntryGate>} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/events" element={<Events />} />
        <Route path="/search" element={<Search />} />

        {/* S16 관광지·지도, S12-1~4 장소 상세(+ S12-S 공유), S14 관련 장소, S15 연관 설명, 추천 코스, S20-A 출처 */}
        <Route path="/places" element={<Places />} />
        <Route path="/places/:placeId" element={<PlaceDetail />} />
        <Route path="/places/:placeId/related" element={<RelatedPlaces />} />
        <Route path="/places/:placeId/related/:targetId" element={<Relation />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:courseId" element={<CourseDetail />} />
        <Route path="/credits" element={<Credits />} />

        {/* S09-A 사진 접근 동의(+ 촬영·갤러리 선택), S09 카메라, S10-A 미리보기 → S10 인식 중, S11 인식 실패 */}
        <Route path="/capture" element={<Capture />} />
        <Route path="/capture/camera" element={<CameraPage />} />
        <Route path="/capture/review" element={<PhotoReview />} />
        <Route path="/capture/failed" element={<RecognitionFailed />} />

        {/* S17 로그인(+ 로그인 후 돌아오는 /login/done), S18 가입 동의, S17-A·S23 마이페이지, S23-A·S23-D 계정, S20 설정 */}
        <Route path="/login" element={<Login />} />
        <Route path="/login/done" element={<LoginDone />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/account" element={<Account />} />
        <Route path="/settings" element={<Settings />} />

        {COMING_SOON.map(([path, title, branch]) => (
          <Route key={path} path={path} element={<ComingSoon title={title} branch={branch} />} />
        ))}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
