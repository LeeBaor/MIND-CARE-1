CREATE TABLE clinical_records (
  id uniqueidentifier PRIMARY KEY,
  booking_id uniqueidentifier NOT NULL UNIQUE REFERENCES appointments(id),
  user_id uniqueidentifier NOT NULL REFERENCES users(id),
  counselor_id uniqueidentifier NOT NULL REFERENCES users(id),
  summary nvarchar(max) NOT NULL,
  completed_at datetime2 NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE TABLE care_plans (
  id uniqueidentifier PRIMARY KEY,
  booking_id uniqueidentifier NOT NULL REFERENCES appointments(id),
  user_id uniqueidentifier NOT NULL REFERENCES users(id),
  counselor_id uniqueidentifier NOT NULL REFERENCES users(id),
  kind nvarchar(20) NOT NULL CHECK(kind IN ('exercise','medicine')),
  title nvarchar(255) NOT NULL,
  notes nvarchar(max) NOT NULL,
  released_at datetime2 NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE INDEX IX_clinical_records_user_completed ON clinical_records(user_id, completed_at DESC);
CREATE INDEX IX_care_plans_user_released ON care_plans(user_id, released_at DESC);
