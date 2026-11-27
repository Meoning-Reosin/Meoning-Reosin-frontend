/**
 * 옆으로 넘기는 카드 줄 (프로토타입 cardRail).
 * - 좌우 화살표로 카드 한 장씩 이동, 끝에 닿으면 화살표가 꺼진다.
 * - 마우스로 끌어서 넘길 수 있다 (끈 직후의 클릭은 무시).
 * - 맨 끝에 '+ 더 보기' 카드가 붙는다.
 */
import { Children, useEffect, useRef, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'

const smooth = () => (matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth')

export default function CardRail({ children, onMore, places = false }) {
  const { t } = useLanguage()
  const ref = useRef(null)
  const [edges, setEdges] = useState({ start: true, end: false })

  function updateEdges() {
    const strip = ref.current
    setEdges({
      start: strip.scrollLeft < 2,
      end: strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - 2,
    })
  }

  function scrollByCard(direction) {
    const strip = ref.current
    const gap = parseFloat(getComputedStyle(strip).columnGap) || 0
    const width = strip.firstElementChild?.offsetWidth || strip.clientWidth
    strip.scrollBy({ left: direction * (width + gap), behavior: smooth() })
  }

  // 마우스 끌기
  useEffect(() => {
    const strip = ref.current
    updateEdges()
    let drag = null
    let blockClick = false

    const onDown = (event) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return
      drag = { id: event.pointerId, x: event.clientX, scroll: strip.scrollLeft, moved: false }
      blockClick = false
    }
    const onMove = (event) => {
      if (!drag || drag.id !== event.pointerId || !event.buttons) return
      const delta = event.clientX - drag.x
      if (!drag.moved && Math.abs(delta) < 5) return
      if (!drag.moved) {
        drag.moved = true
        strip.setPointerCapture(event.pointerId)
        strip.classList.add('dragging')
      }
      strip.scrollLeft = drag.scroll - delta
    }
    const release = () => {
      blockClick = Boolean(drag?.moved)
      drag = null
      strip.classList.remove('dragging')
    }
    const onClick = (event) => {
      if (!blockClick) return
      event.preventDefault()
      event.stopImmediatePropagation()
      blockClick = false
    }
    const noDrag = (event) => event.preventDefault()

    strip.addEventListener('pointerdown', onDown)
    strip.addEventListener('pointermove', onMove)
    strip.addEventListener('pointerup', release)
    strip.addEventListener('pointercancel', release)
    strip.addEventListener('click', onClick, true)
    strip.addEventListener('dragstart', noDrag)
    return () => {
      strip.removeEventListener('pointerdown', onDown)
      strip.removeEventListener('pointermove', onMove)
      strip.removeEventListener('pointerup', release)
      strip.removeEventListener('pointercancel', release)
      strip.removeEventListener('click', onClick, true)
      strip.removeEventListener('dragstart', noDrag)
    }
  }, [])

  // 카드가 늦게 들어오면(백엔드 응답) 맨 앞으로 되돌리고 화살표 상태를 다시 계산한다.
  // (스크롤 스냅이 먼저 있던 '더 보기' 카드에 붙어 있으려고 줄을 끝으로 밀어 버리기 때문)
  const count = Children.count(children)
  useEffect(() => {
    ref.current.scrollLeft = 0
    updateEdges()
  }, [count])

  const more = t('더 보기', 'Show more')

  return (
    <div className="sw-card-rail">
      <div ref={ref} className={`sw-strip grab-strip ${places ? 'places' : ''}`} onScroll={updateEdges}>
        {children}
        <article className="sw-card sw-more-card">
          <button onClick={onMore} type="button" aria-label={more} title={more}>
            <span aria-hidden="true">+</span>
          </button>
        </article>
      </div>
      <button
        type="button"
        className="sw-side-arrow prev"
        aria-label={t('이전', 'Previous')}
        disabled={edges.start}
        onClick={() => scrollByCard(-1)}
      >
        ‹
      </button>
      <button
        type="button"
        className="sw-side-arrow next"
        aria-label={t('다음', 'Next')}
        disabled={edges.end}
        onClick={() => scrollByCard(1)}
      >
        ›
      </button>
    </div>
  )
}
