/**
 * 화면 위쪽 막대 (프로토타입 v20Header).
 *
 *   <Header menu />                  왼쪽 뒤로, 가운데 로고, 오른쪽 메뉴
 *   <Header title="Menu" logo={false} home />   가운데 글자 제목, 오른쪽 홈
 *   <Header isHome menu />           홈 화면: 뒤로 버튼 없음
 */
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import Icon from './icons.jsx'

export const BRAND_LOGO = '/assets/brand-logo.png'

/** 뒤로 가기. 앱 안에서 온 기록이 없으면(주소로 바로 들어옴) 홈으로 간다. */
// eslint-disable-next-line react/only-export-components
export function useGoBack() {
  const navigate = useNavigate()
  return () => {
    if ((window.history.state?.idx ?? 0) > 0) navigate(-1)
    else navigate('/', { replace: true })
  }
}

export function SealButton() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  return (
    <button type="button" className="seal-button" onClick={() => navigate('/')} aria-label={t('홈으로', 'Home')}>
      <img src={BRAND_LOGO} alt="ㅇㅋㅋ-Walk Creator Crew" />
    </button>
  )
}

export default function Header({ title = '', logo = true, menu = false, home = false, isHome = false }) {
  const navigate = useNavigate()
  const goBack = useGoBack()
  const { t } = useLanguage()

  return (
    <header className="bar">
      {isHome ? (
        <span aria-hidden="true"></span>
      ) : (
        <button className="icon" aria-label={t('뒤로', 'Back')} onClick={goBack}>
          <Icon name="back" />
        </button>
      )}

      {logo ? <SealButton /> : <span className="screen-label english-title">{title}</span>}

      <div className="header-right">
        {menu && (
          <button className="icon" onClick={() => navigate('/menu')} aria-label={t('메뉴', 'Menu')}>
            <Icon name="menu" />
          </button>
        )}
        {!menu && home && (
          <button className="icon" onClick={() => navigate('/')} aria-label={t('홈', 'Home')}>
            <Icon name="home" />
          </button>
        )}
      </div>
    </header>
  )
}
