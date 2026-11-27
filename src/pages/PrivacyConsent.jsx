/**
 * S06-A 개인정보 수집·이용 동의 (첫 진입 마지막 단계). 동의하든 안 하든 홈으로 간다.
 * 고른 값은 브라우저에 기억해 두고, 로그인 후 가입 마치기(auth 브랜치)에서 백엔드로 보낸다.
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header.jsx'
import Icon from '../components/icons.jsx'
import PolicyButton from '../components/PolicyButton.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { finishEntry, setPrivacyConsent } from '../lib/entryFlow.js'

export default function PrivacyConsent() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [checked, setChecked] = useState(false)

  function finish(agreed) {
    setPrivacyConsent(agreed ? 'agreed' : 'declined')
    navigate(finishEntry(), { replace: true })
  }

  return (
    <>
      <Header />
      <main className="pad sw-location-consent sw-privacy-consent">
        <div className="geo-symbol">
          <Icon name="shield" />
        </div>
        <h1>{t('개인정보 수집·이용 동의', 'Consent to collect and use personal data')}</h1>
        <p>
          {t(
            '일정과 프로필 기능에서 어떤 정보를 사용하는지 확인해 주세요.',
            'Review what information the profile and itinerary features use.',
          )}
        </p>
        <dl className="privacy-consent-summary">
          <div>
            <dt>{t('수집 항목', 'Data used')}</dt>
            <dd>
              {t(
                '사용자가 입력한 프로필 이름·사진, 일정·찜·일정 대화',
                'Profile name and photo, walks, favorites, and walk messages that you provide',
              )}
            </dd>
          </div>
          <div>
            <dt>{t('이용 목적', 'Purpose')}</dt>
            <dd>
              {t(
                '이 기기에서 프로필과 여행 기록을 저장하고 다시 불러오기',
                'Save and restore your profile and trip records on this device',
              )}
            </dd>
          </div>
          <div>
            <dt>{t('보관 기간', 'Retention')}</dt>
            <dd>
              {t(
                '계정 메뉴에서 체험 데이터를 삭제하거나 브라우저의 사이트 데이터를 지울 때까지',
                'Until you delete demo data in account settings or clear the browser’s site data',
              )}
            </dd>
          </div>
        </dl>
        <PolicyButton policy="privacy" className="inline-policy" />
        <label className="sw-check">
          <input type="checkbox" checked={checked} onChange={(event) => setChecked(event.target.checked)} />
          <span>
            {t(
              '위 내용을 읽었으며 개인정보 수집·이용에 동의합니다.',
              'I have read the information and agree to this use of my data.',
            )}
          </span>
        </label>
        <button type="button" className="primary" onClick={() => finish(true)} disabled={!checked}>
          {t('동의하고 계속', 'Agree and continue')}
        </button>
        <button className="outline" onClick={() => finish(false)}>
          {t('동의하지 않고 둘러보기', 'Browse without agreeing')}
        </button>
      </main>
    </>
  )
}
