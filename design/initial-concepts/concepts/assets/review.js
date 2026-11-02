/* Review helper: toggles placeholder content (testimonials, stats, photos-to-come).
   Anything marked data-placeholder can be hidden by adding ?clean to the URL or using the pill. */
(function () {
  var root = document.documentElement;
  if (/[?&]clean\b/.test(location.search)) root.classList.add('hide-placeholders');
  var style = document.createElement('style');
  style.textContent =
    '.hide-placeholders [data-placeholder]{display:none!important}' +
    '[data-placeholder]{position:relative}' +
    '.review-pill{position:fixed;left:16px;bottom:16px;z-index:9999;font:600 12px/1 system-ui,sans-serif;' +
    'background:#111;color:#fff;border:0;border-radius:99px;padding:10px 14px;cursor:pointer;opacity:.75;box-shadow:0 4px 14px rgba(0,0,0,.3)}' +
    '.review-pill:hover{opacity:1}';
  document.head.appendChild(style);
  var b = document.createElement('button');
  b.className = 'review-pill';
  function label() { b.textContent = root.classList.contains('hide-placeholders') ? 'Placeholders hidden · show' : 'Placeholders shown · hide'; }
  b.onclick = function () { root.classList.toggle('hide-placeholders'); label(); };
  label();
  document.addEventListener('DOMContentLoaded', function () { document.body.appendChild(b); });
})();
