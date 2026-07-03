import { adminTokenDefaults } from "./designTokens.js";

export const CONTENT_STORAGE_KEY = "daekwang.admin.content.v1";

export const defaultAdminContent = {
  schemaVersion: 1,
  updatedAt: "",
  company: {
    nameKo: "대광테크",
    nameEn: "DAE KWANG TECH",
    address: "경기도 화성시 마도면 청원산단5길 60-26",
    tel: "031-355-5400",
    fax: "031-355-5402",
  },
  tokens: adminTokenDefaults,
  pages: [
    {
      id: "index",
      label: "홈",
      href: "#/",
      status: "published",
      seoTitle: "대광테크 기업 홈페이지 | DAE KWANG TECH",
      description: "정밀 가공, CNC 자동선반, 품질 관리, 설비 인프라를 기반으로 한 대광테크 기업 소개 홈페이지입니다.",
      eyebrow: "PRECISION YOUR SUCCESS",
      title: "DAE KWANG TECH",
      headline: "정밀함이 만드는 차이,\n그 차이가 경쟁력입니다",
      summary: "초정밀 가공 · 금속 처리 · 품질 관리까지, 완벽을 향한 우리의 기준은 타협하지 않습니다.",
      heroImage: "assets/real-hero-batch-components.jpg",
    },
    {
      id: "technology",
      label: "기술력",
      href: "#/technology",
      status: "published",
      seoTitle: "대광테크 기술력 | 초정밀 가공 역량",
      description: "초정밀 가공 기술, 소재 대응, 공차 관리, 복합 형상 가공 등 대광테크의 기술 역량을 소개합니다.",
      eyebrow: "TECHNOLOGY",
      title: "기술력",
      headline: "정밀한 기술과\n끊임없는 개선으로 가치를 만듭니다",
      summary: "고객 요구와 도면 조건에 맞춘 정밀 가공 대응 역량을 제공합니다.",
      heroImage: "assets/real-silver-valve-core.jpg",
    },
    {
      id: "products",
      label: "제품/서비스",
      href: "#/products",
      status: "published",
      seoTitle: "대광테크 제품·서비스 | 정밀 가공 부품",
      description: "자동차 부품, 유압 부품, 전자·전장 부품, 산업기계 부품 등 정밀 가공 제품군을 소개합니다.",
      eyebrow: "PRODUCTS & SERVICES",
      title: "제품/서비스",
      headline: "정밀 가공부터 조립까지,\n맞춤형 제품과 제조 솔루션을 제공합니다",
      summary: "다양한 소재와 공정, 축적된 경험으로 고객 요구에 최적화된 고정밀 부품과 완성품을 제공합니다.",
      heroImage: "assets/real-hero-batch-components.jpg",
    },
    {
      id: "process",
      label: "제조 프로세스",
      href: "#/process",
      status: "published",
      seoTitle: "대광테크 제조 프로세스 | 정밀 생산 흐름",
      description: "요구 분석, 설계, 가공, 표면 처리, 검사, 출하까지 이어지는 대광테크 제조 프로세스를 소개합니다.",
      eyebrow: "MANUFACTURING PROCESS",
      title: "제조 프로세스",
      headline: "체계적인 제조 흐름으로\n일관된 품질을 완성합니다",
      summary: "요구 분석부터 출하까지 각 단계의 기준을 정리해 안정적인 생산 흐름을 유지합니다.",
      heroImage: "assets/real-process-shaft-detail.jpg",
    },
    {
      id: "quality",
      label: "품질 관리",
      href: "#/quality",
      status: "published",
      seoTitle: "대광테크 품질 관리 | 정밀 검사 체계",
      description: "대광테크의 품질 관리 체계와 검사 장비, 검증 프로세스를 소개합니다.",
      eyebrow: "QUALITY CONTROL",
      title: "품질 관리",
      headline: "정밀한 검증이\n신뢰를 만듭니다",
      summary: "측정, 검사, 기록 관리를 통해 안정적인 품질 수준을 유지합니다.",
      heroImage: "assets/real-precision-threaded-pair.jpg",
    },
    {
      id: "facility",
      label: "설비/시설",
      href: "#/facility",
      status: "published",
      seoTitle: "대광테크 설비·시설 | 생산 인프라",
      description: "대광테크의 생산 설비, 검사 장비, 운영 인프라를 소개합니다.",
      eyebrow: "FACILITY",
      title: "설비/시설",
      headline: "정밀 제조를 지탱하는\n생산 인프라를 갖추고 있습니다",
      summary: "정밀 가공 설비와 검사 환경을 기반으로 안정적인 제조 대응력을 확보합니다.",
      heroImage: "assets/real-hero-batch-components.jpg",
    },
    {
      id: "company",
      label: "회사 소개",
      href: "#/company",
      status: "published",
      seoTitle: "대광테크 회사 소개 | 신뢰 기반 제조 파트너",
      description: "정밀 제조 역량과 신뢰를 바탕으로 성장해 온 대광테크의 기업 철학과 연혁을 소개합니다.",
      eyebrow: "ABOUT DAE KWANG TECH",
      title: "회사 소개",
      headline: "신뢰를 바탕으로 성장하며,\n정밀 가공의 가치를 만들어갑니다",
      summary: "정직과 책임, 끊임없는 기술 혁신으로 고객과 함께 성장하는 정밀 가공 전문 기업입니다.",
      heroImage: "assets/real-hero-batch-components.jpg",
    },
  ],
  posts: [
    {
      id: "notice-quality-system",
      status: "draft",
      pinned: true,
      category: "공지",
      title: "품질 관리 기준 정비 안내",
      summary: "공정별 품질 확인 기준을 정리해 안정적인 제조 품질을 유지합니다.",
      body: "대광테크는 입고 확인, 가공 정밀도 점검, 조립·용접 검수, 출고 전 확인까지 단계별 기준을 바탕으로 일관된 품질 관리를 이어갑니다.",
      publishedAt: "2026-06-26",
    },
  ],
  media: [
    {
      id: "media-logo",
      label: "대광테크 로고",
      src: "/brand/daekwang-primary-logo.png",
      alt: "DAE KWANG TECH 대광테크 로고",
      usage: "헤더 / 푸터 / 관리자",
      status: "active",
    },
    {
      id: "media-hero-machine",
      label: "메인 히어로",
      src: "assets/hero-machine.jpg",
      alt: "대광테크 정밀 가공 메인 이미지",
      usage: "홈 / 기술력 히어로",
      status: "active",
    },
    {
      id: "media-facility-cnc",
      label: "CNC 설비",
      src: "assets/facility-cnc.jpg",
      alt: "대광테크 CNC 설비 이미지",
      usage: "설비 / 제조 프로세스",
      status: "active",
    },
    {
      id: "media-inspection-cmm",
      label: "검사 장비",
      src: "assets/inspection-cmm.jpg",
      alt: "대광테크 검사 장비 이미지",
      usage: "품질 관리",
      status: "active",
    },
    {
      id: "media-map",
      label: "오시는 길 지도",
      src: "assets/map.jpg",
      alt: "대광테크 오시는 길 지도",
      usage: "회사 소개 / 위치 안내",
      status: "active",
    },
  ],
};

