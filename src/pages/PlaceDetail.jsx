/**
 * S12-1~4 장소 상세. 주소: /places/3?tab=0
 *   사진 → 해설 재생 줄 → 이름·지역·카테고리 → 탭 4개 → '관련 이야기 계속보기'(S14)
 *   탭: 0 장소 소개(S12-1) · 1 운영 정보(S12-2) · 2 혼잡도(S12-3) · 3 해설 대본(S12-4)
 *
 * 백엔드: GET /places/{id}, /places/{id}/operating-info, /places/{id}/script
 * 혼잡도는 서울시 실시간 도시데이터 연동 전이라 '준비 중'으로 둔다.
 * 찜(♥): 로그인 안 했으면 로그인 안내 창. 로그인 상태가 바뀌면 상세를 다시 받아 찜 여부를 맞춘다.
 * 일정에 담기(책갈피 버튼): 로그인 안 했으면 로그인 안내 창, 했으면 '어느 일정에 담을까요?' 창.
 */
import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { getOperatingInfo, getPlace, getScript } from '../api/places.js'
import { useAuth } from '../auth/AuthContext.jsx'
import BottomNav from '../components/BottomNav.jsx'
import GuideLine from '../components/GuideLine.jsx'
import Header from '../components/Header.jsx'
import Photo from '../components/Photo.jsx'
import ShareDialog from '../components/ShareDialog.jsx'
import Icon from '../components/icons.jsx'
import ItineraryPicker from '../components/ItineraryPicker.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import useBookmark from '../lib/useBookmark.js'

const CROWD_SOURCE = 'https://data.seoul.go.kr/SeoulRtd/map'
const ODII_HOME = 'https://www.odii.kr/smarttour_web/home/main'

const ShareIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 14V3m-4 4 4-4 4 4M7 10H5v10h14V10h-2" />
  </svg>
)

/** 탭을 열 때 한 번 불러오는 데이터 */
function useLazy(load, enabled, deps) {
  const [state, setState] = useState({ key: null, data: null, error: null })
  const key = deps.join('|')
  useEffect(() => {
    if (!enabled || state.key === key) return
    let cancelled = false
    load()
      .then((data) => !cancelled && setState({ key, data, error: null }))
      .catch((error) => !cancelled && setState({ key, data: null, error }))
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, key])
  return state.key === key ? state : { data: null, error: null }
}

