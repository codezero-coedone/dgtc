import { useEffect, useState } from "react";
import { site } from "../../data/site";

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
  const [imageState, setImageState] = useState<"idle" | "loaded" | "failed">("idle");
  const hasSrc = Boolean(src);
  const showImage = hasSrc && imageState === "loaded";
  const showFallback = !showImage;

  useEffect(() => {
    setImageState("idle");
  }, [src]);

  return (
    <div
      className={`dk-image-slot ${variantClass[variant]} ${className}`}
      style={{ aspectRatio: ratioByVariant[variant] }}
      role={showFallback ? "img" : undefined}
      aria-label={showFallback ? label : undefined}
    >
      {hasSrc ? (
        <img
          src={src}
          alt={label}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-200 ${showImage ? "opacity-100" : "opacity-0"}`}
          loading={variant === "hero-wide" ? "eager" : "lazy"}
          aria-hidden={!showImage}
          onLoad={() => setImageState("loaded")}
          onError={() => setImageState("failed")}
        />
      ) : null}
      {showFallback ? (
        <div className="dk-fallback-grid" aria-hidden="true">
          <div className="dk-fallback-line" />
          <div className="dk-fallback-circle" />
          <div className="dk-fallback-block" />
        </div>
      ) : null}
      {showImage ? <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_42%,rgba(17,19,21,.62))]" /> : null}
      <div className="dk-fallback-caption">
        <strong className="keep-ko">{label}</strong>
        <span>{site.company.nameEn}</span>
      </div>
    </div>
  );
}
