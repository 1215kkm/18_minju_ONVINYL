const syncHeaderScrollState = () => {
  const threshold = document.body.classList.contains('home-body') ? 726 : 8;
  document.body.classList.toggle('is-scrolled', window.scrollY > threshold);
};

syncHeaderScrollState();
window.addEventListener('scroll', syncHeaderScrollState, { passive: true });

const newCatalog = document.querySelector('#newCatalog');
const newCards = document.querySelectorAll('.new-release-card[data-tags]');
const newFilters = document.querySelectorAll('[data-new-filter]');
const newSearch = document.querySelector('#newSearch');
const newResultCount = document.querySelector('[data-new-result-count]');
const newEmpty = document.querySelector('[data-new-empty]');
const newModal = document.querySelector('[data-new-modal]');
const supportsCart = !document.body.classList.contains('cortis-body');

if (supportsCart && !document.querySelector('[data-new-cart]')) {
  document.body.insertAdjacentHTML('beforeend', `
    <aside class="new-cart-drawer" aria-label="Shopping cart" aria-hidden="true" data-new-cart>
      <button class="new-panel-close" type="button" data-new-cart-close aria-label="Close cart"><span class="material-symbols-outlined">close</span></button>
      <p class="new-eyebrow">YOUR BAG</p>
      <h2>Cart</h2>
      <p class="new-cart-summary"><strong data-cart-summary>2</strong> records selected</p>
      <div class="new-cart-items" data-new-cart-items></div>
      <div class="new-cart-total"><span>TOTAL</span><strong data-cart-total>₩ 101,000</strong></div>
      <button class="new-checkout" type="button" data-new-checkout>CHECKOUT</button>
    </aside>
    <div class="new-overlay" data-new-overlay hidden></div>
  `);
}

const newCart = document.querySelector('[data-new-cart]');
const newOverlay = document.querySelector('[data-new-overlay]');
const newCartCounts = document.querySelectorAll('[data-cart-count]');
const newCartSummary = document.querySelector('[data-cart-summary]');
const newCartItems = document.querySelector('[data-new-cart-items]');
const newCartTotal = document.querySelector('[data-cart-total]');
let activeNewFilter = 'all';
let currentNewProduct;
const cartStorageKey = 'onvinyl-cart-v1';
const initialCartState = [
  { product: 'Ruby', artist: 'JENNIE', price: 52000 },
  { product: 'KARMA', artist: 'Stray Kids', price: 49000 },
];

const loadCartState = () => {
  try {
    const savedCart = JSON.parse(window.localStorage.getItem(cartStorageKey));
    if (!Array.isArray(savedCart)) return initialCartState;

    return savedCart.filter((product) => (
      typeof product.product === 'string'
      && typeof product.artist === 'string'
      && Number.isFinite(product.price)
    ));
  } catch {
    return initialCartState;
  }
};

const saveCartState = (cartState) => {
  try {
    window.localStorage.setItem(cartStorageKey, JSON.stringify(cartState));
  } catch {
    // Keep the cart usable even when browser storage is unavailable.
  }
};

let newCartState = loadCartState();

const closeNewPanels = () => {
  if (newModal) {
    newModal.classList.remove('is-open');
    newModal.setAttribute('aria-hidden', 'true');
  }
  if (newCart) {
    newCart.classList.remove('is-open');
    newCart.setAttribute('aria-hidden', 'true');
  }
  if (newOverlay) newOverlay.hidden = true;
  document.body.classList.remove('has-new-panel');
};

const openNewPanel = (panel) => {
  closeNewPanels();
  if (!panel || !newOverlay) return;

  panel.classList.add('is-open');
  panel.setAttribute('aria-hidden', 'false');
  newOverlay.hidden = false;
  document.body.classList.add('has-new-panel');
  panel.querySelector('.new-panel-close')?.focus();
};

const updateNewResults = () => {
  const query = newSearch?.value.trim().toLowerCase() || '';
  let visibleCount = 0;

  newCards.forEach((card) => {
    const tags = card.dataset.tags || '';
    const searchText = card.dataset.search || '';
    const matchesFilter = activeNewFilter === 'all' || tags.includes(activeNewFilter);
    const matchesSearch = !query || searchText.includes(query);
    const isVisible = matchesFilter && matchesSearch;

    card.hidden = !isVisible;
    if (isVisible) visibleCount += 1;
  });

  if (newResultCount) newResultCount.textContent = String(visibleCount);
  if (newEmpty) newEmpty.hidden = visibleCount !== 0;
};

