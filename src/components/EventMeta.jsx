/** 행사 장소와 기간 (프로토타입 eventMeta). 홈 배너와 행사 소식 화면에서 쓴다. */
import { useLanguage } from '../i18n/LanguageContext.jsx'

export default function EventMeta({ event }) {
  const { lang, t } = useLanguage()
  const format = (iso) =>
    lang === 'en'
      ? new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(
          new Date(iso),
        )
      : iso.replaceAll('-', '.')

  return (
    <div className="sw-event-meta">
      <div className="event-field">
        <b>{t('장소', 'Location')}</b>
        <span>{t(event.venue, event.venueEn)}</span>
      </div>
      <div className="event-field">
        <b>{t('기간', 'Dates')}</b>
        <span>
          <time dateTime={event.start}>{format(event.start)}</time> {t('~', '–')}{' '}
          <time dateTime={event.end}>{format(event.end)}</time>
        </span>
      </div>
    </div>
  )
}
