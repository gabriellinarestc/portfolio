// Mobile nav — build from sidebar links
(function() {
  var sidebar = document.querySelector('.case-sidebar');
  if (!sidebar || window.innerWidth > 768) return;
  var links = sidebar.querySelectorAll('a');
  if (!links.length) return;

  var nav = document.createElement('div');
  nav.className = 'case-mobile-nav';

  var back = document.createElement('a');
  back.href = '../index.html#work';
  back.className = 'case-back-mobile';
  back.innerHTML = '<svg viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg> Back';

  var select = document.createElement('select');
  select.className = 'case-nav-select';
  links.forEach(function(link) {
    var opt = document.createElement('option');
    opt.value = link.getAttribute('href');
    opt.textContent = link.textContent;
    if (link.classList.contains('active')) opt.selected = true;
    select.appendChild(opt);
  });
  select.addEventListener('change', function() {
    var id = this.value.substring(1);
    var target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  nav.appendChild(back);
  nav.appendChild(select);
  document.body.prepend(nav);

  // Update select on scroll
  var sections = document.querySelectorAll('.case-section');
  window.addEventListener('scroll', function() {
    var current = '';
    sections.forEach(function(s) {
      if (s.getBoundingClientRect().top < window.innerHeight * 0.4) current = s.id;
    });
    if (current) select.value = '#' + current;
  }, { passive: true });
})();

// Custom cursor
const cursor = document.getElementById('cursor');
let cursorX = 0, cursorY = 0, actualX = 0, actualY = 0;
document.addEventListener('mousemove', (e) => { cursorX = e.clientX; cursorY = e.clientY; });
function animateCursor() {
  actualX += (cursorX - actualX) * 0.15;
  actualY += (cursorY - actualY) * 0.15;
  cursor.style.left = actualX + 'px';
  cursor.style.top = actualY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();
document.querySelectorAll('a, button, .case-back').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
});

// Scroll spy for sidebar
const sidebar = document.querySelector('.case-sidebar');
const sections = document.querySelectorAll('.case-section');
const sidebarLinks = sidebar ? sidebar.querySelectorAll('a') : [];

sidebarLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    const target = document.getElementById(targetId);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

window.addEventListener('scroll', () => {
  let currentSection = '';
  sections.forEach(section => {
    if (section.getBoundingClientRect().top < window.innerHeight * 0.4) {
      currentSection = section.id;
    }
  });
  sidebarLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + currentSection);
  });
}, { passive: true });

// Reveal animations
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Bar chart animation
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
