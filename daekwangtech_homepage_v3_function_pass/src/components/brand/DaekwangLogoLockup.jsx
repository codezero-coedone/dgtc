import React from "react";
import { DaekwangLogoMark } from "./DaekwangLogoMark.jsx";

export function DaekwangLogoLockup({ variant = "horizontal", tone = "light", size = "md", className = "" }) {
  const markSize = size === "sm" ? 34 : size === "lg" ? 56 : 44;
  const classes = ["dk-brand-logo", `is-${variant}`, `is-${tone}`, `is-${size}`, className].filter(Boolean).join(" ");

  if (variant === "markOnly") {
    return <DaekwangLogoMark tone={tone} size={markSize} />;
  }

  return (
    <div className={classes} aria-label="DAE KWANG TECH 대광테크">
      <DaekwangLogoMark tone={tone} size={markSize} />
      <div className="dk-brand-logo__text">
        <strong>
          <span>DAE KWANG</span>
          <em>TECH</em>
        </strong>
        <small>대광테크</small>
      </div>
    </div>
  );
}
