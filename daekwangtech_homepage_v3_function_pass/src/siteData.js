export const navItems = [
  { id: "technology", label: "기술력" },
  { id: "products", label: "제품/서비스" },
  { id: "process", label: "제조 프로세스" },
  { id: "quality", label: "품질 관리" },
  { id: "facility", label: "설비/시설" },
  { id: "company", label: "회사 소개" },
];

export const routeAlias = {
  "": "index",
  "/": "index",
  "#/": "index",
  "#": "index",
  index: "index",
  "index.html": "index",
  technology: "technology",
  "technology.html": "technology",
  products: "products",
  "products.html": "products",
  process: "process",
  "process.html": "process",
  quality: "quality",
  "quality.html": "quality",
  facility: "facility",
  "facility.html": "facility",
  company: "company",
  "company.html": "company",
  admin: "admin",
  "admin.html": "admin",
};

export const imageFallback = "assets/image-fallback.svg";

export const pageContent = {
  index: {
    rail: [
      ["◎", "TECHNOLOGY", "초정밀 가공 기술"],
      ["⬡", "QUALITY", "신뢰를 만드는 품질"],
      ["⚙", "PROCESS", "체계적인 제조 프로세스"],
      ["▥", "FACILITY", "최첨단 설비 인프라"],
      ["✈", "APPLICATION", "다양한 산업 분야 적용"],
    ],
  },
  technology: {
    rail: [
      ["◎", "초정밀", "마이크로 단위 가공"],
      ["⬡", "복합 형상", "복잡한 형상 대응"],
      ["⚙", "소재 대응", "다양한 금속 소재"],
      ["▥", "공차 관리", "안정적 품질 기준"],
      ["✦", "엔지니어링", "도면 기반 검토"],
    ],
    cards: [
      ["고정밀 CNC 가공", "정밀한 치수와 표면 품질을 요구하는 부품 대응", "assets/real-silver-valve-core.jpg"],
      ["복합 형상 대응", "복잡한 형상의 부품과 지그, 장비 부품 제작", "assets/real-black-valve-core.jpg"],
      ["소재별 가공 조건", "알루미늄, 스틸 등 소재 조건에 맞춘 공정 검토", "assets/real-precision-threaded-pair.jpg"],
      ["공차 관리", "측정과 검증을 통한 안정적인 품질 확보", "assets/real-precision-threaded-pair.jpg"],
    ],
    metrics: [["20μm 이하", "가공 정밀도"], ["0.001mm", "최소 공차"], ["50+종", "소재 대응"], ["24h", "샘플 대응"]],
  },
  products: {
    rail: [
      ["◎", "정밀 가공 부품", "고정밀 CNC 가공"],
      ["⬡", "금속 처리", "열처리 및 표면 처리"],
      ["⚙", "지그 & 장비 부품", "생산성 향상 솔루션"],
      ["▥", "프로토타입 & 소량 생산", "신속 제작 및 검증"],
      ["✦", "조립 & 모듈", "가공부터 조립까지"],
    ],
    cards: [
      ["정밀 가공 부품", "고정밀 CNC 가공으로 완성하는 복잡 형상 부품", "assets/real-black-valve-core.jpg"],
      ["금속 처리", "표면 처리 및 열처리 기술로 내구성과 품질 향상", "assets/real-silver-valve-core.jpg"],
      ["지그 & 장비 부품", "생산성과 정밀도를 높이는 맞춤형 지그 및 부품", "assets/real-process-shaft-detail.jpg"],
      ["프로토타입 & 소량 생산", "신속한 제작과 유연한 대응으로 고객 개발 단계 지원", "assets/real-precision-threaded-pair.jpg"],
      ["조립 & 모듈", "가공부터 조립까지 원스톱 솔루션 제공", "assets/real-stepped-shaft-vertical.jpg"],
    ],
    metrics: [["5개", "제품 그룹"], ["50+종", "소재 대응"], ["20μm 이하", "가공 정밀도"], ["0.001mm", "최소 공차"]],
  },
  process: {
    rail: [["01", "요구 분석", "고객 요구와 도면 검토"], ["02", "설계", "가공 전략 수립"], ["03", "가공", "정밀 장비 생산"], ["04", "검사", "품질 검증"], ["05", "출하", "안전한 전달"]],
    process: ["고객 요구 분석", "설계 & 엔지니어링", "정밀 가공", "표면 처리 / 열처리", "검사 & 품질 검증", "조립 / 포장 / 출하"],
    metrics: [["6단계", "표준 프로세스"], ["100%", "검사 흐름"], ["체계화", "공정 관리"], ["기록", "품질 데이터"]],
  },
  quality: {
    rail: [["◎", "CMM", "3차원 측정"], ["⬡", "형상 측정", "고정밀 형상 검사"], ["⚙", "표면 품질", "거칠기 측정"], ["▥", "경도 시험", "소재 특성 확인"], ["✦", "표준화", "품질 기준 운영"]],
    cards: [
      ["3차원 측정기 (CMM)", "정밀 치수 및 형상 측정", "assets/real-precision-threaded-pair.jpg"],
      ["형상 측정기", "고정밀 형상 및 공차 검사", "assets/real-stepped-shaft-vertical.jpg"],
      ["표면 거칠기 측정기", "표면 품질 및 가공기 분석", "assets/real-process-shaft-detail.jpg"],
      ["경도 시험기", "소재 경도 및 열처리 상태 평가", "assets/real-silver-valve-core.jpg"],
    ],
    metrics: [["ISO 9001", "품질경영"], ["ISO 14001", "환경경영"], ["IATF 16949", "자동차 품질"], ["검사", "출하 전 확인"]],
  },
  facility: {
    rail: [["◎", "CNC", "정밀 가공 설비"], ["⬡", "자동화", "생산 효율"], ["⚙", "측정실", "품질 검증"], ["▥", "클린 환경", "청정 생산"], ["✦", "물류", "보관 관리"]],
    cards: [
      ["정밀 가공 설비", "고정밀 CNC / 복합 가공기", "assets/real-hero-batch-components.jpg"],
      ["자동화 시스템", "로봇 자동화 및 무인 운영 시스템", "assets/real-process-shaft-detail.jpg"],
      ["측정 & 검사실", "전용 측정실 및 항온·항습 관리", "assets/real-precision-threaded-pair.jpg"],
      ["클린 생산 환경", "청정하고 체계적인 생산 환경", "assets/real-process-shaft-detail.jpg"],
      ["물류 & 보관 시스템", "체계적인 자재 및 제품 관리", "assets/real-precision-threaded-pair.jpg"],
    ],
    metrics: [["120+", "생산설비"], ["99.9%", "운영 안정성"], ["24h", "생산 대응"], ["통합", "인프라 관리"]],
  },
  company: {
    rail: [["◎", "미션", "정밀 가치 창조"], ["⬡", "비전", "글로벌 파트너"], ["⚙", "핵심 가치", "신뢰·정밀·혁신"], ["▥", "경영 철학", "사람과 기술"], ["✦", "품질 방침", "고객 만족"]],
    cards: [
      ["신뢰", "정직과 책임을 바탕으로 고객의 신뢰를 지켜갑니다.", "assets/real-hero-batch-components.jpg"],
      ["정밀", "마이크로 단위의 정밀함으로 최고의 품질을 만듭니다.", "assets/real-silver-valve-core.jpg"],
      ["혁신", "지속적인 기술 혁신으로 미래를 선도합니다.", "assets/real-black-valve-core.jpg"],
      ["상생", "고객, 협력사와 함께 지속 가능한 성장을 추구합니다.", "assets/real-precision-threaded-pair.jpg"],
    ],
    metrics: [["1998", "설립 연도"], ["200+", "파트너사"], ["1,000+", "프로젝트 수행"], ["25+", "산업 분야"]],
  },
};

export const homeProducts = pageContent.products.cards;
export const qualityCards = pageContent.quality.cards;
export const facilityCards = pageContent.facility.cards;
export const processSteps = pageContent.process.process;
