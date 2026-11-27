/**
 * 추천 코스 목록. 주소: /courses (홈 '인기 여행 코스 → 전체 보기')
 * 프로토타입 홈의 코스 카드(journal-entry) 모양을 쓴다. 백엔드: GET /courses
 */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listCourses } from '../api/places.js'
import BottomNav from '../components/BottomNav.jsx'
import Header from '../components/Header.jsx'
import Photo from '../components/Photo.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'

export default function Courses() {
  const { lang, t } = useLanguage()
  const navigate = useNavigate()
  const [state, setState] = useState({ key: null, items: [], error: null })

  useEffect(() => {
    let cancelled = false
    listCourses({ size: 100 })
      .then((data) => !cancelled && setState({ key: lang, items: data.items ?? [], error: null }))
      .catch((error) => !cancelled && setState({ key: lang, items: [], error }))
    return () => {
      cancelled = true
    }
  }, [lang])

  const total = String(state.items.length).padStart(2, '0')

  return (
    <>
      <Header />
      <main className="pad bottomspace">
        <div className="eyebrow">CURATED JOURNEYS</div>
        <h1>{t('추천 여행 코스', 'Curated walks')}</h1>
        {state.key !== lang && <p className="small">{t('불러오는 중…', 'Loading…')}</p>}
        {state.error && <p>{t('목록을 불러오지 못했어요.', 'Could not load the list.')}</p>}
        {state.items.map((course, index) => {
          const number = String(index + 1).padStart(2, '0')
          const title = t(course.title, course.title_en)
          return (
            <button key={course.course_id} className="journal-entry" onClick={() => navigate(`/courses/${course.course_id}`)}>
              <div className="journal-photo">
                <Photo src={course.thumbnail_url} label={title} />
                <span className="journal-num">{number}</span>
              </div>
              <div className="journal-caption">
                <span className="eyebrow">
                  JOURNEY {number} / {total}
                </span>
                <h3>{title}</h3>
                <p>
                  {course.subtitle} · {course.place_count}
                  {t('곳', ' stops')} · {course.total_minutes}
                  {t('분', ' min')}
                </p>
                <span className="journal-arrow">↗</span>
              </div>
            </button>
          )
        })}
      </main>
      <BottomNav />
    </>
  )
}
