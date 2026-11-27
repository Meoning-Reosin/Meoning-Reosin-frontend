/**
 * 현재 위치 (위치 동의 S06 에서 허용했을 때만 브라우저에 묻는다).
 *
 *   const { coords, status, checkedAt, refresh } = useCurrentPosition()
 *   coords: {lat, lng} | null
 *   status: 'idle'(아직 안 물어봄) | 'pending'(확인 중) | 'good'(받음) | 'denied'(거부/실패)
 *   refresh(): 위치를 다시 확인한다 ('내 위치' 버튼)
 *
 * 받은 좌표는 이번 탭 안에서 1분 동안 다시 쓴다 (화면을 옮길 때마다 묻지 않게).
 */
import { useEffect, useState } from 'react'
import { locationAllowed, locationChoice } from './entryFlow.js'

const MAX_AGE_MS = 60_000
let cache = null // { coords, at }

function initialState() {
  if (cache && Date.now() - cache.at < MAX_AGE_MS) return { coords: cache.coords, status: 'good', checkedAt: cache.at }
  if (locationChoice() === 'denied') return { coords: null, status: 'denied', checkedAt: 0 }
  return {
    coords: null,
    status: locationAllowed() && 'geolocation' in navigator ? 'pending' : 'idle',
    checkedAt: 0,
  }
}

export default function useCurrentPosition() {
  const [state, setState] = useState(initialState)

  useEffect(() => {
    if (state.status !== 'pending') return
    let cancelled = false
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = { lat: position.coords.latitude, lng: position.coords.longitude }
        const at = position.timestamp || Date.now()
        cache = { coords, at }
        if (!cancelled) setState({ coords, status: 'good', checkedAt: at })
      },
      () => !cancelled && setState((prev) => ({ ...prev, status: 'denied' })),
      { enableHighAccuracy: true, timeout: 12_000, maximumAge: MAX_AGE_MS },
    )
    return () => {
      cancelled = true
    }
  }, [state.status])

  function refresh() {
    if (!('geolocation' in navigator)) return
    cache = null
    setState((prev) => ({ ...prev, status: 'pending' }))
  }

  return { ...state, refresh }
}