export function cloneContent(content = defaultAdminContent) {
  return JSON.parse(JSON.stringify(content));
}

function spaHref(id) {
  return id === "index" ? "#/" : `#/${id}`;
}

export function normalizeContent(content) {
  const base = cloneContent();
  const storedPages = Array.isArray(content.pages) ? content.pages : [];
  const storedById = new Map(storedPages.map((page) => [page.id, page]));
  return {
    ...base,
    ...content,
    company: { ...defaultAdminContent.company, ...(content.company ?? {}) },
    tokens: { ...defaultAdminContent.tokens, ...(content.tokens ?? {}) },
    pages: base.pages.map((page) => {
      const stored = storedById.get(page.id) ?? {};
      return { ...page, ...stored, href: spaHref(page.id) };
    }),
    posts: Array.isArray(content.posts) ? content.posts : base.posts,
    media: Array.isArray(content.media) ? content.media : base.media,
  };
}

export function loadStoredContent() {
  if (typeof window === "undefined") return cloneContent();
  const raw = window.localStorage.getItem(CONTENT_STORAGE_KEY);
  if (!raw) return cloneContent();
  try {
    return normalizeContent(JSON.parse(raw));
  } catch {
    return cloneContent();
  }
}

export function saveStoredContent(content) {
  const next = { ...normalizeContent(content), updatedAt: new Date().toISOString() };
  window.localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(next, null, 2));
  return next;
}
