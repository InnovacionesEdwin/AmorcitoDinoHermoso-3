/* =========================================================
   SEPTIEMBRE EN FLOR — script.js
   JavaScript vanilla ES6+, sin dependencias externas.
   ========================================================= */

'use strict';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------------------------------------------------
   1. MENÚ MÓVIL
   --------------------------------------------------------- */
const initMobileMenu = () => {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('navMenu');
  if (!toggle || !nav) return;

  const closeMenu = () => {
    toggle.classList.remove('is-open');
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  const toggleMenu = () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  };

  toggle.addEventListener('click', toggleMenu);
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => {
    if (window.innerWidth > 760) closeMenu();
  });
};

/* ---------------------------------------------------------
   2. APARICIÓN AL HACER SCROLL (Intersection Observer)
   --------------------------------------------------------- */
const initScrollReveal = () => {
  const targets = document.querySelectorAll('.reveal-on-scroll');
  if (!targets.length) return;

  if (prefersReducedMotion) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach((el) => observer.observe(el));
};

/* ---------------------------------------------------------
   3. MODO OSCURO
   --------------------------------------------------------- */
const initThemeToggle = () => {
  const button = document.getElementById('themeToggle');
  if (!button) return;

  const icon = button.querySelector('.theme-toggle-icon');
  const label = button.querySelector('.theme-toggle-text');
  const stored = localStorage.getItem('septiembre-tema');

  const applyTheme = (theme) => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      icon.textContent = '☀️';
      label.textContent = 'Modo claro';
      button.setAttribute('aria-pressed', 'true');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      icon.textContent = '🌙';
      label.textContent = 'Modo oscuro';
      button.setAttribute('aria-pressed', 'false');
    }
  };

  if (stored) applyTheme(stored);

  button.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('septiembre-tema', next);
  });
};

/* ---------------------------------------------------------
   4. CAPA AMBIENTAL — pétalos flotando de fondo
   --------------------------------------------------------- */
const initAmbientLayer = () => {
  const layer = document.getElementById('ambientLayer');
  if (!layer || prefersReducedMotion) return;

  const symbols = ['🌼', '🌻', '✿'];
  const total = window.innerWidth < 600 ? 8 : 14;

  for (let i = 0; i < total; i += 1) {
    const petal = document.createElement('span');
    petal.className = 'ambient-petal';
    petal.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.setProperty('--drift', `${Math.random() * 120 - 60}px`);
    petal.style.fontSize = `${0.8 + Math.random() * 1}rem`;
    petal.style.animationDuration = `${14 + Math.random() * 16}s`;
    petal.style.animationDelay = `-${Math.random() * 20}s`;
    layer.appendChild(petal);
  }
};

/* ---------------------------------------------------------
   5. PARALLAX SUAVE DEL HERO CON EL MOUSE
   --------------------------------------------------------- */
const initHeroParallax = () => {
  const hero = document.getElementById('heroSection');
  const content = document.getElementById('heroContent');
  const flowers = document.getElementById('heroFlowers');
  if (!hero || !content || prefersReducedMotion) return;
  if (window.matchMedia('(hover: none)').matches) return; // evita en pantallas táctiles

  hero.addEventListener('mousemove', (event) => {
    const rect = hero.getBoundingClientRect();
    const relX = (event.clientX - rect.left) / rect.width - 0.5;
    const relY = (event.clientY - rect.top) / rect.height - 0.5;

    content.style.setProperty('--mx', (relX * -14).toFixed(2));
    content.style.setProperty('--my', (relY * -10).toFixed(2));

    if (flowers) {
      flowers.style.transform = `translate(${relX * -18}px, ${relY * -8}px)`;
    }
  });

  hero.addEventListener('mouseleave', () => {
    content.style.setProperty('--mx', 0);
    content.style.setProperty('--my', 0);
    if (flowers) flowers.style.transform = 'translate(0, 0)';
  });
};

/* ---------------------------------------------------------
   6. INCLINACIÓN 3D DE LAS TARJETAS-FLOR
   --------------------------------------------------------- */
