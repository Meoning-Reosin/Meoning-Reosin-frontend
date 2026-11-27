/**
 * S18 체험 시작 · 동의 (가입 마치기). 주소: /signup
 * Google 로그인을 처음 한 사람이 오는 곳. 백엔드가 10분짜리 가입 쿠키(wcc_signup)를 심어 둔 상태다.
 *   필수: 이용약관, 개인정보 / 선택: 위치, 카메라·사진, 사진 학습 / 닉네임(비우면 Google 이름)
 *   → POST /auth/oauth/signup (API 6) → 로그인 완료
 * 앞에서 고른 값(첫 진입 개인정보·위치 동의, 사진 접근 동의)으로 미리 체크해 둔다.
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signup } from '../api/auth.js'
import { takeLoginNext, useAuth } from '../auth/AuthContext.jsx'
import Header from '../components/Header.jsx'
import PolicyButton from '../components/PolicyButton.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { local } from '../lib/storage.js'
import { locationAllowed, privacyConsent } from '../lib/entryFlow.js'
import notify from '../lib/notify.js'

function Check({ checked, onChange, children }) {
  return (
    <label className="sw-check">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span>{children}</span>
    </label>
  )
}

export default function Signup() {
  const { lang, t } = useLanguage()
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const [form, setForm] = useState(() => ({
    terms: false,
    privacy: privacyConsent() === 'agreed',
    location: locationAllowed(),
    camera: local.get('photo_access', false),
    training: local.get('photo_training', false),
    nickname: '',
  }))
  const [busy, setBusy] = useState(false)
  const set = (key) => (value) => setForm((prev) => ({ ...prev, [key]: value }))
  const nicknameOk = !form.nickname.trim() || (form.nickname.trim().length >= 2 && form.nickname.trim().length <= 20)
  const canSubmit = form.terms && form.privacy && nicknameOk && !busy

  async function submit() {
    setBusy(true)
    try {
      const user = await signup({
        agree_terms: form.terms,
        agree_privacy: form.privacy,
        agree_location: form.location,
        agree_camera: form.camera,
        agree_photo_training: form.training,
        nickname: form.nickname.trim() || undefined,
        language: lang,
      })
      setUser(user)
      notify(t('가입을 마쳤어요. 환영해요!', 'You’re all set. Welcome!'))
      navigate(takeLoginNext(), { replace: true })
    } catch (error) {
      setBusy(false)
      if (error.code === 'SIGNUP_TOKEN_INVALID') {
        notify(t('가입 시간이 지났어요. 다시 로그인해 주세요.', 'Sign-up timed out. Please sign in again.'))
        navigate('/login', { replace: true })
      } else notify(error.message)
    }
  }

  return (
    <>
      <Header />
      <main className="pad bottomspace">
        <h1>{t('체험 시작하기', 'Start your walk')}</h1>
        <p>{t('약관에 동의하면 가입이 끝나요.', 'Agree to the terms to finish joining.')}</p>

        <label className="sw-field">
          <span className="small">{t('닉네임 (비우면 Google 이름, 2~20자)', 'Nickname (blank = Google name, 2–20 chars)')}</span>
          <input
            type="text"
            className="search"
            maxLength={20}
            value={form.nickname}
            onChange={(event) => set('nickname')(event.target.value)}
          />
        </label>

        <Check checked={form.terms} onChange={set('terms')}>
          {t('이용약관에 동의합니다. (필수)', 'I agree to the terms of use. (Required)')}
        </Check>
        <Check checked={form.privacy} onChange={set('privacy')}>
          {t('개인정보 수집·이용에 동의합니다. (필수)', 'I agree to the collection and use of personal data. (Required)')}
        </Check>
        <Check checked={form.location} onChange={set('location')}>
          {t('위치 정보 이용에 동의합니다. (선택)', 'I agree to the use of my location. (Optional)')}
        </Check>
        <Check checked={form.camera} onChange={set('camera')}>
          {t('카메라·사진 접근에 동의합니다. (선택)', 'I agree to camera and photo access. (Optional)')}
        </Check>
        <Check checked={form.training} onChange={set('training')}>
          {t('올린 사진을 장소 인식 개선에 쓰는 데 동의합니다. (선택)', 'I agree to the use of my photos to improve recognition. (Optional)')}
        </Check>

        <div className="footer-policies">
          <PolicyButton policy="terms" />
          <PolicyButton policy="privacy" />
          <PolicyButton policy="location" />
          <PolicyButton policy="photos" />
        </div>

        <button className="primary" disabled={!canSubmit} onClick={submit}>
          {busy ? t('가입하는 중…', 'Joining…') : t('동의하고 시작하기', 'Agree and start')}
        </button>
      </main>
    </>
  )
}
