// ===========================================
// 1. CHARACTER HOVER FONT ANIMATION (Hero Name)
// ===========================================
const fonts = [
  { family: "'Playfair Display', serif", weight: '900', style: 'normal' },
  { family: "'Cormorant Garamond', serif", weight: '300', style: 'italic' },
  { family: "'Syne', sans-serif", weight: '800', style: 'normal' },
  { family: "'Bricolage Grotesque', sans-serif", weight: '800', style: 'normal' },
  { family: "'Climate Crisis', cursive", weight: '400', style: 'normal' },
  { family: "'Bodoni Moda', serif", weight: '900', style: 'normal' },
  { family: "'Fraunces', serif", weight: '900', style: 'normal' },
  { family: "'Space Mono', monospace", weight: '700', style: 'normal' },
  { family: "'Playfair Display', serif", weight: '400', style: 'italic' },
  { family: "'Bricolage Grotesque', sans-serif", weight: '200', style: 'normal' },
];

const nameText = "gabe linares";
const heroNameEl = document.getElementById('hero-name');

nameText.split('').forEach((char, i) => {
  if (char === ' ') {
    const space = document.createElement('span');
    space.className = 'word-space';
    heroNameEl.appendChild(space);
  } else {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = char;

    span.addEventListener('mouseenter', () => {
      const randomFont = fonts[Math.floor(Math.random() * fonts.length)];
      span.style.fontFamily = randomFont.family;
      span.style.fontWeight = randomFont.weight;
      span.style.fontStyle = randomFont.style;
      span.style.transform = `rotate(${(Math.random() - 0.5) * 6}deg)`;
    });

    span.addEventListener('mouseleave', () => {
      span.style.fontFamily = '';
      span.style.fontWeight = '';
      span.style.fontStyle = '';
      span.style.transform = '';
    });

    heroNameEl.appendChild(span);
  }
});

// ===========================================
// 1b. AMBIENT GLITCHES ON NAME
// ===========================================
const allChars = heroNameEl.querySelectorAll('.char');

function ambientGlitch() {
  const count = Math.random() > 0.6 ? 2 : 1;
  const glitched = [];

  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * allChars.length);
    const char = allChars[idx];
    if (char.matches(':hover')) continue;

    const randomFont = fonts[Math.floor(Math.random() * fonts.length)];
    char.style.fontFamily = randomFont.family;
    char.style.fontWeight = randomFont.weight;
    char.style.fontStyle = randomFont.style;
    char.style.color = 'var(--accent)';
    glitched.push(char);
  }

  const revertDelay = 200 + Math.random() * 400;
  setTimeout(() => {
    glitched.forEach(char => {
      if (!char.matches(':hover')) {
        char.style.fontFamily = '';
        char.style.fontWeight = '';
        char.style.fontStyle = '';
        char.style.color = '';
      }
    });
  }, revertDelay);

  const nextDelay = 3000 + Math.random() * 4000;
  setTimeout(ambientGlitch, nextDelay);
}

setTimeout(ambientGlitch, 4000);

// ===========================================
// 2. CUSTOM CURSOR
// ===========================================
const cursor = document.getElementById('cursor');
let cursorX = 0, cursorY = 0;
let actualX = 0, actualY = 0;

document.addEventListener('mousemove', (e) => {
  cursorX = e.clientX;
  cursorY = e.clientY;
});

function animateCursor() {
  actualX += (cursorX - actualX) * 0.15;
  actualY += (cursorY - actualY) * 0.15;
  cursor.style.left = actualX + 'px';
  cursor.style.top = actualY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Cursor hover states
document.querySelectorAll('a, button, .contact-link').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
});

// ===========================================
// 3. SCROLL-FILL TEXT + BG + ILLUSTRATIONS
// ===========================================
const manifestoBlocks = document.querySelectorAll('[data-manifesto]');
const allBlockWords = [];

manifestoBlocks.forEach(block => {
  const rawHTML = block.innerHTML;
  block.innerHTML = '';
  const temp = document.createElement('div');
  temp.innerHTML = rawHTML;
  const wordSpans = [];

  temp.childNodes.forEach(node => {
    if (node.nodeType === 3) {
      node.textContent.trim().split(/\s+/).filter(w => w).forEach(w => {
        const span = document.createElement('span');
        span.className = 'word';
        span.textContent = w;
        wordSpans.push(span);
      });
    } else if (node.tagName === 'SPAN' && node.classList.contains('h')) {
      node.textContent.trim().split(/\s+/).filter(w => w).forEach(w => {
        const span = document.createElement('span');
        span.className = 'word highlight';
        span.textContent = w;
        wordSpans.push(span);
      });
    }
  });

  wordSpans.forEach(s => block.appendChild(s));
  allBlockWords.push({ el: block, words: wordSpans });
});

