CREATE TABLE IF NOT EXISTS admin_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  revoked_at TEXT
);

CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id TEXT PRIMARY KEY,
  actor TEXT,
  action TEXT NOT NULL,
  target TEXT,
  status TEXT NOT NULL,
  detail TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS notices (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  status TEXT NOT NULL,
  publish_date TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  category TEXT,
  is_pinned INTEGER NOT NULL DEFAULT 0,
  author TEXT,
  view_count INTEGER NOT NULL DEFAULT 0,
  content TEXT
);

CREATE INDEX IF NOT EXISTS idx_admin_sessions_user_expires
  ON admin_sessions(user_id, expires_at);

CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_created
  ON admin_audit_logs(created_at);

CREATE INDEX IF NOT EXISTS idx_notices_status_publish
  ON notices(status, publish_date);
