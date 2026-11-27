/**
 * S10-A 선택한 사진 미리보기 → S10 인식 진행 → 결과. 주소: /capture/review
 *   '이 사진으로 장소 찾기'를 누르면 백엔드 POST /recognitions 로 사진(+ 있으면 현재 위치)을 보낸다.
 *   - matched: 그 장소 상세(/places/{id})로
 *   - not_matched: 인식 실패(S11, /capture/failed)로
 *   - 오류(용량 초과, 형식 등): 안내를 띄우고 이 화면에 남는다
 * 고른 사진이 없으면(새로고침 등) /capture 로 돌려보낸다.
 */
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { recognize } from '../api/recognitions.js'
import BottomNav from '../components/BottomNav.jsx'
import Header from '../components/Header.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { getCapturedPhoto } from '../lib/capture.js'
import notify from '../lib/notify.js'
import useCurrentPosition from '../lib/useCurrentPosition.js'

export default function PhotoReview() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { coords } = useCurrentPosition()
  const [scanning, setScanning] = useState(false)
  const photo = getCapturedPhoto()

  if (!photo) return <Navigate to="/capture" replace />

  async function findPlace() {
    setScanning(true)
    try {
      const result = await recognize(photo.file, coords ?? {})
      if (result.status === 'matched' && result.place_id) navigate(`/places/${result.place_id}`, { replace: true })
      else navigate('/capture/failed', { replace: true })
    } catch (error) {
      setScanning(false)
      notify(error.message || t('사진을 보내지 못했어요. 다시 시도해 주세요.', 'Could not send the photo. Try again.'))
    }
  }

  const image = (
    <div className="photo wide loaded">
      <img src={photo.url} alt={t('선택한 사진', 'Selected photo')} />
    </div>
  )

  // S10 인식 진행
  if (scanning) {
    return (
      <>
        <Header title="DISCOVERING" />
        <div className="pad center">
          {image}
          <h1>{t('이야기를 찾는 중…', 'Finding a story…')}</h1>
          <p>{t('사진 속 장소를 찾고 있어요.', 'Looking for the place in your photo.')}</p>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="pad bottomspace">
        <h1>{t('사진 미리보기', 'Review photo')}</h1>
        {image}
        <p>{t('이 사진으로 장소를 찾아볼까요?', 'Find the place in this photo?')}</p>
        <button className="primary" onClick={findPlace}>
          {t('이 사진으로 장소 찾기', 'Find this place')}
        </button>
        <button className="outline" onClick={() => navigate('/capture')}>
          {t('다시 선택', 'Choose another photo')}
        </button>
        <button className="outline" onClick={() => navigate('/search')}>
          {t('장소 직접 찾기', 'Find a place by name')}
        </button>
      </main>
      <BottomNav />
    </>
  )
}
