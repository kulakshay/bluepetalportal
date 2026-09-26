import { CATEGORIES, SITE_INFO } from './config.js';

function renderCategoryLinks() {
  document.querySelectorAll('[data-category-menu]').forEach((menu) => {
    menu.innerHTML = CATEGORIES.filter((c) => !c.parent)
      .map(
        (c) =>
          `<li><a href="catalogue.html?category=${encodeURIComponent(c.slug)}">${c.label}</a></li>`
      )
      .join('');
  });
}

function setActiveLink() {
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu > li > a, .site-footer__links a').forEach((link) => {
    const href = (link.getAttribute('href') || '').split('?')[0];
    if (href === current) link.classList.add('is-active');
  });
}

function wireMobileToggle() {
  const toggle = document.querySelector('[data-nav-toggle]');
  const menu = document.querySelector('[data-nav-menu]');
  if (!toggle || !menu) return;
  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
}

function wireHeaderSearch() {
  document.querySelectorAll('[data-header-search]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const q = new FormData(form).get('q');
      const url = new URL('catalogue.html', location.href);
      if (q) url.searchParams.set('q', q);
      location.href = url.toString();
    });
  });
}

function renderSiteInfo() {
  document.querySelectorAll('[data-site-phone]').forEach((el) => {
    el.textContent = SITE_INFO.phone;
    if (el.tagName === 'A') el.href = `tel:${SITE_INFO.phone.replace(/\s+/g, '')}`;
  });
  document.querySelectorAll('[data-site-email]').forEach((el) => {
    el.textContent = SITE_INFO.email;
    if (el.tagName === 'A') el.href = `mailto:${SITE_INFO.email}`;
  });
  document.querySelectorAll('[data-site-whatsapp]').forEach((el) => {
    el.href = `https://wa.me/${SITE_INFO.whatsapp}`;
  });
  document.querySelectorAll('[data-site-instagram]').forEach((el) => {
    el.href = SITE_INFO.instagram;
  });
  document.querySelectorAll('[data-site-facebook]').forEach((el) => {
    el.href = SITE_INFO.facebook;
  });
  document.querySelectorAll('[data-site-year]').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
}

renderCategoryLinks();
setActiveLink();
wireMobileToggle();
wireHeaderSearch();
renderSiteInfo();
