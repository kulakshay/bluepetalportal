import { CATEGORIES } from './config.js';
import { loadProducts } from './sheet-loader.js';
import { renderGrid } from './product-render.js';

function renderCategoryTiles() {
  const container = document.querySelector('[data-category-tiles]');
  if (!container) return;
  container.innerHTML = CATEGORIES.filter((c) => !c.parent)
    .map(
      (c) => `
      <a class="category-tile" href="catalogue.html?category=${encodeURIComponent(c.slug)}">
        <img src="images/products/${c.slug}/placeholder-1.svg" alt="${c.label}" loading="lazy" />
        <span class="category-tile__label">${c.label}</span>
        <span class="category-tile__cta">View Collection &rarr;</span>
      </a>
    `
    )
    .join('');
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

function renderFeatured(products) {
  const grid = document.querySelector('[data-featured-grid]');
  if (!grid) return;
  const featured = products.filter((p) => p.featured);
  renderGrid(grid, (featured.length ? featured : products).slice(0, 6), {
    emptyMessage: 'New pieces are on their way — check back soon.',
  });
}

renderCategoryTiles();
loadProducts((products, meta) => {
  renderFeatured(products);
  updateNotice(meta.source);
});
