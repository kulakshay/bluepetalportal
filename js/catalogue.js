import { CATEGORIES } from './config.js';
import { loadProducts } from './sheet-loader.js';
import { renderGrid } from './product-render.js';

const params = new URLSearchParams(location.search);
let allProducts = [];
let activeCategory = params.get('category') || '';
let searchTerm = params.get('q') || '';
let debounceTimer;

function syncUrl() {
  const url = new URL(location.href);
  if (activeCategory) url.searchParams.set('category', activeCategory);
  else url.searchParams.delete('category');
  if (searchTerm) url.searchParams.set('q', searchTerm);
  else url.searchParams.delete('q');
  history.replaceState({}, '', url);
}

function updateChipState() {
  document.querySelectorAll('[data-category-chips] .chip').forEach((chip) => {
    chip.classList.toggle('is-active', chip.dataset.slug === activeCategory);
  });
}

function renderChips() {
  const container = document.querySelector('[data-category-chips]');
  if (!container) return;

  const slugs = new Set(CATEGORIES.map((c) => c.slug));
  allProducts.forEach((p) => p.category && slugs.add(p.category));

  const chipHtml = ['<button type="button" class="chip" data-slug="">All</button>'].concat(
    [...slugs].map((slug) => {
      const known = CATEGORIES.find((c) => c.slug === slug);
      const label = known ? known.label : slug;
      return `<button type="button" class="chip" data-slug="${slug}">${label}</button>`;
    })
  );
  container.innerHTML = chipHtml.join('');
  updateChipState();

  container.querySelectorAll('.chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      activeCategory = chip.dataset.slug;
      syncUrl();
      updateChipState();
      applyFilters();
    });
  });
}

function applyFilters() {
  const term = searchTerm.trim().toLowerCase();
  const filtered = allProducts.filter((p) => {
    if (activeCategory && p.category !== activeCategory) return false;
    if (!term) return true;
    const haystack = [p.title, p.description, p.category, ...(p.tags || [])].join(' ').toLowerCase();
    return haystack.includes(term);
  });
  renderGrid(document.querySelector('[data-catalogue-grid]'), filtered);
}

function wireSearchInput() {
  const input = document.querySelector('[data-catalogue-search]');
  if (!input) return;
  input.value = searchTerm;
  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      searchTerm = input.value;
      syncUrl();
      applyFilters();
    }, 180);
  });
}

function updateNotice(source) {
  const notice = document.querySelector('[data-notice]');
  if (!notice) return;
  if (source === 'sample') {
    notice.textContent = 'Showing a sample listing — the live catalogue is temporarily unavailable.';
    notice.hidden = false;
  } else if (source === 'cache-stale') {
    notice.textContent = 'Showing the last saved listing — the live catalogue is temporarily unavailable.';
    notice.hidden = false;
  } else {
    notice.hidden = true;
  }
}

wireSearchInput();
loadProducts((products, meta) => {
  allProducts = products;
  renderChips();
  applyFilters();
  updateNotice(meta.source);
});
