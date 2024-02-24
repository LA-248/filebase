const modal = document.getElementById('share-file-modal');
const cancelButton = document.getElementById('cancel-share-button');
const shareFileButtons = document.querySelectorAll('.share-file-button');
const copyLinkButton = document.querySelector('.copy-link-button');
const createLinkButton = document.querySelector('.create-link-button');

function openShareFileModal(uuid) {
  // Update the href of the copy link button with the new UUID
  copyLinkButton.href = `/share/${uuid}`;
  modal.style.display = 'block';
}

// Generates a new link for sharing
function createNewLink() {
  try {
    document.addEventListener('click', async (event) => {
      if (event.target.classList.contains('create-link-button')) {
        const fileName = document.querySelector('.file-name').textContent;

        const response = await fetch(`/create-uuid/${fileName}`, {
          method: 'GET',
        });

        const data = await response.json();
        const uuid = data.fileUuid;
        copyLinkButton.href = `/share/${uuid}`;
        createLinkButton.textContent = 'New link created';
      } else {
        createLinkButton.textContent = 'Create new link';
      }
    });
  } catch (error) {
    console.error('Error creating new shareable link:', error.message);
  }
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

// Set the name of the current file being shared in the modal
function setFileNameInShareModal() {
  document.addEventListener('click', function (event) {
    if (event.target.classList.contains('share-file-button')) {
      const getFileName = event.target
        .closest('.file-container')
        .querySelector('.uploaded-file').textContent;
      const fileName = document.querySelector('.file-name');
      fileName.textContent = getFileName;
    }
  });
}

// If the user clicks anywhere outside of the copy-link-button, reset its text
document.addEventListener('click', (event) => {
  if (!event.target.classList.contains('copy-link-button')) {
    copyLinkButton.textContent = 'Copy link';
  }
});

// Attach a shareable link to each copy-link-button inside the modal, for each file
shareFileButtons.forEach((button) => {
  button.addEventListener('click', function () {
    const uuid = this.getAttribute('data-uuid');
    copyLinkButton.href = `/share/${uuid}`;
    modal.style.display = 'block';
  });
});

// When clicking anywhere outside the modal, close it
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
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

createNewLink();

export { openShareFileModal, setFileNameInShareModal };
