import React from "react";
import approvedLockupUrl from "../../../assets/daekwang-approved-lockup.svg";
import approvedLockupLightUrl from "../../../assets/daekwang-approved-lockup-light.svg";
import { DaekwangLogoMark } from "./DaekwangLogoMark.jsx";

export function DaekwangLogoLockup({ variant = "horizontal", tone = "light", size = "md", className = "" }) {
  const markSize = size === "sm" ? 34 : size === "lg" ? 56 : 44;
  const classes = ["dk-brand-logo", `is-${variant}`, `is-${tone}`, `is-${size}`, className].filter(Boolean).join(" ");
  const asset = tone === "dark" ? approvedLockupLightUrl : approvedLockupUrl;

  if (variant === "markOnly") {
    return <DaekwangLogoMark tone={tone} size={markSize} />;
  }

  return (
    <span className={classes} aria-label="DAEKWANG TECH 대광테크">
      <img
        className="dk-brand-logo__asset"
        src={asset}
        alt="DAEKWANG TECH 대광테크"
        decoding="async"
      />
    </span>
  );
}
