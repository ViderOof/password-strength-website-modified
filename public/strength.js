document.addEventListener("DOMContentLoaded", () => {
  const pwCheck = document.getElementById("pwCheck");
  const bar     = document.getElementById("bar");
  const label   = document.getElementById("label");
  const crackEl = document.getElementById("crackTime");

  const rLen = document.getElementById("rLen");
  const rLow = document.getElementById("rLow");
  const rUp  = document.getElementById("rUp");
  const rDig = document.getElementById("rDig");
  const rSym = document.getElementById("rSym");

  if (!pwCheck || !bar || !label) return;

  function setRule(el, ok) {
    if (!el) return;
    el.classList.toggle("ok", !!ok);
  }

  function estimate(p) {
    p = String(p || "");
    const hasLower  = /[a-z]/.test(p);
    const hasUpper  = /[A-Z]/.test(p);
    const hasDigit  = /\d/.test(p);
    const hasSymbol = /[^A-Za-z0-9]/.test(p);
    const lengthOk  = p.length >= 12;

    let score = 0;
    if (p.length >= 8)          score++;
    if (p.length >= 12)         score++;
    if (hasLower && hasUpper)   score++;
    if (hasDigit)               score++;
    if (hasSymbol)              score++;
    if (score > 4) score = 4;

    const labels = ["Very Weak", "Weak", "OK", "Good", "Very Good"];
    return { score, label: labels[score], lengthOk, hasLower, hasUpper, hasDigit, hasSymbol };
  }

  // ── Crack time estimation ──────────────────────────────────────

  // viteza unui GPU modern (parole/secundă)
  const GUESSES_PER_SECOND = 10_000_000_000;

  function getAlphabetSize(p) {
    let size = 0;
    if (/[a-z]/.test(p))         size += 26;
    if (/[A-Z]/.test(p))         size += 26;
    if (/[0-9]/.test(p))         size += 10;
    if (/[^a-zA-Z0-9]/.test(p))  size += 33;
    return size || 26;
  }

  function formatTime(seconds) {
    if (seconds < 1)          return "less than a second";
    if (seconds < 60)         return `${Math.round(seconds)} seconds`;
    if (seconds < 3600)       return `${Math.round(seconds / 60)} minutes`;
    if (seconds < 86400)      return `${Math.round(seconds / 3600)} hours`;
    if (seconds < 2592000)    return `${Math.round(seconds / 86400)} days`;
    if (seconds < 31536000)   return `${Math.round(seconds / 2592000)} months`;
    if (seconds < 1e9)        return `${Math.round(seconds / 31536000)} years`;
    if (seconds < 1e12)       return `${(seconds / 1e9).toFixed(1)} billion years`;
    if (seconds < 1e15)       return `${(seconds / 1e12).toFixed(1)} trillion years`;
    return "longer than the age of the universe";
  }

  function getCrackClass(seconds) {
    if (seconds < 86400)    return "danger";   // sub o zi
    if (seconds < 31536000) return "warning";  // sub un an
    return "good";
  }

  function estimateCrackTime(p) {
    if (!p) return { text: "—", cls: "" };
    const alpha   = getAlphabetSize(p);
    const combos  = Math.pow(alpha, p.length);
    // average case = jumătate din combinații
    const seconds = (combos / 2) / GUESSES_PER_SECOND;
    return {
      text: `~${formatTime(seconds)} to crack`,
      cls:  getCrackClass(seconds),
    };
  }

  // ── Event listener ────────────────────────────────────────────

  pwCheck.addEventListener("input", () => {
    const p = pwCheck.value;
    const s = estimate(p);

    // bar + score label
    bar.style.width    = `${(s.score / 4) * 100}%`;
    label.textContent  = s.label;

    // rules
    setRule(rLen, s.lengthOk);
    setRule(rLow, s.hasLower);
    setRule(rUp,  s.hasUpper);
    setRule(rDig, s.hasDigit);
    setRule(rSym, s.hasSymbol);

    // crack time
    if (crackEl) {
      const { text, cls } = estimateCrackTime(p);
      crackEl.textContent = text;
      crackEl.className   = "crack-time " + cls;
    }
  });
});