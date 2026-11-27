/**
 * S21 내 찜 목록. 주소: /favorites
 * - 로그인 안 했으면 '로그인하고 내 찜 보기' 버튼 (누르면 로그인 안내 창 S17-P)
 * - 로그인했으면 GET /bookmarks (최근에 찜한 것부터). 줄 오른쪽 ♥ 로 바로 해제할 수 있다.
 * - 아래 '내가 찜한 공개 코스'(S21-A)는 공개 코스 기능(public-course 브랜치)에서 만든다.
 */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listBookmarks } from '../api/bookmarks.js'
import { useAuth } from '../auth/AuthContext.jsx'
import BottomNav from '../components/BottomNav.jsx'
import Header from '../components/Header.jsx'
import MenuRow from '../components/MenuRow.jsx'
import Photo from '../components/Photo.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import useBookmark from '../lib/useBookmark.js'

function SavedPlace({ place, onRemoved }) {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const bookmark = useBookmark(place, { onChange: (saved) => !saved && onRemoved(place.place_id) })
  const name = t(place.name, place.name_en)

  return (
    <div className="item">
      <Photo src={place.thumbnail_url} label={name} />
      <button className="text" onClick={() => navigate(`/places/${place.place_id}`)}>
        <div className="eyebrow">{place.area}</div>
        <h3>{name}</h3>
        <div className="small">{place.address}</div>
      </button>
      <button
        className="icon"
        aria-label={`${name} ${t('찜 해제', 'remove from saves')}`}
        disabled={bookmark.busy}
        onClick={bookmark.toggle}
        style={{ color: '#9b604d' }}
      >
        ♥
      </button>
    </div>
  )
}

export default function Favorites() {
  const { lang, t } = useLanguage()
  const navigate = useNavigate()
  const { user, loading, requireLogin } = useAuth()
  const [state, setState] = useState({ key: null, items: [], error: null })
  const key = `${user?.id}|${lang}`

  useEffect(() => {
    if (!user) return
    let cancelled = false
    listBookmarks({ size: 100 })
      .then((data) => !cancelled && setState({ key, items: data.items ?? [], error: null }))
      .catch((error) => !cancelled && setState({ key, items: [], error }))
    return () => {
      cancelled = true
    }
  }, [user, key])

  const ready = state.key === key
  const removeFromList = (placeId) =>
    setState((prev) => ({ ...prev, items: prev.items.filter((place) => place.place_id !== placeId) }))

  let body
  if (loading) body = <p className="small">{t('불러오는 중…', 'Loading…')}</p>
  else if (!user)
    body = (
      <button className="outline" onClick={() => requireLogin('/favorites')}>
        {t('로그인하고 내 찜 보기', 'Sign in to see your saves')}
      </button>
    )
  else
    body = (
      <>
        <h2>{t('내가 찜한 장소', 'Places I saved')}</h2>
        {!ready && <p className="small">{t('불러오는 중…', 'Loading…')}</p>}
        {ready && state.error && <p>{t('목록을 불러오지 못했어요.', 'Could not load the list.')}</p>}
        {ready && !state.error && !state.items.length && (
          <p>{t('아직 찜한 장소가 없어요. 장소 상세에서 ♥ 를 눌러 보세요.', 'No saved places yet. Tap ♥ on a place to save it.')}</p>
        )}
        {ready && state.items.map((place) => <SavedPlace key={place.place_id} place={place} onRemoved={removeFromList} />)}
        <MenuRow label={t('내가 찜한 공개 코스', 'Public walks I saved')} onClick={() => navigate('/favorites/walks')} />
      </>
    )

  return (
    <>
      <Header />
      <main className="pad bottomspace">
        <h1>{t('내 찜 목록', 'My favorites')}</h1>
        {body}
      </main>
      <BottomNav />
    </>
  )
}
