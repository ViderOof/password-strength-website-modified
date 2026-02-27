// db.js — conexiunea la MySQL
// Folosim un pool în loc de o singură conexiune
// ca să suporte mai mulți utilizatori simultan

const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  // Acceptăm variabilele noastre SAU variabilele standard injectate de Railway (MYSQL...)
  host: process.env.DB_HOST || process.env.MYSQLHOST || "localhost",
  port: process.env.DB_PORT || process.env.MYSQLPORT || 3306,
  user: process.env.DB_USER || process.env.MYSQLUSER || "root",
  password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || "",
  database: process.env.DB_NAME || process.env.MYSQLDATABASE || "psm_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: "utf8mb4",
});

// test la pornire
pool.getConnection()
  .then(conn => {
    console.log("✅ MySQL conectat cu succes");
    conn.release();
  })
  .catch(err => {
    console.error("❌ Eroare conexiune MySQL:", err.message);
    process.exit(1);
  });

const createUsersTable = `
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
    `;

// Run the query automatically when the server starts
pool.query(createUsersTable)
  .then(() => {
    console.log("✅ Tabelul 'users' este pregătit (creat sau exista deja).");
  })
  .catch((err) => {
    console.error("❌ Eroare la crearea tabelului 'users':", err);
  });

module.exports = pool;
