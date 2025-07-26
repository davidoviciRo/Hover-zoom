let zoomPreview;

function createZoomPreview() {
  zoomPreview = document.createElement('img');
  zoomPreview.id = 'img-zoom-preview';
  document.body.appendChild(zoomPreview);
}

function showZoom(e) {
  const target = e.target;
  if (!target) return;

  let src = '';

  // Handle normal <img> elements
  if (target.tagName === 'IMG') {
    src = target.currentSrc || target.src || target.dataset.src || '';

    // Extract best image from srcset if needed
    if (!src && target.srcset) {
      const srcsetParts = target.srcset.split(',');
      if (srcsetParts.length) {
        const lastPart = srcsetParts[srcsetParts.length - 1].trim().split(' ')[0];
        src = lastPart;
      }
    }

    // Special case for YouTube thumbnails
    if (src.includes('ytimg.com') && src.includes('hqdefault')) {
      src = src.replace('hqdefault', 'maxresdefault');
    }
  }

  // Try background-image from inline style
  if (!src && target.style && target.style.backgroundImage) {
    src = target.style.backgroundImage.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
  }

  // Try background-image from parent
  if (!src && target.parentNode && target.parentNode.style.backgroundImage) {
    src = target.parentNode.style.backgroundImage.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
  }

  if (!src) return;

  zoomPreview.src = src;
  zoomPreview.style.display = 'block';
  moveZoom(e);
}

function moveZoom(e) {
  const padding = 20;
  const maxWidth = window.innerWidth * 0.95;
  const maxHeight = window.innerHeight * 0.95;
  const naturalWidth = zoomPreview.naturalWidth;
  const naturalHeight = zoomPreview.naturalHeight;

  let width = naturalWidth;
  let height = naturalHeight;

  // Scale down if too large for screen
  if (width > maxWidth) {
    const scale = maxWidth / width;
    width = maxWidth;
    height = height * scale;
  }
  if (height > maxHeight) {
    const scale = maxHeight / height;
    height = maxHeight;
    width = width * scale;
  }

  // Position near cursor, but keep on screen
  let left = e.clientX + padding;
  let top = e.clientY + padding;

  if (left + width > window.innerWidth) {
    left = e.clientX - width - padding;
    if (left < 0) left = 0;
  }
  if (top + height > window.innerHeight) {
    top = e.clientY - height - padding;
    if (top < 0) top = 0;
  }

  zoomPreview.style.width = width + 'px';
  zoomPreview.style.height = height + 'px';
  zoomPreview.style.left = left + 'px';
  zoomPreview.style.top = top + 'px';
}

function hideZoom() {
  if (zoomPreview) zoomPreview.style.display = 'none';
}

if (!zoomPreview) {
  createZoomPreview();

  document.addEventListener('mouseover', showZoom);
  document.addEventListener('mousemove', moveZoom);
  document.addEventListener('mouseout', (e) => {
    hideZoom();
  });
}
