// ================== Variables couleurs (lues depuis :root avec fallback) ==================
const rootStyles = getComputedStyle(document.documentElement);
const rougeTomate  = (rootStyles.getPropertyValue("--rouge-tomate")  || "#D32F2F").trim();
const vertBasilic  = (rootStyles.getPropertyValue("--vert-basilic")  || "#388E3C").trim();
const beigeSable   = (rootStyles.getPropertyValue("--beige-sable")   || "#F5F0E6").trim();
const bleuOcean    = (rootStyles.getPropertyValue("--bleu-ocean")    || "#0277BD").trim();
const noirArdoise  = (rootStyles.getPropertyValue("--noir-ardoise") || "#333333").trim();
const blanc        = (rootStyles.getPropertyValue("--blanc")        || "#ffffff").trim();
const grisClair    = (rootStyles.getPropertyValue("--gris-clair")   || "#f9f9f9").trim();
const grisFonce    = (rootStyles.getPropertyValue("--gris-fonce")   || "#555555").trim();
// couleur d'accent / or utilisée auparavant (#d4af37)
const accentColor  = (rootStyles.getPropertyValue("--accent-color") || "#d4af37").trim();
// couleur pour champs désactivés (fallback identique à #e0e0e0)
const disabledBg   = (rootStyles.getPropertyValue("--disabled-bg")  || "#e0e0e0").trim();

// ================== MENU BURGER ==================
function toggleMenu() {
  document.querySelector('.menu-links').classList.toggle('show');
}

