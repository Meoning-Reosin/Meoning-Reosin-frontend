/**
 * 약관 이름 버튼 + 누르면 뜨는 약관 창 (S25 약관·개인정보 열람).
 *   <PolicyButton policy="privacy" className="inline-policy" />
 * policy: 'terms' | 'privacy' | 'location' | 'photos'
 */
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import policies from '../data/policies.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'

function PolicyDialog({ policy, onClose }) {
  const { t } = useLanguage()
  const ref = useRef(null)

  useEffect(() => {
    // 창을 닫으면 컴포넌트가 사라지면서 dialog 도 같이 없어진다. 개발 모드에서 두 번 불려도 괜찮게 open 을 확인한다.
    const dialog = ref.current
    if (!dialog.open) dialog.showModal()
    dialog.scrollTop = 0
  }, [])

  return createPortal(
    <dialog
      ref={ref}
      className="walk-dialog sw-policy-dialog"
      aria-labelledby="storywalkPolicyTitle"
      onClose={onClose}
    >
      <header>
        <h2 id="storywalkPolicyTitle">{t(...policy.title)}</h2>
        <button type="button" onClick={onClose} aria-label={t('닫기', 'Close')}>
          ×
        </button>
      </header>
      <div className="sw-policy-content">
        <p className="small">
          {t('ㅇㅋㅋ-Walk Creator Crew 프로토타입 안내 · 초안', 'ㅇㅋㅋ-Walk Creator Crew prototype notice · Draft')}
        </p>
        {policy.sections.map(([heading, copy]) => (
          <section key={heading[0]}>
            <h3>{t(...heading)}</h3>
            <p>{t(...copy)}</p>
          </section>
        ))}
        <div className="sw-policy-sources" aria-label={t('참고 자료', 'References')}>
          {policy.sources.map(([ko, en, url]) => (
            <a key={url} href={url} target="_blank" rel="noopener noreferrer">
              {t(ko, en)}
            </a>
          ))}
        </div>
      </div>
    </dialog>,
    document.body,
  )
}

export default function PolicyButton({ policy: key, className = '' }) {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const policy = policies[key]
  if (!policy) return null

  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>
        {t(...policy.title)}
      </button>
      {open && <PolicyDialog policy={policy} onClose={() => setOpen(false)} />}
    </>
  )
}
