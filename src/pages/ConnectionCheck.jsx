/**
 * 임시 화면: 프론트와 백엔드가 연결됐는지 확인한다.
 * 프로토타입 화면을 옮기면 이 파일은 지운다.
 */
import { useEffect, useState } from 'react'
import { listPlaces } from '../api/places.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'

export default function ConnectionCheck() {
  const { lang, setLang, t } = useLanguage()
  const [state, setState] = useState({ loading: true, places: [], error: null })

  useEffect(() => {
    let cancelled = false
    listPlaces({ sort: 'name' })
      .then((data) => !cancelled && setState({ loading: false, places: data.items ?? [], error: null }))
      .catch((error) => !cancelled && setState({ loading: false, places: [], error }))
    return () => {
      cancelled = true
    }
  }, [lang])

  return (
    <div className="pad">
      <div className="eyebrow">Walk Creator Crew</div>
      <h2>{t('백엔드 연결 확인', 'Backend connection check')}</h2>
      <p>{t('관광지 목록을 백엔드에서 받아 와요.', 'Loading places from the backend.')}</p>

      <button className="outline" onClick={() => setLang(lang === 'ko' ? 'en' : 'ko')}>
        {lang === 'ko' ? 'English' : '한국어'}
      </button>

      {state.loading && <p>{t('불러오는 중…', 'Loading…')}</p>}
      {state.error && (
        <p>
          {t('연결 실패: 백엔드(8000번)가 켜져 있는지 확인하세요.', 'Failed: is the backend running on port 8000?')}{' '}
          ({state.error.message})
        </p>
      )}
      <ol>
        {state.places.map((place) => (
          <li key={place.place_id}>{t(place.name, place.name_en)}</li>
        ))}
      </ol>
    </div>
  )
}
