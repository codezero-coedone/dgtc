import { useState } from "react";
import { site } from "../data/site";
import { ImageSlot } from "./ui/ImageSlot";
import { SectionTitle } from "./ui/SectionTitle";

type GalleryItem = {
  label: string;
  image?: string;
};

const galleryGroups: { eyebrow: string; title: string; items: GalleryItem[] }[] = [
  {
    eyebrow: "Product Reference",
    title: "제품 자료",
    items: site.gallery.products,
  },
  {
    eyebrow: "Facility Reference",
    title: "설비 자료",
    items: site.gallery.equipment,
  },
];

export function GallerySection() {
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  return (
    <section id="gallery" className="section-anchor dk-section bg-white">
      <div className="dk-container">
        <div className="gallery-head">
          <SectionTitle
            variant="compact"
            eyebrow="Gallery"
            title="자료실"
            description="제품 자료와 설비 자료를 분리하여 가공품과 보유 장비 기반 제조 역량을 함께 확인할 수 있습니다."
          />
          <a href="#/gallery" className="gallery-more">
            자료실 보기
          </a>
        </div>

        <div className="gallery-groups">
          {galleryGroups.map((group) => (
            <div className="gallery-group" key={group.title}>
              <div className="gallery-group-head">
                <span>{group.eyebrow}</span>
                <strong>{group.title}</strong>
              </div>
              <div className="gallery-grid">
                {group.items.map((item, index) => (
                  <button
                    key={`${group.title}-${item.label}-${item.image ?? index}`}
                    type="button"
                    className="gallery-card"
                    onClick={() => setSelected(item)}
                    aria-label={`${item.label} 확대 보기`}
                  >
                    <ImageSlot variant="gallery" label={item.label} src={item.image} className="border border-[var(--dk-line-light)]" />
                    <strong className="keep-ko">{item.label}</strong>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected ? (
        <div className="gallery-modal fixed inset-0 z-[80] grid place-items-center bg-[rgba(7,17,31,.76)] p-4" role="dialog" aria-modal="true">
          <div className="gallery-modal-dialog w-full max-w-3xl rounded-[var(--dk-radius-md)] bg-white p-4 shadow-[var(--dk-shadow-soft)]">
            <div className="gallery-modal-head mb-4 flex flex-wrap items-center justify-between gap-3">
              <h3 className="keep-ko min-w-0 flex-1 text-lg font-bold text-[var(--dk-navy-950)]">{selected.label}</h3>
              <button
                type="button"
                className="h-10 shrink-0 border border-[var(--dk-metal-200)] px-4 text-sm font-semibold"
                onClick={() => setSelected(null)}
              >
                닫기
              </button>
            </div>
            <ImageSlot variant="facility" label={selected.label} src={selected.image} className="rounded-[var(--dk-radius-sm)]" />
          </div>
        </div>
      ) : null}
    </section>
  );
}
