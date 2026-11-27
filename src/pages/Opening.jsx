/**
 * S01 오프닝: 4초짜리 인트로 영상. 끝나거나 '건너뛰기'를 누르면 언어 선택(S02)으로.
 *
 * 프로토타입 규칙
 * - 소리를 켜고 재생을 시도하고, 브라우저가 막으면 음소거로 다시 시도한다.
 * - 영상이 4.5초 안에 안 끝나면(로딩 실패 등) 그냥 넘어간다.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/icons.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { markIntroPlayed } from '../lib/entryFlow.js'

const INTRO_VIDEO = '/assets/intro.mp4'
const DEADLINE_MS = 4500

export default function Opening() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const doneRef = useRef(false)
  const [muted, setMuted] = useState(false)
  const [progress, setProgress] = useState(0)

  const finish = useCallback(() => {
    if (doneRef.current) return
    doneRef.current = true
    markIntroPlayed()
    videoRef.current?.pause()
    navigate('/language', { replace: true })
  }, [navigate])

  useEffect(() => {
    const video = videoRef.current
    const deadline = setTimeout(finish, DEADLINE_MS)

    video.muted = false
    video.play().catch((error) => {
      if (error.name !== 'NotAllowedError') return finish()
      // 소리 있는 자동 재생이 막히면 음소거로 다시 시도
      video.muted = true
      setMuted(true)
      video.play().catch(finish)
    })

    return () => clearTimeout(deadline)
  }, [finish])

  function onTimeUpdate() {
    const video = videoRef.current
    if (Number.isFinite(video.duration) && video.duration) setProgress((100 * video.currentTime) / video.duration)
  }

  function toggleSound() {
    const video = videoRef.current
    video.muted = !video.muted
    setMuted(video.muted)
  }

  return (
    <div className="cinema-intro">
      <video
        ref={videoRef}
        id="openingFilm"
        playsInline
        preload="auto"
        aria-label="ㅇㅋㅋ-Walk Creator Crew 오프닝 영상"
        src={INTRO_VIDEO}
        onPlaying={markIntroPlayed}
        onTimeUpdate={onTimeUpdate}
        onEnded={() => {
          setProgress(100)
          setTimeout(finish, 500)
        }}
        onError={finish}
      />
      <div className="film-controls sw-film-top">
        <button
          className="film-sound"
          onClick={toggleSound}
          aria-label={muted ? t('소리 켜기', 'Unmute') : t('소리 끄기', 'Mute')}
          aria-pressed={muted}
        >
          <Icon name={muted ? 'soundOff' : 'soundOn'} />
        </button>
      </div>
      <button className="sw-film-skip" onClick={finish}>
        {t('건너뛰기', 'Skip')}
      </button>
      <div className="cinema-progress" style={{ width: `${progress}%` }}></div>
    </div>
  )
}
