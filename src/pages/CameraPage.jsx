/**
 * S09 사진 촬영 (화면 안 카메라). 주소: /capture/camera
 * 컴퓨터처럼 카메라 앱을 바로 못 여는 기기에서 쓴다. 셔터를 누르면 지금 화면을 사진으로 찍어 미리보기(S10-A)로.
 * 사진 접근 동의(S09-A)를 안 했으면 /capture 로 돌려보낸다.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { Navigate } from 'react-router-dom'
import Header from '../components/Header.jsx'
import Photo from '../components/Photo.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { photoAccessAgreed } from '../lib/capture.js'
import notify from '../lib/notify.js'
import usePhotoPicker from '../lib/usePhotoPicker.js'

export default function CameraPage() {
  const { t } = useLanguage()
  const { acceptPhoto, pickFromGallery } = usePhotoPicker()
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [status, setStatus] = useState('starting') // starting | live | unavailable | denied

  const stop = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
  }

  const start = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia || !window.isSecureContext) {
      setStatus('unavailable')
      return
    }
    setStatus('starting')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      })
      stop()
      streamRef.current = stream
      videoRef.current.srcObject = stream
      await videoRef.current.play().catch(() => {})
      setStatus('live')
    } catch {
      setStatus('denied')
    }
  }, [])

  // 들어오면 카메라를 켜고, 나가면 끈다.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    start()
    return stop
  }, [start])

  function shoot() {
    const video = videoRef.current
    if (status !== 'live' || !video?.videoWidth) {
      notify(t('카메라 준비 중입니다.', 'Camera is starting.'))
      return
    }
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)
    canvas.toBlob((blob) => blob && acceptPhoto(blob, 'camera'), 'image/jpeg', 0.85)
  }

  if (!photoAccessAgreed()) return <Navigate to="/capture" replace />

  const message = {
    starting: t('카메라를 켜는 중이에요…', 'Starting the camera…'),
    live: t('구조물이 화면 안에 들어오도록 촬영', 'Keep the landmark inside the frame'),
    unavailable: t('카메라는 HTTPS 또는 localhost 환경에서 사용할 수 있어요.', 'Camera requires HTTPS or localhost.'),
    denied: t(
      '카메라 접근이 허용되지 않았거나 사용할 수 없습니다. 갤러리를 이용하거나 브라우저 설정을 확인하세요.',
      'Camera unavailable or permission denied. Use the gallery or check browser settings.',
    ),
  }[status]

  return (
    <>
      <Header title="CAMERA" />
      <div className="camera">
        <video ref={videoRef} autoPlay playsInline muted hidden={status !== 'live'} />
        {status !== 'live' && <Photo label={t('카메라 미리보기', 'Camera preview')} />}
        <div className="frame"></div>
        <span className="camtext">{message}</span>
      </div>
      <div className="pad center">
        <div className="row">
          <button onClick={pickFromGallery}>{t('갤러리', 'Gallery')}</button>
          <button aria-label={t('사진 촬영', 'Take photo')} className="shutter" onClick={shoot}></button>
          <button onClick={start}>{t('카메라 연결', 'Connect camera')}</button>
        </div>
        <p className="small">
          {t(
            '갤러리는 기기의 사진 선택창을 엽니다. 선택한 파일만 읽습니다.',
            'Gallery opens the system picker. Only the selected file is read.',
          )}
        </p>
      </div>
    </>
  )
}
