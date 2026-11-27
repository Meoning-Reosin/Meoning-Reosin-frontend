/** 시간·거리 글자로 바꾸기. t 는 useLanguage() 의 t. */

/** 95 → '1시간 35분' / '1 h 35 min' */
export function formatMinutes(minutes, t) {
  const total = Math.max(0, Math.round(minutes || 0))
  const hours = Math.floor(total / 60)
  const rest = total % 60
  if (!hours) return t(`${rest}분`, `${rest} min`)
  if (!rest) return t(`${hours}시간`, `${hours} h`)
  return t(`${hours}시간 ${rest}분`, `${hours} h ${rest} min`)
}

/** 1234 → '1.2 km', 650 → '650 m' */
export function formatMeters(meters) {
  if (meters == null) return ''
  return meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${Math.round(meters)} m`
}
