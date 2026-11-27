/**
 * S07 홈.
 *   검색창 → 현재 위치 상태 → 배너(표지 + 서울 행사) → 인기 여행 코스 → 추천 역사 명소 → 하단 약관(S07-F)
 * 처음 들어왔으면 온보딩(S03~S05)을 위에 띄운다.
 *
 * 백엔드 연결
 * - 인기 여행 코스: GET /courses (지금은 A/B 추천 코스. 공개 코스 기능이 생기면 바꾼다)
 * - 추천 역사 명소: GET /places (위치가 있으면 가까운 순, 없으면 찜 많은 순) 3곳
 */
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listCourses, listPlaces } from '../api/places.js'
import BottomNav from '../components/BottomNav.jsx'
import CardRail from '../components/CardRail.jsx'
import EventMeta from '../components/EventMeta.jsx'
import Footer from '../components/Footer.jsx'
import Header from '../components/Header.jsx'
import Icon from '../components/icons.jsx'
import LocationStatus from '../components/LocationStatus.jsx'
import OnboardingCoach from '../components/OnboardingCoach.jsx'
import Photo from '../components/Photo.jsx'
import { currentEvents } from '../data/events.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { coachPending, finishCoach } from '../lib/entryFlow.js'
import useCurrentPosition from '../lib/useCurrentPosition.js'

