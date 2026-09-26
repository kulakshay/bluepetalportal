function escapeHtml(str = '') {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function categoryLabel(slug = '') {
  return slug
    .split('-')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function formatPrice(product) {
  if (product.price === null || product.price === undefined || Number.isNaN(product.price)) {
    return 'Price on request';
  }
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: product.currency || 'INR',
      maximumFractionDigits: 0,
    }).format(product.price);
  } catch {
    return `${product.currency || 'INR'} ${product.price}`;
  }
}

export function buildProductJsonLd(product) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description || product.title,
    image: product.imageSrc,
    category: categoryLabel(product.category),
  };
  if (product.sku) data.sku = product.sku;
  if (product.price) {
    data.offers = {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency || 'INR',
      availability:
        product.status === 'SoldOut' ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
    };
  }
  return data;
}

export function createProductCard(product) {
  const card = document.createElement('article');
  card.className = 'product-card';
  card.dataset.category = product.category;

  const isSoldOut = product.status === 'SoldOut';

  card.innerHTML = `
    <button type="button" class="product-card__image-btn" aria-label="View larger image of ${escapeHtml(product.title)}">
      <img class="product-card__image" src="${escapeHtml(product.imageSrc)}" alt="${escapeHtml(product.altText)}" loading="lazy" />
      ${isSoldOut ? '<span class="product-card__badge">Sold Out</span>' : ''}
    </button>
    <div class="product-card__body">
      <p class="product-card__category">${escapeHtml(categoryLabel(product.category))}</p>
      <h3 class="product-card__title">${escapeHtml(product.title)}</h3>
      ${product.description ? `<p class="product-card__desc">${escapeHtml(product.description)}</p>` : ''}
      <p class="product-card__price">${escapeHtml(formatPrice(product))}</p>
    </div>
  `;

  const jsonLd = document.createElement('script');
  jsonLd.type = 'application/ld+json';
  jsonLd.textContent = JSON.stringify(buildProductJsonLd(product));
  card.appendChild(jsonLd);

  return card;
}

export function renderGrid(container, products, { emptyMessage = 'No products match your search.' } = {}) {
  if (!container) return;
  container.innerHTML = '';
  if (!products.length) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = emptyMessage;
    container.appendChild(empty);
    return;
  }
  const fragment = document.createDocumentFragment();
  products.forEach((p) => fragment.appendChild(createProductCard(p)));
  container.appendChild(fragment);
}
