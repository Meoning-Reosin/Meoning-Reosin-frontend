/**
 * 모든 화면을 감싸는 틀.
 * 프로토타입의 <main id="app"><div id="screen">…</div></main> 구조를 그대로 써서
 * base.css / app.css 의 #app, #screen 스타일(가운데 480px 모바일 화면)이 적용되게 한다.
 */
import { Outlet, useLocation } from 'react-router-dom'

export default function AppShell() {
  const { pathname } = useLocation()

  return (
    <main id="app">
      {/* key 를 주소로 두면 화면이 바뀔 때마다 프로토타입의 fade 애니메이션이 다시 돈다. */}
      <div id="screen" key={pathname}>
        <Outlet />
      </div>
    </main>
  )
}
