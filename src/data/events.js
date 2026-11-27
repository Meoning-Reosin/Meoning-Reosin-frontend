/**
 * 서울 행사 소식 (S07-E, 홈 배너). 프로토타입 v4.2 의 officialEvents 를 옮겼다.
 * 서울문화포털 공개 일정을 손으로 적어 둔 값이라, 끝난 행사는 자동으로 빠진다.
 * TODO: 행사 API(서울 열린데이터 문화행사 정보)가 생기면 백엔드에서 받아 온다.
 */

export const CULTURE_CALENDAR_URL =
  'https://culture.seoul.go.kr/culture/culture/cultureCalendar/list.do?menuNo=200122'

const EVENTS = [
  {
    ko: '문화가 흐르는 서울광장',
    en: 'Culture Flowing at Seoul Plaza',
    venue: '서울광장',
    venueEn: 'Seoul Plaza',
    start: '2026-05-06',
    end: '2026-12-31',
    code: '157652',
    image: '/assets/stone.jpg',
  },
  {
    ko: '서울거리공연 구석구석라이브',
    en: 'Seoul Street Performances',
    venue: '서울 곳곳',
    venueEn: 'Across Seoul',
    start: '2026-05-01',
    end: '2026-12-31',
    code: '157655',
    image: '/assets/wall.jpg',
  },
  {
    ko: '백제왕도 달빛기행',
    en: 'Baekje Capital Moonlight Tour',
    venue: '서울백제어린이박물관',
    venueEn: 'Seoul Baekje Children’s Museum',
    start: '2026-04-17',
    end: '2026-11-27',
    endAt: '2026-11-27T19:30:00+09:00',
    url: 'https://culture.seoul.go.kr/culture/culture/cultureEvent/view.do?cultcode=158803&menuNo=200011',
    image: '/assets/palace.jpg',
  },
]

/** 서울 기준 오늘 날짜 'YYYY-MM-DD' */
function seoulToday(date) {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

/** 아직 안 끝난 행사만 */
export function currentEvents(date = new Date()) {
  const today = seoulToday(date)
  return EVENTS.filter((event) => event.end >= today && (!event.endAt || date.getTime() < Date.parse(event.endAt)))
}

export function eventLink(event) {
  return (
    event.url ||
    `https://culture.seoul.go.kr/culture/culture/cultureEvent/view.do?cultcode=${event.code}&menuNo=200110`
  )
}
