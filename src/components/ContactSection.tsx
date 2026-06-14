import type { FormEvent } from "react";
import { site } from "../data/site";
import { SectionTitle } from "./ui/SectionTitle";

const locationRows = [
  { label: "주소", value: site.contact.address },
  { label: "TEL", value: site.contact.tel },
  { label: "FAX", value: site.contact.fax },
  { label: "E-mail", value: site.contact.email },
];

export function ContactSection() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    window.alert("문의가 접수되었습니다. 확인 후 연락드리겠습니다.");
  };

  return (
    <section id="support" className="section-anchor support-section dk-section">
      <div className="dk-container support-grid">
        <div className="support-info">
          <SectionTitle variant="compact" eyebrow="Support" title={site.contact.title} description={site.contact.subtitle} />
          <dl>
            {locationRows.map((row) => (
              <div key={row.label} className="support-info-row">
                <dt>{row.label}</dt>
                <dd className="keep-ko">{row.value}</dd>
              </div>
            ))}
          </dl>
          <div className="support-hold-note">
            <p className="support-note-label">정보 확인 중</p>
            <p className="support-note-body keep-ko">
              주소와 지도 정보는 공식 확인 후 반영됩니다. 방문 관련 안내는 확정 정보 기준으로 순차 업데이트됩니다.
            </p>
          </div>
        </div>

        <form className="support-form" onSubmit={handleSubmit}>
          <div className="support-form-head">
            <span>CONTACT</span>
            <strong>{site.contact.formTitle}</strong>
            <p className="keep-ko">{site.contact.formSubtitle}</p>
          </div>
          <label>
            <span>회사명 / 담당자</span>
            <input name="name" type="text" placeholder="회사명 또는 담당자명" required />
          </label>
          <label>
            <span>연락처</span>
            <input name="phone" type="tel" placeholder="연락 가능한 번호" required />
          </label>
          <label>
            <span>E-mail</span>
            <input name="email" type="email" placeholder="회신 받을 이메일" />
          </label>
          <label>
            <span>문의 내용</span>
            <textarea name="message" placeholder="제품 사양, 도면, 수량, 납기 등 문의 내용을 입력해 주세요." rows={5} required />
          </label>
          <button type="submit">문의 접수</button>
        </form>

        <div className="location-map-panel">
          <div className="location-map-grid dk-enterprise-surface" />
          <div className="location-map-placeholder" />
          <div className="location-map-content">
            <div className="location-map-head">
              <span>LOCATION MAP</span>
              <span className="text-[var(--dk-steel-700)]">MAP UPDATE</span>
            </div>
            <div className="location-map-body">
              <strong>찾아오시는 길</strong>
              <p className="keep-ko">
                공식 주소 확인 후 지도와 방문 안내 정보를 반영합니다.
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
