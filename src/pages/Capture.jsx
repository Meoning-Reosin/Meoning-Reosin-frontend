/**
 * S09-A 사진·갤러리 접근 동의 → 동의하면 같은 화면에 '사진 촬영 / 갤러리 사진 선택' 버튼. 주소: /capture
 * - 사진 촬영: 휴대폰이면 카메라 앱을 바로 열고, 컴퓨터면 화면 안 카메라(S09, /capture/camera)로 간다.
 * - 갤러리: 기기의 사진 선택 창(S09-B)을 연다.
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav.jsx'
import Header from '../components/Header.jsx'
import Icon from '../components/icons.jsx'
import PolicyButton from '../components/PolicyButton.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { agreePhotoAccess, photoAccessAgreed } from '../lib/capture.js'
import notify from '../lib/notify.js'
import usePhotoPicker from '../lib/usePhotoPicker.js'

const isTouchPhone = () => matchMedia('(pointer: coarse)').matches

export default function Capture() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { pickFromGallery, pickWithCameraApp } = usePhotoPicker()
  const [ready, setReady] = useState(photoAccessAgreed)
  const [access, setAccess] = useState(false)
  const [training, setTraining] = useState(false)

  function agree() {
    if (!access) {
      notify(t('촬영·사진 선택 안내에 동의해 주세요.', 'Please accept the photo access notice.'))
      return
    }
    agreePhotoAccess(training)
    setReady(true)
  }

  function takePhoto() {
    if (isTouchPhone()) pickWithCameraApp()
    else navigate('/capture/camera')
  }

  return (
    <>
      <Header menu />
      <main className="pad bottomspace">
        <h1>{t('사진으로 장소 찾기', 'Find a place by photo')}</h1>
        <p>{t('현판과 건물 전체가 보이는 사진을 사용해 보세요.', 'Use a photo showing the sign and the whole building.')}</p>

        {ready ? (
          <>
            <div className="sw-pick">
              <button className="primary" onClick={takePhoto}>
                <Icon name="cam" />
                {t('사진 촬영', 'Take a photo')}
              </button>
              <button className="outline" onClick={pickFromGallery}>
                {t('갤러리 사진 선택', 'Choose from gallery')}
              </button>
            </div>
            <p className="small">
              {t(
                '사진은 장소를 찾는 데만 쓰고 저장하지 않아요.',
                'Your photo is only used to find the place and is not stored.',
              )}
            </p>
          </>
        ) : (
          <>
            <label className="sw-check">
              <input type="checkbox" checked={access} onChange={(event) => setAccess(event.target.checked)} />
              <span>
                {t(
                  '카메라 사용과 갤러리 사진 선택에 동의합니다. 권한이 필요하면 촬영 시 브라우저가 요청해요. (필수)',
                  'I agree to use the camera and choose photos. Your browser asks for permissions when needed. (Required)',
                )}
              </span>
            </label>
            <label className="sw-check">
              <input type="checkbox" checked={training} onChange={(event) => setTraining(event.target.checked)} />
              <span>
                {t(
                  '향후 사진이 장소 인식 모델 학습에 사용되는 것에 동의합니다. (선택)',
                  'I agree to future use of photos for landmark model training. (Optional)',
                )}
              </span>
            </label>
            <button className="primary" onClick={agree}>
              {t('동의하고 계속', 'Agree and continue')}
            </button>
          </>
        )}
        <PolicyButton policy="photos" className="inline-policy" />
      </main>
      <BottomNav />
    </>
  )
}
