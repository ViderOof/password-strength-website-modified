// main-login.js

const form = document.querySelector("#loginForm");
const btnSubmit = document.querySelector("button[type='submit']");

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const parola = document.getElementById("password").value;

  // ── Local validation ──────────────────────────────────────────
  if (!email) {
    showError("Enter your email address.");
    return;
  }
  if (!parola) {
    showError("Enter your password.");
    return;
  }

  // ── Send to server ────────────────────────────────────────────
  btnSubmit.disabled = true;
  btnSubmit.textContent = "Logging in...";

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, parola }),
    });

    const data = await res.json();

    if (data.ok) {
      showSuccess(data.message || "Login successful!");
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } else {
      showError(data.message || "Invalid email or password.");
    }

  } catch (err) {
    showError("The server is not responding. Please try again later.");
  } finally {
    btnSubmit.disabled = false;
    btnSubmit.textContent = "Login";
  }
});

// ── Helpers ──────────────────────────────────────────────────────

function showError(msg) {
  const el = getOrCreateMessage();
  el.textContent = msg;
  el.style.color = "#ef4444";
  el.style.display = "block";
}

function showSuccess(msg) {
  const el = getOrCreateMessage();
  el.textContent = msg;
  el.style.color = "#22c55e";
  el.style.display = "block";
}

function getOrCreateMessage() {
  let el = document.getElementById("formMessage");
  if (!el) {
    el = document.createElement("p");
    el.id = "formMessage";
    el.style.marginTop = "10px";
    el.style.fontSize = "14px";
    document.querySelector("form").appendChild(el);
  }
  return el;
}
