/* ═══════════════════════════════════════════
   ADARSHA HPS — Premium Interactions
   Clean. Minimal. No bloat.
   ═══════════════════════════════════════════ */

// ── Language Toggle ──
function toggleLang() {
  document.body.classList.toggle('lang-kn');
  localStorage.setItem('lang', document.body.classList.contains('lang-kn') ? 'kn' : 'en');
}
if (localStorage.getItem('lang') === 'kn') document.body.classList.add('lang-kn');

// ── Full-Screen Menu ──
function toggleMenu() {
  const btn = document.getElementById('menuBtn');
  const overlay = document.getElementById('menuOverlay');
  btn.classList.toggle('open');
  overlay.classList.toggle('open');
  document.body.style.overflow = overlay.classList.contains('open') ? 'hidden' : '';
}
function closeMenu() {
  document.getElementById('menuBtn').classList.remove('open');
  document.getElementById('menuOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

// ── Navbar scroll + thin top progress line ──
const navbar = document.getElementById('navbar');
const scrollProgressFill = document.getElementById('scrollProgressFill');
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y > 80) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
  lastScroll = y;
  if (scrollProgressFill) {
    const doc = document.documentElement;
    const body = document.body;
    const scrollHeight = Math.max(body.scrollHeight, doc.scrollHeight);
    const view = window.innerHeight;
    const maxScroll = Math.max(scrollHeight - view, 1);
    const pct = Math.min(100, (y / maxScroll) * 100);
    scrollProgressFill.style.width = pct + '%';
  }
}, { passive: true });

// ── Scroll Reveal ──
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings for grid items
      const delay = entry.target.closest('.exp-grid, .g-grid, .acad-grid, .impact-grid, .updates-grid, .mission-grid, .about-stats, .bridge-exchange, .bridge-split')
        ? Array.from(entry.target.parentElement.children).indexOf(entry.target) * 80
        : 0;
      setTimeout(() => {
        entry.target.classList.add('active');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

// ── Counter Animation ──
const counters = document.querySelectorAll('[data-count]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const duration = 2200;
      const start = performance.now();
      const animate = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased);
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
counters.forEach(el => counterObserver.observe(el));

// ── Gallery Lightbox ──
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('show');
  document.body.style.overflow = '';
}
document.querySelectorAll('.g-item').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    if (img) {
      document.getElementById('lbImg').src = img.src;
      document.getElementById('lbImg').alt = img.alt;
      document.getElementById('lightbox').classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  });
});
document.getElementById('lightbox').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeLightbox();
});
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  const lb = document.getElementById('lightbox');
  const vm = document.getElementById('visitBridgeModal');
  const cb = document.getElementById('connectBanner');
  if (lb && lb.classList.contains('show')) closeLightbox();
  else if (vm && !vm.hasAttribute('hidden')) closeBridgeVisitModal();
  else if (cb && cb.classList.contains('is-open')) dismissConnectBanner();
});

function openBridgeVisitModal() {
  const m = document.getElementById('visitBridgeModal');
  if (!m) return;
  m.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
  closeMenu();
  const first = m.querySelector('input[name="bv_name"]');
  if (first) setTimeout(() => first.focus(), 80);
}

function closeBridgeVisitModal() {
  const m = document.getElementById('visitBridgeModal');
  if (!m || m.hasAttribute('hidden')) return;
  m.setAttribute('hidden', '');
  document.body.style.overflow = '';
}

function submitBridgeVisit(e) {
  e.preventDefault();
  const f = e.target;
  const name = f.bv_name.value.trim();
  const role = f.bv_role.value.trim();
  const teach = f.bv_teach.value.trim();
  const wa = f.bv_wa.value.trim();
  const text =
    `Hello Adarsha School,\n\n` +
    `I'm applying for The Bridge (visit & teach exchange).\n\n` +
    `Name: ${name}\nProfession / role: ${role}\nWhat I'd like to share: ${teach}\nWhatsApp: ${wa}`;
  window.open(`https://wa.me/917676489193?text=${encodeURIComponent(text)}`, '_blank');
  closeBridgeVisitModal();
  f.reset();
}

