/**
 * 일정 동선 지도 (프로토타입 mountWalkRouteMap). 방문 순서대로 번호 핀을 찍고 선으로 잇는다.
 *   <RouteMap items={detail.items} />
 * 선은 순서만 보여 준다. 실제 도보 길과는 다를 수 있다.
 */
import L from 'leaflet'
import { useEffect } from 'react'
import { MapContainer, Marker, Polyline, TileLayer, Tooltip, useMap } from 'react-leaflet'
import { useLanguage } from '../i18n/LanguageContext.jsx'

const numberIcon = (n) =>
  L.divIcon({ className: 'route-map-pin', html: String(n), iconSize: [24, 24], iconAnchor: [12, 12], tooltipAnchor: [0, -13] })

/** 모든 장소가 보이게 지도 맞추기 */
function FitBounds({ points }) {
  const map = useMap()
  // 장소 좌표가 바뀔 때만 다시 맞춘다 (화면이 다시 그려질 때마다 지도가 튀지 않게).
  const key = JSON.stringify(points)
  useEffect(() => {
    if (points.length === 1) map.setView(points[0], 16, { animate: false })
    else if (points.length > 1) map.fitBounds(L.latLngBounds(points), { padding: [30, 32], maxZoom: 16, animate: false })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, key])
  return null
}

export default function RouteMap({ items }) {
  const { t } = useLanguage()
  const points = items.map((item) => [item.place.lat, item.place.lng])

  return (
    <MapContainer
      id="walkRouteMap"
      center={points[0] ?? [37.5744, 126.9827]}
      zoom={14}
      scrollWheelZoom
      zoomAnimation={false}
      fadeAnimation={false}
      markerZoomAnimation={false}
      aria-label={t('일정 순서 지도', 'Map of planned stops')}
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {points.length > 1 && (
        <>
          <Polyline positions={points} pathOptions={{ color: '#fff9ee', weight: 8, opacity: 0.85, interactive: false }} />
          <Polyline positions={points} pathOptions={{ color: '#962d25', weight: 4, opacity: 0.95, interactive: false }} />
        </>
      )}
      {items.map((item, index) => {
        const name = t(item.place.name, item.place.name_en)
        return (
          <Marker key={item.item_id} position={points[index]} icon={numberIcon(index + 1)} title={`${index + 1}. ${name}`} alt={name}>
            <Tooltip>{name}</Tooltip>
          </Marker>
        )
      })}
      <FitBounds points={points} />
    </MapContainer>
  )
}
