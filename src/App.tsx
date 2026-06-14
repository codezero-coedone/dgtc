import { useEffect, useMemo, useState } from "react";
import { CapabilitySection } from "./components/CapabilitySection";
import { CompanyIntro } from "./components/CompanyIntro";
import { ContactSection } from "./components/ContactSection";
import { Footer } from "./components/Footer";
import { GallerySection } from "./components/GallerySection";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { ProductSection } from "./components/ProductSection";
import { QualityProcess } from "./components/QualityProcess";
import { ImageSlot } from "./components/ui/ImageSlot";
import { SectionTitle } from "./components/ui/SectionTitle";
import { site, type PageKey } from "./data/site";

function QuickMenu() {
  return (
    <section className="quick-menu-section">
      <div className="dk-container quick-menu-grid">
        {site.quickLinks.map((item, index) => (
          <a href={item.href} className="quick-menu-item" key={item.href}>
            <span className="quick-index">{String(index + 1).padStart(2, "0")}</span>
            <strong className="keep-ko">{item.title}</strong>
            <p className="keep-ko">{item.desc}</p>
            <em>자세히 보기</em>
          </a>
        ))}
      </div>
    </section>
  );
}

function CompanyViewSection() {
  return (
    <section className="company-view-section dk-section-compact">
      <div className="dk-container company-view-grid">
        <div className="company-view-copy">
          <SectionTitle
            variant="compact"
            eyebrow="Company View"
            title="회사 전경"
            description="히어로 배경으로만 지나가던 회사 전경 영상을 별도 영역으로 열어, 대광테크의 실제 사업장 이미지를 명확하게 확인할 수 있게 했습니다."
          />
          <div className="company-view-facts">
            <span>제조 사업장</span>
            <span>자동차 유압부품</span>
            <span>정밀 가공 대응</span>
          </div>
        </div>
        <figure className="company-view-media">
          <video
            className="company-view-video"
            src={site.media.heroVideo}
            autoPlay
            loop
            controls
            muted
            playsInline
            preload="metadata"
          />
          <figcaption>대광테크 회사 전경 영상</figcaption>
        </figure>
      </div>
    </section>
  );
}

const pageKeys = ["company", "products", "capability", "quality", "gallery", "support"] as const;

function getRoute(): PageKey | "home" {
  const value = window.location.hash.replace(/^#\/?/, "");
  return pageKeys.includes(value as PageKey) ? (value as PageKey) : "home";
}

function PageIntro({ pageKey, image }: { pageKey: PageKey; image?: string }) {
  const page = site.pages[pageKey];

  return (
    <section className="detail-page-hero">
      <div className="dk-container detail-page-hero-grid">
        <div className="detail-page-copy">
          <p className="detail-eyebrow">
            <span />
            {page.eyebrow}
          </p>
          <h1 className="keep-ko">{page.title}</h1>
          <p className="keep-ko">{page.lead}</p>
          <a href="#/" className="detail-home-link">
            메인으로
          </a>
        </div>
        <ImageSlot variant="hero-wide" label={page.title} src={image} className="detail-visual" />
      </div>
    </section>
  );
}

function ProductCatalogPage() {
  return (
    <main>
      <PageIntro pageKey="products" image={site.products[0].image} />
      <section id="products" className="section-anchor product-page-section dk-section dk-light-grid-bg">
        <div className="dk-container">
          <SectionTitle
            eyebrow="Product Catalog"
            title="제품 페이지"
            description="제품 구매 화면이 아니라 대광테크가 대응하는 자동차 유압부품군을 기술 카탈로그 방식으로 분리했습니다."
          />
          <div className="product-page-grid">
            {site.products.map((product, index) => (
              <article key={product.name} className="product-page-card">
                <ImageSlot variant="product-card" label={product.name} src={product.image} />
                <div className="product-page-card-body">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong className="keep-ko">{product.name}</strong>
                  <p className="keep-ko">{product.desc}</p>
                  <dl>
                    <div>
                      <dt>상담 기준</dt>
                      <dd>도면 / 사양 / 수량</dd>
                    </div>
                    <div>
                      <dt>대응 흐름</dt>
                      <dd>확인 / 가공 / 검사</dd>
                    </div>
                  </dl>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function CompanyPage() {
  return (
    <main>
      <PageIntro pageKey="company" image={site.media.heroPosterFallback} />
      <CompanyViewSection />
      <CompanyIntro />
    </main>
  );
}

function CapabilityPage() {
  return (
    <main>
      <PageIntro pageKey="capability" image="/equipment/xdi26-32-detail.jpg" />
      <CapabilitySection />
    </main>
  );
}

function EquipmentPage() {
  return (
    <main>
      <PageIntro pageKey="quality" image={site.equipment.images[0].image} />
      <QualityProcess />
    </main>
  );
}

function GalleryPage() {
  return (
    <main>
      <PageIntro pageKey="gallery" image={site.equipment.images[1].image} />
      <GallerySection />
    </main>
  );
}

function SupportPage() {
  return (
    <main>
      <ContactSection />
    </main>
  );
}

function RoutedPage({ pageKey }: { pageKey: PageKey }) {
  if (pageKey === "company") return <CompanyPage />;
  if (pageKey === "products") return <ProductCatalogPage />;
  if (pageKey === "capability") return <CapabilityPage />;
  if (pageKey === "quality") return <EquipmentPage />;
  if (pageKey === "gallery") return <GalleryPage />;
  return <SupportPage />;
}

function HomePage() {
  return (
    <main>
      <Hero />
      <QuickMenu />
      <CompanyViewSection />
      <ProductSection />
      <CapabilitySection />
      <ContactSection />
    </main>
  );
}

export default function App() {
  const [route, setRoute] = useState<PageKey | "home">(() => getRoute());

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(getRoute());
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const content = useMemo(() => (route === "home" ? <HomePage /> : <RoutedPage pageKey={route} />), [route]);

  return (
    <div id="top" className="min-h-screen bg-white">
      <Header />
      {content}
      <Footer />
    </div>
  );
}
