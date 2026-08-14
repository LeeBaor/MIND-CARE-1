CREATE TABLE daily_practice_logs (
  id uniqueidentifier PRIMARY KEY,
  user_id uniqueidentifier NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  practice_date date NOT NULL,
  breathe_started_at datetime2,
  breathe_completed_at datetime2,
  breathe_seconds int,
  journal nvarchar(max),
  journal_completed bit NOT NULL DEFAULT 0,
  sleep_started_at datetime2,
  sleep_completed_at datetime2,
  sleep_minutes int,
  updated_at datetime2 NOT NULL DEFAULT SYSUTCDATETIME(),
  CONSTRAINT UQ_daily_practice_user_date UNIQUE(user_id, practice_date),
  CONSTRAINT CK_daily_breathe_seconds CHECK(breathe_seconds IS NULL OR breathe_seconds BETWEEN 60 AND 180),
  CONSTRAINT CK_daily_sleep_minutes CHECK(sleep_minutes IS NULL OR sleep_minutes > 0)
);

CREATE INDEX IX_daily_practice_user_date ON daily_practice_logs(user_id, practice_date DESC);
