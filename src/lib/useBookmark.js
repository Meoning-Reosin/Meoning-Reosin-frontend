/**
 * 장소 찜(♥) 켜고 끄기. 장소 상세, 내 찜 목록에서 쓴다.
 *
 *   const { saved, count, toggle, busy } = useBookmark(place)
 *   place: 백엔드 장소 상세·카드 (place_id, is_bookmarked, bookmark_count)
 *
 * - 로그인 안 했으면 '로그인해 주세요' 창(S17-P)을 띄운다. 로그인 후 이 장소로 돌아온다.
 * - 누르는 즉시 화면을 먼저 바꾸고(빠르게 보이게), 백엔드가 실패하면 되돌린다.
 *   찜: POST /bookmarks (바뀐 찜 수가 옴) / 해제: DELETE /bookmarks/{id} (204)
 */
import { useState } from 'react'
import { addBookmark, removeBookmark } from '../api/bookmarks.js'
import { useAuth } from '../auth/AuthContext.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import notify from './notify.js'

export default function useBookmark(place, { onChange } = {}) {
  const { t } = useLanguage()
  const { requireLogin } = useAuth()
  // 상세를 새로 받으면(다른 장소, 로그인 후 다시 받기) 그 값으로 다시 시작한다.
  const key = `${place?.place_id}|${place?.is_bookmarked}|${place?.bookmark_count}`
  const [state, setState] = useState({ key: null, saved: false, count: 0 })
  const [busy, setBusy] = useState(false)
  const current =
    state.key === key ? state : { key, saved: Boolean(place?.is_bookmarked), count: place?.bookmark_count ?? 0 }

  async function toggle() {
    if (!place || busy) return
    if (!requireLogin(`/places/${place.place_id}`)) return

    const before = current
    const next = { key, saved: !before.saved, count: Math.max(0, before.count + (before.saved ? -1 : 1)) }
    setState(next)
    setBusy(true)
    try {
      if (next.saved) {
        const result = await addBookmark(place.place_id)
        setState({ key, saved: true, count: result.bookmark_count })
      } else {
        await removeBookmark(place.place_id)
      }
      notify(next.saved ? t('찜했어요.', 'Saved.') : t('찜을 해제했어요.', 'Removed.'))
      onChange?.(next.saved)
    } catch (error) {
      setState(before)
      notify(error.message || t('찜을 바꾸지 못했어요.', 'Could not update your saves.'))
    } finally {
      setBusy(false)
    }
  }

  return { saved: current.saved, count: current.count, toggle, busy }
}