const initFlowerTilt = () => {
  const cards = document.querySelectorAll('.flower-btn');
  if (!cards.length || prefersReducedMotion) return;
  if (window.matchMedia('(hover: none)').matches) return;

  cards.forEach((card) => {
    card.addEventListener('mousemove', (event) => {
      const rect = card.getBoundingClientRect();
      const relX = (event.clientX - rect.left) / rect.width - 0.5;
      const relY = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty('--ry', `${relX * 14}deg`);
      card.style.setProperty('--rx', `${relY * -14}deg`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--ry', '0deg');
      card.style.setProperty('--rx', '0deg');
    });
  });
};

/* ---------------------------------------------------------
   7. JARDÍN INTERACTIVO — 10 efectos distintos
   --------------------------------------------------------- */
const EFFECTS = {
  petalos: { mensaje: 'Un poco de septiembre cae sobre ti.' },
  aroma: { mensaje: 'Huele a girasoles recién abiertos y a mañana fresca.' },
  rayo: { mensaje: 'Un rayo de sol atraviesa las hojas y llega justo hasta aquí.' },
  viento: { mensaje: 'El viento mueve el campo entero, despacio, sin prisa.' },
  deseo: { mensaje: 'Deseo dorado: que todo lo bueno te encuentre primero.' },
  latido: { mensaje: 'Cada vez que pienso en ti, algo dentro late un poco más fuerte.' },
  recuerdo: { mensaje: 'Guardado entre pétalos: un recuerdo cálido, solo para ti.' },
  tarde: { mensaje: 'La tarde se pinta de miel. Es la hora favorita del jardín.' },
  secreto: { mensaje: 'Psst... este jardín se plantó pensando en una sola persona.' },
  final: { mensaje: 'Para ti, Darcy. Todo este jardín, este mes, este gesto: para ti.' },
};

const spawnPetals = (stage, count = 14) => {
  const symbols = ['🌼', '🌻', '🌸'];
  for (let i = 0; i < count; i += 1) {
    const petal = document.createElement('span');
    petal.className = 'petal';
    petal.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    petal.style.left = `${Math.random() * 96}%`;
    petal.style.animationDuration = `${1.6 + Math.random() * 1.4}s`;
    petal.style.animationDelay = `${Math.random() * 0.6}s`;
    petal.style.fontSize = `${1 + Math.random() * 0.8}rem`;
    stage.appendChild(petal);
    petal.addEventListener('animationend', () => petal.remove());
  }
};

const spawnHearts = (stage, count = 16) => {
  for (let i = 0; i < count; i += 1) {
    const heart = document.createElement('span');
    heart.className = 'heart-piece';
    heart.textContent = Math.random() > 0.5 ? '💛' : '🤍';
    heart.style.left = `${Math.random() * 96}%`;
    heart.style.animationDuration = `${1.6 + Math.random() * 1.4}s`;
    heart.style.animationDelay = `${Math.random() * 0.7}s`;
    heart.style.fontSize = `${0.9 + Math.random() * 0.7}rem`;
    stage.appendChild(heart);
    heart.addEventListener('animationend', () => heart.remove());
  }
};

const spawnSparks = (stage, count = 16) => {
  const rect = stage.getBoundingClientRect();
  const originX = rect.width / 2;
  const originY = rect.height / 2;

  for (let i = 0; i < count; i += 1) {
    const spark = document.createElement('span');
    spark.className = 'spark';
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
    const distance = 60 + Math.random() * 70;
    spark.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
    spark.style.setProperty('--ty', `${Math.sin(angle) * distance}px`);
    spark.style.left = `${originX}px`;
    spark.style.top = `${originY}px`;
    stage.appendChild(spark);
    spark.addEventListener('animationend', () => spark.remove());
  }
};

const initGarden = () => {
  const stage = document.getElementById('revealStage');
  const buttons = document.querySelectorAll('.flower-btn');
  if (!stage || !buttons.length) return;

  const clearStageEffectClasses = () => {
    stage.classList.remove('efecto-rayo', 'efecto-viento', 'efecto-final', 'efecto-latido');
  };

  const renderEffect = (key, button) => {
    const data = EFFECTS[key];
    if (!data) return;

    clearStageEffectClasses();
    stage.innerHTML = '';

    const message = document.createElement('p');
    message.className = 'reveal-message';
    message.textContent = data.mensaje;
    stage.appendChild(message);

    button.classList.add('is-visited');

    if (prefersReducedMotion) return;

    switch (key) {
      case 'petalos':
      case 'recuerdo':
        spawnPetals(stage, 12);
        break;
      case 'rayo':
      case 'tarde':
        stage.classList.add('efecto-rayo');
        break;
      case 'viento':
        stage.classList.add('efecto-viento');
        break;
      case 'deseo':
      case 'secreto':
        spawnSparks(stage, 18);
        break;
      case 'latido':
        stage.classList.add('efecto-latido');
        spawnHearts(stage, 8);
        break;
      case 'final':
        stage.classList.add('efecto-final');
        spawnPetals(stage, 14);
        spawnHearts(stage, 14);
        spawnSparks(stage, 16);
        break;
      default:
        break;
    }
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const effectKey = button.dataset.effect;
      renderEffect(effectKey, button);

      if (effectKey === 'final') {
        window.setTimeout(() => {
          document.getElementById('dedicatoria')?.scrollIntoView({ behavior: 'smooth' });
        }, 900);
      }
    });
  });
};

