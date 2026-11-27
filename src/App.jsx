/**
 * 화면 주소(라우트) 목록.
 *
 * 프로토타입의 화면(screen 변수)을 하나씩 pages/ 로 옮기면서 여기에 주소를 추가한다.
 * 화면 이름은 스토리보드 V2 화면 ID(S01~S25)에 맞춘다.
 */
import { Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './components/AppShell.jsx'
import ConnectionCheck from './pages/ConnectionCheck.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        {/* 임시: 홈 화면을 옮기기 전까지 연결 확인 화면을 보여 준다. */}
        <Route index element={<ConnectionCheck />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
