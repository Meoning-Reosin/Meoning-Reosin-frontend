/**
 * S03~S05 온보딩: 홈 화면 위에 어둡게 덮고, 기능 하나씩 동그랗게 비추며 설명한다.
 *   1단계 촬영 버튼 → 2단계 검색창 → 3단계 내 일정
 * 프로토타입 mountCoach/layoutCoach 를 옮겼다. 그동안 뒤의 화면(#screen)은 누를 수 없게 막는다.
 */
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { BRAND_LOGO } from './Header.jsx'

const STEPS = [
  {
    target: 'tab-cam', // S03 하단 메뉴 '촬영'
    ko: '사진으로 장소 찾기',
    en: 'Find a place by photo',
    copy: [
      '가운데 촬영 버튼을 눌러보세요. 장소를 찍거나 앨범에서 사진을 골라 해설을 찾아요.',
      'Use Capture in the middle to take or pick a photo and find its audio guide.',
    ],
  },
  {
    target: 'swSearch', // S04 홈 검색창
    ko: '장소를 찾아 해설 듣기',
    en: 'Find a place and listen',
    copy: [
      '검색창에 장소 이름을 입력하세요. 장소 상세에서 해설을 듣고 관련 이야기를 이어 볼 수 있어요.',
      'Search by name. Open a place to listen to its guide and find related stories.',
    ],
  },
  {
    target: 'tab-plan', // S05 하단 메뉴 '내 일정'
    ko: '함께 걷는 일정 만들기',
    en: 'Plan a walk together',
    copy: [
      '내 일정에서 동행자와 짠 코스, 대화, 함께 찜한 장소를 확인하세요.',
      'Open My walks to find shared routes, conversations, and favorites.',
    ],
  },
]

export default function OnboardingCoach({ onFinish }) {
  const { t } = useLanguage()
  const [step, setStep] = useState(0)
  const [skip, setSkip] = useState(false)
  const spotRef = useRef(null)
  const dialogRef = useRef(null)
  const current = STEPS[step]
  const last = step === STEPS.length - 1

  // 뒤 화면 막기
  useEffect(() => {
    const screen = document.getElementById('screen')
    window.scrollTo(0, 0)
    screen.inert = true
    return () => {
      screen.inert = false
    }
  }, [])

  // 비출 대상의 위치에 맞춰 동그라미와 설명 창 놓기
  useLayoutEffect(() => {
    function layout() {
      const target = document.getElementById(current.target)
      const spot = spotRef.current
      const dialog = dialogRef.current
      if (!target || !spot || !dialog) return
      const camera = target.querySelector('.cam-tab')
      const rect = (camera || target).getBoundingClientRect()
      const xBleed = camera ? 7 : 4
      const yBleed = camera ? 7 : 8
      const left = Math.max(1, rect.left - xBleed)
      const top = Math.max(1, rect.top - yBleed)
      const right = Math.min(innerWidth - 1, rect.right + xBleed)
      const bottom = Math.min(innerHeight - 1, rect.bottom + yBleed)
      spot.classList.toggle('is-camera', Boolean(camera))
      Object.assign(spot.style, {
        left: left + 'px',
        top: top + 'px',
        width: right - left + 'px',
        height: bottom - top + 'px',
      })
      const below = bottom + 10
      dialog.style.top =
        (below + dialog.offsetHeight + 10 < innerHeight ? below : Math.max(12, top - dialog.offsetHeight - 10)) + 'px'
    }
    layout()
    dialogRef.current?.querySelector('.primary')?.focus({ preventScroll: true })
    window.addEventListener('resize', layout)
    return () => window.removeEventListener('resize', layout)
  }, [current.target])

  const finish = () => onFinish(skip)

  return createPortal(
    <div className="coach-layer">
      <div ref={spotRef} className="coach-spot" aria-hidden="true"></div>
      <div ref={dialogRef} className="coach-dialog" role="dialog" aria-modal="true" aria-labelledby="coachTitle">
        <div className="coach-mark">
          <img src={BRAND_LOGO} alt="ㅇㅋㅋ-Walk Creator Crew" />
          <div className="coach-progress" role="img" aria-label={`${t('온보딩', 'Tutorial')} ${step + 1} / ${STEPS.length}`}>
            {STEPS.map((item, index) => (
              <span
                key={item.target}
                className={`coach-step ${index === step ? 'active' : index < step ? 'complete' : ''}`}
              ></span>
            ))}
          </div>
        </div>
        <h2 id="coachTitle">{t(current.ko, current.en)}</h2>
        <p>{t(...current.copy)}</p>
        <button className="primary" onClick={() => (last ? finish() : setStep(step + 1))}>
          {last
            ? t('ㅇㅋㅋ-Walk Creator Crew 시작하기', 'Start ㅇㅋㅋ-Walk Creator Crew')
            : t('다음 기능 살펴보기', 'Continue tutorial')}
        </button>
        <div className="coach-actions">
          <label>
            <input type="checkbox" checked={skip} onChange={(event) => setSkip(event.target.checked)} />{' '}
            {t('다시 보지 않기', 'Do not show again')}
          </label>
          <button onClick={finish}>{t('건너뛰기', 'Skip')}</button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
