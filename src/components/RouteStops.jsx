/**
 * 일정의 장소 순서 목록 (프로토타입 routeList). 번호 · 장소 줄 · 다음 장소까지 도보 시간.
 *   <RouteStops items={detail.items} actions={(item, index) => <button>...</button>} />
 * actions 를 주면 각 줄 오른쪽에 그 버튼들(순서 바꾸기, 방문 체크 등)을 붙인다.
 */
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import Photo from './Photo.jsx'

export default function RouteStops({ items, actions }) {
  const { t } = useLanguage()
  const navigate = useNavigate()

  return (
    <ol className="sw-route">
      {items.map((item, index) => {
        const place = item.place
        const name = t(place.name, place.name_en)
        const next = items[index + 1]
        return (
          <li key={item.item_id}>
            <span className="sw-stop-number">{index + 1}</span>
            <div className="item">
              <Photo src={place.thumbnail_url} label={name} />
              <button className="text" onClick={() => navigate(`/places/${place.place_id}`)}>
                <h3>{name}</h3>
                <div className="small">
                  {place.expected_visit_minutes}
                  {t('분 관람', ' min visit')}
                  {item.memo && ` · ${item.memo}`}
                </div>
              </button>
              {actions ? actions(item, index) : <span>›</span>}
            </div>
            {next?.walk_minutes_from_previous != null && (
              <p className="sw-eta">
                {t(
                  `다음 장소까지 도보 약 ${next.walk_minutes_from_previous}분 · 추정`,
                  `About ${next.walk_minutes_from_previous} min on foot · estimate`,
                )}
              </p>
            )}
          </li>
        )
      })}
    </ol>
  )
}
