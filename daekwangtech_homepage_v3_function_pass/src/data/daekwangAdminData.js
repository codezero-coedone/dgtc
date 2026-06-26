export const categoryLabels = {
  mainBanner: "메인 배너",
  company: "회사소개",
  facility: "설비 이미지",
  product: "제품 이미지",
};

export const adminSectionOptions = [
  { key: "dashboard", label: "대시보드", icon: "Home" },
  { key: "images", label: "이미지 관리", icon: "Image", group: "콘텐츠 관리" },
  { key: "notices", label: "공지사항 관리", icon: "Megaphone", group: "콘텐츠 관리" },
  { key: "pages", label: "페이지 관리", icon: "File", group: "콘텐츠 관리" },
  { key: "popups", label: "팝업 관리", icon: "Popup", group: "콘텐츠 관리" },
  { key: "menus", label: "메뉴 관리", icon: "Menu", group: "사이트 관리" },
  { key: "footer", label: "푸터 관리", icon: "Footer", group: "사이트 관리" },
  { key: "settings", label: "기본 설정", icon: "Settings", group: "사이트 관리" },
  { key: "seo", label: "SEO 설정", icon: "Seo", group: "사이트 관리" },
  { key: "users", label: "사용자 관리", icon: "Users", group: "시스템 관리" },
  { key: "logs", label: "로그 관리", icon: "Log", group: "시스템 관리" },
  { key: "backups", label: "백업 관리", icon: "Backup", group: "시스템 관리" },
];

export const summaryCards = [
  {
    id: "images",
    label: "총 이미지",
    value: "128",
    unit: "개",
    description: "전체 이미지 파일 수",
    icon: "image",
    color: "blue",
  },
  {
    id: "banners",
    label: "활성 배너",
    value: "8",
    unit: "개",
    description: "메인/서브 배너 수",
    icon: "banner",
    color: "green",
  },
  {
    id: "notices",
    label: "공지사항",
    value: "24",
    unit: "건",
    description: "전체 공지사항 수",
    icon: "notice",
    color: "purple",
  },
  {
    id: "recent",
    label: "최근 수정",
    value: "5",
    unit: "건",
    description: "최근 7일 내 수정",
    icon: "clock",
    color: "orange",
  },
];

export const imageAssets = [
  {
    id: "banner-01",
    category: "mainBanner",
    title: "메인 배너 01",
    fileName: "main-banner-01.jpg",
    fileSize: "2.4MB",
    resolution: "1920 x 800",
    uploadDate: "2024-05-20",
    status: "active",
    imageUrl: "assets/hero-machine.jpg",
    order: 1,
  },
  {
    id: "banner-02",
    category: "mainBanner",
    title: "메인 배너 02",
    fileName: "main-banner-02.jpg",
    fileSize: "2.1MB",
    resolution: "1920 x 800",
    uploadDate: "2024-05-18",
    status: "active",
    imageUrl: "assets/facility-cnc.jpg",
    order: 2,
  },
  {
    id: "banner-03",
    category: "mainBanner",
    title: "메인 배너 03",
    fileName: "main-banner-03.jpg",
    fileSize: "1.9MB",
    resolution: "1920 x 800",
    uploadDate: "2024-05-15",
    status: "active",
    imageUrl: "assets/facility-clean.jpg",
    order: 3,
  },
  {
    id: "banner-04",
    category: "mainBanner",
    title: "메인 배너 04",
    fileName: "main-banner-04.jpg",
    fileSize: "2.7MB",
    resolution: "1920 x 800",
    uploadDate: "2024-05-12",
    status: "active",
    imageUrl: "assets/inspection-cmm.jpg",
    order: 4,
  },
  {
    id: "company-01",
    category: "company",
    title: "회사소개 대표 이미지",
    fileName: "company-intro.jpg",
    fileSize: "1.8MB",
    resolution: "1440 x 720",
    uploadDate: "2024-05-10",
    status: "active",
    imageUrl: "assets/facility-auto.jpg",
    order: 1,
  },
  {
    id: "facility-01",
    category: "facility",
    title: "CNC 설비 이미지",
    fileName: "facility-cnc.jpg",
    fileSize: "2.0MB",
    resolution: "1440 x 720",
    uploadDate: "2024-05-08",
    status: "active",
    imageUrl: "assets/facility-lab.jpg",
    order: 1,
  },
  {
    id: "product-01",
    category: "product",
    title: "정밀 부품 이미지",
    fileName: "precision-product.jpg",
    fileSize: "1.4MB",
    resolution: "1200 x 900",
    uploadDate: "2024-05-05",
    status: "inactive",
    imageUrl: "assets/product-1.jpg",
    order: 1,
  },
];

