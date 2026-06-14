import { useState } from "react";

export type ImageSlotVariant = "hero-wide" | "product-card" | "company-strip" | "gallery" | "facility";

type ImageSlotProps = {
  variant?: ImageSlotVariant;
  label: string;
  className?: string;
  src?: string;
};

const ratioByVariant: Record<ImageSlotVariant, string> = {
  "hero-wide": "16 / 10",
  "product-card": "4 / 3",
  "company-strip": "5 / 4",
  gallery: "4 / 3",
  facility: "16 / 9",
};

const variantClass: Record<ImageSlotVariant, string> = {
  "hero-wide": "dk-image-hero",
  "product-card": "dk-image-product",
  "company-strip": "dk-image-company",
  gallery: "dk-image-gallery",
  facility: "dk-image-facility",
};

export function ImageSlot({ variant = "gallery", label, className = "", src }: ImageSlotProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const hasImage = Boolean(src) && !imageFailed;

  return (
    <div
      className={`dk-image-slot ${variantClass[variant]} ${className}`}
      style={{ aspectRatio: ratioByVariant[variant] }}
      role="img"
      aria-label={label}
    >
      {hasImage ? (
        <img
          src={src}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading={variant === "hero-wide" ? "eager" : "lazy"}
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div className="dk-fallback-grid">
          <div className="dk-fallback-line" />
          <div className="dk-fallback-circle" />
          <div className="dk-fallback-block" />
        </div>
      )}
      {hasImage ? <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_42%,rgba(17,19,21,.62))]" /> : null}
      <div className="dk-fallback-caption">
        <strong className="keep-ko">{label}</strong>
        <span>DAEKWANG TECH</span>
      </div>
    </div>
  );
}