// --- Background color transitions ---
const bgLayer = document.getElementById('bg-layer');
const bgSections = document.querySelectorAll('[data-bg]');

function updateBackground() {
  const windowCenter = window.innerHeight * 0.5;
  let closestSection = null;
  let closestDist = Infinity;

  bgSections.forEach(section => {
    const rect = section.getBoundingClientRect();
    const sectionCenter = rect.top + rect.height * 0.5;
    const dist = Math.abs(sectionCenter - windowCenter);
    if (dist < closestDist) {
      closestDist = dist;
      closestSection = section;
    }
  });

  if (closestSection) {
    bgLayer.style.backgroundColor = closestSection.dataset.bg;
  }
}

// --- Orbit illustration (scroll-driven rotation) ---
const orbitEl = document.getElementById('illust-orbit');
const orbitRings = orbitEl.querySelectorAll('.ring');

function updateOrbit() {
  const rect = orbitEl.parentElement.getBoundingClientRect();
  const wh = window.innerHeight;
  const progress = Math.max(0, Math.min(1, (wh - rect.top) / (wh + rect.height)));

  if (progress > 0.05) {
    orbitEl.classList.add('in-view');
  } else {
    orbitEl.classList.remove('in-view');
  }

  const angle = progress * 360;
  orbitRings[0].style.transform = `rotate(${angle}deg)`;
  orbitRings[1].style.transform = `rotate(${-angle * 1.5}deg)`;
  orbitRings[2].style.transform = `rotate(${angle * 2.2}deg)`;
}

// --- Circuit illustration (sequential fill) ---
const circuitSteps = document.querySelectorAll('#illust-circuit [data-step]');
const totalSteps = circuitSteps.length;

function updateCircuit() {
  const rect = document.getElementById('illust-circuit-wrap').getBoundingClientRect();
  const wh = window.innerHeight;
  const progress = Math.max(0, Math.min(1, (wh * 0.6 - rect.top) / (rect.height + wh * 0.2)));
  const activeSteps = Math.floor(progress * (totalSteps + 1));

  circuitSteps.forEach(el => {
    const step = parseInt(el.dataset.step);
    if (step < activeSteps) {
      el.classList.add('lit');
    } else {
      el.classList.remove('lit');
    }
  });
}

// --- Radar illustration (scroll-driven sweep + blips) ---
const radarEl = document.getElementById('illust-radar');
const radarSweep = document.getElementById('radar-sweep');
const radarBlips = [0,1,2,3].map(i => ({
  dot: document.getElementById(`blip-${i}`),
  label: document.getElementById(`blip-label-${i}`)
}));
const blipAngles = [320, 30, 200, 250];

function updateRadar() {
  const rect = radarEl.parentElement.getBoundingClientRect();
  const wh = window.innerHeight;
  const progress = Math.max(0, Math.min(1, (wh * 0.7 - rect.top) / (rect.height + wh * 0.3)));

  if (progress > 0.05) {
    radarEl.classList.add('in-view');
  } else {
    radarEl.classList.remove('in-view');
  }

  const sweepAngle = progress * 720;
  radarSweep.style.transform = `rotate(${sweepAngle}deg)`;

  radarBlips.forEach((blip, i) => {
    const normalizedSweep = sweepAngle % 360;
    const diff = (normalizedSweep - blipAngles[i] + 360) % 360;
    if (diff < 180 && diff > 0 && progress > 0.15) {
      blip.dot.classList.add('visible');
      blip.label.classList.add('visible');
    } else if (progress < 0.1) {
      blip.dot.classList.remove('visible');
      blip.label.classList.remove('visible');
    }
  });
}

// --- Combined manifesto update ---
function updateManifesto() {
  const windowHeight = window.innerHeight;

  allBlockWords.forEach(({ el, words }) => {
    const rect = el.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1,
      (windowHeight * 0.85 - rect.top) / (rect.height + windowHeight * 0.15)
    ));
    const activeCount = Math.floor(progress * words.length);
    words.forEach((word, i) => {
      if (i < activeCount) {
        word.classList.add('active');
      } else {
        word.classList.remove('active');
      }
    });
  });

  updateBackground();
  updateOrbit();
  updateCircuit();
  updateRadar();
}

