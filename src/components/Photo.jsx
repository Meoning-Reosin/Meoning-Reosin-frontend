/**
 * 사진 칸 (프로토타입 photo()).
 * - src 가 있으면 사진을 보여 주고, 다 불러오면 .loaded 가 붙어 대체 글자가 숨는다.
 * - src 가 없거나(백엔드 thumbnail_url 이 아직 null) 못 불러오면 label 글자를 보여 준다.
 *
 *   <Photo src={place.thumbnail_url} label={place.name} className="wide" />
 */
import { useState } from 'react'

export default function Photo({ src, label = '', className = '' }) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const showImage = src && !failed

  return (
    <div className={`photo ${className} ${loaded ? 'loaded' : ''}`} role="img" aria-label={label}>
      <div className="photo-fallback">
        <span>{label}</span>
      </div>
      {showImage && (
        <img
          src={src}
          alt={label}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  )
}
