/* Shared behaviour for the A × Pressure hybrids.
   [data-scene]   gets concept A's house cutaway.
   [data-gauge]   gets the pressure gauge; every gauge reruns when a symptom is chosen.
   .symptoms button[data-s], #r-title, #r-text, #r-tags drive the readout.
   [role=tab][aria-controls] switch method panels. */
(function () {
  var SCENE =
    '<svg class="scene" viewBox="0 0 640 380" role="img" aria-label="Cross-section of a house showing water pipes above and below ground">' +
    '<defs>' +
    '<linearGradient id="h-soil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0E2633"/><stop offset="1" stop-color="#0C151C"/></linearGradient>' +
    '<linearGradient id="h-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0C151C" stop-opacity="0"/><stop offset="1" stop-color="#0E2633" stop-opacity=".55"/></linearGradient>' +
    '<pattern id="h-dots" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#1d4459"/></pattern>' +
    '<linearGradient id="h-beam" x1="0" x2="1"><stop offset="0" stop-color="#00A9ED" stop-opacity="0"/><stop offset=".5" stop-color="#00A9ED" stop-opacity=".28"/><stop offset="1" stop-color="#00A9ED" stop-opacity="0"/></linearGradient>' +
    '<linearGradient id="h-roof" x1="0" x2="1"><stop offset="0" stop-color="#00A9ED"/><stop offset="1" stop-color="#F28E52"/></linearGradient>' +
    '</defs>' +
    '<rect width="640" height="200" fill="url(#h-sky)"/>' +
    '<rect y="200" width="640" height="180" fill="url(#h-soil)"/>' +
    '<rect y="200" width="640" height="180" fill="url(#h-dots)" opacity=".7"/>' +
    '<line x1="0" y1="200" x2="640" y2="200" stroke="#2f6f8c" stroke-width="1.5"/>' +
    '<g stroke="#2a5d6e" stroke-width="1.2"><path d="M30 200l3-6M36 200l2-5M140 200l3-6M146 200l2-5M260 200l3-6M590 200l3-6M596 200l2-5"/></g>' +
    '<g stroke="#4f7d92" stroke-width="1.6" fill="none">' +
    '<path d="M330 200V108l110-62 110 62v92" fill="#0f1f2a"/>' +
    '<path d="M318 112 440 40l122 72" stroke="url(#h-roof)" stroke-width="2.4"/>' +
    '<rect x="470" y="140" width="40" height="60" fill="#0C151C"/>' +
    '<rect x="360" y="124" width="46" height="36" fill="#0C151C"/>' +
    '<line x1="383" y1="124" x2="383" y2="160"/><line x1="360" y1="142" x2="406" y2="142"/></g>' +
    '<rect x="322" y="200" width="236" height="16" fill="#163646" stroke="#4f7d92" stroke-width="1.2"/>' +
    '<g stroke="#26505f" stroke-width="1"><path d="M340 204l8 8M380 204l8 8M420 204l8 8M460 204l8 8M500 204l8 8M540 204l8 8"/></g>' +
    '<rect x="46" y="190" width="34" height="20" rx="3" fill="#0f1f2a" stroke="#4f7d92" stroke-width="1.5"/>' +
    '<circle cx="63" cy="200" r="5" fill="none" stroke="#7fd4f7" stroke-width="1.5"/>' +
    '<path id="p-main" class="pipe" d="M80 205 H110 Q120 205 120 215 V255 Q120 265 130 265 H300"/>' +
    '<path id="p-slab" class="pipe" d="M300 265 H420 Q430 265 430 255 V222"/>' +
    '<path id="p-wall" class="pipe" d="M430 222 V200 M430 200 V150 H470"/>' +
    '<path id="p-yard" class="pipe" d="M200 265 V300 H260"/>' +
    '<path class="flow" id="f-main" d="M80 205 H110 Q120 205 120 215 V255 Q120 265 130 265 H300"/>' +
    '<path class="flow" id="f-slab" d="M300 265 H420 Q430 265 430 255 V222"/>' +
    '<path class="flow" id="f-wall" d="M430 222 V150 H470"/>' +
    '<path class="flow" id="f-yard" d="M200 265 V300 H260"/>' +
    '<rect class="scan" x="0" y="200" width="80" height="180" fill="url(#h-beam)"/>' +
    '<g class="hot" data-s="bill" tabindex="0" role="button" aria-label="Water bill jumped"><circle class="ring" cx="63" cy="172" r="12"/><circle class="dot" cx="63" cy="172" r="8"/><line x1="63" y1="180" x2="63" y2="190" stroke="#4f7d92"/></g>' +
    '<g class="hot" data-s="yard" tabindex="0" role="button" aria-label="Wet patch in the yard"><circle class="ring" cx="240" cy="300" r="12"/><circle class="dot" cx="240" cy="300" r="8"/></g>' +
    '<g class="hot" data-s="floor" tabindex="0" role="button" aria-label="Damp or warm floor"><circle class="ring" cx="380" cy="265" r="12"/><circle class="dot" cx="380" cy="265" r="8"/></g>' +
    '<g class="hot" data-s="wall" tabindex="0" role="button" aria-label="Damp wall or ceiling"><circle class="ring" cx="452" cy="150" r="12"/><circle class="dot" cx="452" cy="150" r="8"/></g>' +
    '<g font-family="JetBrains Mono, monospace" font-size="10" fill="#6d8794" letter-spacing="1.5">' +
    '<text x="40" y="232">METER</text><text x="196" y="330">YARD SERVICE</text><text x="340" y="292">UNDER SLAB</text><text x="482" y="134">WALL</text></g>' +
    '<ellipse id="wet" cx="240" cy="200" rx="34" ry="4" fill="#00A9ED" opacity="0"/>' +
    '</svg>';

  var GAUGE =
    '<div class="gauge-dial"><svg viewBox="0 0 300 200" aria-hidden="true">' +
    '<defs><linearGradient id="GID" x1="0" x2="1"><stop offset="0" stop-color="#F28E52"/><stop offset="1" stop-color="#00A9ED"/></linearGradient></defs>' +
    '<path d="M30 170 A120 120 0 0 1 270 170" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="16" stroke-linecap="round"/>' +
    '<path class="arc" d="M30 170 A120 120 0 0 1 270 170" fill="none" stroke="url(#GID)" stroke-width="16" stroke-linecap="round" pathLength="100" stroke-dasharray="83 100"/>' +
    '<g class="ticks" stroke="rgba(255,255,255,.25)" stroke-width="2"></g></svg>' +
    '<div class="reading"><span class="v">500</span><span class="u">kPa</span></div></div>' +
    '<div class="g-status" aria-live="polite"><i></i><span class="msg">Holding pressure…</span><button type="button">Run again</button></div>';

  var S = {
    bill:  {t: "Unexplained usage often starts at the meter.", d: "We check whether the meter moves with everything off, then work along the service to narrow down where water is escaping.", pipes: ["main", "slab", "wall", "yard"], m: ["Meter check", "Acoustic", "Nitrogen testing", "Pipe locating"], kpa: 312, drop: "Pressure dropping. Water is escaping somewhere.", done: "Leak confirmed on the service line."},
    yard:  {t: "A wet patch usually means a buried service line.", d: "Listening along the line and tracing its route helps find the likely spot before any lawn or paving is lifted.", pipes: ["main", "yard"], m: ["Acoustic", "Tracer gas", "Pipe locating"], kpa: 338, drop: "Yard service losing pressure.", done: "Leak confirmed on the yard line."},
    floor: {t: "Damp or warm floors can point to a leak under the slab.", d: "Thermal imaging shows temperature differences on the surface, and tracer gas or acoustic methods help confirm the location below.", pipes: ["slab"], m: ["Thermal imaging", "Tracer gas", "Acoustic"], kpa: 371, drop: "Under-slab line losing pressure.", done: "Leak confirmed under the slab."},
    wall:  {t: "Damp walls or ceilings often come from concealed pipework.", d: "Thermal imaging and acoustic listening help narrow the search without opening up more wall than necessary.", pipes: ["wall"], m: ["Thermal imaging", "Acoustic", "Nitrogen testing"], kpa: 419, drop: "Slow drop on the wall line.", done: "Small leak confirmed in the wall."}
  };

  document.querySelectorAll('[data-scene]').forEach(function (el) {
    el.insertAdjacentHTML('beforeend', SCENE);
    if (el.dataset.scene === 'slice') el.querySelector('svg').setAttribute('preserveAspectRatio', 'xMidYMid slice');
  });

  var gauges = [].map.call(document.querySelectorAll('[data-gauge]'), function (el, n) {
    el.innerHTML = GAUGE.replace(/GID/g, 'gg' + n);
    var ticks = el.querySelector('.ticks');
    for (var i = 0; i <= 20; i++) {
      var a = Math.PI * (1 - i / 20), r1 = i % 5 ? 104 : 98;
      ticks.insertAdjacentHTML('beforeend', '<line x1="' + (150 + Math.cos(a) * r1) + '" y1="' + (170 - Math.sin(a) * r1) + '" x2="' + (150 + Math.cos(a) * 92) + '" y2="' + (170 - Math.sin(a) * 92) + '"/>');
    }
    return {arc: el.querySelector('.arc'), v: el.querySelector('.v'), st: el.querySelector('.g-status'), msg: el.querySelector('.msg'), btn: el.querySelector('button')};
  });
  var clocks = document.querySelectorAll('[data-clock]');
  var raf, current = 'bill';

  function test(s) {
    if (!gauges.length) return;
    var t0 = performance.now();
    cancelAnimationFrame(raf);
    gauges.forEach(function (g) { g.st.classList.remove('ok'); g.msg.textContent = 'Holding pressure…'; });
    (function tick(now) {
      var sec = (now - t0) / 1000, v = sec < 1.2 ? 500 : Math.max(s.kpa, 500 - (sec - 1.2) * 75);
      gauges.forEach(function (g) {
        g.v.textContent = Math.round(v);
        g.arc.setAttribute('stroke-dasharray', (v / 600 * 100) + ' 100');
        if (sec > 1.2) g.msg.textContent = s.drop;
      });
      clocks.forEach(function (c) { c.textContent = '00:' + String(Math.min(59, Math.floor(sec * 8))).padStart(2, '0'); });
      if (v <= s.kpa) { gauges.forEach(function (g) { g.st.classList.add('ok'); g.msg.textContent = s.done; }); return; }
      raf = requestAnimationFrame(tick);
    })(t0);
  }
  gauges.forEach(function (g) { g.btn.onclick = function () { test(S[current]); }; });

  var btns = [].slice.call(document.querySelectorAll('.symptoms button[data-s]'));
  var hots = [].slice.call(document.querySelectorAll('.scene .hot'));
  function byId(id) { return document.getElementById(id); }
  function show(k) {
    var s = S[k]; current = k;
    btns.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.s === k); });
    hots.forEach(function (h) { h.classList.toggle('on', h.dataset.s === k); });
    ['main', 'slab', 'wall', 'yard'].forEach(function (p) {
      if (!byId('p-' + p)) return;
      byId('p-' + p).classList.toggle('on', s.pipes.indexOf(p) > -1);
      byId('f-' + p).classList.toggle('on', s.pipes.indexOf(p) > -1);
    });
    if (byId('wet')) byId('wet').setAttribute('opacity', k === 'yard' ? .6 : 0);
    if (byId('r-title')) byId('r-title').textContent = s.t;
    if (byId('r-text')) byId('r-text').textContent = s.d;
    if (byId('r-tags')) byId('r-tags').innerHTML = s.m.map(function (x) { return '<span>' + x + '</span>'; }).join('');
    test(s);
  }
  btns.forEach(function (b) { b.onclick = function () { show(b.dataset.s); }; });
  hots.forEach(function (h) {
    h.onclick = function () { show(h.dataset.s); };
    h.onkeydown = function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(h.dataset.s); } };
  });
  show('bill');

  var tabs = [].slice.call(document.querySelectorAll('[role=tab][aria-controls]'));
  tabs.forEach(function (t) {
    t.onclick = function () {
      tabs.forEach(function (x) {
        x.setAttribute('aria-selected', x === t);
        byId(x.getAttribute('aria-controls')).classList.toggle('on', x === t);
      });
    };
  });
})();
