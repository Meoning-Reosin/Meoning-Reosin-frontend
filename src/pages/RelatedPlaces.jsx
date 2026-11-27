/**
 * S14 관련 역사 장소 추천. 주소: /places/3/related
 *   기준 장소 카드 → 카테고리 칩(겹치는 카테고리로 거르기) → 관련 장소 카드들
 * 카드의 '역사적 연관성'을 누르면 S15(/places/3/related/5)로 간다.
 */
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getPlace } from '../api/places.js'
import BottomNav from '../components/BottomNav.jsx'
import Header from '../components/Header.jsx'
import Photo from '../components/Photo.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { findRelatedPlaces } from '../lib/related.js'

export default function RelatedPlaces() {
  const { lang, t } = useLanguage()
  const navigate = useNavigate()
  const { placeId } = useParams()
  const [state, setState] = useState({ key: null, origin: null, related: [], error: null })
  const [filter, setFilter] = useState('all') // 'all' 또는 category_id
  const key = `${placeId}|${lang}`

  useEffect(() => {
    let cancelled = false
    getPlace(placeId)
      .then(async (origin) => {
        const related = await findRelatedPlaces(origin)
        if (!cancelled) setState({ key, origin, related, error: null })
      })
      .catch((error) => !cancelled && setState({ key, origin: null, related: [], error }))
    return () => {
      cancelled = true
    }
  }, [placeId, lang, key])

  const ready = state.key === key
  const { origin, related, error } = ready ? state : { origin: null, related: [], error: null }
  const shown = filter === 'all' ? related : related.filter((entry) => entry.shared.some((c) => c.category_id === filter))

  return (
    <>
      <Header />
      <div className="pad bottomspace">
        <div className="eyebrow">ONE STORY TO THE NEXT</div>
        {error && <p>{t('정보를 불러오지 못했어요.', 'Could not load the information.')}</p>}
        {!ready && <p className="small">{t('불러오는 중…', 'Loading…')}</p>}

        {origin && (
          <>
            <h1>
              {t(`${origin.name}에서`, 'Stories beyond')}
              <br />
              {t('이어지는 이야기', origin.name_en)}
            </h1>
            <p>{t('같은 시대, 같은 지역, 같은 역사로 이어지는 장소를 만나보세요.', 'Explore places connected by history.')}</p>

            <div className="origin-card">
              <Photo src={origin.images[0]?.url} label={t(origin.name, origin.name_en)} />
              <div>
                <span className="eyebrow">{t('기준 장소', 'Reference place')}</span>
                <h3>{t(origin.name, origin.name_en)}</h3>
                <div className="plain-tags">
                  {origin.categories.map((c) => (
                    <span key={c.category_id}>#{c.name}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="chips relation-filters">
              <button className={`chip ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
                {t('전체', 'All')}
              </button>
              {origin.categories.map((c) => (
                <button
                  key={c.category_id}
                  className={`chip ${filter === c.category_id ? 'active' : ''}`}
                  onClick={() => setFilter(c.category_id)}
                >
                  {c.name}
                </button>
              ))}
            </div>
            <div className="covernote">
              {t(
                '카테고리 기반 예시 추천 · 이동·운영·혼잡·연관도 실시간 미연동',
                'Sample category-based recommendation; no live transport, hours, crowds or scores.',
              )}
            </div>

            {shown.map(({ place, shared }) => (
              <article key={place.place_id} className="rec">
                <Photo src={place.thumbnail_url} label={t(place.name, place.name_en)} className="wide" />
                <div className="pad">
                  <div className="eyebrow">{place.area}</div>
                  <h2>{t(place.name, place.name_en)}</h2>
                  <div className="plain-tags">
                    {shared.map((c) => (
                      <span key={c.category_id}>#{c.name}</span>
                    ))}
                  </div>
                  <button
                    style={{ padding: '14px 0', textAlign: 'left', width: '100%' }}
                    onClick={() => navigate(`/places/${origin.place_id}/related/${place.place_id}`)}
                  >
                    <div className="relation-caption">{t('기준 장소와의 역사적 연관성', 'Historical connection')}</div>
                    <div className="quote">
                      {t(
                        `${shared.map((c) => c.name).join(' · ')}(으)로 이어져요.`,
                        `Connected by ${shared.map((c) => c.name).join(' · ')}.`,
                      )}
                      　›
                    </div>
                  </button>
                  <div className="row">
                    <button className="outline inline" onClick={() => navigate(`/places/${place.place_id}`)}>
                      {t('자세히 보기', 'Details')}
                    </button>
                  </div>
                </div>
              </article>
            ))}
            {!shown.length && <p>{t('조건에 맞는 장소가 없습니다. 다른 카테고리를 골라 주세요.', 'No matches. Try another category.')}</p>}
          </>
        )}
      </div>
      <BottomNav />
    </>
  )
}
