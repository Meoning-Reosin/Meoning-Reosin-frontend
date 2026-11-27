/**
 * S20-A 콘텐츠 출처. 주소: /credits
 * - 장소 사진: 백엔드 장소 상세(images)의 작가·라이선스·출처를 모아 보여 준다.
 * - 앱에 들어 있는 배너·오프닝 영상은 AI 예시라는 안내를 붙인다.
 */
import { useEffect, useState } from 'react'
import { getPlace, listPlaces } from '../api/places.js'
import Header from '../components/Header.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'

export default function Credits() {
  const { lang, t } = useLanguage()
  const [state, setState] = useState({ key: null, entries: [], error: null })

  useEffect(() => {
    let cancelled = false
    listPlaces({ size: 100 })
      .then((data) => Promise.all((data.items ?? []).map((place) => getPlace(place.place_id))))
      .then((details) => {
        const entries = details.flatMap((place) => place.images.map((image) => ({ place, image })))
        if (!cancelled) setState({ key: lang, entries, error: null })
      })
      .catch((error) => !cancelled && setState({ key: lang, entries: [], error }))
    return () => {
      cancelled = true
    }
  }, [lang])

  return (
    <>
      <Header />
      <div className="pad">
        <h1>{t('콘텐츠 출처', 'Content credits')}</h1>

        <h2>{t('장소 사진', 'Place photos')}</h2>
        {state.key !== lang && <p className="small">{t('불러오는 중…', 'Loading…')}</p>}
        {state.error && <p>{t('정보를 불러오지 못했어요.', 'Could not load the information.')}</p>}
        {state.key === lang && !state.error && !state.entries.length && (
          <p>{t('아직 등록된 장소 사진이 없어요.', 'No place photos have been added yet.')}</p>
        )}
        {state.entries.map(({ place, image }) => (
          <div key={image.image_id} className="item">
            <div className="text">
              <a href={image.url} target="_blank" rel="noopener noreferrer">
                {t(place.name, place.name_en)}
              </a>
              <div className="small">
                {[image.author, image.source].filter(Boolean).join(' · ')}
                {image.license && (
                  <>
                    {' · '}
                    {image.license_url ? (
                      <a href={image.license_url} target="_blank" rel="noopener noreferrer">
                        {image.license}
                      </a>
                    ) : (
                      image.license
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}

        <h2>{t('해설과 장소 정보', 'Guides and place information')}</h2>
        <p>
          {t(
            '해설 대본과 음성은 한국관광공사 오디, 운영 정보는 한국관광공사 TourAPI를 출처로 합니다. 지금은 연동 전이라 임시 문구가 들어 있어요.',
            'Guides and audio come from Korea Tourism Organization’s Odii, and visiting information from TourAPI. Temporary text is shown until they are connected.',
          )}
        </p>

        <h2>{t('배너와 오프닝 영상', 'Banners and opening film')}</h2>
        <p>
          {t(
            '홈 배너 사진과 오프닝 영상은 화면 시연용 AI 생성 이미지·영상이며 실제 관광지 촬영본이 아닙니다.',
            'Home banner images and the opening film are AI-generated for the demo, not actual photographs of the landmarks.',
          )}
        </p>
      </div>
    </>
  )
}
