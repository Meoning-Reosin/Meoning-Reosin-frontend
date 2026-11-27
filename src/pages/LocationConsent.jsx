/**
 * S06 위치정보 동의: 항상 허용 / 이번만 허용 / 거부
 * - 첫 진입이면(state.entry): 고른 뒤 개인정보 동의(S06-A)로 (이미 골랐으면 홈)
 * - 다른 화면(지도 등)에서 왔으면: 고른 뒤 이전 화면으로
 * 허용을 고르면 브라우저 위치 권한 창을 띄운다. 실제 좌표 사용은 관광지(place) 브랜치에서 한다.
 */
import { useLocation, useNavigate } from 'react-router-dom'
import Header from '../components/Header.jsx'
import Icon from '../components/icons.jsx'
import PolicyButton from '../components/PolicyButton.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { nextAfterLocation, setLocationChoice } from '../lib/entryFlow.js'

export default function LocationConsent() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const fromEntry = useLocation().state?.entry

  function choose(choice) {
    setLocationChoice(choice)
    if (choice !== 'denied' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {},
        () => {},
      )
    }
    if (fromEntry) navigate(nextAfterLocation(), { state: { entry: true } })
    else navigate(-1)
  }

  return (
    <>
      <Header />
      <main className="pad sw-location-consent">
        <div className="geo-symbol">
          <Icon name="focus" />
        </div>
        <h1>{t('현재 위치를 사용할까요?', 'Use your location?')}</h1>
        <p>
          {t(
            '지도에 내 위치를 표시하고 가까운 역사 명소를 찾을 때 사용해요. 실제 위치 접근은 브라우저 권한 설정을 따라요.',
            'We use your location to show your position on the map and find nearby historic places. Actual access follows your browser permissions.',
          )}
        </p>
        <button className="primary" onClick={() => choose('always')}>
          {t('항상 허용', 'Always allow')}
        </button>
        <button className="outline" onClick={() => choose('once')}>
          {t('이번만 허용', 'Allow this time')}
        </button>
        <button className="outline" onClick={() => choose('denied')}>
          {t('거부', 'Deny')}
        </button>
        <p className="small">{t('항상 허용은 앱을 이용할 때만 적용돼요.', 'Always allow applies only while using the app.')}</p>
        <PolicyButton policy="location" className="inline-policy" />
      </main>
    </>
  )
}
