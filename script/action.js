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
