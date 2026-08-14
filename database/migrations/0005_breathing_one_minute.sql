UPDATE daily_practice_logs
SET breathe_seconds = 60
WHERE breathe_seconds IS NOT NULL;

ALTER TABLE daily_practice_logs
DROP CONSTRAINT CK_daily_breathe_seconds;

ALTER TABLE daily_practice_logs
ADD CONSTRAINT CK_daily_breathe_seconds
CHECK(breathe_seconds IS NULL OR breathe_seconds = 60);
