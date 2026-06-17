(() => {
  const body = document.body;
  const menuButton = document.querySelector('.menu-button');
  const mobilePanel = document.querySelector('.mobile-panel');
  const langButton = document.querySelector('.lang');
  const toast = document.getElementById('site-toast');
  const scrollTopButton = document.getElementById('scroll-top');
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 1800);
  }

  function setNav(open) {
    body.classList.toggle('nav-open', open);
    if (menuButton) {
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
      menuButton.textContent = open ? '×' : '☰';
    }
    if (mobilePanel) mobilePanel.setAttribute('aria-hidden', String(!open));
  }

  if (menuButton) {
    menuButton.addEventListener('click', (event) => {
      event.stopPropagation();
      setNav(!body.classList.contains('nav-open'));
    });
  }

  document.addEventListener('click', (event) => {
    if (!body.classList.contains('nav-open')) return;
    if (!event.target.closest('.menu-button') && !event.target.closest('.mobile-panel')) setNav(false);
  });

  document.querySelectorAll('.mobile-panel a').forEach((link) => {
    link.addEventListener('click', () => setNav(false));
  });

  if (langButton) {
    langButton.addEventListener('click', () => showToast('현재 한국어 페이지입니다.'));
  }

  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === path && path !== 'index.html') {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  document.querySelectorAll('img[data-fallback-src]').forEach((img) => {
    img.addEventListener('error', () => {
      const fallback = img.getAttribute('data-fallback-src');
      if (fallback && img.src.indexOf('image-fallback.svg') === -1) {
        img.classList.add('image-error');
        img.src = fallback;
      }
    }, { once: true });
  });

  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', '이미지 확대 보기');
  lightbox.innerHTML = `
    <div class="lightbox__dialog" role="document">
      <button class="lightbox__close" type="button" aria-label="이미지 닫기">×</button>
      <img class="lightbox__image" alt="" />
      <div class="lightbox__caption">
        <div><h3></h3><p></p></div>
      </div>
    </div>`;
  document.body.appendChild(lightbox);

  const lightboxImage = lightbox.querySelector('.lightbox__image');
  const lightboxTitle = lightbox.querySelector('h3');
  const lightboxDesc = lightbox.querySelector('p');
  const closeLightboxButton = lightbox.querySelector('.lightbox__close');
  let lastFocused = null;

  function openLightbox(img) {
    if (!img || !lightboxImage) return;
    lastFocused = document.activeElement;
    const title = img.getAttribute('data-title') || img.getAttribute('alt') || '대광테크 이미지';
    const desc = img.getAttribute('data-desc') || '';
    lightboxImage.src = img.currentSrc || img.src;
    lightboxImage.alt = title;
    lightboxTitle.textContent = title;
    lightboxDesc.textContent = desc;
    lightbox.classList.add('is-open');
    body.classList.add('lightbox-open');
    closeLightboxButton.focus();
  }

  function closeLightbox() {
    if (!lightbox.classList.contains('is-open')) return;
    lightbox.classList.remove('is-open');
    body.classList.remove('lightbox-open');
    lightboxImage.removeAttribute('src');
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  document.addEventListener('click', (event) => {
    const img = event.target.closest('.js-lightbox-img');
    if (img) openLightbox(img);
  });

  document.addEventListener('keydown', (event) => {
    const img = event.target.closest && event.target.closest('.js-lightbox-img');
    if (img && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      openLightbox(img);
      return;
    }
    if (event.key === 'Escape') {
      setNav(false);
      closeLightbox();
    }
  });

  closeLightboxButton.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  if (scrollTopButton) {
    window.addEventListener('scroll', () => {
      scrollTopButton.classList.toggle('is-visible', window.scrollY > 520);
    }, { passive: true });
    scrollTopButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
})();
