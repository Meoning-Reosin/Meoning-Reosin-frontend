/**
 * S16 관광지 · 지도. 주소: /places (특정 장소를 지도에 띄우려면 /places?focus=3)
 *   제목 + 내 위치 버튼 → 위치 상태 → 지도 → 고른 장소 → 전체 장소 목록(5개씩 더보기)
 *
 * 백엔드: GET /places (위치가 있으면 가까운 순, 없으면 이름 순)
 * '내 위치'를 눌렀는데 위치 동의를 안 했으면 위치 동의(S06)로 보낸다.
 */
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { listPlaces } from '../api/places.js'
import BottomNav from '../components/BottomNav.jsx'
import Header from '../components/Header.jsx'
import Icon from '../components/icons.jsx'
import LocationStatus from '../components/LocationStatus.jsx'
import Photo from '../components/Photo.jsx'
import PlaceMap from '../components/PlaceMap.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { locationAllowed } from '../lib/entryFlow.js'
import useCurrentPosition from '../lib/useCurrentPosition.js'

const PAGE = 5

function ageLabel(checkedAt, t) {
  const minutes = Math.max(0, Math.floor((Date.now() - checkedAt) / 60000))
  return t(`현재 위치 · ${minutes}분 전 마지막 확인`, `Location · checked ${minutes} min ago`)
}

export default function Places() {
  const { lang, t } = useLanguage()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { coords, status, checkedAt, refresh } = useCurrentPosition()
  const [places, setPlaces] = useState([])
  const [error, setError] = useState(null)
  const [selectedId, setSelectedId] = useState(() => Number(params.get('focus')) || null)
  const [limit, setLimit] = useState(PAGE)
  const mapWrapRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    const query = coords ? { sort: 'distance', lat: coords.lat, lng: coords.lng, size: 100 } : { sort: 'name', size: 100 }
    listPlaces(query)
      .then((data) => !cancelled && (setPlaces(data.items ?? []), setError(null)))
      .catch((err) => !cancelled && setError(err))
    return () => {
      cancelled = true
    }
  }, [lang, coords])

  const name = (place) => t(place.name, place.name_en)
  const selected = places.find((place) => place.place_id === selectedId)

  function locateMe() {
    if (locationAllowed()) refresh()
    else navigate('/location')
  }

  function focus(id, scrollToMap = false) {
    setSelectedId(id)
    // 목록 뒤쪽 장소면 거기까지 펼친다.
    const index = places.findIndex((place) => place.place_id === id)
    if (index >= limit) setLimit(index + 1)
    if (scrollToMap) mapWrapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <>
      <Header menu />
      <main className="pad bottomspace sw-map-page">
        <div className="sw-title">
          <h1>{t('관광지', 'Places')}</h1>
          <button className="geo-action" onClick={locateMe}>
            <Icon name="focus" />
            {t('내 위치', 'Locate me')}
          </button>
        </div>
        <LocationStatus status={status} />

        <div ref={mapWrapRef} className="sw-map-wrap">
          <PlaceMap places={places} selectedId={selectedId} coords={coords} onSelect={(id) => focus(id)} />
          {coords && <span className="gps-age">{ageLabel(checkedAt, t)}</span>}
        </div>

        <div id="mapSelection">
          {selected && (
            <div className="map-readout">
              <span>
                <strong>{name(selected)}</strong> <span className="small">{selected.area}</span>
              </span>
              <button onClick={() => navigate(`/places/${selected.place_id}`)}>{t('상세 보기', 'Details')} ›</button>
            </div>
          )}
        </div>

        <div className="sw-title">
          <h2>{t('전체 장소', 'All places')}</h2>
          <span className="small">
            {Math.min(limit, places.length)} / {places.length}
          </span>
        </div>
        {error && <p className="small">{t('목록을 불러오지 못했어요.', 'Could not load the list.')}</p>}

        <div id="allPlaces">
          {places.slice(0, limit).map((place) => (
            <div key={place.place_id} className={`map-place ${place.place_id === selectedId ? 'selected' : ''}`}>
              <button className="place-entry" onClick={() => navigate(`/places/${place.place_id}`)}>
                <Photo src={place.thumbnail_url} label={name(place)} />
                <span className="place-entry-text">
                  <span className="place-name">{name(place)}</span>
                  <span className="small">
                    {place.area}
                    {place.distance_m != null && ` · ${(place.distance_m / 1000).toFixed(1)} km`}
                  </span>
                </span>
              </button>
              <button
                className="map-focus"
                onClick={() => focus(place.place_id, true)}
                aria-label={`${name(place)} ${t('지도에서 보기', 'on the map')}`}
              >
                <Icon name="focus" />
                <span>{t('지도', 'Map')}</span>
              </button>
            </div>
          ))}
        </div>

        {limit < places.length && (
          <button
            className="outline map-end"
            onClick={() => setLimit(limit + PAGE)}
            aria-label={t('관광지 더 보기', 'Show more places')}
          >
            <span aria-hidden="true">+</span>
            <span className="map-more-text">{t('더보기', 'Show more')}</span>
          </button>
        )}
      </main>
      <BottomNav />
    </>
  )
}
