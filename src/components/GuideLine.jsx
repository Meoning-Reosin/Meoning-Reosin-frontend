/**
 * 장소 해설 재생 줄 (프로토타입 guideLine): ▶ 버튼 · 재생 위치 · 배속
 *
 * - audioUrl 이 있으면(오디 음원) 그 음원을 튼다.
 * - 없으면 기기 음성(브라우저 speechSynthesis)으로 text 를 읽어 준다.
 *   기기 음성은 위치 이동이 어려워서, 위치 막대는 진행 정도만 보여 준다.
 */
import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import notify from '../lib/notify.js'

const RATES = [0.8, 1, 1.2, 1.5]

export default function GuideLine({ audioUrl, text }) {
  const { lang, t } = useLanguage()
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0) // 0~100
  const [rate, setRate] = useState(1)

  // 화면을 떠나거나 장소·언어가 바뀌면 멈춘다.
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) speechSynthesis.cancel()
    }
  }, [audioUrl, text, lang])

  function toggle() {
    if (audioUrl) {
      const audio = audioRef.current
      if (audio.paused) {
        audio.playbackRate = rate
        audio.play().catch(() =>
          notify(
            t(
              '오디 음원을 재생하지 못했어요. 해설 대본 탭에서 공식 페이지를 열 수 있어요.',
              'Could not play Odii audio. Open the official page from the transcript tab.',
            ),
          ),
        )
      } else audio.pause()
      return
    }
    speak()
  }

  function speak() {
    if (!('speechSynthesis' in window)) {
      notify(t('이 브라우저는 음성 합성을 지원하지 않아요.', 'Speech synthesis unavailable.'))
      return
    }
    if (playing) {
      speechSynthesis.cancel()
      setPlaying(false)
      return
    }
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang === 'en' ? 'en-US' : 'ko-KR'
    utterance.rate = rate
    utterance.onboundary = (event) => setProgress((100 * event.charIndex) / Math.max(1, text.length))
    utterance.onend = () => {
      setPlaying(false)
      setProgress(100)
    }
    utterance.onerror = () => setPlaying(false)
    speechSynthesis.cancel()
    speechSynthesis.speak(utterance)
    setProgress(0)
    setPlaying(true)
  }

  function syncAudio() {
    const audio = audioRef.current
    setPlaying(!audio.paused && !audio.ended)
    if (Number.isFinite(audio.duration) && audio.duration) setProgress((100 * audio.currentTime) / audio.duration)
  }

  function seek(value) {
    const audio = audioRef.current
    if (audio && Number.isFinite(audio.duration)) audio.currentTime = (Number(value) / 100) * audio.duration
    setProgress(Number(value))
  }

  function changeRate(value) {
    const next = Number(value)
    setRate(next)
    if (audioRef.current) audioRef.current.playbackRate = next
  }

  return (
    <div
      className="guide-line"
      aria-label={audioUrl ? t('오디 공식 음성', 'Official Odii narration') : t('기기 음성으로 장소 소개 듣기', 'Listen to the overview with device narration')}
    >
      {audioUrl && (
        <audio
          ref={audioRef}
          preload="metadata"
          src={audioUrl}
          onPlay={syncAudio}
          onPause={syncAudio}
          onTimeUpdate={syncAudio}
          onLoadedMetadata={syncAudio}
          onEnded={syncAudio}
        />
      )}
      <button type="button" aria-label={playing ? t('일시정지', 'Pause') : t('재생', 'Play')} onClick={toggle}>
        {playing ? 'Ⅱ' : '▶'}
      </button>
      <input
        type="range"
        min="0"
        max="100"
        step="1"
        value={Math.round(progress)}
        disabled={!audioUrl}
        style={{ '--guide-progress': `${progress}%` }}
        aria-label={t('재생 위치', 'Playback position')}
        onChange={(event) => seek(event.target.value)}
      />
      <select aria-label={t('재생 배속', 'Playback speed')} value={rate} onChange={(event) => changeRate(event.target.value)}>
        {RATES.map((value) => (
          <option key={value} value={value}>
            {value}x
          </option>
        ))}
      </select>
    </div>
  )
}
