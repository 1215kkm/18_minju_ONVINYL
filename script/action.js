const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.dot');
let current = 0;

function showSlide(index) {
  slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
  dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  current = index;
}

dots.forEach((dot) => {
  dot.addEventListener('click', () => {
    const idx = Number(dot.dataset.slide);
    showSlide(idx);
  });
});

setInterval(() => {
  const next = (current + 1) % slides.length;
  showSlide(next);
}, 6000);
