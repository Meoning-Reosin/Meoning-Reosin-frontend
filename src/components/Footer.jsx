/**
 * 홈 맨 아래 정보 영역 (S07-F 홈 하단 · 약관). 프로토타입 storywalkFooter.
 */
import policies from '../data/policies.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import PolicyButton from './PolicyButton.jsx'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="storywalk-footer">
      <div className="footer-wordmark" aria-label="ㅇㅋㅋ">
        ㅇㅋㅋ
      </div>
      <div className="footer-policies" aria-label={t('서비스 약관', 'Service policies')}>
        {Object.keys(policies).map((key) => (
          <PolicyButton key={key} policy={key} />
        ))}
      </div>
      <address>
        {t(
          '서울특별시 마포구 백범로31길 21, 서울창업허브 공덕 본관 9층 · 새싹(SeSAC) 마포캠퍼스',
          'SeSAC Mapo Campus · Seoul Startup Hub Gongdeok, Main Building 9F, 21 Baekbeom-ro 31-gil, Mapo-gu, Seoul',
        )}
      </address>
      <div className="footer-registration">
        <span>
          {t('사업자등록번호', 'Business registration')} <bdi>000-00-00000</bdi> {t('(예시)', '(sample)')}
        </span>
        <span>
          TEL <bdi>02-0000-0000</bdi> {t('(예시)', '(sample)')}
        </span>
      </div>
      <small>Copyright © 2026 ㅇㅋㅋ-Walk Creator Crew. All rights reserved.</small>
    </footer>
  )
}
