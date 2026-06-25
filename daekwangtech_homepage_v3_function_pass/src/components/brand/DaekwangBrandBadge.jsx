import React from "react";
import { DaekwangLogoMark } from "./DaekwangLogoMark.jsx";

export function DaekwangBrandBadge({ label = "DAE KWANG TECH", tone = "light" }) {
  return (
    <div className={`dk-brand-badge is-${tone}`}>
      <DaekwangLogoMark tone={tone} size={32} />
      <span>{label}</span>
    </div>
  );
}
