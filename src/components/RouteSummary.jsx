/**
 * 여행 예상 시간 요약 (프로토타입 routeSummary): 도보 이동 · 관람 · 총 예상 시간.
 * 값은 백엔드 일정 상세의 total_walk_minutes / total_visit_minutes / total_minutes 를 그대로 쓴다.
 */
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { formatMeters, formatMinutes } from '../lib/format.js'

export default function RouteSummary({ detail }) {
  const { t } = useLanguage()
  const distance = detail.items.reduce((sum, item) => sum + (item.distance_m_from_previous || 0), 0)

  return (
    <>
      <dl className="sw-route-summary" aria-label={t('여행 예상 시간', 'Estimated trip time')}>
        <div>
          <dt>{t('도보 이동', 'Walking')}</dt>
          <dd>{formatMinutes(detail.total_walk_minutes, t)}</dd>
          {distance > 0 && <small>{formatMeters(distance)}</small>}
        </div>
        <div>
          <dt>{t('관람', 'Visiting')}</dt>
          <dd>{formatMinutes(detail.total_visit_minutes, t)}</dd>
        </div>
        <div>
          <dt>{t('총 예상 시간', 'Estimated total')}</dt>
          <dd>{formatMinutes(detail.total_minutes, t)}</dd>
        </div>
      </dl>
      <p className="small route-estimate-note">
        {t('이동거리와 시간은 장소 간 직선거리를 바탕으로 추정했어요.', 'Walking distance and time are estimated from straight-line distances between stops.')}
      </p>
    </>
  )
}
