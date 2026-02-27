// main-login.js

const loginForm = document.querySelector("#loginForm");
const btnSubmit = document.querySelector("button[type='submit']");

loginForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const email  = document.getElementById("username").value.trim(); // câmpul se numește username dar trimitem email
  const parola = document.getElementById("password").value;

  // ── Validare locală ──────────────────────────────────────────
  const usernameError = document.getElementById("usernameError");
  const passwordError = document.getElementById("passwordError");

  usernameError.style.display = "none";
  passwordError.style.display = "none";

  let valid = true;

  if (!email) {
    usernameError.textContent   = "Email is required.";
    usernameError.style.display = "block";
    valid = false;
  }

  if (!parola) {
    passwordError.style.display = "block";
    valid = false;
  }

  if (!valid) return;

  // ── Trimite către server ─────────────────────────────────────
  btnSubmit.disabled    = true;
  btnSubmit.textContent = "Logging in...";

  try {
    const res  = await fetch("/api/login", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ email, parola }),
    });

    const data = await res.json();

    if (data.ok) {
      showMessage(data.message, "#22c55e");
      setTimeout(() => {
        window.location.href = "/";
      }, 1200);
    } else {
      showMessage(data.message || "Email or password is incorrect.", "#ef4444");
    }

  } catch (err) {
    showMessage("The server is not responding. Please try again later.", "#ef4444");
  } finally {
    btnSubmit.disabled    = false;
    btnSubmit.textContent = "Login";
  }
});

// ── Helper ───────────────────────────────────────────────────────

function showMessage(msg, color) {
  let el = document.getElementById("formMessage");
  if (!el) {
    el = document.createElement("p");
    el.id = "formMessage";
    el.style.marginTop = "10px";
    el.style.fontSize  = "14px";
    loginForm.appendChild(el);
  }
  el.textContent  = msg;
  el.style.color  = color;
  el.style.display = "block";
}