CREATE TABLE IF NOT EXISTS site_content (
  id TEXT PRIMARY KEY,
  status TEXT NOT NULL,
  content_json TEXT NOT NULL,
  revision INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL,
  updated_by TEXT
);

CREATE TABLE IF NOT EXISTS content_revisions (
  revision_id INTEGER PRIMARY KEY AUTOINCREMENT,
  status TEXT NOT NULL,
  content_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  created_by TEXT,
  note TEXT
);

CREATE TABLE IF NOT EXISTS media_assets (
  id TEXT PRIMARY KEY,
  object_key TEXT,
  src TEXT NOT NULL,
  label TEXT,
  alt TEXT,
  usage TEXT,
  content_type TEXT,
  size INTEGER,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_content_revisions_status_created
  ON content_revisions(status, created_at);

CREATE INDEX IF NOT EXISTS idx_media_assets_status_updated
  ON media_assets(status, updated_at);