// ===========================================
// 4. PROJECT HOVER — SCANLINE IMAGE + ROW EXPAND + GLITCH META
// ===========================================
const GLITCH_CHARS = '!<>-_\\/[]{}=+*^?#@$%~';

function scrambleMeta(el, targetText) {
  const original = el.dataset.originalMeta || el.textContent;
  if (!el.dataset.originalMeta) el.dataset.originalMeta = original;
  let frame = 0;
  const total = 28;
  const resolveStart = 10;
  cancelAnimationFrame(el._scrambleRaf);
  const tick = () => {
    if (frame >= total) { el.textContent = targetText; return; }
    const progress = Math.max(0, (frame - resolveStart) / (total - resolveStart));
    const resolved = Math.floor(progress * targetText.length);
    let out = '';
    for (let i = 0; i < targetText.length; i++) {
      if (i < resolved) out += targetText[i];
      else if (targetText[i] === ' ' || targetText[i] === '·') out += targetText[i];
      else out += GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
    }
    el.textContent = out;
    frame++;
    el._scrambleRaf = requestAnimationFrame(tick);
  };
  tick();
}

function unscrambleMeta(el) {
  cancelAnimationFrame(el._scrambleRaf);
  if (el.dataset.originalMeta) el.textContent = el.dataset.originalMeta;
}

const projectItems = document.querySelectorAll('.project-item');
let activeHoverImg = null;
let hoverImgX = 0, hoverImgY = 0;
let hoverTargetX = 0, hoverTargetY = 0;
let hoverMouseReady = false;
let leaveTimeout = null;

projectItems.forEach(item => {
  const img = document.getElementById(`hover-img-${item.dataset.hoverImg}`);
  const metaEl = item.querySelector('.project-item-meta');

  item.addEventListener('mouseenter', (e) => {
    clearTimeout(leaveTimeout);

    hoverImgX = e.clientX + 24;
    hoverImgY = e.clientY - 160;
    hoverTargetX = hoverImgX;
    hoverTargetY = hoverImgY;
    img.style.left = hoverImgX + 'px';
    img.style.top = hoverImgY + 'px';
    activeHoverImg = img;
    hoverMouseReady = true;

    img.style.transition = 'clip-path 0.45s ease';
    img.style.transform = 'scale(1)';
    img.style.opacity = '1';
    img.style.clipPath = 'inset(100% 0 0 0)';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      img.style.clipPath = 'inset(0% 0 0 0)';
    }));

    if (metaEl && item.dataset.result) scrambleMeta(metaEl, item.dataset.result);
  });

  item.addEventListener('mouseleave', () => {
    img.style.transition = 'clip-path 0.35s ease';
    img.style.clipPath = 'inset(100% 0 0 0)';
    leaveTimeout = setTimeout(() => { img.style.opacity = '0'; }, 350);

    if (metaEl) unscrambleMeta(metaEl);

    activeHoverImg = null;
    hoverMouseReady = false;
  });
});

document.addEventListener('mousemove', (e) => {
  hoverTargetX = e.clientX + 24;
  hoverTargetY = e.clientY - 160;
});

function animateHoverImg() {
  if (activeHoverImg && hoverMouseReady) {
    hoverImgX += (hoverTargetX - hoverImgX) * 0.12;
    hoverImgY += (hoverTargetY - hoverImgY) * 0.12;
    activeHoverImg.style.left = hoverImgX + 'px';
    activeHoverImg.style.top = hoverImgY + 'px';
  }
  requestAnimationFrame(animateHoverImg);
}
animateHoverImg();

// ===========================================
// 5. INTERSECTION OBSERVER (Reveal animations)
// ===========================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===========================================
// 6. CHART BAR ANIMATION
// ===========================================
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.chart-bar-fill').forEach((bar, i) => {
        setTimeout(() => bar.classList.add('animated'), i * 100);
      });
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.chart-bar-container').forEach(el => barObserver.observe(el));

// ===========================================
// 7. SCROLL-DRIVEN NAME -> NAV LOGO (pixel-perfect)
// ===========================================
const navLogo = document.getElementById('nav-logo');
const heroSection = document.getElementById('hero');
const heroSpacer = document.querySelector('.hero-name-spacer');

let startX, startY, targetX, targetY, targetScaleVal, scrollThreshold;

function measurePositions() {
  const spacerRect = heroSpacer.getBoundingClientRect();
  startX = spacerRect.left + window.scrollX;
  startY = spacerRect.top + window.scrollY;

  const logoRect = navLogo.getBoundingClientRect();
  targetX = logoRect.left;
  targetY = logoRect.top;

  targetScaleVal = logoRect.height / heroNameEl.offsetHeight;

  scrollThreshold = heroSection.offsetHeight * 0.55;
}

