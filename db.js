// db.js — conexiunea la MySQL
// Folosim un pool în loc de o singură conexiune
// ca să suporte mai mulți utilizatori simultan

const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host:     process.env.DB_HOST     || "localhost",
  port:     process.env.DB_PORT     || 3306,
  user:     process.env.DB_USER     || "root",
  password: process.env.DB_PASSWORD || "3039",
  database: process.env.DB_NAME     || "psm_db",
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  charset:            "utf8mb4",
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

module.exports = pool;
pool.getConnection()
  .then(conn => {
    console.log("✅ MySQL conectat cu succes");
    conn.release();
  })
  .catch(err => {
    console.error("❌ Eroare conexiune MySQL:", err.message);
    console.error("   Host:", process.env.DB_HOST);
    console.error("   Port:", process.env.DB_PORT);
    console.error("   User:", process.env.DB_USER);
    console.error("   DB:  ", process.env.DB_NAME);
    process.exit(1);
  });
