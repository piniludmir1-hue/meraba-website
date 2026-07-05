(function () {
  var IMAGE_RE = /\.(png|jpe?g|webp|gif|avif|svg)(\?.*)?$/i;
  var PANEL_CLASS = 'meraba-original-media-helper';
  var FIELD_ATTR = 'data-meraba-media-helper-for';

  function isImagePath(value) {
    return typeof value === 'string' && value.indexOf('/uploads/') !== -1 && IMAGE_RE.test(value.trim());
  }

  function normalizeImageUrl(value) {
    if (!value) return '';

    var clean = String(value).trim();
    if (!clean) return '';

    if (clean.indexOf('public/uploads/') === 0) {
      clean = clean.replace(/^public\/uploads\//, '/uploads/');
    }

    if (clean.indexOf('/uploads/') === 0) {
      return clean;
    }

    var uploadsIndex = clean.indexOf('/uploads/');
    if (uploadsIndex >= 0) {
      return clean.slice(uploadsIndex);
    }

    return clean;
  }

  function formatBytes(bytes) {
    if (!bytes || Number.isNaN(bytes)) return 'Unavailable';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }

  function findFieldRoot(input) {
    var node = input;
    for (var i = 0; i < 8 && node; i += 1) {
      if (node.querySelector && node.querySelector('label')) return node;
      node = node.parentElement;
    }
    return input.parentElement;
  }

  function makePanel(input, url) {
    var panel = document.createElement('div');
    panel.className = PANEL_CLASS;
    panel.setAttribute(FIELD_ATTR, url);
    panel.innerHTML =
      '<div class="meraba-media-helper-head">' +
        '<strong>Original uploaded file</strong>' +
        '<a class="meraba-media-open" target="_blank" rel="noopener noreferrer">Open original file</a>' +
      '</div>' +
      '<div class="meraba-media-helper-grid">' +
        '<div><span>Stored file path</span><code class="meraba-media-path"></code></div>' +
        '<div><span>Natural dimensions</span><strong class="meraba-media-natural">Loading...</strong></div>' +
        '<div><span>File size</span><strong class="meraba-media-size">Loading...</strong></div>' +
        '<div><span>Rendered preview size</span><strong class="meraba-media-rendered">Loading...</strong></div>' +
      '</div>' +
      '<img class="meraba-media-preview" alt="" />';

    var open = panel.querySelector('.meraba-media-open');
    var path = panel.querySelector('.meraba-media-path');
    var preview = panel.querySelector('.meraba-media-preview');
    var natural = panel.querySelector('.meraba-media-natural');
    var rendered = panel.querySelector('.meraba-media-rendered');
    var size = panel.querySelector('.meraba-media-size');

    open.href = url;
    path.textContent = url;

    preview.addEventListener('load', function () {
      natural.textContent = preview.naturalWidth + ' x ' + preview.naturalHeight + ' px';
      rendered.textContent = Math.round(preview.getBoundingClientRect().width) + ' x ' + Math.round(preview.getBoundingClientRect().height) + ' px';
    });

    preview.addEventListener('error', function () {
      natural.textContent = 'Could not load image';
      rendered.textContent = 'Could not load image';
    });

    fetch(url, { method: 'HEAD', cache: 'no-store' })
      .then(function (response) {
        var length = Number(response.headers.get('content-length'));
        size.textContent = formatBytes(length);
      })
      .catch(function () {
        size.textContent = 'Unavailable';
      });

    preview.src = url;

    return panel;
  }

  function updatePanel(input, url) {
    var existing = input.parentElement && input.parentElement.querySelector('.' + PANEL_CLASS);
    var root = findFieldRoot(input);

    if (!root) return;

    if (existing && existing.getAttribute(FIELD_ATTR) === url) return;
    if (existing) existing.remove();

    var panel = makePanel(input, url);
    root.appendChild(panel);
  }

  function enhanceImageInputs() {
    var inputs = Array.prototype.slice.call(document.querySelectorAll('input'));
    inputs.forEach(function (input) {
      var url = normalizeImageUrl(input.value);
      if (!isImagePath(url)) return;
      updatePanel(input, url);
    });
  }

  function addStyles() {
    if (document.getElementById('meraba-media-helper-styles')) return;

    var style = document.createElement('style');
    style.id = 'meraba-media-helper-styles';
    style.textContent =
      '.' + PANEL_CLASS + '{margin-top:12px;padding:14px;border:1px solid #d5dce5;border-radius:10px;background:#f8fafc;color:#172033;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;}' +
      '.meraba-media-helper-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px;}' +
      '.meraba-media-helper-head strong{font-size:13px;line-height:1.3;color:#07111f;}' +
      '.meraba-media-open{display:inline-flex;align-items:center;justify-content:center;border:1px solid #0b4778;background:#083f68;color:#fff!important;text-decoration:none!important;border-radius:999px;padding:7px 12px;font-size:12px;font-weight:700;white-space:nowrap;}' +
      '.meraba-media-helper-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-bottom:12px;}' +
      '.meraba-media-helper-grid span{display:block;margin-bottom:3px;font-size:11px;font-weight:700;letter-spacing:.02em;text-transform:uppercase;color:#66758a;}' +
      '.meraba-media-helper-grid strong,.meraba-media-helper-grid code{font-size:12px;line-height:1.4;color:#172033;word-break:break-word;}' +
      '.meraba-media-preview{display:block;width:min(360px,100%);height:auto;max-height:220px;object-fit:contain;background:#fff;border:1px solid #e1e7ef;}' +
      '@media (max-width:700px){.meraba-media-helper-head{align-items:flex-start;flex-direction:column}.meraba-media-helper-grid{grid-template-columns:1fr}}';

    document.head.appendChild(style);
  }

  var queued = false;
  function queueEnhance() {
    if (queued) return;
    queued = true;
    window.setTimeout(function () {
      queued = false;
      enhanceImageInputs();
    }, 150);
  }

  addStyles();
  queueEnhance();

  document.addEventListener('input', queueEnhance, true);
  document.addEventListener('change', queueEnhance, true);

  new MutationObserver(queueEnhance).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
