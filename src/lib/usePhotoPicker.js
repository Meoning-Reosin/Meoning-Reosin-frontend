/**
 * 사진을 고르면 미리보기(S10-A)로 넘어가는 공통 동작. 촬영 안내·카메라·실패 화면에서 쓴다.
 *   const { pickFromGallery, pickWithCameraApp, acceptPhoto } = usePhotoPicker()
 */
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { MAX_IMAGE_MB, openPhotoPicker, setCapturedPhoto } from './capture.js'
import notify from './notify.js'

export default function usePhotoPicker() {
  const navigate = useNavigate()
  const { t } = useLanguage()

  function acceptPhoto(file, source) {
    setCapturedPhoto(file, source)
    navigate('/capture/review')
  }

  function onError(reason) {
    notify(
      reason === 'size'
        ? t(`이미지 용량은 ${MAX_IMAGE_MB}MB 이하여야 해요.`, `Image must be ${MAX_IMAGE_MB}MB or smaller.`)
        : t('이미지 파일을 선택해 주세요.', 'Choose an image file.'),
    )
  }

  return {
    acceptPhoto,
    pickFromGallery: () => openPhotoPicker({ onPick: (file) => acceptPhoto(file, 'gallery'), onError }),
    pickWithCameraApp: () => openPhotoPicker({ camera: true, onPick: (file) => acceptPhoto(file, 'camera'), onError }),
  }
}
