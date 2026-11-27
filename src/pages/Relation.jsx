/**
 * S15 역사적 연관 설명. 주소: /places/3/related/5 (3 → 5 로 이어지는 이유)
 * 지금은 두 장소의 공통 카테고리와 각 장소 소개로 설명을 만든다.
 * TODO(백엔드): RAG 연관 설명 API 가 생기면 그 문장과 출처를 보여 준다.
 */
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getPlace } from '../api/places.js'
import Header from '../components/Header.jsx'
import Photo from '../components/Photo.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'

export default function Relation() {
  const { lang, t } = useLanguage()
  const navigate = useNavigate()
  const { placeId, targetId } = useParams()
  const [state, setState] = useState({ key: null, pair: null, error: null })
  const key = `${placeId}|${targetId}|${lang}`

  useEffect(() => {
    let cancelled = false
    Promise.all([getPlace(placeId), getPlace(targetId)])
      .then((pair) => !cancelled && setState({ key, pair, error: null }))
      .catch((error) => !cancelled && setState({ key, pair: null, error }))
    return () => {
      cancelled = true
    }
  }, [placeId, targetId, lang, key])

  const ready = state.key === key
  const [a, b] = ready && state.pair ? state.pair : []
  const name = (p) => t(p.name, p.name_en)
  const common = a && b ? a.categories.filter((c) => b.categories.some((d) => d.category_id === c.category_id)) : []

  return (
    <>
      <Header />
      <div className="pad">
        {!ready && <p className="small">{t('불러오는 중…', 'Loading…')}</p>}
        {ready && state.error && <p>{t('정보를 불러오지 못했어요.', 'Could not load the information.')}</p>}
        {a && b && (
          <>
            <div className="eyebrow">{t('두 장소의 역사적 연결', 'A historical connection')}</div>
            <h1>
              {name(a)}
              <br />→ {name(b)}
            </h1>
            <div className="tiles">
              <Photo src={a.images[0]?.url} label={name(a)} />
              <Photo src={b.images[0]?.url} label={name(b)} />
            </div>
            <h2 style={{ marginTop: 25 }}>{t('왜 이 장소를 추천할까요?', 'Why this place?')}</h2>
            <p className="quote">
              {t(
                `두 장소는 ${common.map((c) => c.name).join(' · ') || '서울 역사'}(으)로 이어져요.`,
                `Both places share ${common.map((c) => c.name).join(' · ') || 'Seoul history'}.`,
              )}
            </p>
            <p>
              <strong>{name(a)}</strong> — {a.introduction.summary}
            </p>
            <p>
              <strong>{name(b)}</strong> — {b.introduction.summary}
            </p>
            <div className="notice">
              {t(
                '현재 설명은 카테고리로 만든 예시이며 RAG/출처 검색 미연동입니다.',
                'This explanation is generated from categories, not a live RAG result.',
              )}
            </div>
            <button className="outline" onClick={() => navigate(`/places?focus=${b.place_id}`)}>
              {t('지도에서 보기', 'View on map')}
            </button>
            <button className="primary" onClick={() => navigate(`/places/${b.place_id}`)}>
              {t('자세히 보기', 'Details')}
            </button>
          </>
        )}
      </div>
    </>
  )
}
