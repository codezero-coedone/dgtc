import { site } from "../data/site";
import { ImageSlot } from "./ui/ImageSlot";

const factoryProof = [
  { label: "유압 피팅 가공품", image: "/products/hydraulic-fitting-machined-block.jpg" },
  { label: "유압 밸브 카트리지", image: "/products/hydraulic-valve-cartridge.jpg" },
  { label: "원통형 가공 부품", image: "/products/machined-shaft-pin.jpg" },
  { label: "나사산 가공 부품", image: "/products/threaded-machined-collar.jpg" },
  { label: "검사 및 보관" },
];

export function CompanyIntro() {
  return (
    <section id="company" className="section-anchor company-preview dk-section">
      <div className="dk-container company-preview-grid">
        <div>
          <span className="company-eyebrow">DAEKWANG TECH</span>
          <h2 className="keep-ko">신뢰할 수 있는 제조 흐름을 만드는 기업</h2>
          <p className="keep-ko">{site.company.summary}</p>
          <a href="#/company">회사소개 더보기</a>
          <div className="mt-10 grid gap-4 border-t border-white/10 pt-6 text-xs font-bold text-stone-300 sm:grid-cols-3">
            <span>MANUFACTURING</span>
            <span>HYDRAULIC PARTS</span>
            <span>QUALITY CONTROL</span>
          </div>
        </div>

        <div className="company-image-strip">
          {factoryProof.map((item) => (
            <div key={item.label}>
              <ImageSlot variant="company-strip" label={item.label} src={item.image} className="border border-white/10" />
            </div>
          ))}
          <div className="company-proof-note">
            <p className="text-xs font-bold text-[var(--dk-blue-500)]">FACTORY EVIDENCE</p>
            <p className="keep-ko mt-2 text-sm leading-6 text-stone-300">
              실제 제품 사진을 중심으로 제조 대응 범위를 보여주며, 설비·작업장 이미지는 확보 후 교체합니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
