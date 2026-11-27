/**
 * 프로토타입에서 쓰던 선 아이콘(24x24). 색과 굵기는 app.css 가 정한다.
 *   <Icon name="home" />
 */

const paths = {
  home: <path d="m3 10.5 9-7.5 9 7.5M5.5 8.5V20h13V8.5M10 20v-6h4v6" />,
  map: <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3zM9 3v15M15 6v15" />,
  cam: (
    <>
      <rect x="3" y="6" width="18" height="14" rx="2" />
      <path d="m7 6 2-3h6l2 3" />
      <circle cx="12" cy="13" r="4" />
    </>
  ),
  plan: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="1" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  back: <path d="m15 5-7 7 7 7" />,
  heart: <path d="M20.8 8.6c0 4.4-8.8 10.4-8.8 10.4S3.2 13 3.2 8.6a4.7 4.7 0 0 1 8.8-2.2 4.7 4.7 0 0 1 8.8 2.2Z" />,
  search: (
    <>
      <circle cx="10" cy="10" r="6" />
      <path d="m15 15 5 5" />
    </>
  ),
  person: (
    <>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5 20v-2a7 7 0 0 1 14 0v2" />
    </>
  ),
  focus: (
    <>
      <circle cx="12" cy="12" r="7" />
      <circle cx="12" cy="12" r="2" />
      <path d="M12 2v3m0 14v3M2 12h3m14 0h3" />
    </>
  ),
  shield: (
    <>
      <path d="M12 2.7c2.4 1.8 5.2 2.8 8 3.3v5.2c0 4.8-3.3 8.3-8 10.1-4.7-1.8-8-5.3-8-10.1V6c2.8-.5 5.6-1.5 8-3.3Z" />
      <path d="m8.5 12 2.3 2.3 4.7-5" />
    </>
  ),
  arrow: <path d="M4 12h15m-6-6 6 6-6 6" />,
  pencil: <path d="M4 20l4.3-.9L19 8.4a2.2 2.2 0 0 0-3.1-3.1L5.2 16zM14.9 6.3l2.8 2.8" />,
  soundOn: (
    <>
      <path d="M3 9v6h4l5 4V5L7 9H3z" />
      <path d="M16 9a4 4 0 0 1 0 6m3-9a8 8 0 0 1 0 12" />
    </>
  ),
  soundOff: (
    <>
      <path d="M3 9v6h4l5 4V5L7 9H3z" />
      <path d="m16 10 5 5m0-5-5 5" />
    </>
  ),
}

export default function Icon({ name }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}
