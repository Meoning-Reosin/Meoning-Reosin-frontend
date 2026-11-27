/**
 * 로그인 상태를 앱 전체에서 쓴다.
 *
 *   const { user, loading, refreshUser, logout, requireLogin } = useAuth()
 *   user: 로그인했으면 백엔드 내 정보(GET /users/me), 아니면 null
 *   requireLogin(next): 로그인 안 했으면 '로그인해 주세요' 창(S17-P)을 띄우고 false.
 *                       로그인했으면 true. next 는 로그인 후 돌아올 주소.
 *
 * 로그인은 쿠키로 한다(백엔드가 wcc_access / wcc_refresh 를 심음). 그래서 앱을 열 때 /users/me 로 확인만 하면 된다.
 * 액세스 토큰이 만료되면 api/client.js 가 /auth/refresh 로 알아서 새로 받는다.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as authApi from '../api/auth.js'
import LoginRequiredDialog from '../components/LoginRequiredDialog.jsx'
import { session } from '../lib/storage.js'

const AuthContext = createContext(null)

// 로그인 후 돌아갈 주소. Google 화면을 다녀오는 동안 페이지가 새로 열리므로 탭 저장소에 둔다.
// eslint-disable-next-line react/only-export-components
export const saveLoginNext = (next) => session.set('login_next', next || '/profile')
// eslint-disable-next-line react/only-export-components
export function takeLoginNext() {
  const next = session.get('login_next', '/profile')
  session.set('login_next', '')
  return next || '/profile'
}

export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [askNext, setAskNext] = useState(null) // 로그인 안내 창에 넘길 next. null 이면 창 닫힘

  const refreshUser = useCallback(async () => {
    try {
      const me = await authApi.getMe()
      setUser(me)
      return me
    } catch {
      setUser(null)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // 앱을 열 때 한 번: 쿠키가 있으면 내 정보가 오고, 없으면(401) 비로그인으로 둔다.
  useEffect(() => {
    let cancelled = false
    authApi
      .getMe()
      .then((me) => !cancelled && setUser(me))
      .catch(() => !cancelled && setUser(null))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [])

  const logout = useCallback(async () => {
    await authApi.logout()
    setUser(null)
  }, [])

  const deleteAccount = useCallback(async () => {
    await authApi.deleteAccount()
    setUser(null)
  }, [])

  const requireLogin = useCallback(
    (next) => {
      if (user) return true
      setAskNext(next || window.location.pathname)
      return false
    },
    [user],
  )

  const value = useMemo(
    () => ({ user, setUser, loading, refreshUser, logout, deleteAccount, requireLogin }),
    [user, loading, refreshUser, logout, deleteAccount, requireLogin],
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
      {askNext !== null && (
        <LoginRequiredDialog
          onLogin={() => {
            const next = askNext
            setAskNext(null)
            navigate('/login', { state: { next } })
          }}
          onClose={() => setAskNext(null)}
        />
      )}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react/only-export-components
export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth 는 AuthProvider 안에서만 쓸 수 있어요.')
  return value
}
