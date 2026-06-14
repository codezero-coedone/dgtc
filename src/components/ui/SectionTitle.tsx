type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  variant?: "light" | "dark" | "compact";
  align?: "left" | "center";
};

export function SectionTitle({
  eyebrow,
  title,
  description,
  variant = "light",
  align = "left",
}: SectionTitleProps) {
  const classNames = ["section-title", align === "center" ? "center" : "", variant].filter(Boolean).join(" ");

  return (
    <div className={classNames}>
      {eyebrow ? <p className="section-eyebrow">{eyebrow}</p> : null}
      <h2 className="text-balance-ko">{title}</h2>
      {description ? <p className="keep-ko">{description}</p> : null}
    </div>
  );
}
