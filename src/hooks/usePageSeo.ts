import { useEffect } from "react";
import { companyInfo, liveProducts } from "../data/daekwangContent";

export function usePageSeo(_page: unknown) {
  useEffect(() => undefined, []);
}

export function useHomeSeo() {
  useEffect(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const canonical = `${origin}/`;
    const title = "대광테크 | DAE KWANG TECH";
    const description = "대광테크는 정밀가공 기술과 품질 중심의 제조 역량을 소개하는 기업 홈페이지입니다.";

    document.title = title;

    const setMeta = (attr: "name" | "property", key: string, content: string) => {
      let tag = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, key);
        document.head.appendChild(tag);
      }
      tag.content = content;
    };

    setMeta("name", "description", description);
    setMeta("name", "robots", "index, follow");
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:url", canonical);
    setMeta("property", "og:image", `${origin}/assets/daekwang/live/company-front.jpg`);

    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonical;

    document.querySelectorAll("[data-seo-jsonld]").forEach((node) => node.remove());
    const businessScript = document.createElement("script");
    businessScript.type = "application/ld+json";
    businessScript.dataset.seoJsonld = "business";
    businessScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: companyInfo.nameKo,
      alternateName: companyInfo.nameEn,
      telephone: companyInfo.tel,
      faxNumber: companyInfo.fax,
      email: companyInfo.email,
      url: canonical,
      description,
      address: companyInfo.address,
      makesOffer: liveProducts.map((product) => product.title),
    });
    document.head.appendChild(businessScript);
  }, []);
}