// ── Smooth Scroll ──
function setUpdatesPanelOpen(open) {
  const btn = document.getElementById('updatesToggle');
  const panel = document.getElementById('updatesPanel');
  if (!btn || !panel) return;
  btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  panel.toggleAttribute('hidden', !open);
  panel.setAttribute('aria-hidden', open ? 'false' : 'true');
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const id = anchor.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      if (id === '#updates') setUpdatesPanelOpen(true);
      const offset = 60;
      const doScroll = () => {
        const pos = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: pos, behavior: 'smooth' });
      };
      // #updates: measure after panel is visible so scroll target height is correct
      if (id === '#updates') requestAnimationFrame(() => requestAnimationFrame(doScroll));
      else doScroll();
    }
  });
});

// ── Hero parallax ──
const heroBg = document.querySelector('.hero-bg');
if (heroBg) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      heroBg.style.transform = `scale(1.05) translateY(${y * 0.12}px)`;
    }
  }, { passive: true });
}

// ── Updates collapsible (Latest News) ──
(function () {
  const btn = document.getElementById('updatesToggle');
  const panel = document.getElementById('updatesPanel');
  if (!btn || !panel) return;

  btn.addEventListener('click', () => {
    setUpdatesPanelOpen(btn.getAttribute('aria-expanded') !== 'true');
  });

  function openFromHash() {
    if (window.location.hash === '#updates') setUpdatesPanelOpen(true);
  }
  window.addEventListener('load', openFromHash);
  window.addEventListener('hashchange', openFromHash);
})();

// ── Community Accordion ──
document.querySelectorAll('.acc-trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const item = trigger.closest('.acc-item');
    const panel = item.querySelector('.acc-panel');
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.acc-item.open').forEach(openItem => {
      openItem.classList.remove('open');
      openItem.querySelector('.acc-panel').style.maxHeight = '0';
      openItem.querySelector('.acc-trigger').setAttribute('aria-expanded', 'false');
    });

    // Open clicked (if it was closed)
    if (!isOpen) {
      item.classList.add('open');
      panel.style.maxHeight = panel.scrollHeight + 'px';
      trigger.setAttribute('aria-expanded', 'true');
    }
  });
});

// ── Connect banner (delayed + menu “Quick links”) ──
let connectBannerTimer;
function openConnectBanner() {
  const el = document.getElementById('connectBanner');
  if (!el) return;
  clearTimeout(connectBannerTimer);
  el.classList.add('is-open');
  el.setAttribute('aria-hidden', 'false');
}
function dismissConnectBanner() {
  const el = document.getElementById('connectBanner');
  if (!el) return;
  el.classList.remove('is-open');
  el.setAttribute('aria-hidden', 'true');
  try {
    sessionStorage.setItem('adarshaConnectBannerDismissed', '1');
  } catch (err) { /* ignore */ }
}
(function scheduleConnectBanner() {
  const el = document.getElementById('connectBanner');
  if (!el) return;
  let dismissed = false;
  try {
    dismissed = sessionStorage.getItem('adarshaConnectBannerDismissed') === '1';
  } catch (err) { dismissed = false; }
  if (!dismissed) connectBannerTimer = setTimeout(openConnectBanner, 4500);
})();

// ── Admission Form → WhatsApp ──
function submitAdmission(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.name.value.trim();
  const phone = form.phone.value.trim();
  const grade = form.grade.value;
  const msg = form.message.value.trim();
  let text = `Hello Adarsha School,\n\nI want to enquire about admission.\n\n` +
    `Child's Name: ${name}\nPhone: ${phone}\nGrade: ${grade}`;
  if (msg) text += `\nMessage: ${msg}`;
  const url = `https://wa.me/917676489193?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}
