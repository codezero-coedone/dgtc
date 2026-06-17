export type SectionId = "home" | "company" | "business" | "technology" | "process-quality" | "facilities" | "location";

export type NavItem = {
  id: Exclude<SectionId, "home">;
  label: string;
  href: `#${Exclude<SectionId, "home">}`;
};

export type HeroStat = {
  label: string;
  value: string;
  caption: string;
  icon: "building" | "machine" | "partner" | "quality";
  source: "lockedBrief" | "live";
};

export type ImageCard = {
  title: string;
  description: string;
  image: string;
  alt: string;
};

export type FeatureItem = {
  title: string;
  body: string;
  meta?: string;
};

export const companyInfo = {
  nameKo: "대광테크",
  nameEn: "DAE KWANG TECH",
  logoSrc: "",
  logoText: "DK",
  address: "경남 김해시 한림면 신천산단로 52",
  tel: "055-323-7157",
  fax: "055-314-5430",
  mobile: "010-9256-7475",
  email: "ndh7157@hanmail.net",
  contactPerson: "품질팀 / 부장 이원근",
  representative: "자료 확인 중",
  businessNumber: "자료 확인 중",
  establishedAt: "자료 확인 중",
  summary: "CNC 자동선반 기반 자동차·유압·전자부품 전문 가공업체",
  sourceUrl: "https://dgtc.ejdzm90.workers.dev/#/",
  note: "실제 회사와 다릅니다",
};

export const assets = {
  heroCompany: "/assets/daekwang/hero-company.jpg",
  heroMachine: "/assets/daekwang/hero-machine.jpg",
  businessPrecision: "/assets/daekwang/business-precision.jpg",
  businessJig: "/assets/daekwang/business-jig.jpg",
  businessAutomation: "/assets/daekwang/business-automation.jpg",
  businessDefense: "/assets/daekwang/business-defense.jpg",
  technologyHero: "/assets/daekwang/technology-hero.jpg",
  processHero: "/assets/daekwang/process-hero.jpg",
  facilityHero: "/assets/daekwang/facility-hero.jpg",
};

export const navItems: NavItem[] = [
  { id: "company", label: "회사소개", href: "#company" },
  { id: "business", label: "사업영역", href: "#business" },
  { id: "technology", label: "기술역량", href: "#technology" },
  { id: "process-quality", label: "공정·품질", href: "#process-quality" },
  { id: "facilities", label: "설비·인프라", href: "#facilities" },
  { id: "location", label: "오시는 길", href: "#location" },
];

export const hero = {
  eyebrow: "Precision in Every Process",
  title: "정밀한 기술로\n내일의 가치를 만듭니다",
  description: "대광테크는 정밀가공 기술을 기반으로\n고객의 신뢰와 함께 성장합니다.",
  scrollHint: "SCROLL TO DISCOVER",
};

export const heroStats: HeroStat[] = [
  { label: "설립연도", value: "1998", caption: "Since", icon: "building", source: "lockedBrief" },
  { label: "생산설비", value: "120+", caption: "Units", icon: "machine", source: "lockedBrief" },
  { label: "주요거래처", value: "250+", caption: "Partners", icon: "partner", source: "lockedBrief" },
  { label: "품질보증", value: "100%", caption: "Quality", icon: "quality", source: "lockedBrief" },
];

export const mobileQuickNav = navItems.map((item) => ({ label: item.label, href: item.href }));

export const businessAreas: ImageCard[] = [
  {
    title: "정밀가공부품",
    description: "도면과 소재 조건을 기준으로 검토하는 CNC 선반 가공 대응",
    image: assets.businessPrecision,
    alt: "대광테크 정밀가공부품",
  },
  {
    title: "금형 및 지그",
    description: "형상과 체결 조건을 확인해 검토하는 산업 부품 제작 대응",
    image: assets.businessJig,
    alt: "대광테크 금형 및 지그",
  },
  {
    title: "자동화 설비 부품",
    description: "원통형 부품, 나사산 부품 등 복합 형상 검토",
    image: assets.businessAutomation,
    alt: "대광테크 자동화 설비 부품",
  },
  {
    title: "항공·방산 부품",
    description: "정밀도와 공정 검토가 필요한 부품 제작 대응",
    image: assets.businessDefense,
    alt: "대광테크 항공·방산 부품",
  },
];

