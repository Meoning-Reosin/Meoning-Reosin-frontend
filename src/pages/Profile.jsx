/**
 * 마이페이지. 주소: /profile
 * - S17-A 로그아웃 상태: 해치 기본 사진, '마이페이지', 로그인 버튼
 * - S23 로그인 상태: 프로필 사진, 닉네임(연필로 고치기, API 10), 찜·일정 개수
 * 아래 메뉴: 내 계정 관리 · 내 여행 일정 · 찜한 장소 · 설정
 * TODO(S23-P): 프로필 사진 바꾸기는 백엔드 업로드 API 가 생기면 붙인다.
 */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { updateMe } from '../api/auth.js'
import { listBookmarks } from '../api/bookmarks.js'
import { listItineraries } from '../api/itineraries.js'
import { useAuth } from '../auth/AuthContext.jsx'
import BottomNav from '../components/BottomNav.jsx'
import Header from '../components/Header.jsx'
import Icon from '../components/icons.jsx'
import MenuRow from '../components/MenuRow.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import notify from '../lib/notify.js'

const HAECHI = '/assets/haechi.png'

export default function Profile() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { user, setUser } = useAuth()
  const [counts, setCounts] = useState({ walks: '', places: '' })

  // 로그인했으면 일정·찜 개수를 받아 온다.
  useEffect(() => {
    if (!user) return
    let cancelled = false
    Promise.all([listItineraries({ size: 1 }), listBookmarks({ size: 1 })])
      .then(([walks, places]) => !cancelled && setCounts({ walks: String(walks.total), places: String(places.total) }))
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [user])

  async function editNickname() {
    const value = window.prompt(t('닉네임 (2~20자)', 'Nickname (2–20 characters)'), user.nickname)
    if (value === null) return
    const nickname = value.trim()
    if (nickname.length < 2 || nickname.length > 20) {
      notify(t('닉네임은 2~20자로 입력해 주세요.', 'Use 2–20 characters for your nickname.'))
      return
    }
    try {
      setUser(await updateMe({ nickname }))
      notify(t('닉네임을 바꿨어요.', 'Nickname updated.'))
    } catch (error) {
      notify(error.message)
    }
  }

  const goLogin = () => navigate('/login', { state: { next: '/profile' } })

  return (
    <>
      <Header menu />
      <main className="bottomspace">
        <div className="profile-cover">
          <div className="profile-photo-wrap">
            {user?.profile_image_url ? (
              <img className="avatar" src={user.profile_image_url} alt={t('프로필 사진', 'Profile photo')} />
            ) : (
              <img className="avatar sw-profile-fallback" src={HAECHI} alt={t('해치 기본 프로필', 'Default Haechi profile')} />
            )}
          </div>
          <div className="profile-nickname-row">
            <h1>{user ? user.nickname : t('마이페이지', 'My page')}</h1>
            {user && (
              <button
                type="button"
                className="profile-edit-pencil"
                aria-label={t('닉네임 편집', 'Edit nickname')}
                title={t('닉네임 편집', 'Edit nickname')}
                onClick={editNickname}
              >
                <Icon name="pencil" />
              </button>
            )}
          </div>
          {!user && (
            <button className="profile-login" onClick={goLogin}>
              {t('로그인', 'Sign in')}
            </button>
          )}
        </div>
        <div className="pad">
          <MenuRow label={t('내 계정 관리', 'Manage my account')} onClick={() => navigate('/account')} />
          <MenuRow label={t('내 여행 일정', 'My walks')} sub={user ? counts.walks : ''} onClick={() => navigate('/itineraries')} />
          <MenuRow label={t('찜한 장소', 'Saved places')} sub={user ? counts.places : ''} onClick={() => navigate('/favorites')} />
          <MenuRow label={t('설정', 'Settings')} onClick={() => navigate('/settings')} />
        </div>
      </main>
      <BottomNav />
    </>
  )
}
