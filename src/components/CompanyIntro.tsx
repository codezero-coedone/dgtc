import { site } from "../data/site";
import { ImageSlot } from "./ui/ImageSlot";

const factoryProof = site.gallery.company;

export function CompanyIntro() {
  return (
    <section id="company" className="section-anchor company-preview dk-section">
      <div className="dk-container company-preview-grid">
        <div>
          <span className="company-eyebrow">{site.company.nameEn}</span>
          <h2 className="keep-ko">신뢰할 수 있는 제조 흐름을 만드는 기업</h2>
          <p className="keep-ko">{site.company.summary}</p>
          <a href="#/company">회사소개 더보기</a>
          <div className="company-credential-row">
            <span>AUTOMOTIVE PARTS</span>
            <span>HYDRAULIC PARTS</span>
            <span>ELECTRONIC PARTS</span>
          </div>
        </div>

        <div className="company-image-strip">
          {factoryProof.map((item) => (
            <div key={item.label}>
              <ImageSlot variant="company-strip" label={item.label} src={item.image} className="border border-[var(--dk-line-light)]" />
            </div>
          ))}
          <div className="company-proof-note">
            <p className="company-note-label">REFERENCE</p>
            <p className="company-note-body keep-ko mt-2 text-sm leading-6">
              제품 사진과 장비 자료를 분리해 대광테크의 정밀 가공 대응 범위를 차분하게 확인할 수 있도록 구성했습니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
