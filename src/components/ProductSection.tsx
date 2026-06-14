import { site } from "../data/site";
import { ImageSlot } from "./ui/ImageSlot";
import { SectionTitle } from "./ui/SectionTitle";

export function ProductSection() {
  return (
    <section id="products" className="section-anchor product-catalog dk-section dk-light-grid-bg">
      <div className="dk-container">
        <SectionTitle
          eyebrow="Products"
          title="제품 카탈로그"
          description="자동차부품, 유압부품, 전자부품과 CNC 자동선반 가공 가능 범위를 기술 카탈로그 형식으로 정리했습니다."
        />

        <div className="product-grid">
          {site.products.map((product) => (
            <a key={product.name} href="#/products" className="product-tile">
              <ImageSlot variant="product-card" label={product.name} src={product.image} />
              <div className="product-tile-body">
                <div>
                  <strong className="keep-ko">{product.name}</strong>
                  <p className="keep-ko">{product.desc}</p>
                  <div className="product-meta-row">
                    <span>DRAWING</span>
                    <span>MACHINING</span>
                    <span>INSPECTION</span>
                  </div>
                </div>
                <span className="product-arrow">→</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
