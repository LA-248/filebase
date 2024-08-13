export default function handleDisplayingError(error, element, defaultMessage) {
  element.textContent = error.message;
  setTimeout(() => {
    element.textContent = defaultMessage;
  }, 5000);
}
