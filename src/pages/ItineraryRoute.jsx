/**
 * S19-B 일정 동선 지도. 주소: /itineraries/3/route
 *   예상 시간 요약 → 번호 핀 지도 → 장소 순서(보기만) → 여행 시작하기(S19-J)
 */
import { useNavigate, useParams } from 'react-router-dom'
import BottomNav from '../components/BottomNav.jsx'
import Header from '../components/Header.jsx'
import LoginGate from '../components/LoginGate.jsx'
import RouteMap from '../components/RouteMap.jsx'
import RouteStops from '../components/RouteStops.jsx'
import RouteSummary from '../components/RouteSummary.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import useItinerary from '../lib/useItinerary.js'

function Route({ itineraryId }) {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { detail, error, loading } = useItinerary(itineraryId)

  if (loading) return <p className="small">{t('불러오는 중…', 'Loading…')}</p>
  if (error) return <p>{t('일정을 불러오지 못했어요.', 'Could not load the walk.')}</p>

  return (
    <>
      <h1>{t('일정 동선', 'Walk route')}</h1>
      <p className="small">{detail.title}</p>
      {detail.items.length ? (
        <>
          <RouteSummary detail={detail} />
          <div className="sw-map-wrap">
            <RouteMap items={detail.items} />
          </div>
          <p className="small walk-map-note">
            {t('연결선은 방문 순서를 보여줘요. 실제 도보 경로는 달라질 수 있어요.', 'The line shows stop order. Actual walking routes may differ.')}
          </p>
          <RouteStops items={detail.items} />
          <button className="primary" onClick={() => navigate(`/itineraries/${itineraryId}/journey`)}>
            {t('여행 시작하기', 'Start walking')}
          </button>
        </>
      ) : (
        <p>{t('아직 일정에 장소가 없어요.', 'This walk has no places yet.')}</p>
      )}
    </>
  )
}

export default function ItineraryRoute() {
  const { itineraryId } = useParams()
  return (
    <>
      <Header />
      <main className="pad bottomspace sw-walk-map-page">
        <LoginGate next={`/itineraries/${itineraryId}/route`}>
          <Route itineraryId={itineraryId} />
        </LoginGate>
      </main>
      <BottomNav />
    </>
  )
}
