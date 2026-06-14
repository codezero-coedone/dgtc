import type { FormEvent } from "react";
import { site } from "../data/site";
import { SectionTitle } from "./ui/SectionTitle";

const locationRows = [
  { label: "주소", value: site.contact.address },
  { label: "TEL", value: site.contact.tel, href: "tel:055-323-7157" },
  { label: "FAX", value: site.contact.fax },
  { label: "Mobile", value: site.contact.mobile, href: "tel:010-9256-7475" },
  { label: "E-mail", value: site.contact.email, href: "mailto:ndh7157@hanmail.net" },
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
                <dd className="keep-ko">
                  {row.href ? <a href={row.href}>{row.value}</a> : row.value}
                </dd>
              </div>
            ))}
          </dl>
          <div className="support-hold-note">
            <p className="support-note-label">CONTACT POINT</p>
            <p className="support-note-body keep-ko">
              제품 도면, 소재, 수량, 납기 정보를 함께 전달해 주시면 품질팀 담당자가 확인 후 안내드립니다.
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
          <div className="location-map-content">
            <div className="location-map-head">
              <span>VISIT</span>
              <span className="text-[var(--dk-steel-700)]">GIMHAE</span>
            </div>
            <div className="location-map-body">
              <strong>방문 안내</strong>
              <p className="keep-ko">{site.contact.address}</p>
              <p className="keep-ko">방문 전 전화 문의 후 방문해 주시면 보다 정확한 안내가 가능합니다.</p>
              <p>
                <a href="tel:055-323-7157">TEL 055-323-7157</a>
              </p>
            </div>
            <div className="location-map-tags">
              <span>신천산단로</span>
              <span>한림면</span>
              <span>방문 전 연락</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