const formatNewPrice = (price) => `₩ ${price.toLocaleString('ko-KR')}`;

const renderNewCart = () => {
  if (!newCartItems || !newCartSummary || !newCartTotal) return;

  saveCartState(newCartState);
  newCartItems.replaceChildren();
  newCartState.forEach((product, index) => {
    const item = document.createElement('article');
    const copy = document.createElement('div');
    const title = document.createElement('p');
    const price = document.createElement('strong');
    const remove = document.createElement('button');

    item.className = 'new-cart-item';
    copy.className = 'new-cart-item-copy';
    title.textContent = `${product.product} - ${product.artist}`;
    price.textContent = formatNewPrice(product.price);
    remove.className = 'new-cart-remove';
    remove.type = 'button';
    remove.dataset.newRemoveItem = String(index);
    remove.setAttribute('aria-label', `${product.product} 삭제`);
    remove.textContent = '삭제';

    copy.append(title, price);
    item.append(copy, remove);
    newCartItems.append(item);
  });

  if (!newCartState.length) {
    const empty = document.createElement('p');
    empty.className = 'new-cart-empty';
    empty.textContent = '장바구니가 비어 있습니다.';
    newCartItems.append(empty);
  }

  const total = newCartState.reduce((sum, product) => sum + product.price, 0);
  const count = String(newCartState.length);
  newCartCounts.forEach((cartCount) => {
    cartCount.textContent = count;
  });
  newCartSummary.textContent = count;
  newCartTotal.textContent = formatNewPrice(total);
};

if (document.body.classList.contains('new-body')) {
  newFilters.forEach((button) => {
    button.addEventListener('click', () => {
      activeNewFilter = button.dataset.newFilter || 'all';
      newFilters.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle('active', isActive);
        item.setAttribute('aria-pressed', String(isActive));
      });
      updateNewResults();
    });
  });

  newSearch?.addEventListener('input', updateNewResults);

  document.querySelector('[data-new-search-toggle]')?.addEventListener('click', () => {
    newCatalog?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => newSearch?.focus({ preventScroll: true }), 280);
  });

  document.querySelector('[data-new-reset]')?.addEventListener('click', () => {
    activeNewFilter = 'all';
    if (newSearch) newSearch.value = '';
    newFilters.forEach((item) => {
      const isActive = item.dataset.newFilter === 'all';
      item.classList.toggle('active', isActive);
      item.setAttribute('aria-pressed', String(isActive));
    });
    updateNewResults();
    newCatalog?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  document.querySelectorAll('[data-new-quickview]').forEach((button) => {
    button.addEventListener('click', () => {
      currentNewProduct = {
        product: button.dataset.product || '',
        artist: button.dataset.artist || '',
        detail: button.dataset.detail || '',
        price: button.dataset.price || '',
      };
      const modalImage = document.querySelector('[data-new-modal-image]');
      if (modalImage) {
        modalImage.src = button.dataset.image || '';
        modalImage.alt = `${currentNewProduct.artist} ${currentNewProduct.product} vinyl preview`;
      }
      document.querySelector('[data-new-modal-product]').textContent = currentNewProduct.product;
      document.querySelector('[data-new-modal-artist]').textContent = currentNewProduct.artist;
      document.querySelector('[data-new-modal-detail]').textContent = currentNewProduct.detail;
      document.querySelector('[data-new-modal-price]').textContent = currentNewProduct.price;
      document.querySelector('[data-new-modal-badge]').textContent = button.dataset.badge || 'NEW';
      openNewPanel(newModal);
    });
  });

  document.querySelector('[data-new-add-cart]')?.addEventListener('click', () => {
    if (!currentNewProduct) return;
    newCartState.push({
      product: currentNewProduct.product,
      artist: currentNewProduct.artist,
      price: Number(currentNewProduct.price.replace(/[^0-9]/g, '')),
    });
    renderNewCart();
    openNewPanel(newCart);
  });

  updateNewResults();
}

document.querySelectorAll('[data-site-newsletter]').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const status = form.parentElement?.querySelector('[data-site-newsletter-status]');
    if (status) status.textContent = '구독 신청이 완료되었습니다.';
    form.reset();
  });
});

