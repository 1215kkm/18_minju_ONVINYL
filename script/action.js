const paginationButtons = document.querySelectorAll('.hero-pagination button');

const syncHeaderScrollState = () => {
  document.body.classList.toggle('is-scrolled', window.scrollY > 8);
};

syncHeaderScrollState();
window.addEventListener('scroll', syncHeaderScrollState, { passive: true });

paginationButtons.forEach((button) => {
  button.addEventListener('click', () => {
    paginationButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
  });
});

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
