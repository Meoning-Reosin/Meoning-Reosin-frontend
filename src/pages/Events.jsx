/** S07-E 서울 행사 소식. 카드를 누르면 서울문화포털 공식 안내가 새 창으로 열린다. */
import BottomNav from '../components/BottomNav.jsx'
import EventMeta from '../components/EventMeta.jsx'
import Header from '../components/Header.jsx'
import { CULTURE_CALENDAR_URL, currentEvents, eventLink } from '../data/events.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'

export default function Events() {
  const { t } = useLanguage()
  const events = currentEvents()

  return (
    <>
      <Header />
      <main className="pad bottomspace">
        <h1>{t('서울 행사 소식', 'Seoul events')}</h1>
        <p className="small">
          {t(
            '서울문화포털 공개 일정 · 회차별 시간은 공식 안내에서 확인하세요.',
            'Source: Seoul Culture Portal. Check the official listings for individual showtimes.',
          )}
        </p>
        <div className="sw-event-list">
          {events.length ? (
            events.map((event) => (
              <a key={event.ko} className="sw-event-card" href={eventLink(event)} target="_blank" rel="noopener noreferrer">
                <h2>{t(event.ko, event.en)}</h2>
                <EventMeta event={event} />
              </a>
            ))
          ) : (
            <p>
              {t(
                '표시할 행사가 없어요. 공식 문화달력에서 최신 일정을 확인하세요.',
                'Check the official calendar for upcoming events.',
              )}
            </p>
          )}
        </div>
        <a className="outline" href={CULTURE_CALENDAR_URL} target="_blank" rel="noopener noreferrer">
          {t('서울문화포털 전체 행사 일정', 'Official Seoul culture calendar')}
        </a>
      </main>
      <BottomNav />
    </>
  )
}
