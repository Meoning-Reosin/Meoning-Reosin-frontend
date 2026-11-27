/**
 * S07 홈 (임시). 진짜 홈 화면, 온보딩(S03~S05), 검색(S08)은 home 브랜치에서 옮긴다.
 * 지금은 공통 틀(위 막대, 하단 메뉴, 홈 하단 약관 S07-F)이 잘 나오는지 확인하는 용도.
 */
import BottomNav from '../components/BottomNav.jsx'
import Footer from '../components/Footer.jsx'
import Header from '../components/Header.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'

export default function Home() {
  const { t } = useLanguage()

  return (
    <>
      <Header isHome menu />
      <main className="pad">
        <div className="eyebrow">Walk Creator Crew</div>
        <h1>{t('홈', 'Home')}</h1>
        <p>{t('홈 화면은 home 브랜치에서 옮길 예정이에요.', 'The home screen will be built on the home branch.')}</p>
      </main>
      <Footer />
      <BottomNav />
    </>
  )
}
