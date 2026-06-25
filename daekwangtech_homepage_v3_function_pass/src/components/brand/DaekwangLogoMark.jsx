import React from "react";

export function DaekwangLogoMark({ className = "", tone = "light", size = 42, title = "대광테크 로고 마크" }) {
  const isDark = tone === "dark";
  const navy = isDark ? "#FFFFFF" : "#0B1D3A";
  const blue = isDark ? "#5DA5E0" : "#0F47AF";
  const sky = isDark ? "#B9DFFF" : "#5DA5E0";

  return (
    <svg className={className} width={size} height={size} viewBox="0 0 72 72" role="img" aria-label={title} xmlns="http://www.w3.org/2000/svg">
      <title>{title}</title>
      <defs>
        <linearGradient id={`dkMarkG-${tone}`} x1="14" y1="12" x2="58" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor={blue} />
          <stop offset="1" stopColor={sky} />
        </linearGradient>
      </defs>
      <rect x="5" y="5" width="62" height="62" rx="18" fill={isDark ? "rgba(255,255,255,.08)" : "#FFFFFF"} stroke={isDark ? "rgba(255,255,255,.22)" : "rgba(11,29,58,.12)"} />
      <path d="M18 49V22h12.2c9.7 0 16.1 5.1 16.1 13.5S39.9 49 30.2 49H18Zm8.2-7.2h4c4.9 0 7.8-2.2 7.8-6.3s-2.9-6.3-7.8-6.3h-4v12.6Z" fill={navy} />
      <path d="M44.3 22h9.9L41.4 35.1 55 49H44.8L32.3 36.1 44.3 22Z" fill={`url(#dkMarkG-${tone})`} />
      <path d="M51.3 25.7h-3.9L36.7 36.2 48.3 47h4.4L41.4 35.2l9.9-9.5Z" fill={isDark ? "#0B1D3A" : "#FFFFFF"} opacity=".88" />
    </svg>
  );
}
