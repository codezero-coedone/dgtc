import React from "react";
import approvedBrandMarkUrl from "../../../assets/daekwang-approved-mark.svg";

export function DaekwangLogoMark({ className = "", tone = "light", size = 42, title = "대광테크 로고 마크" }) {
  return (
    <img
      className={className}
      src={approvedBrandMarkUrl}
      alt={title}
      width={size}
      height={size}
      decoding="async"
      data-tone={tone}
    />
  );
}