if (supportsCart && newCart) {
  document.querySelectorAll('[data-cart-toggle]').forEach((button) => {
    button.addEventListener('click', () => openNewPanel(newCart));
  });

  document.querySelectorAll('[data-new-close], [data-new-cart-close]').forEach((button) => {
    button.addEventListener('click', closeNewPanels);
  });
  newOverlay?.addEventListener('click', closeNewPanels);

  newCartItems?.addEventListener('click', (event) => {
    const removeButton = event.target.closest('[data-new-remove-item]');
    if (!removeButton) return;

    const itemIndex = Number(removeButton.dataset.newRemoveItem);
    newCartState.splice(itemIndex, 1);
    renderNewCart();
  });

  document.querySelector('[data-new-checkout]')?.addEventListener('click', () => {
    const button = document.querySelector('[data-new-checkout]');
    if (!button) return;
    button.textContent = 'CHECKOUT READY';
    window.setTimeout(() => {
      button.textContent = 'CHECKOUT';
    }, 1200);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeNewPanels();
  });

  renderNewCart();
}

const genreCards = document.querySelectorAll('.genre-product-card[data-genre-tags]');
const genreFilters = document.querySelectorAll('[data-genre-filter]');
const genreResultCount = document.querySelector('[data-genre-result-count]');
const genreEmpty = document.querySelector('[data-genre-empty]');
const genreProducts = document.querySelector('#group-selection');

if (document.body.classList.contains('genre-body') && genreCards.length && genreFilters.length) {
  const updateGenreProducts = (filter) => {
    let visibleCount = 0;
    genreCards.forEach((card) => {
      const isVisible = filter === 'all' || (card.dataset.genreTags || '').split(' ').includes(filter);
      card.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });
    if (genreResultCount) genreResultCount.textContent = String(visibleCount);
    if (genreEmpty) genreEmpty.hidden = visibleCount !== 0;
  };

  genreFilters.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.genreFilter || 'all';
      genreFilters.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle('active', isActive);
        item.setAttribute('aria-pressed', String(isActive));
      });
      updateGenreProducts(filter);
      genreProducts?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  document.querySelectorAll('[data-genre-add-cart]').forEach((button) => {
    button.addEventListener('click', () => {
      newCartState.push({
        product: button.dataset.product || '',
        artist: button.dataset.artist || '',
        price: Number(button.dataset.price || 0),
      });
      renderNewCart();
      openNewPanel(newCart);
    });
  });

  const alignGenreHashTarget = () => {
    const target = document.getElementById(window.location.hash.slice(1));
    if (target?.closest('.genre-page')) {
      target.scrollIntoView({ block: 'start' });
    }
  };

  if (window.location.hash) {
    window.addEventListener('load', alignGenreHashTarget, { once: true });
  }
  window.addEventListener('hashchange', alignGenreHashTarget);

  updateGenreProducts('all');
}

document.querySelectorAll('form').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
  });
});

const mainProductImage = document.querySelector('#mainProductImage');
const productThumbs = document.querySelectorAll('.thumb[data-main]');

productThumbs.forEach((thumb) => {
  thumb.addEventListener('click', () => {
    const nextImage = thumb.dataset.main;
    const nextAlt = thumb.querySelector('img')?.alt || mainProductImage?.alt || '';

    if (!mainProductImage || !nextImage) return;

    productThumbs.forEach((item) => item.classList.remove('active'));
    thumb.classList.add('active');

    mainProductImage.style.opacity = '0';
    mainProductImage.style.transform = 'scale(.985)';

    window.setTimeout(() => {
      mainProductImage.src = nextImage;
      mainProductImage.alt = nextAlt;
      mainProductImage.style.opacity = '1';
      mainProductImage.style.transform = 'scale(1)';
    }, 120);
  });
});

const kpopHero = document.querySelector('.kpop-hero');
const kpopVersionButtons = document.querySelectorAll('[data-kpop-version]');