function Overview({ place }) {
  const { t } = useLanguage()
  const summary = place.introduction.summary
  return (
    <>
      <p className="quote">{summary}</p>
      <h3>{t('관람 포인트', 'What to look for')}</h3>
      <ul className="sw-visit-points">
        {place.introduction.highlights.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </>
  )
}

function OperatingInfo({ info }) {
  const { t } = useLanguage()
  const rows = [
    [t('지금', 'Now'), info.is_open_now ? t('운영 중', 'Open') : t('운영 종료', 'Closed')],
    [t('운영 시간', 'Opening hours'), info.opening_hours],
    [t('입장 마감', 'Last admission'), info.last_admission],
    [t('휴무일', 'Closed'), info.closed_days],
    [t('관람료', 'Admission'), info.admission_fee],
    [t('예약', 'Reservation'), info.reservation],
    [t('예상 관람 시간', 'Expected visit'), `${info.expected_visit_minutes}${t('분', ' min')}`],
  ].filter(([, value]) => value)

  return (
    <>
      {rows.map(([label, value]) => (
        <div key={label} className="listbutton">
          {label}
          <span className="small">{value}</span>
        </div>
      ))}
      {info.source_url ? (
        <a className="outline" target="_blank" rel="noopener noreferrer" href={info.source_url}>
          {info.source || t('공식 안내', 'Official information')} ↗
        </a>
      ) : (
        <p className="small">{t('임시 정보예요. 방문 전 공식 안내를 확인해 주세요.', 'Sample information. Check official sources before visiting.')}</p>
      )}
    </>
  )
}

function Crowd() {
  const { t } = useLanguage()
  return (
    <>
      <div className="crowd-report" aria-live="polite">
        <p>{t('실시간 혼잡도는 연결 준비 중이에요.', 'Live crowd data is pending integration.')}</p>
      </div>
      <a className="crowd-source" href={CROWD_SOURCE} target="_blank" rel="noopener noreferrer">
        {t('서울시 실시간 도시데이터에서 보기', 'Open Seoul’s real-time data')}
      </a>
    </>
  )
}

function Script({ script }) {
  const { t } = useLanguage()
  return (
    <>
      <p className="quote">{script.content}</p>
      <a className="odii-link" href={ODII_HOME} target="_blank" rel="noopener noreferrer">
        {t('한국관광공사 오디 · 출처', 'Korea Tourism Organization · Odii')}
      </a>
    </>
  )
}

export default function PlaceDetail() {
  const { t, lang } = useLanguage()
  const navigate = useNavigate()
  const { placeId } = useParams()
  const [params, setParams] = useSearchParams()
  const tab = Number(params.get('tab')) || 0
  const [sharing, setSharing] = useState(false)
  const [picking, setPicking] = useState(false)

  const { user, requireLogin } = useAuth()
  // user?.id 를 넣어서 로그인·로그아웃하면 찜 여부(is_bookmarked)를 다시 받는다.
  const detail = useLazy(() => getPlace(placeId), true, [placeId, lang, user?.id ?? 'guest'])
  const bookmark = useBookmark(detail.data)
  const operating = useLazy(() => getOperatingInfo(placeId), tab === 1, [placeId, lang])
  const script = useLazy(() => getScript(placeId), tab === 3, [placeId, lang])

  const tabs = [t('장소 소개', 'Overview'), t('운영 정보', 'Visiting'), t('혼잡도', 'Crowd level'), t('해설 대본', 'Transcript')]
  const place = detail.data
  const failed = t('정보를 불러오지 못했어요.', 'Could not load the information.')
  const loading = <p className="small">{t('불러오는 중…', 'Loading…')}</p>

  if (detail.error) {
    return (
      <>
        <Header />
        <main className="pad">
          <h1>{detail.error.status === 404 ? t('장소를 찾을 수 없어요.', 'Place not found.') : failed}</h1>
          <button className="outline" onClick={() => navigate('/places')}>
            {t('관광지 목록으로', 'Back to places')}
          </button>
        </main>
        <BottomNav />
      </>
    )
  }

  if (!place) {
    return (
      <>
        <Header />
        <main className="pad">{loading}</main>
        <BottomNav />
      </>
    )
  }

  const name = t(place.name, place.name_en)
  const otherName = lang === 'en' ? place.name : place.name_en
  const image = place.images[0]

  let panel
  if (tab === 0) panel = <Overview place={place} />
  else if (tab === 1) panel = operating.error ? <p>{failed}</p> : operating.data ? <OperatingInfo info={operating.data} /> : loading
  else if (tab === 2) panel = <Crowd />
  else panel = script.error ? <p>{failed}</p> : script.data ? <Script script={script.data} /> : loading

  return (
    <>
      <Header />
      <div className="bottomspace">
        <Photo src={image?.url} label={name} className="wide" />
        <GuideLine audioUrl={place.audio?.url} text={place.introduction.summary} />

        <div className="pad detail-summary">
          <div className="eyebrow">{place.area}</div>
          <div className="row detail-heading">
            <h1 style={{ margin: '6px 0' }}>{name}</h1>
            <div className="detail-actions">
              <button className="icon" aria-label={t('장소 공유', 'Share place')} onClick={() => setSharing(true)}>
                <ShareIcon />
              </button>
              <button
                className="icon"
                aria-label={bookmark.saved ? t('찜 해제', 'Remove from saves') : t('찜하기', 'Save place')}
                aria-pressed={bookmark.saved}
                disabled={bookmark.busy}
                onClick={bookmark.toggle}
                style={{ color: bookmark.saved ? '#9b604d' : 'inherit' }}
              >
                {bookmark.saved ? '♥' : <Icon name="heart" />}
              </button>
              <button
                className="icon bookmark"
                aria-label={t('내 일정에 추가', 'Add to itinerary')}
                title={t('내 일정에 추가', 'Add to itinerary')}
                onClick={() => requireLogin(`/places/${place.place_id}`) && setPicking(true)}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 3h12v18l-6-4-6 4z" />
                  <path d="M9 10h6m-3-3v6" />
                </svg>
              </button>
            </div>
          </div>
          <div className="small">
            {otherName} · {t('찜', 'Saves')} {bookmark.count}
          </div>
          <div className="plain-tags">
            {place.categories.map((category) => (
              <span key={category.category_id}>#{category.name}</span>
            ))}
          </div>
        </div>

        <div className="tabs" role="tablist">
          {tabs.map((label, index) => (
            <button
              key={label}
              role="tab"
              aria-selected={tab === index}
              className={tab === index ? 'active' : undefined}
              onClick={() => setParams(index ? { tab: String(index) } : {}, { replace: true })}
            >
              {label}
            </button>
          ))}
        </div>

        <section className="pad">
          <h2>{tabs[tab]}</h2>
          {panel}
          <button className="primary" onClick={() => navigate(`/places/${place.place_id}/related`)}>
            {t('관련 이야기 계속보기', 'Continue the story')}
          </button>
        </section>
      </div>
      <BottomNav />

      {picking && <ItineraryPicker placeId={place.place_id} onClose={() => setPicking(false)} />}
      {sharing && (
        <ShareDialog title={name} url={`${window.location.origin}/places/${place.place_id}`} onClose={() => setSharing(false)} />
      )}
    </>
  )
}
