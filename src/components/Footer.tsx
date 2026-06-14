import { site } from "../data/site";

export function Footer() {
  return (
    <footer className="footer">
      <div className="dk-container footer-grid">
        <div className="footer-brand">
          <strong>{site.company.nameEn}</strong>
          <span>{site.company.nameKo}</span>
          <p className="keep-ko mt-4 text-sm leading-6 text-white/70">{site.company.positioning}</p>
        </div>
        <div className="footer-info">
          <span>{site.contact.address}</span>
          <a href={site.contact.telHref}>TEL {site.contact.tel}</a>
          <span>FAX {site.contact.fax}</span>
          <a href={site.contact.mobileHref}>Mobile {site.contact.mobile}</a>
          <a href={site.contact.emailHref}>{site.contact.email}</a>
        </div>
        <div className="footer-links">
          <a href="#/support">개인정보처리방침</a>
          <a href="#/support">이용약관</a>
          <a href="#/">사이트맵</a>
        </div>
      </div>
      <div className="dk-container">
        <small>
        Copyright {site.company.nameEn}. All rights reserved.
        </small>
      </div>
    </footer>
  );
}
