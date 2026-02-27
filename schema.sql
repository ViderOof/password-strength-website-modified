-- ══════════════════════════════════════
--  PSM — Database Schema
--  Rulează o singură dată:
--  mysql -u root -p < schema.sql
-- ══════════════════════════════════════

CREATE DATABASE IF NOT EXISTS psm_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE psm_db;

CREATE TABLE IF NOT EXISTS users (
  id            INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  nume          VARCHAR(100)  NOT NULL,
  prenume       VARCHAR(100)  NOT NULL,
  email         VARCHAR(255)  NOT NULL,
  password_hash VARCHAR(255)  NOT NULL,
  created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;