const smooth = () => (matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth')

function SearchBar({ located }) {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const [value, setValue] = useState('')
  const [editing, setEditing] = useState(false)

  function submit(event) {
    event.preventDefault()
    const q = value.trim()
    if (!q) return inputRef.current.focus()
    navigate(`/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <form id="swSearch" className="sw-search" onSubmit={submit} role="search">
      <button
        type="button"
        className={located ? 'located' : undefined}
        onClick={() => navigate('/places')}
        aria-label={t('내 위치 지도', 'My location on the map')}
      >
        <Icon name="focus" />
      </button>
      <input
        ref={inputRef}
        type="search"
        enterKeyHint="search"
        placeholder={t('어느 장소를 찾고 계신가요?', 'Which place are you looking for?')}
        aria-label={t('장소 검색', 'Search for a place')}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onFocus={() => setEditing(true)}
        onBlur={() => setEditing(Boolean(value))}
      />
      <button
        type="submit"
        aria-label={editing ? t('검색 실행', 'Run search') : t('검색 입력', 'Focus search')}
        onPointerDown={(event) => !value && event.preventDefault()}
      >
        <Icon name={editing ? 'arrow' : 'search'} />
      </button>
    </form>
  )
}


function Banners() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const trackRef = useRef(null)
  const [index, setIndex] = useState(0)
  const events = currentEvents()
  const total = events.length ? events.length + 1 : 2

  function onScroll() {
    const track = trackRef.current
    if (track.clientWidth) setIndex(Math.round(track.scrollLeft / track.clientWidth))
  }

  function move(direction) {
    const track = trackRef.current
    const next = (Math.round(track.scrollLeft / track.clientWidth) + direction + total) % total
    track.scrollTo({ left: next * track.clientWidth, behavior: smooth() })
  }

  return (
    <div className="sw-carousel">
      <div ref={trackRef} className="sw-track" aria-label={t('서울 이야기와 행사', 'Seoul stories and events')} onScroll={onScroll}>
        <section className="sw-slide sw-cover">
          <Photo src="/assets/hanok.jpg" label={t('서울의 한옥', 'Hanok in Seoul')} />
          <span className="cover-frame" aria-hidden="true"></span>
          <span className="cover-brand" lang="en">
            ㅇㅋㅋ-Walk Creator Crew
          </span>
          <div className="sw-slide-copy">
            <h1>
              {t('옛것을 벗 삼아,', 'Walk Seoul,')}
              <br />
              {t('서울을 걷다.', 'with the past.')}
            </h1>
            <button className="cover-cta" type="button" onClick={() => navigate('/places')}>
              {t('역사 명소 둘러보기', 'Explore historic places')}
              <Icon name="arrow" />
            </button>
          </div>
        </section>

        {events.map((event) => (
          <button key={event.ko} className="sw-slide" onClick={() => navigate('/events')}>
            <Photo src={event.image} label={t('서울 풍경', 'A view of Seoul')} />
            <div className="sw-slide-copy">
              <p>{t('서울 행사 소식', 'Seoul events')}</p>
              <h2>{t(event.ko, event.en)}</h2>
              <EventMeta event={event} />
            </div>
          </button>
        ))}

        {!events.length && (
          <button className="sw-slide" onClick={() => navigate('/events')}>
            <Photo src="/assets/palace.jpg" />
            <div className="sw-slide-copy">
              <h2>{t('서울 행사 소식', 'Seoul events')}</h2>
              <p>{t('서울문화포털 공식 일정 보기', 'See the official calendar')}</p>
            </div>
          </button>
        )}
      </div>
      <button type="button" className="sw-side-arrow prev" aria-label={t('이전', 'Previous')} onClick={() => move(-1)}>
        ‹
      </button>
      <button type="button" className="sw-side-arrow next" aria-label={t('다음', 'Next')} onClick={() => move(1)}>
        ›
      </button>
      <span className="sw-banner-counter">
        {index + 1} / {total}
      </span>
    </div>
  )
}

/** 백엔드에서 목록을 받아 온다. 언어나 조건이 바뀌면 다시 받는다. */
function useList(load, deps) {
  const [items, setItems] = useState([])
  const [error, setError] = useState(null)
  useEffect(() => {
    let cancelled = false
    load()
      .then((data) => !cancelled && (setItems(data.items ?? []), setError(null)))
      .catch((err) => !cancelled && setError(err))
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return { items, error }
}

function formatKm(meters) {
  return (meters / 1000).toFixed(1) + ' km'
}

export default function Home() {
  const { lang, t } = useLanguage()
  const navigate = useNavigate()
  const { coords, status } = useCurrentPosition()
  const [showCoach, setShowCoach] = useState(coachPending)

  const courses = useList(() => listCourses({ size: 5 }), [lang])
  const places = useList(
    () =>
      listPlaces(coords ? { sort: 'distance', lat: coords.lat, lng: coords.lng, size: 3 } : { sort: 'bookmarks', size: 3 }),
    [lang, coords?.lat, coords?.lng],
  )

  const loadFailed = t('목록을 불러오지 못했어요.', 'Could not load the list.')

  return (
    <>
      <Header isHome menu />
      <main className="sw-home">
        <SearchBar located={Boolean(coords)} />
        <LocationStatus status={status} />
        <Banners />

        <section className="sw-section">
          <div className="sw-title">
            <h2>{t('인기 여행 코스', 'Popular walks')}</h2>
            <button className="section-action" onClick={() => navigate('/courses')}>
              {t('전체 보기', 'See all')}
            </button>
          </div>
          {courses.error && <p className="small">{loadFailed}</p>}
          <CardRail onMore={() => navigate('/courses')}>
            {courses.items.map((course, index) => (
              <article key={course.course_id} className="sw-card">
                <button className="sw-card-link" onClick={() => navigate(`/courses/${course.course_id}`)}>
                  <Photo src={course.thumbnail_url} label={t(course.title, course.title_en)} />
                  <span className="sw-rank">{index + 1}</span>
                  <h3>{t(course.title, course.title_en)}</h3>
                  <p className="small">
                    {course.place_count}
                    {t('곳', ' stops')} · {course.total_minutes}
                    {t('분', ' min')}
                  </p>
                </button>
              </article>
            ))}
          </CardRail>
        </section>

        <section className="sw-section">
          <div className="sw-title">
            <h2>{t('추천 역사 명소', 'Historic places')}</h2>
            <button className="section-action" onClick={() => navigate('/places')}>
              {t('지도 보기', 'Open map')}
            </button>
          </div>
          <p className="small">
            {coords
              ? t('현재 위치에서 가까운 순 · 직선거리', 'Nearest to you · straight-line distance')
              : t(
                  '서울 도심 추천 · 위치를 허용하면 가까운 곳부터 보여드려요.',
                  'Central Seoul picks. Enable location to see the nearest places.',
                )}
          </p>
          {places.error && <p className="small">{loadFailed}</p>}
          <CardRail places onMore={() => navigate('/places')}>
            {places.items.map((place) => (
              <article key={place.place_id} className="sw-card">
                <button className="sw-card-link" onClick={() => navigate(`/places/${place.place_id}`)}>
                  <Photo src={place.thumbnail_url} label={t(place.name, place.name_en)} />
                  <h3>{t(place.name, place.name_en)}</h3>
                  <p className="small">{place.distance_m != null ? formatKm(place.distance_m) : place.area}</p>
                </button>
              </article>
            ))}
          </CardRail>
        </section>

        <Footer />
      </main>
      <BottomNav />

      {showCoach && (
        <OnboardingCoach
          onFinish={(skipNextTime) => {
            finishCoach(skipNextTime)
            setShowCoach(false)
          }}
        />
      )}
    </>
  )
}