if (document.body.classList.contains('kpop-body') && kpopHero) {
  const kpopVersionTitle = document.querySelector('#kpopVersionTitle');
  const kpopVersionSummary = document.querySelector('#kpopVersionSummary');
  const kpopVersionPackage = document.querySelector('#kpopVersionPackage');
  const kpopVersionGoods = document.querySelector('#kpopVersionGoods');
  const activeKpopVersion = 'blush';
  let currentKpopVersion = activeKpopVersion;
  let kpopVersionTimer;
  let isHeroHeaderMode = true;
  const kpopVersions = {
    blush: {
      title: 'DAYDREAM CLUB<br />BLUSH PACKAGE',
      summary: '블러시 톤의 아웃박스와 스프링 포토북, 펄 핑크 CD, 리릭 포스터를 중심으로 구성한 패키지입니다. 하트 아크릴 키링과 파우치, 스티커까지 데이드림 무드를 손에 잡히는 굿즈로 이어갑니다.',
      packageSrc: 'images/blush-package-hero-cutout.png',
      goodsSrc: 'images/blush-package-goods-cutout.png',
    },
    brown: {
      title: 'DAYDREAM CLUB<br />BROWN PACKAGE',
      summary: '코코아 브라운 아웃박스에 핑크 타이포와 로즈 CD를 더한 다른 무드의 구성입니다. 포토북, 포토카드, 스티커, 브라운 파우치와 키링이 차분한 팬 키트 콘셉트를 완성합니다.',
      packageSrc: 'images/brown-package-hero-cutout.png',
      goodsSrc: 'images/brown-package-goods-cutout.png',
    },
  };

  const setKpopVersion = (version, animate = true) => {
    const nextVersion = kpopVersions[version] ? version : activeKpopVersion;
    const nextData = kpopVersions[nextVersion];
    const switchDelay = animate ? 260 : 0;
    currentKpopVersion = nextVersion;

    if (animate) kpopHero.classList.add('is-switching');

    window.setTimeout(() => {
      kpopHero.classList.toggle('is-brown-version', nextVersion === 'brown');
      document.body.classList.toggle('is-brown-version', nextVersion === 'brown');
      if (kpopVersionTitle) kpopVersionTitle.innerHTML = nextData.title;
      if (kpopVersionSummary) kpopVersionSummary.textContent = nextData.summary;
      if (kpopVersionPackage) kpopVersionPackage.src = nextData.packageSrc;
      if (kpopVersionGoods) kpopVersionGoods.src = nextData.goodsSrc;
      window.setTimeout(() => {
        kpopHero.classList.remove('is-switching');
      }, animate ? 90 : 0);
    }, switchDelay);

    kpopVersionButtons.forEach((button) => {
      button.classList.toggle('active', button.dataset.kpopVersion === nextVersion);
    });
  };

  const startKpopVersionLoop = () => {
    window.clearInterval(kpopVersionTimer);
    kpopVersionTimer = window.setInterval(() => {
      setKpopVersion(currentKpopVersion === 'blush' ? 'brown' : 'blush');
    }, 4200);
  };

  const stopKpopVersionLoop = () => {
    window.clearInterval(kpopVersionTimer);
  };

  const syncKpopHeaderMode = () => {
    const headerHeight = document.querySelector('.site-header')?.offsetHeight || 82;
    const isPastHero = window.scrollY > kpopHero.offsetTop + kpopHero.offsetHeight - headerHeight - 8;

    document.body.classList.toggle('is-past-kpop-hero', isPastHero);

    if (isPastHero && isHeroHeaderMode) {
      isHeroHeaderMode = false;
      stopKpopVersionLoop();
    } else if (!isPastHero && !isHeroHeaderMode) {
      isHeroHeaderMode = true;
      startKpopVersionLoop();
    }
  };

  kpopVersionButtons.forEach((button) => {
    button.addEventListener('click', () => {
      setKpopVersion(button.dataset.kpopVersion);
      if (isHeroHeaderMode) startKpopVersionLoop();
    });
  });

  setKpopVersion(activeKpopVersion, false);
  startKpopVersionLoop();
  syncKpopHeaderMode();
  window.addEventListener('scroll', syncKpopHeaderMode, { passive: true });
  window.addEventListener('resize', syncKpopHeaderMode);
}

const optionButtons = document.querySelectorAll('.option-row button[data-product-option]');
const kpopProductTitle = document.querySelector('#kpopProductTitle');
const kpopProductPrice = document.querySelector('#kpopProductPrice');
const kpopProductFormat = document.querySelector('#kpopProductFormat');
const kpopProductVersion = document.querySelector('#kpopProductVersion');

const kpopProducts = {
  kit: {
    title: 'DAYDREAM CLUB\nBlush Package Kit',
    price: '₩ 32,000',
    format: 'Album Kit',
    version: 'Blush Package Kit',
  },
  photobook: {
    title: 'DAYDREAM CLUB\nBlush Photobook Edition',
    price: '₩ 24,000',
    format: 'Photobook',
    version: 'Blush Photobook Edition',
  },
  vinyl: {
    title: 'DAYDREAM CLUB\nBlush Vinyl Edition',
    price: '₩ 49,000',
    format: 'Vinyl LP',
    version: 'Blush Vinyl Edition',
  },
};

let selectedKpopProduct = 'vinyl';

