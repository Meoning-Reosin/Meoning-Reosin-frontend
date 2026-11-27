/** S17-P 저장 전 로그인 안내 창. 찜·일정처럼 로그인이 필요한 버튼을 눌렀을 때 뜬다. */
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useLanguage } from '../i18n/LanguageContext.jsx'

export default function LoginRequiredDialog({ onLogin, onClose }) {
  const { t } = useLanguage()
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current.open) ref.current.showModal()
  }, [])

  return createPortal(
    <dialog ref={ref} className="walk-dialog sw-login-dialog" aria-labelledby="loginRequiredTitle" onClose={onClose}>
      <h2 id="loginRequiredTitle">{t('로그인해 주세요', 'Please sign in')}</h2>
      <p>{t('찜과 일정 저장 등은 로그인 후 이용할 수 있어요.', 'Sign in to save places, walks, and more.')}</p>
      <button type="button" className="primary" onClick={onLogin}>
        {t('로그인', 'Sign in')}
      </button>
      <button type="button" className="outline" onClick={onClose}>
        {t('나중에', 'Not now')}
      </button>
    </dialog>,
    document.body,
  )
}