export const notices = [
  {
    id: 24,
    title: "대광테크 홈페이지 리뉴얼 오픈 안내",
    status: "visible",
    publishDate: "2024-05-20",
    createdAt: "2024-05-20 14:30",
    updatedAt: "2024-05-20 14:30",
    category: "공지",
    isPinned: true,
    author: "대광테크",
    viewCount: 128,
    content: "대광테크 홈페이지가 새롭게 리뉴얼되었습니다.\n\n정밀가공, 설비 인프라, 품질관리 정보를 더 명확하게 확인하실 수 있도록 화면과 콘텐츠 구조를 정비했습니다.",
  },
  {
    id: 23,
    title: "2024년 하계 휴가 일정 안내",
    status: "visible",
    publishDate: "2024-05-10",
    createdAt: "2024-05-10 09:15",
    updatedAt: "2024-05-10 09:15",
    category: "휴무",
    isPinned: false,
    author: "대광테크",
    viewCount: 92,
    content: "2024년 하계 휴가 일정을 안내드립니다.\n\n방문 및 업무 일정 확인이 필요한 경우 사전 일정을 확인해 주시기 바랍니다.",
  },
  {
    id: 22,
    title: "ISO 45001 인증 획득 안내",
    status: "visible",
    publishDate: "2024-04-25",
    createdAt: "2024-04-25 11:20",
    updatedAt: "2024-04-25 11:20",
    category: "인증",
    isPinned: false,
    author: "대광테크",
    viewCount: 76,
    content: "대광테크가 ISO 45001 인증을 획득했습니다.\n\n안전한 작업 환경과 체계적인 운영 기준을 바탕으로 안정적인 제조 역량을 유지하겠습니다.",
  },
  {
    id: 21,
    title: "설비 증설에 따른 생산 능력 확대 안내",
    status: "visible",
    publishDate: "2024-04-18",
    createdAt: "2024-04-18 16:45",
    updatedAt: "2024-04-18 16:45",
    category: "설비",
    isPinned: false,
    author: "대광테크",
    viewCount: 61,
    content: "설비 증설로 생산 대응력을 확대했습니다.\n\n정밀 부품 생산과 검사 대응 범위를 안정적으로 확장해 품질 중심 운영을 이어가겠습니다.",
  },
  {
    id: 20,
    title: "대광테크 2023년 연간 보고서 발간",
    status: "visible",
    publishDate: "2024-04-01",
    createdAt: "2024-04-01 10:10",
    updatedAt: "2024-04-01 10:10",
    category: "공지",
    isPinned: false,
    author: "대광테크",
    viewCount: 55,
    content: "2023년 연간 보고서가 발간되었습니다.\n\n주요 운영 현황과 생산 역량 개선 내용을 정리한 자료입니다.",
  },
];

export const noticeCtaSettings = {
  enabled: true,
  position: "bottom",
  style: "navyOutline",
  title: "대광테크 주요 소식 확인",
  description: "품질, 설비, 운영 관련 안내를 공지사항에서 확인하실 수 있습니다.",
  buttonLabel: "전체 공지사항 보기",
  buttonUrl: "#/notice",
};

export const activityLogs = [
  {
    id: "activity-01",
    type: "imageUpload",
    title: "이미지 업로드",
    description: "메인 배너 01 이미지가 업로드 되었습니다.",
    time: "14:30",
    user: "관리자",
  },
  {
    id: "activity-02",
    type: "noticeCreate",
    title: "공지사항 등록",
    description: "새 공지 '홈페이지 리뉴얼 오픈 안내'가 등록되었습니다.",
    time: "14:28",
    user: "관리자",
  },
  {
    id: "activity-03",
    type: "noticeEdit",
    title: "공지사항 수정",
    description: "공지 'ISO 45001 인증 획득 안내'가 수정되었습니다.",
    time: "11:20",
    user: "관리자",
  },
  {
    id: "activity-04",
    type: "imageReplace",
    title: "이미지 교체",
    description: "회사소개 이미지가 교체되었습니다.",
    time: "10:15",
    user: "관리자",
  },
  {
    id: "activity-05",
    type: "login",
    title: "사용자 로그인",
    description: "관리자(admin)가 로그인했습니다.",
    time: "09:02",
    user: "관리자",
  },
];

export const initialNoticeDraft = {
  title: "",
  publishDate: "2024-05-20",
  visible: true,
  category: "공지",
  isPinned: false,
  content: "",
};

export const pageItems = [
  { id: "page-home", name: "메인", path: "/", status: "visible", lastModified: "2026-06-26 10:10", seoTitle: "대광테크", description: "대광테크 대표 화면", sections: ["Hero", "회사소개", "제품", "설비", "위치"] },
  { id: "page-about", name: "회사소개", path: "/about", status: "visible", lastModified: "2026-06-25 18:20", seoTitle: "대광테크 회사소개", description: "회사 개요와 신뢰 정보", sections: ["Hero", "회사소개"] },
  { id: "page-business", name: "사업분야", path: "/business", status: "visible", lastModified: "2026-06-24 14:00", seoTitle: "대광테크 사업분야", description: "주요 사업영역 안내", sections: ["Hero", "제품"] },
  { id: "page-facility", name: "설비현황", path: "/facility", status: "visible", lastModified: "2026-06-22 09:30", seoTitle: "대광테크 설비현황", description: "생산 설비와 인프라", sections: ["Hero", "설비"] },
  { id: "page-products", name: "제품소개", path: "/products", status: "visible", lastModified: "2026-06-21 16:40", seoTitle: "대광테크 제품소개", description: "대표 제품군 관리", sections: ["Hero", "제품"] },
  { id: "page-portfolio", name: "포트폴리오", path: "/portfolio", status: "hidden", lastModified: "2026-06-20 11:15", seoTitle: "대광테크 포트폴리오", description: "프로젝트 사례", sections: ["포트폴리오"] },
  { id: "page-location", name: "오시는 길", path: "/location", status: "visible", lastModified: "2026-06-19 13:25", seoTitle: "대광테크 오시는 길", description: "사업장 위치 정보", sections: ["위치"] },
];

