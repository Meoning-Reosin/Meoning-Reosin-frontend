/**
 * S19-A 일정 상세. 주소: /itineraries/3
 *   제목 + '지도에서 보기'(S19-B) → 예상 시간 요약 → 이름 변경 · 일정 삭제 → 장소 순서(↑↓ 순서 바꾸기, 삭제)
 *   → 장소 더 찾기 · 여행 시작하기(S19-J)
 * 백엔드: GET/PATCH/DELETE /itineraries/{id}, PATCH/DELETE /itineraries/{id}/items/{itemId}
 * TODO(public-course 브랜치): 공개/비공개(S19-P) / TODO(invite 브랜치): 일정 대화, 초대 링크 공유
 */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  deleteItinerary,
  getItinerary,
  removeItineraryItem,
  updateItinerary,
  updateItineraryItem,
} from '../api/itineraries.js'
import BottomNav from '../components/BottomNav.jsx'
import Header from '../components/Header.jsx'
import LoginGate from '../components/LoginGate.jsx'
import RouteStops from '../components/RouteStops.jsx'
import RouteSummary from '../components/RouteSummary.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import notify from '../lib/notify.js'
import useItinerary from '../lib/useItinerary.js'

function Plan({ itineraryId }) {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { detail, error, loading, setDetail } = useItinerary(itineraryId)
  const [busy, setBusy] = useState(false)

  if (loading) return <p className="small">{t('불러오는 중…', 'Loading…')}</p>
  if (error)
    return (
      <p>
        {error.status === 404 || error.status === 403
          ? t('일정을 찾을 수 없어요.', 'Walk not found.')
          : t('일정을 불러오지 못했어요.', 'Could not load the walk.')}
      </p>
    )

  async function run(action) {
    setBusy(true)
    try {
      await action()
    } catch (err) {
      notify(err.message)
    } finally {
      setBusy(false)
    }
  }

  const rename = () =>
    run(async () => {
      const title = window.prompt(t('일정 이름', 'Walk name'), detail.title)?.trim()
      if (!title || title === detail.title) return
      setDetail(await updateItinerary(itineraryId, { title: title.slice(0, 50) }))
    })

  const remove = () =>
    run(async () => {
      if (!window.confirm(t('이 일정을 삭제할까요? 되돌릴 수 없어요.', 'Delete this walk? This cannot be undone.'))) return
      await deleteItinerary(itineraryId)
      notify(t('일정을 삭제했어요.', 'Walk deleted.'))
      navigate('/itineraries', { replace: true })
    })

  const move = (item, delta) =>
    run(async () => setDetail(await updateItineraryItem(itineraryId, item.item_id, { visit_order: item.visit_order + delta })))

  const removeItem = (item) =>
    run(async () => {
      await removeItineraryItem(itineraryId, item.item_id)
      // 삭제는 204 라서, 순서·도보 시간이 다시 계산된 일정을 새로 받는다.
      setDetail(await getItinerary(itineraryId))
    })

  const hasItems = detail.items.length > 0

  return (
    <>
      <div className="sw-route-head">
        <h1>{detail.title}</h1>
        {hasItems && (
          <button className="route-show-map" type="button" onClick={() => navigate(`/itineraries/${itineraryId}/route`)}>
            {t('지도에서 보기', 'View on map')}
          </button>
        )}
      </div>
      {hasItems && <RouteSummary detail={detail} />}
      <p className="small">
        {detail.travel_date ? `${detail.travel_date} · ` : ''}
        {detail.item_count}
        {t('곳', ' stops')} · {t(`${detail.visited_count}곳 방문`, `${detail.visited_count} visited`)}
      </p>

      <div className="row sw-plan-buttons">
        <button className="chip" disabled={busy} onClick={rename}>
          {t('이름 변경', 'Rename')}
        </button>
        <button className="chip" disabled={busy} onClick={remove}>
          {t('일정 삭제', 'Delete walk')}
        </button>
      </div>

      {hasItems ? (
        <RouteStops
          items={detail.items}
          actions={(item, index) => (
            <div className="sw-route-actions">
              <button aria-label={t('위로', 'Move up')} disabled={busy || index === 0} onClick={() => move(item, -1)}>
                ↑
              </button>
              <button
                aria-label={t('아래로', 'Move down')}
                disabled={busy || index + 1 === detail.items.length}
                onClick={() => move(item, 1)}
              >
                ↓
              </button>
              <button className="small" disabled={busy} onClick={() => removeItem(item)}>
                {t('삭제', 'Remove')}
              </button>
            </div>
          )}
        />
      ) : (
        <p>{t('아직 일정에 장소가 없어요.', 'This walk has no places yet.')}</p>
      )}

      <button className="outline" onClick={() => navigate('/search')}>
        {t('장소 더 찾기', 'Find more places')}
      </button>
      {hasItems && (
        <button className="primary" onClick={() => navigate(`/itineraries/${itineraryId}/journey`)}>
          {t('여행 시작하기', 'Start walking')}
        </button>
      )}
    </>
  )
}

export default function ItineraryDetail() {
  const { itineraryId } = useParams()
  return (
    <>
      <Header />
      <main className="pad bottomspace">
        <LoginGate next={`/itineraries/${itineraryId}`}>
          <Plan itineraryId={itineraryId} />
        </LoginGate>
      </main>
      <BottomNav />
    </>
  )
}
