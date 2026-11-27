/**
 * 코스 상세. 주소: /courses/1 (프로토타입 'CURATED JOURNEY' 테마 화면 모양)
 *   대표 사진 → 제목·부제·설명 → 이야기의 순서(장소 목록, 관람 시간과 앞 장소에서 걷는 시간)
 * 백엔드: GET /courses/{id}
 * '이 코스 일정에 담기': 로그인 확인 후 일정 고르기 창 (API 31 POST /itineraries/courses)
 */
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCourse } from '../api/places.js'
import { useAuth } from '../auth/AuthContext.jsx'
import BottomNav from '../components/BottomNav.jsx'
import Header from '../components/Header.jsx'
import ItineraryPicker from '../components/ItineraryPicker.jsx'
import Photo from '../components/Photo.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'

export default function CourseDetail() {
  const { lang, t } = useLanguage()
  const { requireLogin } = useAuth()
  const [picking, setPicking] = useState(false)
  const navigate = useNavigate()
  const { courseId } = useParams()
  const [state, setState] = useState({ key: null, course: null, error: null })
  const key = `${courseId}|${lang}`

  useEffect(() => {
    let cancelled = false
    getCourse(courseId)
      .then((course) => !cancelled && setState({ key, course, error: null }))
      .catch((error) => !cancelled && setState({ key, course: null, error }))
    return () => {
      cancelled = true
    }
  }, [courseId, lang, key])

  const ready = state.key === key
  const course = ready ? state.course : null

  return (
    <>
      <Header />
      <div className="bottomspace">
        {!ready && <p className="pad small">{t('불러오는 중…', 'Loading…')}</p>}
        {ready && state.error && (
          <p className="pad">
            {state.error.status === 404 ? t('코스를 찾을 수 없어요.', 'Walk not found.') : t('정보를 불러오지 못했어요.', 'Could not load the information.')}
          </p>
        )}
        {course && (
          <>
            <Photo src={course.places[0]?.thumbnail_url} label={t(course.title, course.title_en)} className="tall" />
            <div className="pad center">
              <div className="eyebrow">CURATED JOURNEY</div>
              <h1>{t(course.title, course.title_en)}</h1>
              <p>{course.subtitle}</p>
              <p>{course.description}</p>
              <div className="small">
                {course.places.length}
                {t('개의 장소', ' places')} · {t('약', 'about')} {course.total_minutes}
                {t('분 도보 여행', ' min walking journey')}
              </div>
              <button className="primary" onClick={() => requireLogin(`/courses/${courseId}`) && setPicking(true)}>
                {t('이 코스 일정에 담기', 'Save this journey')}
              </button>
            </div>
            <section className="section">
              <div className="eyebrow">THE JOURNEY</div>
              <h2>{t('이야기의 순서', 'Your chapters')}</h2>
              <div className="timeline">
                {course.places.map((place) => (
                  <div key={place.place_id} className="item">
                    <Photo src={place.thumbnail_url} label={t(place.name, place.name_en)} />
                    <button className="text" onClick={() => navigate(`/places/${place.place_id}`)}>
                      <div className="eyebrow">
                        {String(place.order).padStart(2, '0')}
                        {place.walk_minutes_from_previous != null &&
                          ` · ${t('도보', 'walk')} ${place.walk_minutes_from_previous}${t('분', ' min')}`}
                      </div>
                      <h3>{t(place.name, place.name_en)}</h3>
                      <div className="small">
                        {place.expected_visit_minutes}
                        {t('분 관람', ' min visit')}
                      </div>
                    </button>
                    <span>›</span>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
      <BottomNav />
      {picking && course && (
        <ItineraryPicker
          course={{ course_id: course.course_id, title: t(course.title, course.title_en) }}
          onClose={() => setPicking(false)}
        />
      )}
    </>
  )
}
