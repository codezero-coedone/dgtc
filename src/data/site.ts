export const imagePaths = {
  hero: {
    main: "/images/hero/hero-main.jpg",
  },
  products: [
    "/images/products/product-01.jpg",
    "/images/products/product-02.jpg",
    "/images/products/product-03.jpg",
    "/images/products/product-04.jpg",
    "/images/products/product-05.jpg",
    "/images/products/product-06.jpg",
    "/images/products/product-07.jpg",
    "/images/products/product-08.jpg",
  ],
  company: [
    "/images/company/company-01.jpg",
    "/images/company/company-02.jpg",
    "/images/company/company-03.jpg",
    "/images/company/company-04.jpg",
    "/images/company/company-05.jpg",
    "/images/company/company-06.jpg",
  ],
  equipment: [
    "/images/equipment/equipment-01.jpg",
    "/images/equipment/equipment-02.jpg",
    "/images/equipment/equipment-03.jpg",
    "/images/equipment/equipment-04.jpg",
  ],
} as const;

export const site = {
  company: {
    nameKo: "대광테크",
    nameEn: "DAE KWANG TECH",
    tagline: "CNC 자동선반 기반 정밀 부품 가공",
    positioning: "CNC 자동선반 기반 자동차·유압·전자부품 전문 가공업체",
    description:
      "대광테크는 CNC 자동선반 기반으로 자동차부품, 유압부품, 전자부품 분야의 정밀 가공을 수행합니다.",
    summary:
      "대광테크는 도면과 사양을 기준으로 자동차·유압·전자부품에 필요한 소형 정밀 금속 부품을 안정적으로 가공합니다.",
    manager: {
      department: "품질팀",
      title: "부장",
      name: "이원근",
    },
  },

  media: {
    heroVideo: "/videos/daekwang-hero.mp4",
    heroPoster: imagePaths.hero.main,
    heroPosterFallback: imagePaths.hero.main,
  },

  nav: [
    { label: "회사소개", href: "#/company" },
    { label: "제품소개", href: "#/products" },
    { label: "기술역량", href: "#/capability" },
    { label: "보유장비", href: "#/quality" },
    { label: "자료실", href: "#/gallery" },
    { label: "고객지원", href: "#/support" },
  ],

  quickLinks: [
    {
      title: "회사소개",
      desc: "대광테크의 비전과 인사말을 소개합니다.",
      href: "#/company",
      icon: "company",
    },
    {
      title: "제품소개",
      desc: "자동차부품, 유압부품, 전자부품 가공 대응 범위를 확인하실 수 있습니다.",
      href: "#/products",
      icon: "products",
    },
    {
      title: "보유장비",
      desc: "CNC 자동선반 기반 가공 역량과 공정 흐름을 확인하실 수 있습니다.",
      href: "#/quality",
      icon: "equipment",
    },
    {
      title: "고객지원",
      desc: "제품 문의와 방문 안내 정보를 확인하실 수 있습니다.",
      href: "#/support",
      icon: "support",
    },
  ],

  products: [
    { name: "CNC 정밀 샤프트", desc: "도면과 소재 조건을 기준으로 검토하는 CNC 선반 샤프트 가공품", imageKey: "cnc-precision-shaft-01", image: imagePaths.products[0] },
    { name: "유압 밸브 스풀", desc: "유압 밸브 내부 구성에 쓰이는 스풀 형상 정밀 가공품", imageKey: "hydraulic-valve-spool-02", image: imagePaths.products[1] },
    { name: "유압 카트리지 밸브 부품", desc: "카트리지 밸브 구성 부품의 형상과 공차 조건을 기준으로 한 가공 대응", imageKey: "hydraulic-cartridge-valve-part", image: imagePaths.products[2] },
    { name: "유압 밸브 스풀", desc: "사양과 치수 조건을 확인해 검토하는 유압 밸브 스풀 가공품", imageKey: "hydraulic-valve-spool-04", image: imagePaths.products[3] },
    { name: "유압 밸브 슬리브", desc: "유압 밸브용 슬리브 형상의 금속 부품 가공 상담", imageKey: "hydraulic-valve-sleeve", image: imagePaths.products[4] },
    { name: "정밀 슬리브 가공품", desc: "소재, 치수, 수량 조건을 바탕으로 검토하는 정밀 슬리브 가공품", imageKey: "precision-sleeve-machined-part", image: imagePaths.products[5] },
    { name: "CNC 정밀 샤프트", desc: "원통형 샤프트류 부품의 도면 기반 CNC 정밀 가공 상담", imageKey: "cnc-precision-shaft-07", image: imagePaths.products[6] },
    { name: "유압 피팅·어댑터", desc: "유압 계통 연결 부품의 형상과 체결 조건을 확인해 검토하는 가공품", imageKey: "hydraulic-fitting-adapter", image: imagePaths.products[7] },
  ],

  capabilities: [
    { title: "정밀 선반 가공", desc: "CNC Swiss Turning Lathe 기반의 소형 정밀 금속 부품 가공 대응" },
    { title: "복합 형상 대응", desc: "자동차·유압·전자부품에 필요한 원통형 부품, 나사산 부품 등 복합 형상 검토" },
    { title: "도면 기반 사양 검토", desc: "도면, 용도, 수량 정보를 기준으로 가공 가능 범위와 공정 흐름 검토" },
    { title: "출하 전 품질 확인", desc: "사양 확인부터 가공, 세척, 검사, 출하까지 이어지는 제조 흐름 관리" },
  ],

  process: ["사양 확인", "가공", "세척", "검사", "출하"],

  equipment: {
    model: "XDI 26/32",
    type: "CNC Swiss Turning Lathe",
    title: "보유장비 기반 정밀 선반 가공 역량",
    purpose: "자동차·유압·전자부품용 소형 정밀 금속 부품 가공 대응",
    description:
      "CNC Swiss Turning Lathe 기반으로 복잡 형상 소형 금속 부품의 반복 가공과 도면 기반 상담을 진행할 수 있는 제조 대응력을 보여줍니다.",
    images: [
      { label: "정밀 선반 가공 장비", image: imagePaths.equipment[0] },
      { label: "CNC Swiss Turning Lathe 세부", image: imagePaths.equipment[1] },
      { label: "자동선반 장비 외관", image: imagePaths.equipment[2] },
      { label: "장비 작업 영역", image: imagePaths.equipment[3] },
    ],
    highlights: ["복잡 형상 부품", "동시 가공", "배면 가공", "도면 기반 대응"],
    specs: [
      { name: "NC", value: "Fanuc 31i-B" },
      { name: "최대가공경", value: "Ø26/32mm" },
      { name: "Z1 스트로크", value: "350mm(H), 100mm(N)" },
      { name: "메인스핀들 회전수", value: "8,000rpm" },
      { name: "메인스핀들 최대출력", value: "2.2/5.5kW" },
    ],
    marketFit: [
      "자동차·유압·전자부품 정밀 가공 상담",
      "원통형·나사산·복합 형상 부품 대응 검토",
      "다품종 소량 및 도면 기반 상담 설득력",
      "실제 장비 기반 제조 신뢰도 강화",
    ],
  },

  gallery: {
    products: [
      { label: "CNC 정밀 샤프트", image: imagePaths.products[0] },
      { label: "유압 밸브 스풀", image: imagePaths.products[1] },
      { label: "유압 카트리지 밸브 부품", image: imagePaths.products[2] },
      { label: "유압 밸브 스풀", image: imagePaths.products[3] },
      { label: "유압 밸브 슬리브", image: imagePaths.products[4] },
      { label: "정밀 슬리브 가공품", image: imagePaths.products[5] },
      { label: "CNC 정밀 샤프트", image: imagePaths.products[6] },
      { label: "유압 피팅·어댑터", image: imagePaths.products[7] },
    ],
    equipment: [
      { label: "정밀 선반 가공 장비", image: imagePaths.equipment[0] },
      { label: "CNC Swiss Turning Lathe 세부", image: imagePaths.equipment[1] },
      { label: "자동선반 장비 외관", image: imagePaths.equipment[2] },
      { label: "장비 작업 영역", image: imagePaths.equipment[3] },
    ],
    company: [
      { label: "회사 외관", image: imagePaths.company[0] },
      { label: "작업장", image: imagePaths.company[1] },
      { label: "설비", image: imagePaths.company[2] },
      { label: "제품 보관", image: imagePaths.company[3] },
      { label: "검사 장비", image: imagePaths.company[4] },
      { label: "제조 현장", image: imagePaths.company[5] },
    ],
  },

  contact: {
    title: "고객지원",
    subtitle: "자동차·유압·전자부품 가공 문의는 도면, 수량, 소재 정보를 함께 전달해 주세요.",
    managerLabel: "품질팀 / 부장 이원근",
    address: "경남 김해시 한림면 신천산단로 52",
    tel: "055-323-7157",
    telHref: "tel:055-323-7157",
    fax: "055-314-5430",
    mobile: "010-9256-7475",
    mobileHref: "tel:010-9256-7475",
    email: "ndh7157@hanmail.net",
    emailHref: "mailto:ndh7157@hanmail.net",
    formTitle: "제품 문의",
    formSubtitle: "자동차부품, 유압부품, 전자부품 또는 CNC 자동선반 가공 문의 내용을 남겨주세요.",
  },

  pages: {
    company: {
      eyebrow: "Company",
      title: "CNC 자동선반 기반 정밀 부품 가공업체입니다.",
      lead: "대광테크는 정밀 가공과 제조 단계별 확인을 바탕으로 자동차·유압·전자부품 분야의 고객 요구에 대응합니다.",
      blocks: [
        { title: "사업 영역", desc: "자동차부품, 유압부품, 전자부품과 CNC 자동선반 기반 소형 정밀 가공품을 중심으로 대응합니다." },
        { title: "운영 기준", desc: "사양 확인, 가공, 세척, 검사, 포장, 출하 흐름을 기준으로 안정적인 품질 관리를 지향합니다." },
        { title: "고객 대응", desc: "제품 사양, 도면, 수량 정보를 기준으로 적용 가능 품목과 제조 대응 범위를 확인합니다." },
      ],
    },
    products: {
      eyebrow: "Product Catalog",
      title: "자동차·유압·전자부품 가공 카탈로그",
      lead: "자동차부품, 유압부품, 전자부품과 CNC 자동선반 가공 대응 범위를 한눈에 확인하실 수 있도록 정리했습니다.",
      blocks: [
        { title: "자동차부품", desc: "차량용 소형 금속 부품의 도면 기반 가공 가능 범위를 확인합니다." },
        { title: "유압·전자부품", desc: "유압 계통 부품과 전자부품 정밀 가공 상담 범위를 확인합니다." },
        { title: "주문형 가공", desc: "도면과 사양에 따른 맞춤형 가공 가능 여부를 확인합니다." },
      ],
    },
    capability: {
      eyebrow: "Technical Capability",
      title: "장비 기반 정밀 선반 가공과 도면 대응 역량",
      lead: "대광테크의 기술 정보는 CNC 자동선반 보유장비와 제조 과정에서 확인 가능한 대응 항목을 중심으로 정리합니다.",
      blocks: [
        { title: "정밀 선반 가공", desc: "자동차·유압·전자부품에 필요한 치수, 형상, 체결부 특성을 고려한 CNC 선반 가공 대응." },
        { title: "도면 기반 검토", desc: "제품 용도, 도면, 수량, 적용 위치를 기준으로 대응 가능 범위를 확인." },
        { title: "출하 전 확인", desc: "사양 확인부터 검사까지 단계별 확인을 통해 납품 안정성을 높이는 흐름." },
      ],
    },
    quality: {
      eyebrow: "Facility & Quality",
      title: "보유장비 및 가공 공정",
      lead: "대광테크의 보유장비와 공정 흐름, 출하 전 확인 기준을 중심으로 제조 대응 역량을 안내합니다.",
      blocks: [
        { title: "사양 확인", desc: "도면, 용도, 수량, 적용 위치를 기준으로 가공 대응 범위를 확인합니다." },
        { title: "정밀 가공", desc: "요구 사양에 맞춰 소형 금속 부품 형상과 치수를 가공합니다." },
        { title: "검사 및 출하", desc: "외관, 치수, 구성 상태를 출하 전 기준으로 확인합니다." },
      ],
    },
    gallery: {
      eyebrow: "Reference",
      title: "제품·보유장비 자료실",
      lead: "제품과 보유장비 관련 자료를 순차적으로 정리하여 제조 대응 범위를 확인하실 수 있도록 구성했습니다.",
      blocks: [
        { title: "제품 사진", desc: "자동차부품, 유압부품, 전자부품, 주문형 가공품의 대표 사진 영역." },
        { title: "보유장비 사진", desc: "CNC 자동선반 등 제조 환경과 가공 역량을 보여주는 자료 영역." },
        { title: "자료 확장", desc: "카탈로그, 도면 문의 안내, 적용 사례 자료로 확장 가능한 영역." },
      ],
    },
    support: {
      eyebrow: "Support",
      title: "고객지원",
      lead: "제품 문의, 방문 주소, 담당자 연락 정보를 한 화면에서 확인할 수 있도록 구성했습니다.",
      blocks: [
        { title: "주소 정보", desc: "경남 김해시 한림면 신천산단로 52." },
        { title: "담당자", desc: "품질팀 / 부장 이원근." },
        { title: "연락 정보", desc: "TEL, FAX, Mobile, E-mail 정보를 제공합니다." },
      ],
    },
  },
};

export type Product = (typeof site.products)[number];
export type QuickLink = (typeof site.quickLinks)[number];
export type PageKey = keyof typeof site.pages;
