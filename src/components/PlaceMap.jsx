/**
 * 관광지 지도 (프로토타입 mountPlacesMap). OpenStreetMap 배경 + 장소 핀 + 내 위치 점.
 *
 *   <PlaceMap places={[...]} selectedId={3} coords={{lat, lng}} onSelect={(id) => ...} />
 *
 * - 핀을 누르면 onSelect(place_id)
 * - selectedId 가 바뀌면 그 장소로 지도를 옮기고 핀을 강조한다.
 */
import L from 'leaflet'
import { useEffect, useState } from 'react'
import { MapContainer, Marker, TileLayer, Tooltip, useMap } from 'react-leaflet'
import { useLanguage } from '../i18n/LanguageContext.jsx'

const SEOUL_CENTER = [37.5744, 126.9827]

const PIN_SVG =
  '<svg viewBox="0 0 26 30" aria-hidden="true"><path fill="currentColor" stroke="#F9F7F2" stroke-width="1.6" d="M13 28C11 25 4 18 4 11a9 9 0 1 1 18 0c0 7-7 14-9 17Z"/><circle cx="13" cy="11" r="3" fill="#F9F7F2"/></svg>'

const pinIcon = (selected) =>
  L.divIcon({
    className: 'heritage-pin' + (selected ? ' selected' : ''),
    html: PIN_SVG,
    iconSize: [26, 30],
    iconAnchor: [13, 28],
    tooltipAnchor: [0, -21],
  })

const currentIcon = L.divIcon({ className: 'map-current', iconSize: [15, 15] })

/** 고른 장소나 내 위치로 지도 옮기기 */
function FlyTo({ selected, coords }) {
  const map = useMap()
  useEffect(() => {
    if (selected) map.setView([selected.lat, selected.lng], Math.max(map.getZoom(), 16), { animate: false })
  }, [map, selected])
  useEffect(() => {
    if (coords && !selected) map.setView([coords.lat, coords.lng], 15, { animate: false })
    // 위치를 새로 받았을 때만 옮긴다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, coords?.lat, coords?.lng])
  return null
}

export default function PlaceMap({ places, selectedId, coords, onSelect }) {
  const { t } = useLanguage()
  const [tilesLoaded, setTilesLoaded] = useState(false)
  const [tilesFailed, setTilesFailed] = useState(false)
  const selected = places.find((place) => place.place_id === selectedId)

  const center = selected ? [selected.lat, selected.lng] : coords ? [coords.lat, coords.lng] : SEOUL_CENTER
  const zoom = selected ? 16 : coords ? 15 : 13
  const externalLink =
    'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(coords ? `${coords.lat},${coords.lng}` : 'Seoul')

  return (
    <MapContainer
        id="liveMap"
        center={center}
        zoom={zoom}
        scrollWheelZoom
        zoomAnimation={false}
        fadeAnimation={false}
        markerZoomAnimation={false}
      >
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          eventHandlers={{
            tileload: () => setTilesLoaded(true),
            load: () => !tilesLoaded && setTilesFailed(true),
          }}
        />
        {places.map((place) => (
          <Marker
            key={place.place_id}
            position={[place.lat, place.lng]}
            icon={pinIcon(place.place_id === selectedId)}
            title={t(place.name, place.name_en)}
            alt={t(place.name, place.name_en)}
            eventHandlers={{ click: () => onSelect(place.place_id) }}
          >
            <Tooltip permanent={place.place_id === selectedId}>{t(place.name, place.name_en)}</Tooltip>
          </Marker>
        ))}
        {coords && <Marker position={[coords.lat, coords.lng]} icon={currentIcon} title={t('현재 위치', 'You are here')} />}
        <FlyTo selected={selected} coords={coords} />

      {!tilesLoaded && (
        <div className="map-fallback">
          <p>
            {tilesFailed
              ? t('지도 배경을 연결할 수 없어요.', 'The basemap is unavailable.')
              : t('지도를 불러오는 중이에요.', 'Loading the map.')}
          </p>
          <a href={externalLink} target="_blank" rel="noopener noreferrer">
            {t('외부 지도에서 보기', 'Open in Maps')}
          </a>
        </div>
      )}
    </MapContainer>
  )
}
