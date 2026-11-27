/**
 * 화면 언어(한국어/영어).
 *
 * 프로토타입의 t('한글', 'English') 방식을 그대로 쓴다.
 *   const { t } = useLanguage()
 *   <h1>{t('오늘의 산책', "Today's walk")}</h1>
 *
 * 고른 언어는 브라우저에 기억하고, 백엔드 요청에도 같은 언어를 보낸다.
 */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { setApiLanguage } from '../api/client.js'

const STORAGE_KEY = 'wcc_lang'
const LanguageContext = createContext(null)

function initialLanguage() {
  const saved = localStorage.getItem(STORAGE_KEY)
  return saved === 'en' || saved === 'ko' ? saved : 'ko'
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(initialLanguage)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang)
    document.documentElement.lang = lang
    setApiLanguage(lang)
  }, [lang])

  const value = useMemo(() => ({ lang, setLang, t: (ko, en) => (lang === 'en' ? en : ko) }), [lang])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

// eslint-disable-next-line react/only-export-components
export function useLanguage() {
  const value = useContext(LanguageContext)
  if (!value) throw new Error('useLanguage 는 LanguageProvider 안에서만 쓸 수 있어요.')
  return value
}
