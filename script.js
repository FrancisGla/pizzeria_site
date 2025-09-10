// ================== Variables couleurs ==================
const rootStyles = getComputedStyle(document.documentElement);
const rougeTomate  = (rootStyles.getPropertyValue("--rouge-tomate")  || "#D32F2F").trim();
const vertBasilic  = (rootStyles.getPropertyValue("--vert-basilic")  || "#388E3C").trim();
const beigeSable   = (rootStyles.getPropertyValue("--beige-sable")   || "#F5F0E6").trim();
const bleuOcean    = (rootStyles.getPropertyValue("--bleu-ocean")    || "#0277BD").trim();
const noirArdoise  = (rootStyles.getPropertyValue("--noir-ardoise") || "#333333").trim();
const blanc        = (rootStyles.getPropertyValue("--blanc")        || "#ffffff").trim();
const grisClair    = (rootStyles.getPropertyValue("--gris-clair")   || "#f9f9f9").trim();
const grisFonce    = (rootStyles.getPropertyValue("--gris-fonce")   || "#555555").trim();
const accentColor  = (rootStyles.getPropertyValue("--accent-color") || "#d4af37").trim();
const disabledBg   = (rootStyles.getPropertyValue("--disabled-bg")  || "#e0e0e0").trim();

// ================== MENU BURGER ==================
function toggleMenu() {
  document.querySelector('.menu-links').classList.toggle('show');
}

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
  captchaLabel.style.color = rougeTomate;

  captchaInput.style.width = "600px";
  captchaInput.style.textAlign = "center";
  captchaInput.style.display = "block";
  captchaInput.style.margin = "10px auto";
  captchaInput.style.fontSize = "1.3rem";
  captchaInput.style.height = "40px";
  captchaInput.style.borderColor = grisFonce;
  captchaInput.style.background = grisClair;
  captchaInput.style.color = noirArdoise;

  if (captchaInfo) captchaInfo.style.color = vertBasilic;

  if (retryBtn) {
    retryBtn.style.background = rougeTomate;
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
    ctx.fillStyle = accentColor;
    ctx.font = `bold ${fontSize}px Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(formatted, clockCanvas.width / 2, clockCanvas.height / 2);
  }

  function failAttempt(message) {
    tries++;
    captchaInput.value = "";
    if (captchaInfo) {
      captchaInfo.innerHTML = `<span class="error-message">
        ${message} Tentatives : ${tries}/3
      </span>`;
    }
    retryBtn.style.display = "inline-block";

    if (tries >= 3) {
      clearInterval(timer);
      if (clockCanvas) clockCanvas.style.display = "none";
      retryBtn.style.display = "none";
      captchaInput.value = "";
      captchaInput.disabled = true;
      captchaInput.style.backgroundColor = disabledBg;

      if (captchaInfo) {
        captchaInfo.innerHTML = `
          <span style="color:${accentColor}; font-weight:bold; font-size:1.2rem;">
            🚫 3 tentatives échouées.
          </span><br>
          <button id="reloadBtn">🔄 Recharger la page</button>
          <button id="homeBtn">🏠 Retour à l'accueil</button>
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

// ================== ANIMATION + ZOOM IMAGES ==================
document.addEventListener("DOMContentLoaded", () => {
  const imgs = document.querySelectorAll(".featured-dish img, .card img, .gallery img");

  imgs.forEach((img, index) => {
    // Fade-in progressif
    setTimeout(() => img.classList.add("show"), 200 * index);

    // Toggle zoom au clic
    img.addEventListener("click", (e) => {
      e.stopPropagation();
      img.classList.toggle("zoomed");
    });
  });

  // Clic ailleurs = dézoome
  document.addEventListener("click", (e) => {
    if (!e.target.matches(".featured-dish img, .card img, .gallery img")) {
      imgs.forEach(img => img.classList.remove("zoomed"));
    }
  });

  // Échap ferme aussi
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") imgs.forEach(img => img.classList.remove("zoomed"));
  });
});
