(() => {
  const stack = document.getElementById('gallery-stack');
  const configEl = document.getElementById('gallery-config');
  const lightbox = document.getElementById('lightbox');
  const lightboxContent = document.getElementById('lightbox-content');
  const lightboxClose = document.getElementById('lightbox-close');

  if (!stack || !configEl) return;

  const config = JSON.parse(configEl.textContent || '{}');
  const photos = config.photos || [];

  const openLightbox = (item) => {
    if (!lightbox || !lightboxContent) return;
    lightboxContent.innerHTML = '';
    const node = document.createElement(item.type === 'video' ? 'video' : 'img');
    node.src = item.src;
    node.alt = 'Gallery media';
    if (item.type === 'video') {
      node.autoplay = true;
      node.loop = true;
      node.muted = true;
      node.playsInline = true;
      node.controls = true;
    }
    lightboxContent.appendChild(node);
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    if (lightboxContent) {
      lightboxContent.innerHTML = '';
    }
  };

  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keyup', (event) => {
    if (event.key === 'Escape') {
      closeLightbox();
    }
  });

  const preloadPhotos = () => {
    photos.forEach((src) => {
      const image = new Image();
      image.src = src;
    });
  };

  const buildPhotoStack = () => {
    const fragment = document.createDocumentFragment();
    photos.forEach((src, index) => {
      const card = document.createElement('article');
      card.className = 'gallery-card';
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', 'Open gallery photo');

      const figure = document.createElement('figure');
      const img = document.createElement('img');
      img.src = src;
      img.loading = 'eager';
      img.decoding = 'sync';
      img.alt = 'Gallery photo';
      figure.appendChild(img);

      card.appendChild(figure);

      card.addEventListener('click', () => openLightbox({ type: 'image', src }));
      card.addEventListener('keypress', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openLightbox({ type: 'image', src });
        }
      });

      fragment.appendChild(card);
    });

    stack.appendChild(fragment);
  };

  preloadPhotos();
  buildPhotoStack();
})();