export const popupItems = [
  {
    id: "popup-renewal",
    title: "홈페이지 리뉴얼 안내",
    placement: "메인",
    startDate: "2026-06-20",
    endDate: "2026-07-05",
    status: "active",
    linkUrl: "/notice/24",
    imageUrl: "assets/hero-machine.jpg",
    content: "새롭게 정비된 대광테크 홈페이지를 확인해 주세요.",
  },
  {
    id: "popup-vacation",
    title: "하계 휴가 일정",
    placement: "메인",
    startDate: "2026-07-20",
    endDate: "2026-08-05",
    status: "inactive",
    linkUrl: "/notice/23",
    imageUrl: "assets/facility-clean.jpg",
    content: "방문 전 운영 일정을 확인해 주세요.",
  },
];

export const menuItems = [
  { id: "menu-about", name: "회사소개", path: "/about", order: 1, status: "visible" },
  { id: "menu-business", name: "사업분야", path: "/business", order: 2, status: "visible" },
  { id: "menu-facility", name: "설비현황", path: "/facility", order: 3, status: "visible" },
  { id: "menu-products", name: "제품소개", path: "/products", order: 4, status: "visible" },
  { id: "menu-portfolio", name: "포트폴리오", path: "/portfolio", order: 5, status: "hidden" },
  { id: "menu-notice", name: "공지사항", path: "/notice", order: 6, status: "visible" },
  { id: "menu-location", name: "오시는 길", path: "/location", order: 7, status: "visible" },
];

export const footerInfo = {
  companyName: "대광테크",
  representative: "홍길동",
  businessNumber: "000-00-00000",
  address: "경상남도 김해시 ...",
  tel: "055-000-0000",
  email: "admin@daekwang.co.kr",
  copyright: "© DAE KWANG TECH. All rights reserved.",
};

export const siteSettings = {
  siteName: "대광테크",
  adminEmail: "admin@daekwang.co.kr",
  contactNumber: "055-000-0000",
  language: "ko",
  maintenanceMode: false,
  publicStatus: true,
};

export const seoSettings = {
  metaTitle: "대광테크 | 정밀 제조·산업 설비 전문기업",
  metaDescription: "대광테크는 정밀 제조와 산업 설비 분야의 신뢰 기반 B2B 제조 기업입니다.",
  keywords: "대광테크, 제조업, 정밀가공, 산업설비",
  ogImage: "/og-daekwang.jpg",
  robots: "index,follow",
};

export const adminUsers = [
  { id: "user-owner", name: "최고관리자", email: "admin@daekwang.co.kr", role: "owner", status: "active", lastLogin: "2026-06-26 09:02" },
  { id: "user-editor", name: "콘텐츠 관리자", email: "content@daekwang.co.kr", role: "editor", status: "active", lastLogin: "2026-06-25 17:30" },
  { id: "user-viewer", name: "읽기 전용", email: "viewer@daekwang.co.kr", role: "viewer", status: "inactive", lastLogin: "2026-06-20 12:11" },
];

export const logItems = [
  { id: "log-01", time: "2026-06-26 09:02", user: "관리자", action: "로그인", target: "관리자 콘솔", status: "success", type: "login" },
  { id: "log-02", time: "2026-06-26 10:00", user: "관리자", action: "이미지 업로드", target: "메인 배너 01", status: "success", type: "imageUpload" },
  { id: "log-03", time: "2026-06-25 17:30", user: "콘텐츠 관리자", action: "공지사항 수정", target: "ISO 45001 인증 획득 안내", status: "success", type: "noticeEdit" },
  { id: "log-04", time: "2026-06-24 14:20", user: "관리자", action: "페이지 저장", target: "사업분야", status: "success", type: "pageSave" },
  { id: "log-05", time: "2026-06-23 11:05", user: "관리자", action: "백업 생성", target: "사이트 데이터", status: "success", type: "backup" },
];

export const backupItems = [
  { id: "backup-20260626", fileName: "backup_2026_06_26.zip", createdAt: "2026-06-26 10:00", fileSize: "24.8MB", status: "success" },
  { id: "backup-20260620", fileName: "backup_2026_06_20.zip", createdAt: "2026-06-20 10:00", fileSize: "23.9MB", status: "success" },
  { id: "backup-20260613", fileName: "backup_2026_06_13.zip", createdAt: "2026-06-13 10:00", fileSize: "23.1MB", status: "success" },
];
