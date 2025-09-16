// ================== Variables couleurs ==================
const rootStyles = getComputedStyle(document.documentElement);

const noir       = (rootStyles.getPropertyValue("--noir")        || "#000").trim();
const noirFonce  = (rootStyles.getPropertyValue("--noir-fonce")  || "#1a1a1a").trim();
const grisMoyen  = (rootStyles.getPropertyValue("--gris-moyen")  || "#222").trim();
const grisClair  = (rootStyles.getPropertyValue("--gris-clair")  || "#eee").trim();
const grisPlusClair = (rootStyles.getPropertyValue("--gris-plus-clair") || "#f9f9f9").trim();
const grisBordure   = (rootStyles.getPropertyValue("--gris-bordure")   || "#555").trim();
const grisCard      = (rootStyles.getPropertyValue("--gris-card")      || "#666").trim();

const blanc     = (rootStyles.getPropertyValue("--blanc")       || "#fff").trim();
const or        = (rootStyles.getPropertyValue("--or")          || "#d4af37").trim();
const orFonce   = (rootStyles.getPropertyValue("--or-fonce")    || "#b08a2e").trim();
const orClair   = (rootStyles.getPropertyValue("--or-clair")    || "#e6c86e").trim();

const textePrincipal   = (rootStyles.getPropertyValue("--texte-principal")   || "#F7F7F7").trim();
const texteSecondaire  = (rootStyles.getPropertyValue("--texte-secondaire")  || "#ccc").trim();

const disabledBg = "#e0e0e0"; // couleur des champs désactivés

// ================== MENU BURGER ==================
function toggleMenu() {
  const links = document.querySelector('.menu-links');
  if (!links) return;
  links.classList.toggle('show');
}

document.addEventListener('click', (e) => {
  const links = document.querySelector('.menu-links');
  const toggle = document.querySelector('.menu-toggle');
  if (!links || !toggle) return;
  if (!links.classList.contains('show')) return;
  if (e.target === toggle || toggle.contains(e.target) || links.contains(e.target)) return;
  links.classList.remove('show');
});

// ================== FADE-IN IMAGES ==================
document.addEventListener("DOMContentLoaded", () => {
  const imgs = document.querySelectorAll(".gallery img, .card img, .featured-dish img");
  imgs.forEach((img, index) => {
    setTimeout(() => img.classList.add("show"), 200 * index);
  });
});

