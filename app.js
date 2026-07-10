import { EditorView, basicSetup } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import hljs from 'https://cdn.jsdelivr.net/npm/highlight.js@11.11.1/+esm';

const avatarInput = document.getElementById('avatarInput');
const avatarUploadPreview = document.getElementById('avatarUploadPreview');
const avatarFileName = document.getElementById('avatarFileName');
const nameInput = document.getElementById('nameInput');
const usernameInput = document.getElementById('usernameInput');
const contentInput = document.getElementById('contentInput');
const codeEditorHost = document.getElementById('codeEditor');
const verifiedInput = document.getElementById('verifiedInput');
const paddingSlider = document.getElementById('paddingSlider');
const paddingValue = document.getElementById('paddingValue');
const cardContent = document.getElementById('cardContent');
const imageToggle = document.getElementById('imageToggle');
const postImageField = document.getElementById('postImageField');
const postImageInput = document.getElementById('postImageInput');
const postImageStatus = document.getElementById('postImageStatus');
const previewImageContainer = document.getElementById('previewImageContainer');
let previewPostImage = null;

const previewAvatar = document.getElementById('previewAvatar');
const previewName = document.getElementById('previewName');
const previewUsername = document.getElementById('previewUsername');
const previewContent = document.getElementById('previewContent');
const previewCode = document.getElementById('previewCode');
const verifiedBadge = document.getElementById('verifiedBadge');

const downloadBtn = document.getElementById('downloadBtn');
const card = document.getElementById('card');
const previewCodeBlock = document.getElementById('previewCodeBlock');
const previewUsernameWrap = document.getElementById('previewUsernameWrap');
const bgThemeInputs = document.querySelectorAll('input[name="bgTheme"]');
const codeToggle = document.getElementById('codeToggle');
const defaultCode = 'const hello = "world";';

let isCodeVisible = true;
let isImageVisible = false;

const CARD_THEMES = {
  dark: {
    card: ['bg-slate-900', 'border-white/10'],
    name: ['text-white'],
    username: ['text-violet-300/70'],
    content: ['text-slate-200'],
    codeBlock: ['bg-slate-950', 'border-white/5'],
    exportBackground: '#0f172a',
  },
  light: {
    card: ['bg-white', 'border-zinc-200'],
    name: ['text-zinc-900'],
    username: ['text-violet-600'],
    content: ['text-zinc-700'],
    codeBlock: ['bg-zinc-50', 'border-zinc-200'],
    exportBackground: '#ffffff',
  },
};

let activeCardTheme = 'dark';

const swapClasses = (element, add, remove) => {
  element.classList.remove(...remove);
  element.classList.add(...add);
};

const clearPostImagePreview = () => {
  postImageInput.value = '';
  previewPostImage?.remove();
  previewPostImage = null;
  previewImageContainer.hidden = true;
  previewImageContainer.classList.add('hidden');
  postImageStatus.textContent = 'No image selected yet.';
  postImageStatus.classList.remove('is-ready');
};

const ensurePostImagePreview = () => {
  if (!previewPostImage) {
    previewPostImage = document.createElement('img');
    previewPostImage.id = 'previewPostImage';
    previewPostImage.alt = 'Post Image';
    previewPostImage.className = 'block h-auto w-full object-contain';
    previewImageContainer.replaceChildren(previewPostImage);
  }

  return previewPostImage;
};

const getSelectedBgTheme = () => {
  const selected = document.querySelector('input[name="bgTheme"]:checked');

  return selected?.value === 'light' ? 'light' : 'dark';
};

const applyCardTheme = (theme) => {
  const config = CARD_THEMES[theme];
  const otherTheme = theme === 'dark' ? 'light' : 'dark';
  const otherConfig = CARD_THEMES[otherTheme];

  activeCardTheme = theme;
  card.dataset.theme = theme;

  swapClasses(card, config.card, otherConfig.card);
  swapClasses(previewName, config.name, otherConfig.name);
  swapClasses(previewUsernameWrap, config.username, otherConfig.username);
  swapClasses(previewContent, config.content, otherConfig.content);
  swapClasses(previewCodeBlock, config.codeBlock, otherConfig.codeBlock);
  syncCodePreview();
};

/* ---------- Name ---------- */
nameInput.addEventListener('input', () => {
  previewName.textContent = nameInput.value || 'Name';
});

/* ---------- Username ---------- */

usernameInput.addEventListener('input', () => {
  previewUsername.textContent = usernameInput.value || 'username';
});

/* ---------- Badge ---------- */
verifiedInput.addEventListener('change', () => {
  if (verifiedInput.checked) {
    verifiedBadge.classList.remove('hidden');
  } else {
    verifiedBadge.classList.add('hidden');
  }
});

/* ---------- Content ---------- */

