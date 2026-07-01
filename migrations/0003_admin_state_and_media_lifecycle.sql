CREATE TABLE IF NOT EXISTS admin_state (
  id TEXT PRIMARY KEY,
  content_json TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  updated_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_admin_state_updated
  ON admin_state(updated_at);

CREATE INDEX IF NOT EXISTS idx_media_assets_status_created
  ON media_assets(status, created_at);
