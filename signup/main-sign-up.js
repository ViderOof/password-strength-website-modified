// main-sign-up.js

const form     = document.querySelector("#signupForm");
const btnSubmit = document.querySelector("button[type='submit']");

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const fullname = document.getElementById("fullname").value.trim();
  const email    = document.getElementById("email").value.trim();
  const parola   = document.getElementById("password").value;

  // ── Validare locală ──────────────────────────────────────────
  if (!fullname) {
    showError("Enter your full name.");
    return;
  }
  if (!email) {
    showError("Enter your email address.");
    return;
  }
  if (!parola) {
    showError("Enter a password.");
    return;
  }

  // split "Nume Prenume" → nume + prenume
  const parts   = fullname.split(" ");
  const nume    = parts[0];
  const prenume = parts.slice(1).join(" ") || "-";

  // ── Trimite către server ─────────────────────────────────────
  btnSubmit.disabled    = true;
  btnSubmit.textContent = "Creating account...";

  try {
    const res  = await fetch("/api/signup", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ nume, prenume, email, parola }),
    });

    const data = await res.json();

    if (data.ok) {
      showSuccess("Account created successfully! You are being redirected...");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } else {
      showError(data.message || "Error creating account.");
    }

  } catch (err) {
    showError("The server is not responding. Please try again later.");
  } finally {
    btnSubmit.disabled    = false;
    btnSubmit.textContent = "Register";
  }
});

// ── Helpers ──────────────────────────────────────────────────────

function showError(msg) {
  const el = getOrCreateMessage();
  el.textContent  = msg;
  el.style.color  = "#ef4444";
  el.style.display = "block";
}

function showSuccess(msg) {
  const el = getOrCreateMessage();
  el.textContent  = msg;
  el.style.color  = "#22c55e";
  el.style.display = "block";
}

function getOrCreateMessage() {
  let el = document.getElementById("formMessage");
  if (!el) {
    el = document.createElement("p");
    el.id = "formMessage";
    el.style.marginTop = "10px";
    el.style.fontSize  = "14px";
    document.querySelector("form").appendChild(el);
  }
  return el;
}