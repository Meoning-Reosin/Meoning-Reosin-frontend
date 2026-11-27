/**
 * S12-S 장소 공유 창: 링크 복사, (휴대폰이면) 카카오톡 등 기기 공유 메뉴.
 *   <ShareDialog title="광화문" url="https://…/places/2" onClose={...} />
 */
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import notify from '../lib/notify.js'

export default function ShareDialog({ title, url, onClose }) {
  const { t } = useLanguage()
  const dialogRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog.open) dialog.showModal()
  }, [])

  async function copy() {
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      // 복사 권한이 없으면 글자를 선택해 두고 직접 복사하게 한다.
      inputRef.current.focus()
      inputRef.current.select()
      notify(t('선택한 링크를 복사해 주세요.', 'Copy the selected link.'))
      return
    }
    onClose()
    notify(t('장소 링크를 복사했어요.', 'Place link copied.'))
  }

  function nativeShare() {
    navigator.share({ title: `${title} · ㅇㅋㅋ-Walk Creator Crew`, url }).catch((error) => {
      if (error.name !== 'AbortError')
        notify(t('공유 메뉴를 열 수 없어요. 링크를 복사해 주세요.', 'Could not open sharing. Copy the link instead.'))
    })
  }

  return createPortal(
    <dialog ref={dialogRef} className="walk-dialog sw-share-dialog" aria-labelledby="sharePlaceTitle" onClose={onClose}>
      <h2 id="sharePlaceTitle">{t('장소 공유', 'Share place')}</h2>
      <p>{title}</p>
      <input ref={inputRef} type="text" readOnly value={url} aria-label={t('장소 공유 링크', 'Place link')} />
      <button type="button" className="primary" onClick={copy}>
        {t('링크 복사', 'Copy link')}
      </button>
      {'share' in navigator && (
        <button type="button" className="outline" onClick={nativeShare}>
          {t('카카오톡 등으로 공유', 'Share via your apps')}
        </button>
      )}
      <button type="button" className="outline" onClick={onClose}>
        {t('닫기', 'Close')}
      </button>
    </dialog>,
    document.body,
  )
}