contentInput.addEventListener('input', () => {
  previewContent.textContent = contentInput.value || 'Your content appears here...';
});

/* ---------- Code ---------- */

const getCodeValue = () => codeEditorView.state.doc.toString();

const syncCodePreview = () => {
  const value = getCodeValue();
  const code = value === '' ? defaultCode : value;
  const { value: highlighted } = hljs.highlight(code, { language: 'javascript' });

  previewCode.innerHTML = highlighted;
};

const codeEditorView = new EditorView({
  parent: codeEditorHost,
  doc: defaultCode,
  extensions: [
    basicSetup,
    javascript(),
    oneDark,
    EditorView.lineWrapping,
    EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        syncCodePreview();
      }
    }),
    EditorView.theme({
      '&': {
        height: 'auto',
        backgroundColor: 'transparent',
      },
      '&.cm-focused': {
        outline: 'none',
      },
      '.cm-cursor': {
        borderLeftColor: '#c084fc',
      },
      '&.cm-focused .cm-selectionBackground, .cm-selectionBackground': {
        backgroundColor: 'rgba(124, 58, 237, 0.35) !important',
      },
    }),
  ],
});

syncCodePreview();

/* ---------- Code Toggle ---------- */
codeToggle.addEventListener('change', () => {
  isCodeVisible = codeToggle.checked;
  previewCodeBlock.classList.toggle('hidden', !isCodeVisible);
});

/* ---------- Image Toggle ---------- */
const syncImageUploadState = () => {
  isImageVisible = imageToggle.checked;

  postImageField.hidden = !isImageVisible;
  postImageField.classList.toggle('hidden', !isImageVisible);
  postImageInput.disabled = !isImageVisible;

  const hasSelectedImage = postImageInput.files.length > 0;

  if (!isImageVisible) {
    clearPostImagePreview();
    return;
  }

  const shouldShowPreview = hasSelectedImage && previewPostImage !== null;

  previewImageContainer.hidden = !shouldShowPreview;
  previewImageContainer.classList.toggle('hidden', !shouldShowPreview);
};

previewImageContainer.hidden = true;
previewImageContainer.classList.add('hidden');

imageToggle.addEventListener('change', syncImageUploadState);

syncImageUploadState();

postImageInput.addEventListener('change', (e) => {
  const file = e.target.files[0];

  if (!file) {
    clearPostImagePreview();
    return;
  }

  if (!file.type.startsWith('image/')) {
    alert('Please upload an image.');
    clearPostImagePreview();
    postImageStatus.textContent = 'Please choose a PNG, JPG, or GIF image.';
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    const imagePreview = ensurePostImagePreview();
    imagePreview.src = reader.result;
    if (imageToggle.checked) {
      previewImageContainer.hidden = false;
      previewImageContainer.classList.remove('hidden');
    }
    postImageStatus.textContent = `Selected: ${file.name}`;
    postImageStatus.classList.add('is-ready');
  };

  reader.readAsDataURL(file);
});

/* ---------- Padding ---------- */
const updateCardPadding = () => {
  const value = Number(paddingSlider.value);

  cardContent.style.paddingTop = `${value}px`;
  cardContent.style.paddingBottom = `${value}px`;

  paddingValue.textContent = `${value}px`;
};

paddingSlider.addEventListener('input', updateCardPadding);

updateCardPadding();

/* ---------- Export background ---------- */

bgThemeInputs.forEach((input) => {
  input.addEventListener('change', () => {
    applyCardTheme(getSelectedBgTheme());
  });
});

applyCardTheme('dark');

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
    avatarUploadPreview.src = reader.result;
    avatarFileName.textContent = file.name;
  };

  reader.readAsDataURL(file);
});

/* ---------- Download ---------- */

downloadBtn.addEventListener('click', async () => {
  try {
    downloadBtn.disabled = true;
    downloadBtn.textContent = 'Generating...';

    const { toPng } = await import('https://cdn.jsdelivr.net/npm/html-to-image@1.11.13/+esm');

    const rect = card.getBoundingClientRect();
    const exportBackground = CARD_THEMES[activeCardTheme].exportBackground;

    const originalBorderRadius = card.style.borderRadius;

    card.style.borderRadius = '0';

    const dataUrl = await toPng(card, {
      cacheBust: true,
      pixelRatio: 3,
      backgroundColor: exportBackground,
      width: Math.max(1, Math.round(rect.width)),
      height: Math.max(1, Math.round(rect.height)),
      style: {
        display: 'block',
        width: `${Math.max(1, Math.round(rect.width))}px`,
        height: `${Math.max(1, Math.round(rect.height))}px`,
        margin: '0',
        borderRadius: '0',
      },
    });

    card.style.borderRadius = originalBorderRadius;

    const link = document.createElement('a');

    link.download = `code-card-${activeCardTheme}-${Date.now()}.png`;
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
