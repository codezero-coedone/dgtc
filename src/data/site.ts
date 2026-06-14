export const site = {
  company: {
    nameKo: "대광테크",
    nameEn: "DAEKWANG TECH",
    tagline: "정밀한 기술, 신뢰의 가치",
    description:
      "대광테크는 자동차 유압 시스템에 필요한 부품과 장비를 정밀하게 제조하여 고객의 요구에 최적의 품질과 서비스를 제공합니다.",
    summary:
      "대광테크는 자동차 유압부품 제조 분야에서 축적된 경험과 기술을 바탕으로 고객이 신뢰할 수 있는 품질과 안정적인 공급을 실현하기 위해 노력하고 있습니다.",
  },

  media: {
    heroVideo: "/KakaoTalk_20260614_172146925.mp4",
    heroPosterFallback: "/products/hydraulic-fitting-machined-block.jpg",
  },

  nav: [
    { label: "회사소개", href: "#/company" },
    { label: "제품소개", href: "#/products" },
    { label: "기술역량", href: "#/capability" },
    { label: "운용장비", href: "#/quality" },
    { label: "자료실", href: "#/gallery" },
    { label: "찾아오시는 길", href: "#/support" },
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
      desc: "다양한 자동차 유압부품과 장비를 확인하실 수 있습니다.",
      href: "#/products",
      icon: "products",
    },
    {
      title: "운용장비",
      desc: "CNC 자동선반 기반 가공 역량과 공정 흐름을 확인하실 수 있습니다.",
      href: "#/quality",
      icon: "equipment",
    },
    {
      title: "찾아오시는 길",
      desc: "공장 위치와 방문 안내 정보를 확인하실 수 있습니다.",
      href: "#/support",
      icon: "support",
    },
  ],

  products: [
    { name: "유압 피팅", desc: "유압 라인 연결을 위한 정밀 가공 부품", imageKey: "fitting", image: "/products/hydraulic-fitting-machined-block.jpg" },
    { name: "유압 밸브", desc: "유량과 압력 제어를 위한 유압 부품", imageKey: "valve", image: "/products/hydraulic-valve-cartridge.jpg" },
    { name: "유압 호스 / 라인", desc: "자동차 유압 시스템용 호스 및 라인 부품", imageKey: "hose" },
    { name: "유압 실린더", desc: "구동 장치와 장비에 적용되는 유압 실린더", imageKey: "cylinder", image: "/products/machined-shaft-pin.jpg" },
    { name: "유압 장비", desc: "현장 요구에 맞춘 유압 장비 및 구성품", imageKey: "equipment" },
    { name: "주문형 가공 부품", desc: "도면과 사양에 따른 맞춤형 가공 대응", imageKey: "custom", image: "/products/threaded-machined-collar.jpg" },
  ],

  capabilities: [
    { title: "정밀 선반 가공", desc: "CNC Swiss Turning Lathe 기반의 소형 정밀 금속 부품 가공 대응" },
    { title: "복합 형상 대응", desc: "유압 피팅, 밸브류, 원통형 부품, 나사산 부품 등 복잡 형상 확인" },
    { title: "도면 기반 사양 검토", desc: "도면, 용도, 수량 정보를 기준으로 가공 가능 범위와 공정 흐름 검토" },
    { title: "출하 전 품질 확인", desc: "사양 확인부터 가공, 세척, 검사, 출하까지 이어지는 제조 흐름 관리" },
  ],

  process: ["사양 확인", "가공", "세척", "검사", "출하"],

  equipment: {
    model: "XDI 26/32",
    type: "CNC Swiss Turning Lathe",
    title: "보유 장비 기반 정밀 선반 가공 역량",
    purpose: "자동차 유압부품용 소형 정밀 금속 부품 가공 대응",
    description:
      "CNC Swiss Turning Lathe 기반으로 복잡 형상 소형 금속 부품의 반복 가공과 도면 기반 상담을 진행할 수 있는 제조 대응력을 보여줍니다.",
    images: [
      { label: "정밀 선반 가공 장비", image: "/equipment/xdi26-32-main.jpg" },
      { label: "CNC Swiss Turning Lathe reference", image: "/equipment/xdi26-32-detail.jpg" },
      { label: "자동선반 장비 외관", image: "/equipment/xdi26-32-overview.jpg" },
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
      "유압 피팅/밸브류 반복 정밀 가공",
      "원통형·나사산·복합 형상 부품 대응",
      "다품종 소량 및 도면 기반 상담 설득력",
      "실제 장비 기반 제조 신뢰도 강화",
    ],
  },

  gallery: {
    products: [
      { label: "유압 피팅 가공품", image: "/products/hydraulic-fitting-machined-block.jpg" },
      { label: "유압 밸브 카트리지", image: "/products/hydraulic-valve-cartridge.jpg" },
      { label: "원통형 가공 부품", image: "/products/machined-shaft-pin.jpg" },
      { label: "나사산 가공 부품", image: "/products/threaded-machined-collar.jpg" },
      { label: "제품사진 5" },
      { label: "제품사진 6" },
    ],
    equipment: [
      { label: "정밀 선반 가공 장비", image: "/equipment/xdi26-32-main.jpg" },
      { label: "CNC Swiss Turning Lathe reference", image: "/equipment/xdi26-32-detail.jpg" },
      { label: "자동선반 장비 외관", image: "/equipment/xdi26-32-overview.jpg" },
    ],
    company: ["회사 외관", "작업장", "설비", "제품 보관", "검사 장비"],
  },

  contact: {
    title: "찾아오시는 길",
    subtitle: "네이버지도 스크린샷과 실제 주소 정보를 입력할 위치 안내 영역입니다.",
    address: "주소 입력 예정",
    tel: "TEL 입력 예정",
    fax: "FAX 입력 예정",
    email: "E-mail 입력 예정",
  },

  pages: {
    company: {
      eyebrow: "Company",
      title: "자동차 유압부품 제조를 기반으로 신뢰할 수 있는 공급을 지향합니다.",
      lead: "대광테크는 정밀 가공과 제조 단계별 확인을 바탕으로 고객 요구에 맞춘 유압부품과 장비 대응을 진행합니다.",
      blocks: [
        { title: "사업 영역", desc: "자동차 유압 시스템에 필요한 피팅, 밸브, 호스, 실린더, 장비 구성품을 중심으로 대응합니다." },
        { title: "운영 기준", desc: "사양 확인, 가공, 세척, 검사, 포장, 출하 흐름을 기준으로 안정적인 품질 관리를 지향합니다." },
        { title: "고객 대응", desc: "제품 사양, 도면, 수량 정보를 기준으로 적용 가능 품목과 제조 대응 범위를 확인합니다." },
      ],
    },
    products: {
      eyebrow: "Product Catalog",
      title: "자동차 유압부품 및 장비 카탈로그",
      lead: "구매형 상세페이지가 아니라 제품군과 대응 범위를 확인하는 제조업 카탈로그 페이지입니다.",
      blocks: [
        { title: "유압 라인 부품", desc: "피팅, 호스, 라인 부품 등 연결과 이송에 필요한 구성품을 확인합니다." },
        { title: "제어 부품", desc: "유량과 압력 제어를 위한 밸브류와 관련 부품 대응 범위를 확인합니다." },
        { title: "주문형 가공", desc: "도면과 사양에 따른 맞춤형 가공 가능 여부를 확인합니다." },
      ],
    },
    capability: {
      eyebrow: "Technical Capability",
      title: "장비 기반 정밀 선반 가공과 도면 대응 역량",
      lead: "대광테크의 기술 정보는 과장된 인증 표현이 아니라 보유 장비와 제조 과정에서 확인 가능한 대응 항목 중심으로 정리합니다.",
      blocks: [
        { title: "정밀 선반 가공", desc: "유압부품에 필요한 치수, 형상, 체결부 특성을 고려한 CNC 선반 가공 대응." },
        { title: "도면 기반 검토", desc: "제품 용도, 도면, 수량, 적용 위치를 기준으로 대응 가능 범위를 확인." },
        { title: "출하 전 확인", desc: "사양 확인부터 검사까지 단계별 확인을 통해 납품 안정성을 높이는 흐름." },
      ],
    },
    quality: {
      eyebrow: "Facility & Quality",
      title: "운용장비 및 가공 공정",
      lead: "외부 인증 표현을 근거 없이 넣지 않고, 현재 페이지에서는 보유 장비와 공정 흐름, 확인 기준만 제시합니다.",
      blocks: [
        { title: "사양 확인", desc: "도면, 용도, 수량, 적용 위치를 기준으로 가공 대응 범위를 확인합니다." },
        { title: "정밀 가공", desc: "요구 사양에 맞춰 소형 금속 부품 형상과 치수를 가공합니다." },
        { title: "검사 및 출하", desc: "외관, 치수, 구성 상태를 출하 전 기준으로 확인합니다." },
      ],
    },
    gallery: {
      eyebrow: "Reference",
      title: "제품·설비 자료실",
      lead: "실제 사진 교체 전까지는 산업재 fallback 이미지로 영역을 유지하고, 향후 제품 사진과 설비 사진을 교체합니다.",
      blocks: [
        { title: "제품 사진", desc: "유압부품, 장비, 주문형 가공품의 대표 사진 영역." },
        { title: "설비 사진", desc: "CNC 자동선반 등 제조 환경과 가공 역량을 보여주는 자료 영역." },
        { title: "자료 확장", desc: "카탈로그, 도면 문의 안내, 적용 사례 자료로 확장 가능한 영역." },
      ],
    },
    support: {
      eyebrow: "Location",
      title: "찾아오시는 길",
      lead: "네이버지도 스크린샷과 실제 주소 텍스트를 입력할 수 있도록 위치 안내 영역을 열어둡니다.",
      blocks: [
        { title: "지도 이미지", desc: "네이버지도 캡처 이미지를 위치 안내 영역에 교체 입력합니다." },
        { title: "주소 텍스트", desc: "도로명 주소, 지번 주소, 방문 안내 문구를 실제 정보로 입력합니다." },
        { title: "연락 정보", desc: "방문 전 확인 가능한 TEL, FAX, E-mail 정보를 입력합니다." },
      ],
    },
  },
};

export type Product = (typeof site.products)[number];
export type QuickLink = (typeof site.quickLinks)[number];
export type PageKey = keyof typeof site.pages;
