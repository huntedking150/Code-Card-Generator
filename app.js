const avatarInput = document.getElementById('avatarInput');
const nameInput = document.getElementById('nameInput');
const usernameInput = document.getElementById('usernameInput');
const contentInput = document.getElementById('contentInput');
const codeInput = document.getElementById('codeInput');
const verifiedInput = document.getElementById('verifiedInput');

const previewAvatar = document.getElementById('previewAvatar');
const previewName = document.getElementById('previewName');
const previewUsername = document.getElementById('previewUsername');
const previewContent = document.getElementById('previewContent');
const previewCode = document.getElementById('previewCode');
const verifiedBadge = document.getElementById('verifiedBadge');

const downloadBtn = document.getElementById('downloadBtn');
const card = document.getElementById('card');

/* ---------- Name ---------- */
nameInput.addEventListener('input', ()=>{
  previewName.textContent = nameInput.value || 'Name';
});

/* ---------- Username ---------- */

usernameInput.addEventListener('input', () => {
  previewUsername.textContent =
    usernameInput.value || 'username';
});

/* ---------- Badge ---------- */
verifiedInput.addEventListener('change', ()=>{
  if(verifiedInput.checked){
    verifiedBadge.classList.remove('hidden');
  } else {
    verifiedBadge.classList.add('hidden');
  }
})

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
