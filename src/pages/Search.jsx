/**
 * S08 장소 검색. 주소: /search?q=검색어&group=history
 * 검색어와 묶음(전체·역사·사진 명소·문화)으로 백엔드 GET /places 를 부른다.
 * 검색어는 주소에 남겨서, 상세에 갔다가 뒤로 와도 그대로 보인다.
 */
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { listPlaces } from '../api/places.js'
import BottomNav from '../components/BottomNav.jsx'
import Header from '../components/Header.jsx'
import Photo from '../components/Photo.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'

const GROUPS = [
  ['all', '전체', 'All'],
  ['history', '역사', 'History'],
  ['sns', '사진 명소', 'Photo spots'],
  ['content', '문화·전시', 'Culture'],
]

export default function Search() {
  const { lang, t } = useLanguage()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const group = params.get('group') || 'all'
  const [input, setInput] = useState(params.get('q') || '')
  // key: 어떤 조건(검색어·묶음·언어)으로 받은 결과인지. 지금 조건과 다르면 아직 불러오는 중이다.
  const [state, setState] = useState({ key: null, items: [], error: null })

  // 글자를 칠 때마다 부르지 않고, 멈춘 뒤 0.25초 후에 주소(q)를 바꾼다.
  useEffect(() => {
    const timer = setTimeout(() => {
      const next = new URLSearchParams(params)
      if (input.trim()) next.set('q', input.trim())
      else next.delete('q')
      if (next.toString() !== params.toString()) setParams(next, { replace: true })
    }, 250)
    return () => clearTimeout(timer)
  }, [input, params, setParams])

  const q = params.get('q') || ''
  const key = `${q}|${group}|${lang}`
  const loading = state.key !== key
  useEffect(() => {
    let cancelled = false
    listPlaces({ q: q || undefined, group: group === 'all' ? undefined : group, sort: 'name', size: 50 })
      .then((data) => !cancelled && setState({ key, items: data.items ?? [], error: null }))
      .catch((error) => !cancelled && setState({ key, items: [], error }))
    return () => {
      cancelled = true
    }
  }, [q, group, lang, key])

  function chooseGroup(next) {
    setInput('')
    setParams(next === 'all' ? {} : { group: next }, { replace: true })
  }

  return (
    <>
      <Header title="EXPLORE" />
      <div className="pad bottomspace">
        <div className="eyebrow">FIND A PLACE</div>
        <h1>{t('장소 찾기', 'Find a place')}</h1>
        <input
          type="search"
          className="search"
          placeholder={t('장소 이름 검색', 'Search by name')}
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        <div className="chips">
          {GROUPS.map(([key, ko, en]) => (
            <button key={key} className={`chip ${group === key ? 'active' : ''}`} onClick={() => chooseGroup(key)}>
              {t(ko, en)}
            </button>
          ))}
        </div>
        <div className="row">
          <div className="eyebrow">{t('장소 목록', 'PLACES')}</div>
          <button onClick={() => navigate('/places')}>{t('지도', 'Map')} ›</button>
        </div>

        <div id="results">
          {state.error && <p>{t('목록을 불러오지 못했어요.', 'Could not load the list.')}</p>}
          {!state.error && !loading && !state.items.length && (
            <p>{t('검색 결과가 없습니다. 다른 장소 이름으로 검색해 주세요.', 'No matching places. Try another search.')}</p>
          )}
          {state.items.map((place) => (
            <div key={place.place_id} className="item">
              <Photo src={place.thumbnail_url} label={t(place.name, place.name_en)} />
              <button className="text" onClick={() => navigate(`/places/${place.place_id}`)}>
                <div className="eyebrow">{place.area}</div>
                <h3>{t(place.name, place.name_en)}</h3>
                <div className="small">{place.address}</div>
              </button>
              <span>›</span>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </>
  )
}