// ================== ANIMATION FADE-IN ==================
document.addEventListener("DOMContentLoaded", () => {
  const imgs = document.querySelectorAll(".gallery img, .card img");
  imgs.forEach((img, index) => {
    setTimeout(() => {
      img.classList.add("show");
    }, 200 * index);
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

  // Si on n'est pas sur la page contenant ces éléments, on sort proprement
  if (!captchaLabel || !captchaInput || !retryBtn || !form) return;

  // applique quelques styles dynamiques (visuels cohérents avec la palette)
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

  if (captchaInfo) {
    captchaInfo.style.color = vertBasilic;
  }

  if (retryBtn) {
    retryBtn.style.background = rougeTomate;
    retryBtn.style.color = blanc;
    retryBtn.style.border = "none";
    retryBtn.style.borderRadius = "6px";
    retryBtn.style.padding = "8px 14px";
    retryBtn.style.cursor = "pointer";
  }

  // initialisation variables
  let solution = 0;
  let tries = 0;
  let timer = null;
  let timeLeft = 30;

  // ajuste la taille du canvas si présent
  if (clockCanvas) {
    clockCanvas.width = Math.max(80, Math.min(140, Math.round(window.innerWidth * 0.08)));
    clockCanvas.height = 36;
    clockCanvas.style.display = "none";
  }

  // === Générer une nouvelle opération ===
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

  // === Affichage numérique de l'horloge (format 00:00) ===
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

  // === Quand une tentative échoue ===
  function failAttempt(message) {
    tries++;
    captchaInput.value = "";

    if (captchaInfo) {
      captchaInfo.innerHTML = `<span class="error-message">
        ${message} Tentatives : ${tries}/3
      </span>`;
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

      // vider et griser le champ définitivement
      captchaInput.value = "";
      captchaInput.disabled = true;
      captchaInput.style.backgroundColor = disabledBg;

      if (captchaInfo) {
        captchaInfo.innerHTML = `
          <span style="color:${accentColor}; font-weight:bold; font-size:1.2rem;">
            🚫 3 tentatives échouées.
          </span><br>
          <button id="reloadBtn" style="
            margin:10px; padding:10px 20px; background:${accentColor}; color:${noirArdoise};
            border:none; border-radius:8px; font-weight:bold; cursor:pointer;
          ">🔄 Recharger la page</button>
          <button id="homeBtn" style="
            margin:10px; padding:10px 20px; background:${accentColor}; color:${noirArdoise};
            border:none; border-radius:8px; font-weight:bold; cursor:pointer;
          ">🏠 Retour à l'accueil</button>
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

  // === Lancer le timer ===
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

  // === Validation du formulaire ===
  form.addEventListener("submit", function (e) {
    if (captchaInput.value != solution) {
      e.preventDefault();
      failAttempt("❌ Mauvaise réponse.");
    }
  });

  // === Bouton nouvelle opération (déclenche aussi le timer + horloge) ===
  retryBtn.addEventListener("click", function () {
    newOperation();
    startTimer();
  });

  // === Première opération au chargement ===
  newOperation();
});

// ================== EMPÊCHER FORMULAIRE EN CACHE ==================
window.addEventListener("pageshow", function (event) {
  if (event.persisted) {
    window.location.reload();
  }
});

window.onload = function () {
  const form = document.querySelector("form");
  if (form) form.reset();
};

// ================== Zoom clone (toggle propre) ==================
document.addEventListener("DOMContentLoaded", () => {
  const imgs = document.querySelectorAll(".featured-dish img, .card img, .gallery img");
  let clone = null;
  let sourceImg = null;
  let overlay = document.querySelector('.zoom-overlay');

  // créer l'overlay s'il n'existe pas
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'zoom-overlay';
    document.body.appendChild(overlay);
  }

  function openZoom(img) {
    closeZoom(); // fermer si déjà un clone ouvert

    const rect = img.getBoundingClientRect();
    sourceImg = img;
    clone = img.cloneNode(true);
    clone.className = 'zoom-clone';

    // positionner le clone centré sur le centre de l'image d'origine
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    clone.style.left = cx + 'px';
    clone.style.top = cy + 'px';
    clone.style.width = rect.width + 'px';
    clone.style.height = rect.height + 'px';
    clone.style.transform = 'translate(-50%,-50%) scale(1)';

    document.body.appendChild(clone);

    // calculer échelle pour s'adapter à l'écran (90% viewport)
    const maxW = window.innerWidth * 0.9;
    const maxH = window.innerHeight * 0.9;
    const scaleW = maxW / rect.width;
    const scaleH = maxH / rect.height;
    const scale = Math.min(scaleW, scaleH, 2.8); // plafond pour éviter trop gros

    const finalWidth = Math.round(rect.width * scale);
    const finalHeight = Math.round(rect.height * scale);

    // forcer reflow avant animation
    clone.getBoundingClientRect();

    // afficher overlay + bloquer scroll
    overlay.classList.add('show');
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    // animer vers le centre et la taille finale
    requestAnimationFrame(() => {
      clone.style.left = '50%';
      clone.style.top = '50%';
      clone.style.width = finalWidth + 'px';
      clone.style.height = finalHeight + 'px';
      // on garde transform translate(-50%,-50%) (déjà appliqué)
    });

    // clic sur le clone le ferme
    clone.addEventListener('click', (e) => {
      e.stopPropagation();
      closeZoom();
    });
  }

  function closeZoom() {
    if (!clone || !sourceImg) return;

    // revenir à la position/size d'origine avant suppression
    const rect = sourceImg.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    overlay.classList.remove('show');
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';

    clone.style.left = cx + 'px';
    clone.style.top = cy + 'px';
    clone.style.width = rect.width + 'px';
    clone.style.height = rect.height + 'px';

    // supprimer le clone après la fin de la transition
    clone.addEventListener('transitionend', function cleanup() {
      if (clone && clone.parentNode) clone.parentNode.removeChild(clone);
      clone = null;
      sourceImg = null;
      this.removeEventListener('transitionend', cleanup);
    }, { once: true });
  }

  // attacher handlers
  imgs.forEach(img => {
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      // si le clone déjà ouvert pour cette image => fermer
      if (clone && sourceImg === img) {
        closeZoom();
      } else {
        openZoom(img);
      }
    });
  });

  // clic hors image ferme
  overlay.addEventListener('click', closeZoom);
  document.addEventListener('click', () => { if (clone) closeZoom(); });

  // Échap ferme aussi
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeZoom(); });

  // si rotation/redim, on ferme pour éviter incohérences
  window.addEventListener('resize', () => { if (clone) closeZoom(); });
});
