export const extractedDesignTokens = {
  color: {
    navy980: "#030912",
    navy950: "#06111f",
    navy920: "#081827",
    navy900: "#0b1e35",
    blue600: "#2563eb",
    blue500: "#3b82f6",
    background: "#f6f8fb",
    surface: "#ffffff",
    line: "#e5eaf0",
    text: "#111827",
    muted: "#64748b",
  },
  radius: {
    card: "8px",
    panel: "14px",
    pill: "999px",
  },
  shadow: {
    strong: "0 22px 60px rgba(15,23,42,.12)",
    soft: "0 10px 30px rgba(15,23,42,.08)",
    admin: "0 18px 48px rgba(15, 23, 42, 0.1)",
  },
  layout: {
    contentMax: "1280px",
    contentGutter: "80px",
    headerHeight: "66px",
    heroDesktopMin: "324px",
    cardGap: "14px",
  },
  typography: {
    family: 'Pretendard, SUIT, Inter, "Apple SD Gothic Neo", "Noto Sans KR", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    headingWeight: "900",
    navWeight: "800",
    bodyTracking: "-.025em",
  },
};

export const adminTokenDefaults = {
  background: extractedDesignTokens.color.background,
  surface: extractedDesignTokens.color.surface,
  text: extractedDesignTokens.color.text,
  muted: extractedDesignTokens.color.muted,
  deep: extractedDesignTokens.color.navy950,
  accent: extractedDesignTokens.color.blue600,
  line: extractedDesignTokens.color.line,
  radius: extractedDesignTokens.radius.card,
};

export const tokenGroups = [
  {
    title: "Core Industrial Palette",
    items: [
      ["Deep Navy", extractedDesignTokens.color.navy950],
      ["Steel Blue", extractedDesignTokens.color.blue600],
      ["Surface", extractedDesignTokens.color.surface],
      ["Line", extractedDesignTokens.color.line],
    ],
  },
  {
    title: "Layout Rhythm",
    items: [
      ["Content Max", extractedDesignTokens.layout.contentMax],
      ["Header", extractedDesignTokens.layout.headerHeight],
      ["Card Gap", extractedDesignTokens.layout.cardGap],
      ["Radius", extractedDesignTokens.radius.card],
    ],
  },
  {
    title: "Depth",
    items: [
      ["Strong Shadow", extractedDesignTokens.shadow.strong],
      ["Soft Shadow", extractedDesignTokens.shadow.soft],
    ],
  },
];
