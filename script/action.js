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
  let activeKpopVersion = 'blue';
  let kpopVersionTimer;

  const setKpopVersion = (version) => {
    activeKpopVersion = version;
    kpopHero.classList.toggle('is-pink-version', version === 'pink');
    kpopVersionButtons.forEach((button) => {
      button.classList.toggle('active', button.dataset.kpopVersion === version);
    });
  };

  const startKpopVersionLoop = () => {
    window.clearInterval(kpopVersionTimer);
    kpopVersionTimer = window.setInterval(() => {
      setKpopVersion(activeKpopVersion === 'blue' ? 'pink' : 'blue');
    }, 4600);
  };

  kpopVersionButtons.forEach((button) => {
    button.addEventListener('click', () => {
      setKpopVersion(button.dataset.kpopVersion);
      startKpopVersionLoop();
    });
  });

  setKpopVersion(activeKpopVersion);
  startKpopVersionLoop();
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
