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
