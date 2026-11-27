/**
 * S02 언어 선택.
 * - 첫 진입이면: 계속하기 → 위치 동의(S06) (항상 허용이면 건너뜀)
 * - 메뉴에서 왔으면(state.fromMenu): 계속하기 → 이전 화면으로
 */
import { useLocation, useNavigate } from 'react-router-dom'
import { BRAND_LOGO, useGoBack } from '../components/Header.jsx'
import Icon from '../components/icons.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { nextAfterLanguage } from '../lib/entryFlow.js'

const OPTIONS = [
  { code: 'ko', label: '한국어' },
  { code: 'en', label: 'English' },
]

export default function Language() {
  const { lang, setLang, t } = useLanguage()
  const navigate = useNavigate()
  const goBack = useGoBack()
  const fromMenu = useLocation().state?.fromMenu

  function next() {
    if (fromMenu) navigate(-1)
    else navigate(nextAfterLanguage(), { state: { entry: true } })
  }

  return (
    <>
      <header className="language-head">
        <button className="icon language-back" onClick={goBack} aria-label={t('뒤로', 'Back')}>
          <Icon name="back" />
        </button>
        <img src={BRAND_LOGO} alt="ㅇㅋㅋ-Walk Creator Crew" />
        <h1 className="english-title" lang="en">
          Language
        </h1>
      </header>
      <main className="intro sw-language">
        <div>
          <h2>{t('이용 언어를 선택하세요.', 'Choose your language.')}</h2>
          {OPTIONS.map(({ code, label }) => (
            <button
              key={code}
              className={`listbutton language-option ${lang === code ? 'selected' : ''}`}
              aria-pressed={lang === code}
              onClick={() => setLang(code)}
            >
              <span>{label}</span>
              <span>{lang === code ? '●' : '○'}</span>
            </button>
          ))}
        </div>
        <div>
          <button className="primary" onClick={next}>
            {t('계속하기', 'Continue')}
          </button>
        </div>
      </main>
    </>
  )
}