export const liveProducts: ImageCard[] = [
  {
    title: "CNC 정밀 샤프트",
    description: "도면과 소재 조건을 기준으로 검토하는 CNC 선반 샤프트 가공품",
    image: assets.businessPrecision,
    alt: "CNC 정밀 샤프트",
  },
  {
    title: "유압 밸브 스풀",
    description: "유압 밸브 내부 구성에 쓰이는 스풀 형상 정밀 가공품",
    image: "/assets/daekwang/live/product-hydraulic-valve-spool-01.jpg",
    alt: "유압 밸브 스풀",
  },
  {
    title: "유압 카트리지 밸브 부품",
    description: "카트리지 밸브 구성 부품의 형상과 공차 조건을 기준으로 한 가공 대응",
    image: assets.businessJig,
    alt: "유압 카트리지 밸브 부품",
  },
  {
    title: "유압 밸브 슬리브",
    description: "유압 밸브용 슬리브 형상의 금속 부품 가공 대응",
    image: "/assets/daekwang/live/product-hydraulic-valve-sleeve.jpg",
    alt: "유압 밸브 슬리브",
  },
  {
    title: "정밀 슬리브 가공품",
    description: "소재와 치수 조건을 바탕으로 검토하는 정밀 슬리브 가공품",
    image: assets.businessDefense,
    alt: "정밀 슬리브 가공품",
  },
  {
    title: "유압 피팅·어댑터",
    description: "유압 계통 연결 부품의 형상과 체결 조건을 확인해 검토하는 가공품",
    image: assets.businessAutomation,
    alt: "유압 피팅·어댑터",
  },
];

export const companyOverview = [
  ["회사명", companyInfo.nameKo],
  ["영문명", companyInfo.nameEn],
  ["주소", companyInfo.address],
  ["담당", companyInfo.contactPerson],
  ["대표", companyInfo.representative],
  ["사업자번호", companyInfo.businessNumber],
  ["설립일", companyInfo.establishedAt],
  ["주요 사업", "자동차·유압·전자부품, CNC 자동선반"],
];

export const values: FeatureItem[] = [
  { title: "신뢰", body: "사양 확인부터 출하까지 일관된 제조 흐름을 유지합니다." },
  { title: "정밀", body: "도면과 소재 조건을 기준으로 가공 가능 범위를 검토합니다." },
  { title: "품질", body: "출하 전 품질 확인을 중심에 둔 대응 체계를 운영합니다." },
  { title: "지속성장", body: "자동차·유압·전자부품 가공 대응력을 축적합니다." },
];

export const timeline = [
  ["1998", "설립연도", "제공 시안 기준"],
  ["현재", "CNC 자동선반 기반 제조", "정밀 금속 부품 가공 대응"],
  ["현재", "자동차·유압·전자부품 대응", "주요 제품군 중심 운영"],
  ["현재", "사양 확인·가공·검사·출하", "제조 흐름 기반 품질 확인"],
];

export const capabilities: FeatureItem[] = [
  { title: "고정밀 가공 대응", body: "CNC Swiss Turning Lathe 기반의 소형 정밀 금속 부품 가공 대응", meta: "CNC" },
  { title: "도면 기반 맞춤 제작", body: "도면, 용도, 소재 정보를 기준으로 가공 가능 범위와 공정 흐름 검토", meta: "DWG" },
  { title: "복합 형상 대응", body: "원통형 부품, 나사산 부품 등 복합 형상 검토", meta: "Ø" },
  { title: "납기·품질 중심 운영", body: "사양 확인부터 가공, 세척, 검사, 출하까지 이어지는 흐름 관리", meta: "QC" },
];

export const processSteps = ["도면 검토", "가공 계획", "CNC 가공", "세척·검사", "출하 관리"];

export const qualityItems: FeatureItem[] = [
  { title: "도면 기반 검토", body: "가공 조건과 소재 정보를 먼저 확인합니다." },
  { title: "공정 흐름 관리", body: "가공, 세척, 검사, 출하 흐름을 정리합니다." },
  { title: "출하 전 품질 확인", body: "주요 요구 조건을 출하 전 확인합니다." },
  { title: "기록 기반 대응", body: "제품 조건과 공정 이력을 기준으로 대응합니다." },
];

export const facilities: ImageCard[] = [
  {
    title: "CNC 자동선반",
    description: "소형 정밀 금속 부품 가공 대응",
    image: assets.heroMachine,
    alt: "대광테크 CNC 자동선반 관련 가공품",
  },
  {
    title: "제품별 공정 대응",
    description: "자동차·유압·전자부품별 조건 검토",
    image: "/assets/daekwang/live/product-hydraulic-valve-spool-02.jpg",
    alt: "대광테크 제품별 공정 대응",
  },
  {
    title: "검사·출하 흐름",
    description: "사양 확인 후 출하 전 품질 확인",
    image: assets.processHero,
    alt: "대광테크 검사 출하 흐름",
  },
];

export const locationInfo = [
  ["주소", companyInfo.address],
  ["TEL", companyInfo.tel],
  ["FAX", companyInfo.fax],
  ["Mobile", companyInfo.mobile],
  ["E-mail", companyInfo.email],
  ["담당", companyInfo.contactPerson],
];
