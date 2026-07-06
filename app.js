const avatarInput = document.getElementById('avatarInput');
const usernameInput = document.getElementById('usernameInput');
const contentInput = document.getElementById('contentInput');
const codeInput = document.getElementById('codeInput');

const previewAvatar = document.getElementById('previewAvatar');
const previewUsername = document.getElementById('previewUsername');
const previewContent = document.getElementById('previewContent');
const previewCode = document.getElementById('previewCode');

const downloadBtn = document.getElementById('downloadBtn');
const card = document.getElementById('card');

/* ---------- Username ---------- */

usernameInput.addEventListener('input', () => {
  previewUsername.textContent =
    usernameInput.value || 'username';
});

/* ---------- Content ---------- */

contentInput.addEventListener('input', () => {
  previewContent.textContent =
    contentInput.value || 'Your content appears here...';
});

/* ---------- Code ---------- */

codeInput.addEventListener('input', () => {
  previewCode.textContent =
    codeInput.value || 'const hello = "world";';
});

/* ---------- Avatar ---------- */

avatarInput.addEventListener('change', (e) => {
  const file = e.target.files[0];

  if (!file) {
    return;
  }

  if (!file.type.startsWith('image/')) {
    alert('Please upload an image.');
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    previewAvatar.src = reader.result;
  };

  reader.readAsDataURL(file);
});

/* ---------- Download ---------- */

downloadBtn.addEventListener('click', async () => {
  try {
    downloadBtn.disabled = true;
    downloadBtn.textContent = 'Generating...';

    const { toPng } = await import('https://cdn.jsdelivr.net/npm/html-to-image@1.11.13/+esm');

    const dataUrl = await toPng(card, {
      cacheBust: true,
      pixelRatio: 3
    });

    const link = document.createElement('a');

    link.download = `code-card-${Date.now()}.png`;
    link.href = dataUrl;

    link.click();
  } catch (error) {
    console.error(error);
    alert('Failed to generate image.');
  } finally {
    downloadBtn.disabled = false;
    downloadBtn.textContent = 'Download PNG';
  }
});
