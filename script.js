/* =========================================================
   Te amo, Darcy — interactions
   ========================================================= */

// ---- Mensajes especiales por botón -------------------------------------
const MESSAGES = {
  duda: "Cuando dudes de ti, recuerda que yo te veo con una claridad que tú a veces te niegas. Eres más de lo que crees.",
  lejos: "La distancia no cambia nada de lo que siento. Sigues siendo el lugar al que vuelven mis pensamientos, esté donde esté.",
  sonrie: "Cada vez que sonríes, el mundo se ordena un poco. Ojalá pudieras verte como yo te veo en ese instante.",
  malDia: "Si hoy fue difícil, respira. Estoy contigo, incluso en los días donde no alcanzan las palabras para arreglar nada.",
  futuro: "Quiero los días simples contigo: los comunes, los aburridos, los de siempre. Ahí es donde más quiero estar.",
  hoy: "Solo por hoy, quiero que sepas esto: te amo sin condiciones y sin necesitar un motivo especial para decirlo."
};

// ---- Elementos -----------------------------------------------------------
const overlay = document.getElementById('overlay');
const heartCard = document.getElementById('heartCard');
const heartMessageEl = document.getElementById('heartMessage');
const closeBtn = document.getElementById('closeBtn');
const buttonsGrid = document.getElementById('buttonsGrid');
const scrollCue = document.getElementById('scrollCue');

// ---- Abrir mensaje ---------------------------------------------------------
function openMessage(key) {
  const text = MESSAGES[key] || "Te amo, Darcy.";
  heartMessageEl.textContent = text;
  overlay.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  spawnBurst();
}

function closeMessage() {
  overlay.classList.remove('is-open');
  document.body.style.overflow = '';
}

buttonsGrid.addEventListener('click', (e) => {
  const btn = e.target.closest('.msg-btn');
  if (!btn) return;
  openMessage(btn.dataset.key);
});

closeBtn.addEventListener('click', closeMessage);

overlay.addEventListener('click', (e) => {
  if (e.target === overlay) closeMessage();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeMessage();
});

scrollCue.addEventListener('click', () => {
  document.getElementById('reasons').scrollIntoView({ behavior: 'smooth' });
});

// ---- Pequeño estallido de corazones al abrir un mensaje -------------------
function spawnBurst() {
  const rect = heartCard.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;
  const count = 14;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.className = 'burst-heart';
    el.textContent = '♥';

    const angle = Math.random() * Math.PI * 2;
    const distance = 60 + Math.random() * 120;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance - 40; // sesgo hacia arriba

    el.style.left = `${originX}px`;
    el.style.top = `${originY}px`;
    el.style.setProperty('--dx', `${dx}px`);
    el.style.setProperty('--dy', `${dy}px`);
    el.style.setProperty('--rot', `${(Math.random() * 60 - 30)}deg`);
    el.style.fontSize = `${0.8 + Math.random() * 1}rem`;

    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1500);
  }
}

// ---- Fondo ambiental: corazones flotando en canvas ------------------------
const canvas = document.getElementById('hearts-bg');
const ctx = canvas.getContext('2d');
let hearts = [];
let animationId;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createHeart() {
  return {
    x: Math.random() * canvas.width,
    y: canvas.height + 40 + Math.random() * canvas.height,
    size: 6 + Math.random() * 12,
    speed: 0.3 + Math.random() * 0.6,
    drift: (Math.random() - 0.5) * 0.6,
    opacity: 0.08 + Math.random() * 0.18,
    wobble: Math.random() * Math.PI * 2
  };
}

function drawHeart(h) {
  const s = h.size;
  ctx.save();
  ctx.translate(h.x + Math.sin(h.wobble) * 10, h.y);
  ctx.globalAlpha = h.opacity;
  ctx.fillStyle = '#f0b3ae';
  ctx.beginPath();
  ctx.moveTo(0, s * 0.3);
  ctx.bezierCurveTo(-s / 2, -s * 0.3, -s, s * 0.15, 0, s);
  ctx.bezierCurveTo(s, s * 0.15, s / 2, -s * 0.3, 0, s * 0.3);
  ctx.fill();
  ctx.restore();
}

function tick() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const h of hearts) {
    h.y -= h.speed;
    h.x += h.drift;
    h.wobble += 0.01;
    if (h.y < -40) {
      Object.assign(h, createHeart(), { y: canvas.height + 40 });
    }
    drawHeart(h);
  }
  animationId = requestAnimationFrame(tick);
}

function initHearts() {
  resizeCanvas();
  const count = window.innerWidth < 640 ? 16 : 30;
  hearts = Array.from({ length: count }, createHeart);
  cancelAnimationFrame(animationId);
  tick();
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  window.addEventListener('resize', resizeCanvas);
  initHearts();
} else {
  resizeCanvas();
}