const setKpopProduct = (option) => {
  const nextOption = kpopProducts[option] ? option : 'kit';
  const product = kpopProducts[nextOption];
  selectedKpopProduct = nextOption;

  if (kpopProductTitle) kpopProductTitle.textContent = product.title;
  if (kpopProductPrice) kpopProductPrice.textContent = product.price;
  if (kpopProductFormat) kpopProductFormat.textContent = product.format;
  if (kpopProductVersion) kpopProductVersion.textContent = product.version;

  optionButtons.forEach((button) => {
    const isActive = button.dataset.productOption === nextOption;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
};

optionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    setKpopProduct(button.dataset.productOption);
  });
});

setKpopProduct(selectedKpopProduct);

document.querySelectorAll('.kpop-purchase button[data-feedback]').forEach((button) => {
  const originalText = button.textContent;

  button.addEventListener('click', () => {
    const selectedLabel = kpopProducts[selectedKpopProduct]?.format || 'ITEM';
    button.classList.add('is-feedback');
    button.textContent = `${selectedLabel} ${button.dataset.feedback}`;

    window.setTimeout(() => {
      button.classList.remove('is-feedback');
      button.textContent = originalText;
    }, 1200);
  });
});

const genreSections = document.querySelectorAll('[data-genre-section]');
const genreRailLinks = document.querySelectorAll('[data-genre-rail-link]');

if (document.body.classList.contains('genre-body') && genreSections.length && genreRailLinks.length) {
  const setActiveGenreSection = (sectionId) => {
    genreRailLinks.forEach((link) => {
      link.classList.toggle('active', link.dataset.genreRailLink === sectionId);
    });
  };

  const genreSectionObserver = new IntersectionObserver((entries) => {
    const visibleEntry = entries
      .filter((entry) => entry.isIntersecting)
      .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

    if (visibleEntry) setActiveGenreSection(visibleEntry.target.id);
  }, {
    rootMargin: '-22% 0px -54% 0px',
    threshold: [0, .15, .35, .6],
  });

  genreSections.forEach((section) => genreSectionObserver.observe(section));
}


const heroBgVideo = document.getElementById('heroBgVideo');
if (heroBgVideo) {
  const heroUiCover = document.querySelector('.hero-ui-cover');
  if (heroUiCover) setTimeout(() => heroUiCover.classList.add('is-gone'), 1000);
  heroBgVideo.play();
}

if (window.parent !== window) {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (href && (href === 'index.html' || href.startsWith('index.html#') || href === './')) {
      e.preventDefault();
      window.parent.postMessage({ type: 'pjax-close' }, '*');
    }
  }, true);
} else if (document.body.classList.contains('home-body')) {
  const overlay = document.createElement('div');
  overlay.id = 'subpageOverlay';
  const frame = document.createElement('iframe');
  frame.id = 'subpageFrame';
  frame.title = 'Subpage';
  overlay.appendChild(frame);
  document.body.appendChild(overlay);

  let isOverlayOpen = false;

  const openSubpage = (url) => {
    frame.src = url;
    overlay.classList.add('is-open');
    isOverlayOpen = true;
    history.pushState({ pjaxSubpage: url }, '', url);
  };

  const closeSubpage = () => {
    overlay.classList.remove('is-open');
    isOverlayOpen = false;
    window.scrollTo({ top: 0, behavior: 'instant' });
    setTimeout(() => { frame.src = 'about:blank'; }, 250);
  };

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href || !href.includes('.html') || href.startsWith('index.html') || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto')) return;
    e.preventDefault();
    openSubpage(href);
  });

  window.addEventListener('popstate', (e) => {
    if (isOverlayOpen && !e.state?.pjaxSubpage) {
      closeSubpage();
    } else if (!isOverlayOpen && e.state?.pjaxSubpage) {
      openSubpage(e.state.pjaxSubpage);
    }
  });

  frame.addEventListener('load', () => {
    if (!isOverlayOpen) return;
    try {
      const loc = frame.contentWindow?.location;
      if (loc && loc.href !== 'about:blank') {
        const fname = loc.pathname.split('/').pop();
        if (fname && !fname.startsWith('index')) {
          history.replaceState({ pjaxSubpage: fname }, '', fname);
        }
      }
    } catch { /* cross-origin: skip */ }
  });

  window.addEventListener('message', (e) => {
    if (e.data?.type === 'pjax-close' && isOverlayOpen) {
      closeSubpage();
      history.back();
    }
  });
}
