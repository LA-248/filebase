const modal = document.getElementById('share-file-modal');
const cancelButton = document.getElementById('cancel-share-button');
const shareFileButtons = document.querySelectorAll('.share-file-button');
const copyLinkButton = document.querySelector('.copy-link-button');

export default function openShareFileModal(uuid) {
  // Update the href of the copy link button with the new UUID
  copyLinkButton.href = `/share/${uuid}`;
  modal.style.display = 'block';
}

function closeShareModal() {
  modal.style.display = 'none';
}

function copyLinkToClipboard(event) {
  event.preventDefault();

  // Explicitly define the base URL
  const baseURL = 'http://localhost:3000';

  // Get the path from the 'href' attribute of the link
  const hrefAttribute = event.target.getAttribute('href');

  // Concatenate the base URL with the href attribute value
  const fullURL = baseURL + hrefAttribute;

  // Use the Clipboard API to copy the href value to the clipboard
  navigator.clipboard.writeText(fullURL).then(
    function () {
      copyLinkButton.textContent = 'Link copied to clipboard';
    },
    function (err) {
      console.error('Error in copying link: ', err);
    }
  );
}

shareFileButtons.forEach((button) => {
  button.addEventListener('click', function () {
    const uuid = this.getAttribute('data-uuid');
    copyLinkButton.href = `/share/${uuid}`;
    modal.style.display = 'block';
  });
});

window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
    copyLinkButton.textContent = 'Copy link';
  }
});

if (cancelButton) {
  cancelButton.onclick = closeShareModal;
  cancelButton.addEventListener('click', () => {
    copyLinkButton.textContent = 'Copy link';
  });
}

if (copyLinkButton) {
  copyLinkButton.addEventListener('click', (event) => {
    copyLinkToClipboard(event);
  });
}
