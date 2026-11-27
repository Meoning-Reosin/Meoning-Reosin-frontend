/**
 * 일정 하나 불러오기 (GET /itineraries/{id}). 일정 상세·동선 지도·여행 진행 화면이 같이 쓴다.
 *   const { detail, error, loading, setDetail } = useItinerary(id)
 * 순서 바꾸기·방문 체크처럼 백엔드가 바뀐 일정 전체를 돌려주면 setDetail 로 바로 바꾼다.
 */
import { useEffect, useState } from 'react'
import { getItinerary } from '../api/itineraries.js'
import { useAuth } from '../auth/AuthContext.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'

export default function useItinerary(itineraryId) {
  const { lang } = useLanguage()
  const { user } = useAuth()
  const key = `${itineraryId}|${lang}|${user?.id}`
  const [state, setState] = useState({ key: null, detail: null, error: null })

  useEffect(() => {
    if (!user) return
    let cancelled = false
    getItinerary(itineraryId)
      .then((detail) => !cancelled && setState({ key, detail, error: null }))
      .catch((error) => !cancelled && setState({ key, detail: null, error }))
    return () => {
      cancelled = true
    }
  }, [itineraryId, user, key])

  const ready = state.key === key
  return {
    detail: ready ? state.detail : null,
    error: ready ? state.error : null,
    loading: !ready,
    setDetail: (detail) => setState({ key, detail, error: null }),
  }
}
