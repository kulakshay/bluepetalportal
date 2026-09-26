function buildLightbox() {
  const overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.hidden = true;
  overlay.innerHTML = `
    <button type="button" class="lightbox__close" aria-label="Close image">&times;</button>
    <img class="lightbox__image" src="" alt="" />
  `;
  document.body.appendChild(overlay);
  return overlay;
}

export function initLightbox() {
  const overlay = buildLightbox();
  const img = overlay.querySelector('.lightbox__image');
  const closeBtn = overlay.querySelector('.lightbox__close');

  function open(src, alt) {
    img.src = src;
    img.alt = alt;
    overlay.hidden = false;
    document.body.classList.add('lightbox-open');
  }

  function close() {
    overlay.hidden = true;
    img.src = '';
    document.body.classList.remove('lightbox-open');
  }

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('.product-card__image-btn');
    if (trigger) {
      const cardImg = trigger.querySelector('img');
      if (cardImg) open(cardImg.src, cardImg.alt);
      return;
    }
    if (event.target === overlay || event.target === closeBtn) {
      close();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !overlay.hidden) close();
  });
}

initLightbox();
