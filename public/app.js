async function postJSON(url, data) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, json };
}

// --- Password checker UI ---
const pwCheck = document.getElementById("pwCheck");
const bar = document.getElementById("bar");
const label = document.getElementById("label");

const rLen = document.getElementById("rLen");
const rLow = document.getElementById("rLow");
const rUp = document.getElementById("rUp");
const rDig = document.getElementById("rDig");
const rSym = document.getElementById("rSym");

function setRule(el, ok) {
  el.classList.toggle("ok", !!ok);
}

function setBar(score) {
  // score 0..4
  const pct = (score / 4) * 100;
  bar.style.width = `${pct}%`;
}

let strengthTimer = null;

pwCheck.addEventListener("input", () => {
  clearTimeout(strengthTimer);
  strengthTimer = setTimeout(async () => {
    const password = pwCheck.value;
    const { ok, json } = await postJSON("/api/strength", { password });

    if (!ok) return;

    setBar(json.score);
    label.textContent = json.label;

    setRule(rLen, json.lengthOk);
    setRule(rLow, json.hasLower);
    setRule(rUp, json.hasUpper);
    setRule(rDig, json.hasDigit);
    setRule(rSym, json.hasSymbol);
  }, 120);
});

// --- Signup ---
const signupForm = document.getElementById("signupForm");
const signupMsg = document.getElementById("signupMsg");

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  signupMsg.textContent = "";

  const form = new FormData(signupForm);
  const payload = {
    nume: form.get("nume"),
    prenume: form.get("prenume"),
    email: form.get("email"),
    parola: form.get("parola"),
  };

  const { ok, json } = await postJSON("/api/signup", payload);
  signupMsg.textContent = json.message || (ok ? "OK" : "Eroare");

  if (ok) signupForm.reset();
});

// --- Login ---
const loginForm = document.getElementById("loginForm");
const loginMsg = document.getElementById("loginMsg");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  loginMsg.textContent = "";

  const form = new FormData(loginForm);
  const payload = {
    email: form.get("email"),
    parola: form.get("parola"),
  };

  const { ok, json } = await postJSON("/api/login", payload);
  loginMsg.textContent = json.message || (ok ? "OK" : "Eroare");

  if (ok) loginForm.reset();
});