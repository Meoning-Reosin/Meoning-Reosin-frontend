/**
 * '어느 일정에 담을까요?' 창. 장소 상세(장소 1곳)와 코스 상세(코스 통째로)에서 쓴다.
 *
 *   <ItineraryPicker placeId={3} onClose={...} />          장소 담기 (API 28)
 *   <ItineraryPicker course={{course_id, title}} onClose={...} />  코스 담기 (API 31)
 *
 * - 내 일정 목록을 보여 준다. 장소면 이미 담긴 일정에 ✓ 표시 (GET /itineraries?place_id=).
 * - '새 일정 만들기': 이름을 받아 새 일정을 만들고(API 24) 바로 담는다.
 *   코스는 이름 없이 '코스 이름으로 새 일정'도 고를 수 있다 (itinerary_id 를 안 보내면 백엔드가 만든다).
 * 다 담으면 그 일정 화면으로 갈지 알림과 함께 onClose.
 */
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { addCourseToItinerary, addPlaceToItinerary, createItinerary, listItineraries } from '../api/itineraries.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import notify from '../lib/notify.js'

export default function ItineraryPicker({ placeId, course, onClose }) {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const ref = useRef(null)
  const [state, setState] = useState({ loaded: false, items: [], error: null })
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!ref.current.open) ref.current.showModal()
    let cancelled = false
    listItineraries({ placeId, size: 100 })
      .then((data) => !cancelled && setState({ loaded: true, items: data.items ?? [], error: null }))
      .catch((error) => !cancelled && setState({ loaded: true, items: [], error }))
    return () => {
      cancelled = true
    }
  }, [placeId])

  async function addTo(itineraryId) {
    setBusy(true)
    try {
      let targetId = itineraryId
      if (course) {
        const result = await addCourseToItinerary({ courseId: course.course_id, itineraryId })
        targetId = result.itinerary_id
        notify(
          result.skipped_count
            ? t(`${result.added_count}곳을 담았어요. ${result.skipped_count}곳은 이미 있었어요.`, `Added ${result.added_count}. ${result.skipped_count} were already there.`)
            : t(`코스의 ${result.added_count}곳을 담았어요.`, `Added ${result.added_count} places from the walk.`),
        )
      } else {
        await addPlaceToItinerary({ itineraryId, placeId })
        notify(t('일정에 담았어요.', 'Added to your walk.'))
      }
      onClose()
      navigate(`/itineraries/${targetId}`)
    } catch (error) {
      setBusy(false)
      notify(error.status === 409 ? t('이미 이 일정에 있는 장소예요.', 'This place is already in that walk.') : error.message)
    }
  }

  async function createAndAdd() {
    const title = window.prompt(t('새 일정 이름', 'New walk name'), t('서울 산책', 'Seoul walk'))?.trim()
    if (!title) return
    setBusy(true)
    try {
      const created = await createItinerary({ title: title.slice(0, 50) })
      await addTo(created.itinerary_id)
    } catch (error) {
      setBusy(false)
      notify(error.message)
    }
  }

  return createPortal(
    <dialog ref={ref} className="walk-dialog" aria-labelledby="walkPickerTitle" onClose={onClose}>
      <div className="sw-title">
        <h2 id="walkPickerTitle">{t('어느 일정에 담을까요?', 'Save to which walk?')}</h2>
        <button onClick={onClose} aria-label={t('닫기', 'Close')}>
          {t('닫기', 'Close')}
        </button>
      </div>

      {!state.loaded && <p className="small">{t('불러오는 중…', 'Loading…')}</p>}
      {state.error && <p>{t('일정을 불러오지 못했어요.', 'Could not load your walks.')}</p>}
      {state.loaded && !state.error && !state.items.length && (
        <p className="small">{t('아직 일정이 없어요. 새로 만들어 담아 보세요.', 'No walks yet. Create one below.')}</p>
      )}

      {state.items.map((walk) => (
        <button
          key={walk.itinerary_id}
          className="listbutton"
          disabled={busy || walk.contains_place === true}
          aria-pressed={walk.contains_place === true}
          onClick={() => addTo(walk.itinerary_id)}
        >
          <span>{walk.title}</span>
          <span className="small">
            {walk.contains_place ? t('담김 ✓', 'Added ✓') : `${walk.item_count}${t('곳', ' stops')}`}
          </span>
        </button>
      ))}

      {course && (
        <button className="primary" disabled={busy} onClick={() => addTo(undefined)}>
          {t('코스 이름으로 새 일정 만들기', 'New walk named after this course')}
        </button>
      )}
      <button className="outline" disabled={busy} onClick={createAndAdd}>
        {t('새 일정 만들기', 'Create a walk')}
      </button>
    </dialog>,
    document.body,
  )
}
