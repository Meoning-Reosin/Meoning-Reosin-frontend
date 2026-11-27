/**
 * S20 서비스 설정. 주소: /settings
 * - 알림 설정: 이 기기에만 저장 (푸시 알림은 연동 전)
 * - 선택 동의(로그인했을 때만): 위치 · 카메라·사진 · 사진 학습 → PATCH /users/me/consents (API 43)
 * - 언어, 온보딩 다시 보기, 사진 동의 다시 설정, 내 계정 관리, 콘텐츠 출처
 * TODO(bot 브랜치): 해치봇 표시 설정
 */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getConsents, updateConsents } from '../api/auth.js'
import { useAuth } from '../auth/AuthContext.jsx'
import BottomNav from '../components/BottomNav.jsx'
import Header from '../components/Header.jsx'
import MenuRow from '../components/MenuRow.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { replayCoach } from '../lib/entryFlow.js'
import notify from '../lib/notify.js'
import { local } from '../lib/storage.js'

function Toggle({ label, checked, onChange, disabled }) {
  return (
    <label className="sw-toggle">
      <span>{label}</span>
      <input type="checkbox" role="switch" checked={checked} disabled={disabled} onChange={(event) => onChange(event.target.checked)} />
    </label>
  )
}

export default function Settings() {
  const { lang, t } = useLanguage()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [notices, setNotices] = useState(() => ({
    walk: local.get('notice_walk', true),
    event: local.get('notice_event', true),
  }))
  const [consents, setConsents] = useState(null)

  useEffect(() => {
    if (!user) return
    let cancelled = false
    getConsents()
      .then((data) => !cancelled && setConsents(data))
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [user])

  function setNotice(key, value) {
    local.set(`notice_${key}`, value)
    setNotices((prev) => ({ ...prev, [key]: value }))
  }

  async function setConsent(key, value) {
    try {
      setConsents(await updateConsents({ [key]: value }))
    } catch (error) {
      notify(error.message)
    }
  }

  function resetPhotoConsent() {
    local.set('photo_access', false)
    local.set('photo_training', false)
    if (user) updateConsents({ camera: false, photo_training: false }).catch(() => {})
    navigate('/capture')
  }

  return (
    <>
      <Header />
      <main className="pad bottomspace">
        <h1>{t('서비스 설정', 'Settings')}</h1>

        <h2>{t('알림 설정', 'Notifications')}</h2>
        <Toggle label={t('일정 대화 알림', 'Walk discussion alerts')} checked={notices.walk} onChange={(v) => setNotice('walk', v)} />
        <Toggle label={t('서울 행사 소식', 'Seoul event updates')} checked={notices.event} onChange={(v) => setNotice('event', v)} />
        <p className="small">
          {t('이 기기에 설정을 저장해요. 푸시 알림은 연동 준비 중이에요.', 'Preferences are saved on this device. Push notifications are pending.')}
        </p>

        {user && (
          <>
            <h2>{t('선택 동의', 'Optional consents')}</h2>
            <Toggle
              label={t('위치 정보 이용', 'Use my location')}
              checked={Boolean(consents?.location)}
              disabled={!consents}
              onChange={(v) => setConsent('location', v)}
            />
            <Toggle
              label={t('카메라·사진 접근', 'Camera and photo access')}
              checked={Boolean(consents?.camera)}
              disabled={!consents}
              onChange={(v) => setConsent('camera', v)}
            />
            <Toggle
              label={t('사진을 인식 개선에 활용', 'Use my photos to improve recognition')}
              checked={Boolean(consents?.photo_training)}
              disabled={!consents}
              onChange={(v) => setConsent('photo_training', v)}
            />
            <p className="small">
              {t('필수 동의(이용약관·개인정보)는 계정 탈퇴로 철회할 수 있어요.', 'Required consents can be withdrawn by deleting your account.')}
            </p>
          </>
        )}

        <MenuRow
          label={t('언어 선택', 'Language')}
          sub={lang === 'ko' ? '한국어' : 'English'}
          onClick={() => navigate('/language', { state: { fromMenu: true } })}
        />
        <MenuRow
          label={t('온보딩 다시 보기', 'Replay tutorial')}
          onClick={() => {
            replayCoach()
            navigate('/')
          }}
        />
        <MenuRow label={t('사진·학습 동의 다시 설정', 'Reset photo and training choices')} onClick={resetPhotoConsent} />
        <MenuRow label={t('내 계정 관리', 'Manage my account')} onClick={() => navigate('/account')} />
        <MenuRow label={t('콘텐츠 출처', 'Content credits')} onClick={() => navigate('/credits')} />
      </main>
      <BottomNav />
    </>
  )
}
