const paginationButtons = document.querySelectorAll('.hero-pagination button');

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

const optionButtons = document.querySelectorAll('.option-row button');

optionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    optionButtons.forEach((item) => {
      item.classList.remove('active');
      item.setAttribute('aria-pressed', 'false');
    });
    button.classList.add('active');
    button.setAttribute('aria-pressed', 'true');
  });
});

document.querySelectorAll('.kpop-purchase button[data-feedback]').forEach((button) => {
  const originalText = button.textContent;

  button.addEventListener('click', () => {
    button.classList.add('is-feedback');
    button.textContent = button.dataset.feedback;

    window.setTimeout(() => {
      button.classList.remove('is-feedback');
      button.textContent = originalText;
    }, 1200);
  });
});
