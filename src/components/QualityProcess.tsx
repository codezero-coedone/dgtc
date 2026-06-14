import { site } from "../data/site";
import { ImageSlot } from "./ui/ImageSlot";
import { SectionTitle } from "./ui/SectionTitle";

export function QualityProcess() {
  const { equipment } = site;

  return (
    <section id="quality" className="section-anchor quality-band dk-section-compact">
      <div className="dk-container">
        <SectionTitle
          variant="compact"
          eyebrow="Facility & Quality"
          title="보유 장비 기반 가공 역량"
          description="CNC Swiss Turning Lathe 기반 정밀 선반 가공과 사양 확인부터 출하까지 이어지는 제조 흐름을 정리합니다."
        />

        <article className="equipment-showcase">
          <div className="equipment-visual">
            <ImageSlot variant="facility" label={equipment.images[0].label} src={equipment.images[0].image} />
            <div className="equipment-thumb-grid">
              {equipment.images.slice(1).map((image) => (
                <ImageSlot key={image.label} variant="gallery" label={image.label} src={image.image} />
              ))}
            </div>
          </div>

          <div className="equipment-copy">
            <p className="equipment-kicker">{equipment.type}</p>
            <h3 className="keep-ko">
              {equipment.model}
              <span>{equipment.title}</span>
            </h3>
            <p className="keep-ko equipment-purpose">{equipment.purpose}</p>
            <p className="keep-ko equipment-description">{equipment.description}</p>

            <div className="equipment-chip-row">
              {equipment.highlights.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>

            <dl className="equipment-spec-table">
              {equipment.specs.map((spec) => (
                <div key={spec.name}>
                  <dt>{spec.name}</dt>
                  <dd>{spec.value}</dd>
                </div>
              ))}
            </dl>

            <div className="market-fit-panel">
              <strong>시장 대응 포인트</strong>
              <ul>
                {equipment.marketFit.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </article>

        <ol className="process-line">
          {site.process.map((step, index) => (
            <li className="process-step" key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{step}</strong>
              <p className="keep-ko mt-3">단계별 확인</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