measurePositions();
window.addEventListener('resize', measurePositions);

let lerpX, lerpY, lerpScale;
lerpX = startX;
lerpY = startY;
lerpScale = 1;

function updateNameScroll() {
  const scrollY = window.scrollY;
  const rawProgress = Math.max(0, Math.min(1, scrollY / scrollThreshold));

  const progress = 1 - Math.pow(1 - rawProgress, 2.5);

  const naturalY = startY - scrollY;
  const goalX = startX + (targetX - startX) * progress;
  const goalY = naturalY + (targetY - naturalY) * progress;
  const goalScale = 1 + (targetScaleVal - 1) * progress;

  const lerpFactor = 0.12;
  lerpX += (goalX - lerpX) * lerpFactor;
  lerpY += (goalY - lerpY) * lerpFactor;
  lerpScale += (goalScale - lerpScale) * lerpFactor;

  heroNameEl.style.transform = `translate(${lerpX}px, ${lerpY}px) scale(${lerpScale})`;

  if (rawProgress > 0.9) {
    heroNameEl.style.pointerEvents = 'none';
  } else {
    heroNameEl.style.pointerEvents = 'auto';
  }
}

function tickNameScroll() {
  updateNameScroll();
  requestAnimationFrame(tickNameScroll);
}

tickNameScroll();

window.addEventListener('scroll', () => {
  updateManifesto();
}, { passive: true });

// Initial call
updateManifesto();

// ===========================================
// 8. SMOOTH SCROLL FOR NAV LINKS
// ===========================================
document.querySelectorAll('[data-link]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===========================================
// 9. WORD ROTATORS (input + output, staggered)
// ===========================================
function sizeRotator(container, activeItem) {
  const measure = activeItem.cloneNode(true);
  measure.style.position = 'absolute';
  measure.style.visibility = 'hidden';
  measure.style.whiteSpace = 'nowrap';
  measure.classList.add('active');
  container.appendChild(measure);
  container.style.width = measure.offsetWidth + 'px';
  container.removeChild(measure);
}

function setupRotator(containerId, interval) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const items = container.querySelectorAll('.word-rotator-item');
  let current = 0;

  sizeRotator(container, items[0]);

  setInterval(() => {
    const cur = items[current];
    cur.classList.remove('active');
    cur.classList.add('exit');

    current = (current + 1) % items.length;

    const next = items[current];
    next.classList.remove('exit');
    next.classList.add('active');
    sizeRotator(container, next);

    setTimeout(() => { cur.classList.remove('exit'); }, 500);
  }, interval);
}

setupRotator('word-rotator-input', 2400);
setTimeout(() => setupRotator('word-rotator-output', 2400), 1200);

// ===========================================
// 10. LIVE CLOCK (Sao Paulo time)
// ===========================================
const heroTime = document.getElementById('hero-time');
function updateClock() {
  const now = new Date();
  const sp = now.toLocaleTimeString('en-US', {
    timeZone: 'America/Sao_Paulo',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  heroTime.textContent = sp + ' BRT';
}
updateClock();
setInterval(updateClock, 1000);

// ===========================================
// 11. CONTACT MODAL
// ===========================================
const contactModal = document.getElementById('contactModal');
const openBtn = document.getElementById('openContactModal');
const closeBtn = document.getElementById('closeContactModal');

function openModal() {
  contactModal.classList.add('open');
  contactModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  contactModal.classList.remove('open');
  contactModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

if (openBtn) openBtn.addEventListener('click', openModal);
if (closeBtn) closeBtn.addEventListener('click', closeModal);

// Close on backdrop click
contactModal?.addEventListener('click', (e) => {
  if (e.target === contactModal) closeModal();
});

// Close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && contactModal?.classList.contains('open')) closeModal();
});

// Auto-open if redirected back after send
if (window.location.search.includes('sent=1')) {
  document.querySelector('.contact-modal-title').textContent = 'Message sent.';
  document.querySelector('.contact-modal-sub').textContent = "Got it. I'll be in touch within 24h.";
  document.querySelector('.contact-form').innerHTML = '<p style="color:var(--accent);font-family:var(--mono);font-size:0.8rem;letter-spacing:0.08em;">✓ Delivered to inbox.</p>';
  openModal();
  history.replaceState({}, '', window.location.pathname);
}
