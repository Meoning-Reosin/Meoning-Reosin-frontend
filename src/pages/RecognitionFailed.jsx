/**
 * S11 인식 실패. 주소: /capture/failed
 * 다른 방법을 안내한다: 주변 장소, 다시 촬영, 앨범, 이름 검색, 홈.
 */
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header.jsx'
import Photo from '../components/Photo.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { getCapturedPhoto } from '../lib/capture.js'
import usePhotoPicker from '../lib/usePhotoPicker.js'

export default function RecognitionFailed() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { pickFromGallery } = usePhotoPicker()
  const photo = getCapturedPhoto()

  return (
    <>
      <Header title="PHOTO DISCOVERY" />
      <div className="pad">
        {photo ? (
          <div className="photo wide loaded">
            <img src={photo.url} alt={t('선택한 사진', 'Selected photo')} />
          </div>
        ) : (
          <Photo className="wide" />
        )}
        <div className="eyebrow" style={{ marginTop: 24 }}>
          TRY ANOTHER WAY
        </div>
        <h1>{t('장소를 인식하지 못했어요.', 'We couldn’t identify the place.')}</h1>
        <p>
          {t(
            '다시 촬영하거나 주변 역사 명소를 찾아보세요. 현판과 건물 전체가 보이게 찍으면 더 잘 찾아요.',
            'Try again or explore nearby places. Photos showing the sign and the whole building work best.',
          )}
        </p>
        <button className="primary" onClick={() => navigate('/places')}>
          {t('내 주변 장소 찾기', 'Explore nearby places')}
        </button>
        <button className="outline" onClick={() => navigate('/capture')}>
          {t('다시 촬영하기', 'Take another photo')}
        </button>
        <button className="outline" onClick={pickFromGallery}>
          {t('앨범에서 선택', 'Choose from gallery')}
        </button>
        <button className="outline" onClick={() => navigate('/search')}>
          {t('장소 직접 검색', 'Search by name')}
        </button>
        <button className="linkbtn" onClick={() => navigate('/')}>
          {t('홈으로 돌아가기', 'Return home')}
        </button>
      </div>
    </>
  )
}