// ================== CAPTCHA + HORLOGE ==================
document.addEventListener("DOMContentLoaded", function () {
  const captchaLabel = document.getElementById("captchaLabel");
  const captchaInput = document.getElementById("captcha");
  const captchaInfo  = document.getElementById("captchaInfo");
  const retryBtn     = document.getElementById("retryCaptcha");
  const form         = document.getElementById("contactForm");
  const clockCanvas  = document.getElementById("captchaClock");
  const ctx          = clockCanvas ? clockCanvas.getContext("2d") : null;

  if (!captchaLabel || !captchaInput || !retryBtn || !form) return;

  captchaLabel.style.display = "block";
  captchaLabel.style.textAlign = "center";
  captchaLabel.style.fontWeight = "bold";
  captchaLabel.style.marginBottom = "8px";
  captchaLabel.style.fontSize = "1.3rem";
  captchaLabel.style.color = or;

  captchaInput.style.width = "600px";
  captchaInput.style.textAlign = "center";
  captchaInput.style.display = "block";
  captchaInput.style.margin = "10px auto";
  captchaInput.style.fontSize = "1.3rem";
  captchaInput.style.height = "40px";
  captchaInput.style.borderColor = grisBordure;
  captchaInput.style.background = grisPlusClair;
  captchaInput.style.color = noirFonce;

  if (captchaInfo) captchaInfo.style.color = orClair;

  if (retryBtn) {
    retryBtn.style.background = orFonce;
    retryBtn.style.color = blanc;
    retryBtn.style.border = "none";
    retryBtn.style.borderRadius = "6px";
    retryBtn.style.padding = "8px 14px";
    retryBtn.style.cursor = "pointer";
  }

  let solution = 0;
  let tries = 0;
  let timer = null;
  let timeLeft = 30;

  if (clockCanvas) {
    clockCanvas.width = Math.max(80, Math.min(140, Math.round(window.innerWidth * 0.08)));
    clockCanvas.height = 36;
    clockCanvas.style.display = "none";
  }

  function newOperation() {
    const n1 = Math.floor(Math.random() * 9) + 1;
    const n2 = Math.floor(Math.random() * 9) + 1;
    const n3 = Math.floor(Math.random() * 9) + 1;
    solution = n1 + n2 + n3;

    captchaLabel.textContent = `⛔ Résolvez : ${n1} + ${n2} + ${n3} = ?`;
    captchaInput.value = "";
    if (captchaInfo) captchaInfo.textContent = "";
    retryBtn.style.display = "none";
    captchaInput.disabled = false;
    captchaInput.style.backgroundColor = "";

    if (ctx && clockCanvas) {
      ctx.clearRect(0, 0, clockCanvas.width, clockCanvas.height);
      clockCanvas.style.display = "none";
    }
  }

  function drawClock() {
    if (!ctx || !clockCanvas) return;
    ctx.clearRect(0, 0, clockCanvas.width, clockCanvas.height);
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formatted = String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
    const fontSize = Math.max(12, Math.floor(clockCanvas.height * 0.6));
    ctx.fillStyle = or;
    ctx.font = `bold ${fontSize}px Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(formatted, clockCanvas.width / 2, clockCanvas.height / 2);
  }

  function failAttempt(message) {
    tries++;
    captchaInput.value = "";
    if (captchaInfo) {
      captchaInfo.innerHTML = `<span class="error-message">${message} Tentatives : ${tries}/3</span>`;
    }
    retryBtn.style.display = "inline-block";

    if (tries === 2) {
      clearInterval(timer);
      if (clockCanvas) clockCanvas.style.display = "none";
    }

    if (tries >= 3) {
      clearInterval(timer);
      if (clockCanvas) clockCanvas.style.display = "none";
      retryBtn.style.display = "none";
      captchaInput.value = "";
      captchaInput.disabled = true;
      captchaInput.style.backgroundColor = disabledBg;

      if (captchaInfo) {
        captchaInfo.innerHTML = `
          <span style="color:${or}; font-weight:bold; font-size:1.2rem;">
            🚫 3 tentatives échouées.
          </span><br>
          <button id="reloadBtn" style="margin:10px; padding:10px 20px; background:${or}; color:${noirFonce}; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">
            🔄 Recharger la page
          </button>
          <button id="homeBtn" style="margin:10px; padding:10px 20px; background:${or}; color:${noirFonce}; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">
            🏠 Retour à l'accueil
          </button>
        `;
        const reloadBtn = document.getElementById("reloadBtn");
        const homeBtn = document.getElementById("homeBtn");
        if (reloadBtn) reloadBtn.onclick = () => window.location.reload();
        if (homeBtn) homeBtn.onclick = () => window.location.href = "index.html";
      }

      const submitBtn = form.querySelector("button[type='submit']");
      if (submitBtn) submitBtn.disabled = true;
    }
  }

  function startTimer() {
    clearInterval(timer);
    timeLeft = 30;
    if (clockCanvas) clockCanvas.style.display = "block";
    drawClock();
    timer = setInterval(() => {
      timeLeft--;
      drawClock();
      if (timeLeft <= 0) {
        clearInterval(timer);
        failAttempt("⏰ Temps écoulé !");
        if (clockCanvas) clockCanvas.style.display = "none";
      }
    }, 1000);
  }

  form.addEventListener("submit", function (e) {
    if (captchaInput.value != solution) {
      e.preventDefault();
      failAttempt("❌ Mauvaise réponse.");
    }
  });

  retryBtn.addEventListener("click", function () {
    newOperation();
    startTimer();
  });

  newOperation();
});

// ================== EMPÊCHER FORMULAIRE EN CACHE ==================
window.addEventListener("pageshow", function (event) {
  if (event.persisted) window.location.reload();
});

window.onload = function () {
  const form = document.querySelector("form");
  if (form) form.reset();
};

// ================== ZOOM PROPRE (overlay + clone) ==================
document.addEventListener("DOMContentLoaded", () => {
  const imgs = Array.from(document.querySelectorAll(".featured-dish img, .card img, .gallery img"));

  let overlay = document.querySelector('.zoom-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'zoom-overlay';
    document.body.appendChild(overlay);
  }

  let clone = null;
  let cleanupTimer = null;

  function removeCloneImmediate() {
    if (cleanupTimer) { clearTimeout(cleanupTimer); cleanupTimer = null; }
    if (clone && clone.parentNode) clone.parentNode.removeChild(clone);
    clone = null;
    overlay.classList.remove('show');
  }

  function openZoom(img) {
    if (clone) removeCloneImmediate();

    clone = img.cloneNode(true);
    clone.className = 'zoom-clone';
    clone.style.position = 'fixed';
    clone.style.left = '50%';
    clone.style.top = '50%';
    clone.style.transform = 'translate(-50%, -50%)';
    clone.style.width = img.width + 'px';
    clone.style.height = img.height + 'px';
    clone.style.transition = 'all 300ms ease';

    document.body.appendChild(clone);
    overlay.classList.add('show');

    const maxW = window.innerWidth * 0.9;
    const maxH = window.innerHeight * 0.9;
    const scale = Math.min(maxW / img.width, maxH / img.height, 2.8);

    requestAnimationFrame(() => {
      clone.style.width = img.width * scale + 'px';
      clone.style.height = img.height * scale + 'px';
    });

    clone.addEventListener('click', (ev) => { ev.stopPropagation(); closeZoom(); });

    cleanupTimer = setTimeout(() => { cleanupTimer = null; }, 800);
  }

  function closeZoom() {
    if (!clone) return;
    clone.remove();
    clone = null;
    overlay.classList.remove('show');
  }

  imgs.forEach(img => {
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      openZoom(img);
    });
  });

  overlay.addEventListener('click', closeZoom);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && clone) closeZoom();
  });
  window.addEventListener('resize', () => { if (clone) closeZoom(); });
});
