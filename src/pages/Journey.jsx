/**
 * S19-J 여행 진행 · 방문 체크. 주소: /itineraries/3/journey
 *   'N / M 방문 완료' → 장소마다 '방문 체크' 버튼 (PATCH /itineraries/{id}/items/{itemId} {visited})
 */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { updateItineraryItem } from '../api/itineraries.js'
import BottomNav from '../components/BottomNav.jsx'
import Header from '../components/Header.jsx'
import LoginGate from '../components/LoginGate.jsx'
import RouteStops from '../components/RouteStops.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import notify from '../lib/notify.js'
import useItinerary from '../lib/useItinerary.js'

function Progress({ itineraryId }) {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { detail, error, loading, setDetail } = useItinerary(itineraryId)
  const [busyId, setBusyId] = useState(null)

  if (loading) return <p className="small">{t('불러오는 중…', 'Loading…')}</p>
  if (error) return <p>{t('일정을 불러오지 못했어요.', 'Could not load the walk.')}</p>

  async function toggleVisit(item) {
    setBusyId(item.item_id)
    try {
      setDetail(await updateItineraryItem(itineraryId, item.item_id, { visited: !item.visited }))
    } catch (err) {
      notify(err.message)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <>
      <h1>{t('오늘의 여행', 'Today’s walk')}</h1>
      <p className="small">{detail.title}</p>
      <p className="small">
        {detail.visited_count} / {detail.item_count} {t('방문 완료', 'visited')}
      </p>
      <RouteStops
        items={detail.items}
        actions={(item) => (
          <button
            className={`chip ${item.visited ? 'active' : ''}`}
            aria-pressed={item.visited}
            disabled={busyId === item.item_id}
            onClick={() => toggleVisit(item)}
          >
            {item.visited ? t('완료', 'Done') : t('방문 체크', 'Check in')}
          </button>
        )}
      />
      <button className="outline" onClick={() => navigate(`/itineraries/${itineraryId}/route`)}>
        {t('동선 지도 보기', 'View route map')}
      </button>
      <button className="outline" onClick={() => navigate(`/itineraries/${itineraryId}`)}>
        {t('내 일정으로 돌아가기', 'Return to my walk')}
      </button>
    </>
  )
}

export default function Journey() {
  const { itineraryId } = useParams()
  return (
    <>
      <Header />
      <main className="pad bottomspace sw-walk-map-page">
        <LoginGate next={`/itineraries/${itineraryId}/journey`}>
          <Progress itineraryId={itineraryId} />
        </LoginGate>
      </main>
      <BottomNav />
    </>
  )
}
