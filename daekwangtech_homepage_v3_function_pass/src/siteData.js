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
    metrics: [["CNC", "자동선반 기반"], ["도면", "가공 조건 검토"], ["금속", "소형 정밀 부품"], ["기록", "품질 확인"]],
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
      ["자동차부품", "반복 정밀도와 안정성이 중요한 자동차 관련 소형 부품 가공", "assets/real-black-valve-core.jpg"],
      ["유압부품", "압력·체결·밀폐 성능이 중요한 유압 피팅 및 관련 부품 가공", "assets/real-silver-valve-core.jpg"],
      ["전자부품", "소형 정밀도와 균일 품질이 필요한 전자 부품 가공", "assets/real-process-shaft-detail.jpg"],
      ["CNC 자동선반 가공", "CNC Swiss Turning Lathe 기반의 소형 정밀 금속 부품 가공", "assets/real-precision-threaded-pair.jpg"],
      ["정밀 금속 부품", "도면 조건과 소재 특성에 맞춘 반복 생산 대응", "assets/real-stepped-shaft-vertical.jpg"],
    ],
    metrics: [["자동차부품", "취급 품목"], ["유압부품", "취급 품목"], ["전자부품", "취급 품목"], ["CNC", "자동선반 가공"]],
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
    metrics: [["입고", "자재 확인"], ["가공", "치수 확인"], ["검사", "출하 전 확인"], ["기록", "품질 이력"]],
  },
  facility: {
    rail: [["◎", "CNC 자동선반", "정밀 부품 가공"], ["⬡", "XDI26/32", "한화 자동선반 계열"], ["⚙", "Swiss Turning", "소형 금속 부품"], ["▥", "취급 품목", "자동차·유압·전자"], ["✦", "품질 확인", "반복 생산 관리"]],
    cards: [
      ["한화 XDI26/32 CNC 자동선반", "Ø26/Ø32mm급 소형 정밀 부품 가공에 대응하는 CNC 자동선반 설비입니다.", "assets/real-hero-batch-components.jpg"],
      ["CNC Swiss Turning Lathe", "반복 정밀도와 균일 품질이 중요한 소형 금속 부품 가공에 활용됩니다.", "assets/real-process-shaft-detail.jpg"],
      ["자동차부품 가공 설비", "자동차 관련 소형 정밀 부품 생산 흐름에 맞춘 CNC 자동선반 기반 설비입니다.", "assets/real-precision-threaded-pair.jpg"],
      ["유압부품 가공 설비", "압력·체결·밀폐 성능이 중요한 유압 피팅 및 관련 부품 가공에 활용됩니다.", "assets/real-process-shaft-detail.jpg"],
      ["전자부품 가공 설비", "소형 정밀도와 균일 품질이 필요한 전자 부품 가공에 대응합니다.", "assets/real-precision-threaded-pair.jpg"],
    ],
    metrics: [["장비 구분", "CNC 자동선반"], ["모델", "한화 XDI26/32"], ["가공 방식", "CNC Swiss Turning Lathe"], ["적용 분야", "소형 정밀 금속 부품"]],
  },
  company: {
    rail: [["◎", "상호", "대광테크"], ["⬡", "영문명", "DAE KWANG TECH"], ["⚙", "업종", "CNC 자동선반 전문"], ["▥", "담당", "이원근 이사"], ["✦", "주소", "김해 한림면"]],
    cards: [
      ["CNC 자동선반 전문 가공업체", "대광테크는 CNC 자동선반 기반 정밀 부품 가공을 중심으로 운영합니다.", "assets/real-hero-batch-components.jpg"],
      ["자동차부품", "반복 정밀도와 안정성이 중요한 자동차 관련 소형 부품 가공", "assets/real-silver-valve-core.jpg"],
      ["유압부품", "압력·체결·밀폐 성능이 중요한 유압 피팅 및 관련 부품 가공", "assets/real-black-valve-core.jpg"],
      ["전자부품", "소형 정밀도와 균일 품질이 필요한 전자 부품 가공", "assets/real-precision-threaded-pair.jpg"],
    ],
    metrics: [["상호", "대광테크"], ["업종", "CNC 자동선반 전문 가공업체"], ["담당", "이원근 이사"], ["주소", "경남 김해시 한림면"]],
  },
};

export const homeProducts = pageContent.products.cards;
export const qualityCards = pageContent.quality.cards;
export const facilityCards = pageContent.facility.cards;
export const processSteps = pageContent.process.process;
