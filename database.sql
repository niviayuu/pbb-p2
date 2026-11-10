-- ============================================================
-- Database Schema & Initial Data for PBB-P2 BAPENDA Karawang
-- Exported at: 2026-11-09 07:56:14
-- ============================================================

-- TABLE: cache
CREATE TABLE "cache" ("key" varchar not null, "value" text not null, "expiration" integer not null, primary key ("key"));

-- TABLE: cache_locks
CREATE TABLE "cache_locks" ("key" varchar not null, "owner" varchar not null, "expiration" integer not null, primary key ("key"));

-- TABLE: failed_jobs
CREATE TABLE "failed_jobs" ("id" integer primary key autoincrement not null, "uuid" varchar not null, "connection" varchar not null, "queue" varchar not null, "payload" text not null, "exception" text not null, "failed_at" datetime not null default CURRENT_TIMESTAMP);

-- TABLE: job_batches
CREATE TABLE "job_batches" ("id" varchar not null, "name" varchar not null, "total_jobs" integer not null, "pending_jobs" integer not null, "failed_jobs" integer not null, "failed_job_ids" text not null, "options" text, "cancelled_at" integer, "created_at" integer not null, "finished_at" integer, primary key ("id"));

-- TABLE: jobs
CREATE TABLE "jobs" ("id" integer primary key autoincrement not null, "queue" varchar not null, "payload" text not null, "attempts" integer not null, "reserved_at" integer, "available_at" integer not null, "created_at" integer not null);

-- TABLE: migrations
CREATE TABLE "migrations" ("id" integer primary key autoincrement not null, "migration" varchar not null, "batch" integer not null);

-- TABLE: password_reset_tokens
CREATE TABLE "password_reset_tokens" ("email" varchar not null, "token" varchar not null, "created_at" datetime, primary key ("email"));

-- TABLE: sessions
CREATE TABLE "sessions" ("id" varchar not null, "user_id" integer, "ip_address" varchar, "user_agent" text, "payload" text not null, "last_activity" integer not null, primary key ("id"));

-- TABLE: users
CREATE TABLE "users" ("id" integer primary key autoincrement not null, "name" varchar not null, "email" varchar not null, "email_verified_at" datetime, "password" varchar not null, "remember_token" varchar, "created_at" datetime, "updated_at" datetime, phone VARCHAR(50) DEFAULT NULL, instansi VARCHAR(150) DEFAULT NULL);

-- INDEX: cache_expiration_index
CREATE INDEX "cache_expiration_index" on "cache" ("expiration");

-- INDEX: cache_locks_expiration_index
CREATE INDEX "cache_locks_expiration_index" on "cache_locks" ("expiration");

-- INDEX: failed_jobs_connection_queue_failed_at_index
CREATE INDEX "failed_jobs_connection_queue_failed_at_index" on "failed_jobs" ("connection", "queue", "failed_at");

-- INDEX: failed_jobs_uuid_unique
CREATE UNIQUE INDEX "failed_jobs_uuid_unique" on "failed_jobs" ("uuid");

-- INDEX: jobs_queue_index
CREATE INDEX "jobs_queue_index" on "jobs" ("queue");

-- INDEX: sessions_last_activity_index
CREATE INDEX "sessions_last_activity_index" on "sessions" ("last_activity");

-- INDEX: sessions_user_id_index
CREATE INDEX "sessions_user_id_index" on "sessions" ("user_id");

-- INDEX: users_email_unique
CREATE UNIQUE INDEX "users_email_unique" on "users" ("email");

-- ============================================================
-- DATA DUMP: Tabel users
-- ============================================================

INSERT INTO users (id, name, email, email_verified_at, password, remember_token, created_at, updated_at, phone, instansi) VALUES ('1', 'Administrator BAPENDA', 'admin@karawangkab.go.id', NULL, '$2y$10$T4eTRnZqWxZeK3uBeBbmI.3VatgIKp/bpFZMqxt/3t5uDmXewxaqa', NULL, '2026-11-09 07:14:30', '2026-11-09 07:14:30', '081234567890', 'BAPENDA Kabupaten Karawang');
