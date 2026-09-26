import { SHEET_URL } from './config.js';

const CACHE_KEY = 'bp_products_cache_v1';
const FETCH_TIMEOUT_MS = 8000;

function parseGvizResponse(text) {
  const start = text.indexOf('(');
  const end = text.lastIndexOf(')');
  const json = JSON.parse(text.substring(start + 1, end));
  const cols = json.table.cols.map((c, i) => (c.label || c.id || `col${i}`).trim().toLowerCase());
  return json.table.rows.map((row) => {
    const record = {};
    cols.forEach((col, i) => {
      const cell = row.c[i];
      record[col] = cell && cell.v !== null && cell.v !== undefined ? String(cell.v).trim() : '';
    });
    return record;
  });
}

function normalizeProduct(raw) {
  return {
    category: (raw.category || '').toLowerCase(),
    title: raw.title || 'Untitled piece',
    description: raw.description || '',
    price: raw.price ? Number(raw.price) : null,
    currency: raw.currency || 'INR',
    image: raw.image || '',
    imageUrl: raw.image_url || raw.imageurl || '',
    altText: raw.alt_text || raw.alttext || raw.title || '',
    tags: (raw.tags || '').split(',').map((t) => t.trim()).filter(Boolean),
    featured: String(raw.featured).toUpperCase() === 'TRUE',
    status: (raw.status || 'Active').trim(),
    sku: raw.sku || '',
  };
}

function slugify(value) {
  return (value || 'misc')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function resolveImageSrc(product) {
  if (product.imageUrl) return product.imageUrl;
  return `images/products/${slugify(product.category)}/${product.image}`;
}

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data }));
  } catch {
    // localStorage unavailable (private mode/quota) - cache is a nice-to-have, safe to skip.
  }
}

async function fetchLive() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(SHEET_URL, { signal: controller.signal });
    if (!res.ok) throw new Error(`Sheet request failed: ${res.status}`);
    const text = await res.text();
    return parseGvizResponse(text)
      .map(normalizeProduct)
      .filter((p) => p.status !== 'Hidden')
      .map((p) => ({ ...p, imageSrc: resolveImageSrc(p) }));
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchSampleFallback() {
  const res = await fetch('data/products.sample.json');
  const rows = await res.json();
  return rows
    .map(normalizeProduct)
    .filter((p) => p.status !== 'Hidden')
    .map((p) => ({ ...p, imageSrc: resolveImageSrc(p) }));
}

/**
 * Loads the product catalogue and invokes onData with the results.
 * May call onData twice: once immediately with a cached copy (if one exists),
 * then again once the live Google Sheet fetch resolves (or the sample
 * fallback, if the Sheet can't be reached and there was no cache to show).
 */
export function loadProducts(onData) {
  const cached = readCache();
  if (cached) {
    onData(cached.data, { source: 'cache' });
  }

  fetchLive()
    .then((live) => {
      writeCache(live);
      onData(live, { source: 'live' });
    })
    .catch(async () => {
      if (cached) {
        onData(cached.data, { source: 'cache-stale' });
        return;
      }
      try {
        const sample = await fetchSampleFallback();
        onData(sample, { source: 'sample' });
      } catch {
        onData([], { source: 'error' });
      }
    });
}
