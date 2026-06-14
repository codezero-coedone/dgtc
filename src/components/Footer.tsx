import { site } from "../data/site";

export function Footer() {
  return (
    <footer className="footer">
      <div className="dk-container footer-grid">
        <div className="footer-brand">
          <strong>DAEKWANG TECH</strong>
          <span>대광테크</span>
          <p className="keep-ko mt-4 text-sm leading-6 text-white/70">자동차 유압부품 및 장비 구성품 제조 기업</p>
        </div>
        <div className="footer-info">
          <span>{site.contact.address}</span>
          <span>{site.contact.tel}</span>
          <span>{site.contact.fax}</span>
          <span>{site.contact.email}</span>
        </div>
        <div className="footer-links">
          <a href="#/support">개인정보처리방침</a>
          <a href="#/support">이용약관</a>
          <a href="#/">사이트맵</a>
        </div>
      </div>
      <div className="dk-container">
        <small>
        Copyright DAEKWANG TECH. All rights reserved.
        </small>
      </div>
    </footer>
  );
}
