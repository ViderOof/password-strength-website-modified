const express = require("express");
const path    = require("path");
const bcrypt  = require("bcrypt");
const session = require("express-session");
const db      = require("./db");

const app  = express();
const PORT = 3000;

// ── Middleware ───────────────────────────────────────────────────

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Fișiere statice
app.use(express.static(path.join(__dirname, "public")));
app.use("/login",  express.static(path.join(__dirname, "login")));
app.use("/signup", express.static(path.join(__dirname, "signup")));

const MemoryStore = require("memorystore")(session);

app.use(session({
  secret:            process.env.SESSION_SECRET || "psm_secret_dev",
  resave:            false,
  saveUninitialized: false,
  store: new MemoryStore({
    checkPeriod: 86400000  // curăță sesiunile expirate la fiecare 24h
  }),
  cookie: {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    maxAge:   1000 * 60 * 60 * 24,
  },
}));
// Sesiuni
app.use(session({
  secret:            process.env.SESSION_SECRET || "psm_secret_dev",
  resave:            false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure:   false,   // pune true când ai HTTPS
    maxAge:   1000 * 60 * 60 * 24,  // 24 ore
  },
}));

// ── Rute statice ─────────────────────────────────────────────────

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ── Helper: estimare strength ────────────────────────────────────

function estimateStrength(password) {
  const p = String(password || "");

  const hasLower  = /[a-z]/.test(p);
  const hasUpper  = /[A-Z]/.test(p);
  const hasDigit  = /\d/.test(p);
  const hasSymbol = /[^A-Za-z0-9]/.test(p);

  let score = 0;
  if (p.length >= 8)          score++;
  if (p.length >= 12)         score++;
  if (hasLower && hasUpper)   score++;
  if (hasDigit)               score++;
  if (hasSymbol)              score++;
  if (score > 4) score = 4;

  return {
    lengthOk: p.length >= 12,
    hasLower,
    hasUpper,
    hasDigit,
    hasSymbol,
    score,
    label: ["Foarte slabă", "Slabă", "OK", "Bună", "Foarte bună"][score],
  };
}

// ── API: POST /api/strength ──────────────────────────────────────

app.post("/api/strength", (req, res) => {
  const result = estimateStrength(req.body.password);
  res.json(result);
});

// ── API: POST /api/signup ────────────────────────────────────────
//  Body: { nume, prenume, email, parola }

app.post("/api/signup", async (req, res) => {
  try {
    const { nume, prenume, email, parola } = req.body;

    // 1. câmpuri obligatorii
    if (!nume || !prenume || !email || !parola) {
      return res.status(400).json({ ok: false, message: "Completează toate câmpurile." });
    }

    // 2. parolă suficient de puternică
    const strength = estimateStrength(parola);
    if (strength.score < 3) {
      return res.status(400).json({
        ok: false,
        message: "Parola este prea slabă. Fă-o mai puternică (minim Bună).",
        strength,
      });
    }

    // 3. email unic
    const [existing] = await db.execute(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [email.toLowerCase()]
    );
    if (existing.length > 0) {
      return res.status(409).json({ ok: false, message: "Email deja folosit." });
    }

    // 4. hash parolă
    const passwordHash = await bcrypt.hash(parola, 10);

    // 5. inserare în DB
    const [result] = await db.execute(
      "INSERT INTO users (nume, prenume, email, password_hash) VALUES (?, ?, ?, ?)",
      [nume.trim(), prenume.trim(), email.toLowerCase(), passwordHash]
    );

    // 6. salvează sesiunea
    req.session.userId = result.insertId;
    req.session.nume   = nume.trim();

    return res.json({ ok: true, message: "Cont creat." });

  } catch (err) {
    console.error("Eroare signup:", err);
    return res.status(500).json({ ok: false, message: "Eroare server." });
  }
});

// ── API: POST /api/login ─────────────────────────────────────────
//  Body: { email, parola }

app.post("/api/login", async (req, res) => {
  try {
    const { email, parola } = req.body;

    if (!email || !parola) {
      return res.status(400).json({ ok: false, message: "Completează email și parola." });
    }

    // 1. găsește utilizatorul
    const [rows] = await db.execute(
      "SELECT id, nume, prenume, email, password_hash FROM users WHERE email = ? LIMIT 1",
      [email.toLowerCase()]
    );

    if (rows.length === 0) {
      return res.status(401).json({ ok: false, message: "Email sau parola greșită." });
    }

    const user = rows[0];

    // 2. verifică parola
    const ok = await bcrypt.compare(parola, user.password_hash);
    if (!ok) {
      return res.status(401).json({ ok: false, message: "Email sau parola greșită." });
    }

    // 3. salvează sesiunea
    req.session.userId = user.id;
    req.session.nume   = user.nume;

    return res.json({ ok: true, message: `Salut, ${user.nume} ${user.prenume}.` });

  } catch (err) {
    console.error("Eroare login:", err);
    return res.status(500).json({ ok: false, message: "Eroare server." });
  }
});

// ── API: POST /api/logout ────────────────────────────────────────

app.post("/api/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ ok: true, message: "Deconectat." });
  });
});

// ── API: GET /api/me ─────────────────────────────────────────────

app.get("/api/me", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ ok: false, message: "Neautentificat." });
  }

  try {
    const [rows] = await db.execute(
      "SELECT id, nume, prenume, email, created_at FROM users WHERE id = ? LIMIT 1",
      [req.session.userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ ok: false, message: "Utilizator negăsit." });
    }

    return res.json({ ok: true, user: rows[0] });

  } catch (err) {
    console.error("Eroare /api/me:", err);
    return res.status(500).json({ ok: false, message: "Eroare internă." });
  }
});

// ── Pornire ──────────────────────────────────────────────────────

// ── Admin: servește pagina ───────────────────────────────────────
// Pune acest bloc ÎNAINTE de app.listen()

app.use("/admin", express.static(path.join(__dirname, "admin")));

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "admin", "index.html"));
});

// ── API: GET /api/admin/users ────────────────────────────────────
// returnează toți utilizatorii din DB

app.get("/api/admin/users", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT id, nume, prenume, email, created_at FROM users ORDER BY created_at DESC"
    );
    res.json({ ok: true, users: rows });
  } catch (err) {
    console.error("Eroare admin/users:", err);
    res.status(500).json({ ok: false, message: "Eroare la citirea utilizatorilor." });
  }
});

// ── API: DELETE /api/admin/users/:id ────────────────────────────
// șterge un utilizator după id

app.delete("/api/admin/users/:id", async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ ok: false, message: "ID invalid." });
  }

  try {
    const [result] = await db.execute(
      "DELETE FROM users WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Utilizatorul nu există." });
    }

    res.json({ ok: true, message: "Utilizator șters." });
  } catch (err) {
    console.error("Eroare delete user:", err);
    res.status(500).json({ ok: false, message: "Eroare la ștergere." });
  }
});

app.use("/about",   express.static(path.join(__dirname, "about")));
app.use("/contact", express.static(path.join(__dirname, "contact")));


app.listen(PORT, () => {
  console.log(`🚀 Server pornit pe http://localhost:${PORT}`);
});
