PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS image_slots (
  slot_id TEXT PRIMARY KEY,
  page TEXT NOT NULL,
  label TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  x REAL NOT NULL CHECK (x >= 0 AND x <= 100),
  y REAL NOT NULL CHECK (y >= 0 AND y <= 100),
  w REAL NOT NULL CHECK (w > 0 AND w <= 100),
  h REAL NOT NULL CHECK (h > 0 AND h <= 100),
  aspect_ratio REAL NOT NULL CHECK (aspect_ratio > 0),
  min_width INTEGER NOT NULL DEFAULT 800 CHECK (min_width >= 320),
  active_version_id TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS image_versions (
  version_id TEXT PRIMARY KEY,
  slot_id TEXT NOT NULL REFERENCES image_slots(slot_id) ON DELETE CASCADE,
  original_key TEXT NOT NULL,
  processed_key TEXT NOT NULL,
  preset TEXT NOT NULL CHECK (preset IN ('natural','product','bright')),
  focal_x REAL NOT NULL DEFAULT 0.5 CHECK (focal_x >= 0 AND focal_x <= 1),
  focal_y REAL NOT NULL DEFAULT 0.5 CHECK (focal_y >= 0 AND focal_y <= 1),
  width INTEGER NOT NULL CHECK (width > 0),
  height INTEGER NOT NULL CHECK (height > 0),
  mime TEXT NOT NULL CHECK (mime IN ('image/jpeg','image/png','image/webp')),
  bytes INTEGER NOT NULL CHECK (bytes > 0),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived','deleted')),
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  published_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_image_versions_slot_created
  ON image_versions(slot_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_image_versions_status
  ON image_versions(status, created_at DESC);

CREATE TABLE IF NOT EXISTS cms_prime_notices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 120),
  body TEXT NOT NULL CHECK (length(body) BETWEEN 1 AND 20000),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','scheduled','published','hidden','deleted')),
  is_pinned INTEGER NOT NULL DEFAULT 0 CHECK (is_pinned IN (0,1)),
  cover_key TEXT,
  publish_at TEXT,
  published_at TEXT,
  created_by TEXT NOT NULL,
  updated_by TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_cms_prime_notices_public
  ON cms_prime_notices(status, is_pinned DESC, published_at DESC, id DESC);
CREATE INDEX IF NOT EXISTS idx_cms_prime_notices_updated
  ON cms_prime_notices(updated_at DESC);

CREATE TABLE IF NOT EXISTS notice_revisions (
  revision_id TEXT PRIMARY KEY,
  notice_id INTEGER NOT NULL REFERENCES cms_prime_notices(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL,
  is_pinned INTEGER NOT NULL,
  cover_key TEXT,
  publish_at TEXT,
  changed_by TEXT NOT NULL,
  changed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notice_revisions_notice
  ON notice_revisions(notice_id, changed_at DESC);

CREATE TABLE IF NOT EXISTS audit_logs (
  audit_id TEXT PRIMARY KEY,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  detail_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created
  ON audit_logs(created_at DESC);

-- Exact-screen overlay slots. No active image means the existing bundled screenshot remains visible.
INSERT OR IGNORE INTO image_slots
(slot_id,page,label,description,x,y,w,h,aspect_ratio,min_width)
VALUES
('home.automotive','home','홈 · 자동차부품','자동차부품 카드의 사진 영역',1.6,42.4,14.3,11.3,1.69,900),
('home.hydraulic','home','홈 · 유압부품','유압부품 카드의 사진 영역',16.0,42.4,13.0,11.3,1.53,900),
('home.electronic','home','홈 · 전자부품','전자부품 카드의 사진 영역',29.0,42.4,11.6,11.3,1.36,900),
('home.mass','home','홈 · 정밀 양산가공','정밀 양산가공 카드의 사진 영역',40.6,42.4,12.2,11.3,1.44,900),
('home.products','home','홈 · 제품·가공사례','제품·가공사례 갤러리 영역',53.7,41.0,44.6,12.6,4.72,1200),
('home.facilities','home','홈 · 설비현황','설비현황 대표 사진 영역',71.4,56.5,25.8,14.9,2.31,1200),
('home.quality','home','홈 · 품질관리','품질관리 측정 사진 영역',14.1,74.0,11.5,12.0,1.28,800),
('company.hero','company','회사소개 · 공장 전경','회사소개 상단 공장 전경',27.5,5.0,59.0,33.0,2.38,1600),
('company.factory','company','회사소개 · 생산 현장','회사 개요의 생산 현장 사진',4.3,40.5,21.9,13.3,2.20,1000),
('company.automotive','company','회사소개 · 자동차부품','주요 산업 분야 자동차부품',21.8,61.3,8.8,7.5,1.56,700),
('company.hydraulic','company','회사소개 · 유압부품','주요 산업 분야 유압부품',30.8,61.3,8.8,7.5,1.56,700),
('company.electronic','company','회사소개 · 전자부품','주요 산업 분야 전자부품',21.8,69.1,8.8,7.2,1.63,700),
('company.mass','company','회사소개 · 정밀 공작기계','주요 산업 분야 정밀 공작기계',30.8,69.1,8.8,7.2,1.63,700),
('fields.hero','fields','가공분야 · 대표 설비','가공분야 상단 자동선반 설비',49.0,3.0,31.0,27.5,1.50,1400),
('fields.automotive','fields','가공분야 · 자동차부품','자동차부품 분야 대표 사진',15.7,29.0,11.7,12.8,1.22,900),
('fields.hydraulic','fields','가공분야 · 유압부품','유압부품 분야 대표 사진',38.0,29.0,11.5,12.8,1.20,900),
('fields.electronic','fields','가공분야 · 전자부품','전자부품 분야 대표 사진',61.2,29.0,10.2,12.8,1.06,900),
('fields.mass','fields','가공분야 · 정밀 양산가공','정밀 양산가공 대표 사진',83.3,29.0,11.2,12.8,1.17,900),
('products.grid1','products','제품사례 · 1번','제품 갤러리 첫 번째 사진',2.4,30.3,15.9,12.8,1.66,900),
('products.grid2','products','제품사례 · 2번','제품 갤러리 두 번째 사진',18.5,30.3,15.9,12.8,1.66,900),
('products.grid3','products','제품사례 · 3번','제품 갤러리 세 번째 사진',34.4,30.3,14.9,12.8,1.55,900),
('products.grid4','products','제품사례 · 4번','제품 갤러리 네 번째 사진',2.4,43.5,15.9,11.5,1.84,900),
('products.grid5','products','제품사례 · 5번','제품 갤러리 다섯 번째 사진',18.5,43.5,15.9,11.5,1.84,900),
('products.grid6','products','제품사례 · 6번','제품 갤러리 여섯 번째 사진',34.4,43.5,14.9,11.5,1.73,900),
('products.feature','products','제품사례 · 대표 제품','오른쪽 대표 제품 상세 사진',52.0,34.7,23.4,19.8,1.58,1200),
('facilities.line','facilities','설비현황 · 자동선반 라인','대표 장비 환경 자동선반 라인',19.8,37.2,16.0,10.5,2.03,900),
('facilities.measure','facilities','설비현황 · 측정 장비','정밀 측정·검사 장비',36.2,37.2,16.0,10.5,2.03,900),
('facilities.tooling','facilities','설비현황 · 치공구','전용 지그 및 치공구',52.7,37.2,15.1,10.5,1.92,900),
('facilities.clean','facilities','설비현황 · 세척 설비','세척 설비',68.3,37.2,14.9,10.5,1.89,900),
('facilities.pack','facilities','설비현황 · 포장 설비','포장 설비',83.7,37.2,14.7,10.5,1.87,900),
('quality.hero','quality','품질관리 · 정밀 검사','상단 정밀 측정 대표 사진',36.0,5.8,38.0,18.8,2.70,1400),
('quality.lab','quality','품질관리 · 측정실','오른쪽 측정실 대표 사진',74.5,26.2,23.2,13.5,2.29,1000);