/* ---------------------------------------------------------
   8. CARRUSEL DE PALABRAS ROTATIVAS
   --------------------------------------------------------- */
const WORDS = [
  'Cada septiembre confirma que hay personas irremplazables.',
  'Contigo hasta lo ordinario se siente como un buen día.',
  'Hay una calma bonita en las personas que hacen bien las cosas.',
  'Eres de las personas que uno quiere seguir eligiendo.',
  'Ojalá supieras cuánto suma tenerte cerca.',
  'Sonríes y, sin darte cuenta, arreglas el día de alguien.',
];

const initWordsCarousel = () => {
  const textEl = document.getElementById('wordsText');
  const dotsEl = document.getElementById('wordsDots');
  const prevBtn = document.getElementById('wordsPrev');
  const nextBtn = document.getElementById('wordsNext');
  if (!textEl || !dotsEl || !prevBtn || !nextBtn) return;

  let index = 0;
  let timer = null;

  const renderDots = () => {
    dotsEl.innerHTML = '';
    WORDS.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Ver palabra ${i + 1}`);
      dot.className = i === index ? 'is-active' : '';
      dot.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(dot);
    });
  };

  const show = () => {
    textEl.style.animation = 'none';
    // Forzar reflow para reiniciar la animación de entrada del texto
    void textEl.offsetWidth;
    textEl.style.animation = '';
    textEl.textContent = `“${WORDS[index]}”`;
    renderDots();
  };

  const goTo = (i) => {
    index = (i + WORDS.length) % WORDS.length;
    show();
    restartAutoplay();
  };

  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  const restartAutoplay = () => {
    if (prefersReducedMotion) return;
    window.clearInterval(timer);
    timer = window.setInterval(next, 6000);
  };

  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);

  show();
  restartAutoplay();
};

/* ---------------------------------------------------------
   9. FLORES DECORATIVAS DEL HERO (generadas por JS)
   --------------------------------------------------------- */
const initHeroFlowers = () => {
  const group = document.getElementById('heroFlowers');
  if (!group) return;

  const svgNS = 'http://www.w3.org/2000/svg';
  const total = 9;

  for (let i = 0; i < total; i += 1) {
    const cx = 60 + (1080 / total) * i + (Math.random() * 40 - 20);
    const cy = 430 + Math.random() * 40;
    const scale = 0.7 + Math.random() * 0.6;

    const flower = document.createElementNS(svgNS, 'g');
    flower.setAttribute('transform', `translate(${cx} ${cy}) scale(${scale})`);
    flower.setAttribute('opacity', '0.9');

    const stem = document.createElementNS(svgNS, 'line');
    stem.setAttribute('x1', '0');
    stem.setAttribute('y1', '0');
    stem.setAttribute('x2', '0');
    stem.setAttribute('y2', '60');
    stem.setAttribute('stroke', 'var(--color-verde)');
    stem.setAttribute('stroke-width', '3');
    flower.appendChild(stem);

    for (let p = 0; p < 6; p += 1) {
      const angle = (360 / 6) * p;
      const petal = document.createElementNS(svgNS, 'ellipse');
      petal.setAttribute('cx', '0');
      petal.setAttribute('cy', '-14');
      petal.setAttribute('rx', '6');
      petal.setAttribute('ry', '13');
      petal.setAttribute('fill', 'var(--color-sol)');
      petal.setAttribute('transform', `rotate(${angle})`);
      flower.appendChild(petal);
    }

    const center = document.createElementNS(svgNS, 'circle');
    center.setAttribute('cx', '0');
    center.setAttribute('cy', '0');
    center.setAttribute('r', '6');
    center.setAttribute('fill', 'var(--color-ocre)');
    flower.appendChild(center);

    group.appendChild(flower);
  }
};

/* ---------------------------------------------------------
   INICIALIZACIÓN
   --------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initScrollReveal();
  initThemeToggle();
  initAmbientLayer();
  initHeroParallax();
  initFlowerTilt();
  initGarden();
  initWordsCarousel();
  initHeroFlowers();
});
