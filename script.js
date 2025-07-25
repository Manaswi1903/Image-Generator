const imageUrlInput = document.getElementById('imageUrl');
const loadImageBtn = document.getElementById('loadImageBtn');
const uploadInput = document.getElementById('uploadInput');
const imagePreview = document.getElementById('imagePreview');
const filterSelect = document.getElementById('filterSelect');
const rotateRange = document.getElementById('rotateRange');
const scaleRange = document.getElementById('scaleRange');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');
const toggleThemeBtn = document.getElementById('toggleThemeBtn');

let currentImage = null;
let rotation = 0;
let scale = 1;
let filter = 'none';

function showLoading(state) {
  document.body.classList.toggle('loading', state);
}

function loadImageFromURL(url) {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = url;
  img.onload = () => {
    setImage(img);
  };
  img.onerror = () => {
    alert('Image could not be loaded. Check URL.');
  };
}

function setImage(img) {
  imagePreview.innerHTML = '';
  img.id = 'generatedImage';
  img.style.maxWidth = '100%';
  img.style.filter = filter;
  img.style.transform = `rotate(${rotation}deg) scale(${scale})`;
  imagePreview.appendChild(img);
  currentImage = img;
}

function applyStyles() {
  if (currentImage) {
    currentImage.style.filter = filter;
    currentImage.style.transform = `rotate(${rotation}deg) scale(${scale})`;
  }
}

function downloadImage() {
  if (!currentImage) {
    alert('Load or upload an image first.');
    return;
  }

  const canvas = document.createElement('canvas');
  canvas.width = currentImage.naturalWidth;
  canvas.height = currentImage.naturalHeight;

  const ctx = canvas.getContext('2d');
  ctx.filter = filter;
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.scale(scale, scale);
  ctx.drawImage(currentImage, -canvas.width / 2, -canvas.height / 2);
  ctx.restore();

  const link = document.createElement('a');
  link.download = 'generated_image.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

function resetApp() {
  imageUrlInput.value = '';
  filterSelect.value = 'none';
  rotateRange.value = 0;
  scaleRange.value = 1;
  filter = 'none';
  rotation = 0;
  scale = 1;
  currentImage = null;
  imagePreview.innerHTML = '<p>No image loaded yet</p>';
}

function toggleTheme() {
  document.body.classList.toggle('dark');
}

// Event Listeners
loadImageBtn.addEventListener('click', () => {
  const url = imageUrlInput.value.trim();
  if (url) {
    showLoading(true);
    setTimeout(() => {
      loadImageFromURL(url);
      showLoading(false);
    }, 500);
  }
});

uploadInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.src = event.target.result;
    img.onload = () => {
      setImage(img);
    };
  };
  reader.readAsDataURL(file);
});

filterSelect.addEventListener('change', (e) => {
  filter = e.target.value;
  applyStyles();
});

rotateRange.addEventListener('input', (e) => {
  rotation = parseInt(e.target.value, 10);
  applyStyles();
});

scaleRange.addEventListener('input', (e) => {
  scale = parseFloat(e.target.value);
  applyStyles();
});

downloadBtn.addEventListener('click', downloadImage);
resetBtn.addEventListener('click', resetApp);
toggleThemeBtn.addEventListener('click', toggleTheme);

// Auto-apply theme from local preference
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
}
