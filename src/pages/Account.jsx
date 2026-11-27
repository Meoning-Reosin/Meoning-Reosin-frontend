/**
 * S23-A 내 계정 관리. 주소: /account
 *   로그인 정보(닉네임·이메일·로그인 방식) → 로그아웃(API 8) · 계정 탈퇴(S23-D 확인 창 → API 40)
 * 로그인 안 했으면 로그인 버튼만 보여 준다.
 */
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'
import BottomNav from '../components/BottomNav.jsx'
import Header from '../components/Header.jsx'
import MenuRow from '../components/MenuRow.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import notify from '../lib/notify.js'

/** S23-D 계정 탈퇴 확인 창 */
function DeleteAccountDialog({ onDone, onClose }) {
  const { t } = useLanguage()
  const { deleteAccount } = useAuth()
  const ref = useRef(null)
  const [agreed, setAgreed] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!ref.current.open) ref.current.showModal()
  }, [])

  async function confirm() {
    setBusy(true)
    try {
      await deleteAccount()
      onDone()
    } catch {
      setBusy(false)
      notify(t('계정을 삭제하지 못했어요. 다시 시도해 주세요.', 'Could not delete the account. Please try again.'))
    }
  }

  return createPortal(
    <dialog
      ref={ref}
      className="walk-dialog sw-account-dialog"
      aria-labelledby="accountDeleteTitle"
      onClose={onClose}
      onCancel={(event) => busy && event.preventDefault()}
    >
      <h2 id="accountDeleteTitle">{t('계정을 탈퇴할까요?', 'Delete your account?')}</h2>
      <p>
        {t(
          'ㅇㅋㅋ-Walk Creator Crew 계정과 프로필, 일정, 찜이 삭제돼요. Google 계정은 유지돼요.',
          'Your ㅇㅋㅋ-Walk Creator Crew account, profile, walks, and favorites will be deleted. Your Google account is kept.',
        )}
      </p>
      <label className="sw-check">
        <input type="checkbox" checked={agreed} disabled={busy} onChange={(event) => setAgreed(event.target.checked)} />
        <span>{t('삭제된 데이터를 되돌릴 수 없음을 확인했어요.', 'I understand that deleted data cannot be recovered.')}</span>
      </label>
      <button type="button" className="primary account-delete" disabled={!agreed || busy} onClick={confirm}>
        {t('탈퇴하기', 'Delete account')}
      </button>
      <button type="button" className="outline" disabled={busy} onClick={onClose}>
        {t('취소', 'Cancel')}
      </button>
    </dialog>,
    document.body,
  )
}

export default function Account() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [deleting, setDeleting] = useState(false)

  async function signOut() {
    try {
      await logout()
      notify(t('로그아웃했어요.', 'Signed out.'))
    } catch {
      notify(t('로그아웃을 완료하지 못했어요.', 'Could not sign out.'))
    }
  }

  return (
    <>
      <Header />
      <main className="pad bottomspace account-page">
        <h1>{t('내 계정 관리', 'Manage my account')}</h1>
        {user ? (
          <>
            <section className="account-section">
              <h2>{t('로그인 정보', 'Sign-in information')}</h2>
              <div className="listbutton">
                <span>{t('닉네임', 'Nickname')}</span>
                <strong>{user.nickname}</strong>
              </div>
              <div className="listbutton">
                <span>{t('이메일', 'Email')}</span>
                <strong>{user.email}</strong>
              </div>
              <div className="listbutton">
                <span>{t('로그인 방식', 'Sign-in method')}</span>
                <strong>{user.provider === 'google' ? 'Google' : user.provider}</strong>
              </div>
              <MenuRow label={t('프로필 편집', 'Edit profile')} onClick={() => navigate('/profile')} />
            </section>
            <section className="account-section">
              <h2>{t('계정 이용', 'Account actions')}</h2>
              <MenuRow label={t('로그아웃', 'Sign out')} onClick={signOut} />
              <button type="button" className="listbutton account-danger" onClick={() => setDeleting(true)}>
                <span>{t('계정 탈퇴', 'Delete account')}</span>
                <span aria-hidden="true">›</span>
              </button>
            </section>
          </>
        ) : (
          <>
            <p>{t('로그인하면 계정 정보와 프로필을 관리할 수 있어요.', 'Sign in to manage your account and profile.')}</p>
            <button className="primary" onClick={() => navigate('/login', { state: { next: '/account' } })}>
              {t('로그인', 'Sign in')}
            </button>
          </>
        )}
      </main>
      <BottomNav />

      {deleting && (
        <DeleteAccountDialog
          onClose={() => setDeleting(false)}
          onDone={() => {
            setDeleting(false)
            navigate('/profile', { replace: true })
            notify(t('계정 탈퇴를 완료했어요.', 'Account deleted.'))
          }}
        />
      )}
    </>
  )
}
