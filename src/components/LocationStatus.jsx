/** 현재 위치 상태 한 줄 (프로토타입 locationIndicator). 홈과 관광지 화면에서 쓴다. */
import { useLanguage } from '../i18n/LanguageContext.jsx'

export default function LocationStatus({ status }) {
  const { t } = useLanguage()
  const text = {
    denied: t('위치 접근을 허용하지 않았어요.', 'Location access was declined.'),
    pending: t('현재 위치를 확인하고 있어요…', 'Finding your location…'),
    good: t('✓ 현재 위치를 확인했어요.', '✓ Location found.'),
    idle: t('현재 위치를 아직 확인하지 않았어요.', 'Location hasn’t been checked.'),
  }[status]
  const tone = status === 'denied' ? 'bad' : status === 'good' ? 'good' : ''
  return (
    <p className={`location-status ${tone}`} role="status">
      {text}
    </p>
  )
}
