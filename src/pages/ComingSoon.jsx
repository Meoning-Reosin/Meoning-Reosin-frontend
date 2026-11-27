/**
 * 임시 화면: 아직 옮기지 않은 화면 자리. 하단 메뉴와 전체 메뉴를 눌러 볼 수 있게 둔다.
 * 각 기능 브랜치에서 진짜 화면으로 바꾸면 App.jsx 에서 이 화면을 쓰는 줄을 지운다.
 */
import BottomNav from '../components/BottomNav.jsx'
import Header from '../components/Header.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'

export default function ComingSoon({ title, branch }) {
  const { t } = useLanguage()

  return (
    <>
      <Header menu />
      <main className="pad bottomspace">
        <div className="eyebrow">COMING SOON</div>
        <h1>{t(...title)}</h1>
        <p>{t(`이 화면은 ${branch} 브랜치에서 옮길 예정이에요.`, `This screen will be built on the ${branch} branch.`)}</p>
      </main>
      <BottomNav />
    </>
  )
}
