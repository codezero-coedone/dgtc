import type { ReactNode } from "react";
import { site } from "../data/site";
import { SectionTitle } from "./ui/SectionTitle";
import { ImageSlot } from "./ui/ImageSlot";

type LocationRow = {
  label: string;
  value: ReactNode;
  href?: string;
};

const locationRows: LocationRow[] = [
  {
    label: "회사명",
    value: (
      <>
        <strong>{site.company.nameKo}</strong>
        <span>{site.company.nameEn}</span>
      </>
    ),
  },
  { label: "담당", value: `${site.company.manager.department} / ${site.company.manager.title} ${site.company.manager.name}` },
  { label: "주소", value: site.contact.address },
  { label: "TEL", value: site.contact.tel, href: site.contact.telHref },
  { label: "FAX", value: site.contact.fax },
  { label: "Mobile", value: site.contact.mobile, href: site.contact.mobileHref },
  { label: "E-mail", value: site.contact.email, href: site.contact.emailHref },
];

export function ContactSection() {
  return (
    <section id="support" className="section-anchor support-section dk-section">
      <div className="dk-container support-grid">
        <div className="support-info">
          <SectionTitle
            variant="compact"
            eyebrow="Location"
            title={site.contact.title}
            description={site.contact.subtitle}
          />
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
          <div className="support-action-row" aria-label="방문 안내 바로가기">
            <a href={site.contact.mapHref} target="_blank" rel="noreferrer" className="support-link-cta primary">
              카카오맵 보기
            </a>
            <a href={site.contact.telHref} className="support-link-cta">
              전화 연결
            </a>
          </div>
        </div>

        <div className="company-front-card">
          <ImageSlot variant="facility" label="대광테크 사업장 자료" src={site.media.companyFrontImage} className="company-front-image" />
          <div className="company-front-copy">
            <span>DAE KWANG TECH</span>
            <strong className="keep-ko">경남 김해 한림면 사업장</strong>
            <p className="keep-ko">{site.contact.address}</p>
          </div>
        </div>

        <div className="visit-guide-panel">
          <div className="visit-guide-head">
            <span>VISIT GUIDE</span>
            <strong className="keep-ko">방문 안내</strong>
          </div>
          <div className="visit-guide-list">
            <div>
              <span>01</span>
              <p className="keep-ko">방문 전 품질팀 담당자에게 전화로 일정을 확인해 주세요.</p>
            </div>
            <div>
              <span>02</span>
              <p className="keep-ko">주소는 경남 김해시 한림면 신천산단로 52입니다.</p>
            </div>
            <div>
              <span>03</span>
              <p className="keep-ko">현장 방문 시 안내에 따라 지정 구역에서 대기해 주세요.</p>
            </div>
          </div>
          <div className="support-hold-note">
            <p className="support-note-label">CONTACT POINT</p>
            <p className="support-note-body keep-ko">
              담당 품질팀 / 부장 이원근 · TEL 055-323-7157 · Mobile 010-9256-7475
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
