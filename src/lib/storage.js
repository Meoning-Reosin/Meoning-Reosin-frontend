/**
 * 브라우저 저장소 도우미. 키 앞에 'wcc_' 를 붙이고 JSON 으로 저장한다.
 * - local: 브라우저를 껐다 켜도 남는다 (언어, 위치 '항상 허용' 등)
 * - session: 탭을 닫으면 사라진다 (오프닝 영상을 이번에 봤는지 등)
 */

function wrap(store) {
  return {
    get(key, fallback) {
      try {
        const raw = store.getItem('wcc_' + key)
        return raw === null ? fallback : JSON.parse(raw)
      } catch {
        return fallback
      }
    },
    set(key, value) {
      try {
        store.setItem('wcc_' + key, JSON.stringify(value))
      } catch {
        // 저장소를 못 쓰는 환경(사생활 보호 모드 등)이면 조용히 넘어간다.
      }
    },
  }
}

export const local = wrap(localStorage)
export const session = wrap(sessionStorage)
