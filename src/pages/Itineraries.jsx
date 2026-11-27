/**
 * S19 내 여행 일정. 주소: /itineraries
 *   위: '내 일정 / 찜 목록' 전환 (찜 목록은 /favorites 로)
 *   내 일정 목록(GET /itineraries) → 누르면 일정 상세(S19-A) / '새 일정 만들기'(POST /itineraries)
 * 로그인해야 볼 수 있다.
 * TODO(invite 브랜치): '대화 목록'(S19-C) 버튼, 함께하는 사람 표시
 */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createItinerary, listItineraries } from '../api/itineraries.js'
import { useAuth } from '../auth/AuthContext.jsx'
import BottomNav from '../components/BottomNav.jsx'
import Header from '../components/Header.jsx'
import LoginGate from '../components/LoginGate.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import notify from '../lib/notify.js'

function WalkList() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [state, setState] = useState({ key: null, items: [], error: null })
  const key = String(user.id)

  useEffect(() => {
    let cancelled = false
    listItineraries({ size: 100 })
      .then((data) => !cancelled && setState({ key, items: data.items ?? [], error: null }))
      .catch((error) => !cancelled && setState({ key, items: [], error }))
    return () => {
      cancelled = true
    }
  }, [key])

  async function newWalk() {
    const title = window.prompt(t('새 일정 이름', 'New walk name'), t('서울 산책', 'Seoul walk'))?.trim()
    if (!title) return
    try {
      const created = await createItinerary({ title: title.slice(0, 50) })
      navigate(`/itineraries/${created.itinerary_id}`)
    } catch (error) {
      notify(error.message)
    }
  }

  if (state.key !== key) return <p className="small">{t('불러오는 중…', 'Loading…')}</p>

  return (
    <>
      {state.error && <p>{t('일정을 불러오지 못했어요.', 'Could not load your walks.')}</p>}
      {!state.error && !state.items.length && (
        <p>{t('아직 일정이 없어요. 새 일정을 만들거나 코스를 담아 보세요.', 'No walks yet. Create one or save a curated walk.')}</p>
      )}
      {state.items.map((walk) => (
        <button key={walk.itinerary_id} className="sw-plan-item" onClick={() => navigate(`/itineraries/${walk.itinerary_id}`)}>
          <h2>{walk.title}</h2>
          {walk.travel_date && <p className="small">{walk.travel_date}</p>}
          <p className="small">
            {walk.item_count}
            {t('곳', ' stops')} ›
          </p>
        </button>
      ))}
      <button className="outline" onClick={newWalk}>
        {t('새 일정 만들기', 'New walk')}
      </button>
    </>
  )
}

export default function Itineraries() {
  const { t } = useLanguage()
  const navigate = useNavigate()

  return (
    <>
      <Header menu />
      <main className="pad bottomspace">
        <h1>{t('내 여행 일정', 'My walks')}</h1>
        <div className="sw-segments" aria-label={t('일정 보기 전환', 'Itinerary views')}>
          <button className="active" aria-pressed="true">
            {t('내 일정', 'My walks')}
          </button>
          <button aria-pressed="false" onClick={() => navigate('/favorites')}>
            {t('찜 목록', 'Favorites')}
          </button>
        </div>
        <LoginGate next="/itineraries">
          <WalkList />
        </LoginGate>
      </main>
      <BottomNav />
    </>
  )
}
