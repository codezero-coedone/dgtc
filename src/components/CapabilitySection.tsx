import { site } from "../data/site";
import { SectionTitle } from "./ui/SectionTitle";

const icons = ["CNC", "Ø", "DWG", "QC"];

export function CapabilitySection() {
  return (
    <section id="capability" className="section-anchor dk-section bg-white">
      <div className="dk-container">
        <SectionTitle
          eyebrow="Capability"
          title="기술역량"
          description="장비 기반 정밀 선반 가공, 복합 형상 대응, 도면 기반 사양 검토를 중심으로 자동차 유압부품 제조 대응력을 보여줍니다."
        />

        <div className="capability-grid">
          {site.capabilities.map((capability, index) => (
            <article key={capability.title} className="capability-card">
              <div className="icon">{icons[index]}</div>
              <strong>{capability.title}</strong>
              <p className="keep-ko">{capability.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
