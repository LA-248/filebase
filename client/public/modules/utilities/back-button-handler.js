document.addEventListener('click', (event) => {
  if (event.target.classList.contains('back-button')) {
    window.history.back();
  }
});
