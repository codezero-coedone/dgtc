import { site } from "../data/site";
import { SectionTitle } from "./ui/SectionTitle";

const locationRows = [
  { label: "주소", value: site.contact.address },
  { label: "TEL", value: site.contact.tel },
  { label: "FAX", value: site.contact.fax },
  { label: "E-mail", value: site.contact.email },
];

export function ContactSection() {
  return (
    <section id="support" className="section-anchor support-section dk-section">
      <div className="dk-container support-grid">
        <div className="support-info">
          <SectionTitle variant="compact" eyebrow="Location" title={site.contact.title} description={site.contact.subtitle} />
          <dl>
            {locationRows.map((row) => (
              <div key={row.label} className="support-info-row">
                <dt>{row.label}</dt>
                <dd className="keep-ko">{row.value}</dd>
              </div>
            ))}
          </dl>
          <div className="support-hold-note">
            <p className="text-xs font-bold uppercase text-[var(--dk-brass-600)]">Input Hold</p>
            <p className="keep-ko mt-3 text-sm leading-6 text-[var(--dk-steel-600)]">
              이 영역은 실제 주소 텍스트와 방문 안내 문구를 입력할 자리입니다. 네이버지도 스크린샷을 확보하면 오른쪽 지도 영역에 교체합니다.
            </p>
          </div>
        </div>

        <div className="location-map-panel">
          <div className="location-map-grid dk-enterprise-surface" />
          <div className="location-map-placeholder" />
          <div className="location-map-content">
            <div className="location-map-head">
              <span>NAVER MAP SCREENSHOT AREA</span>
              <span className="text-[var(--dk-blue-600)]">IMAGE PLACEHOLDER</span>
            </div>
            <div className="location-map-body">
              <strong>지도 이미지 교체 예정</strong>
              <p className="keep-ko">
                네이버지도 캡처 파일을 받으면 이 박스에 실제 위치 이미지로 교체합니다.
              </p>
            </div>
            <div className="location-map-tags">
              <span>도로명 주소</span>
              <span>방문 안내</span>
              <span>주차 / 출입</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
