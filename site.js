const formatINR = (v) => `₹${new Intl.NumberFormat('en-IN').format(v)}`;

/* Contact: WhatsApp is the primary channel, email the fallback. */
const SIROS_WHATSAPP = '919649319677';
const SIROS_EMAIL = 'siroselectric@gmail.com';
const sirosWhatsApp = (text) => `https://wa.me/${SIROS_WHATSAPP}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

/* Site root, worked out from where this script was loaded, so links and
   assets built here resolve the same from /index.html and /models/nexa/. */
const SIROS_ROOT = (() => {
  try { return new URL('.', document.currentScript.src).href; } catch (e) { return ''; }
})();
const sirosModelUrl = (slug) => `${SIROS_ROOT}models/${slug}/`;

/* ------------------------------------------------- hero video, file:// fallback --
   The scroll-scrub engine loads the clip by fetching it and building a blob
   URL, so it can seek without needing HTTP range support. That fetch is
   blocked by the browser when the page itself is opened as a local file
   (file://...) rather than served over http/https — Chrome refuses
   same-origin fetches to file:// resources. When that happens the clip never
   loads, 'seeked' never fires, and the hero is stuck on its still poster
   forever. This does not edit the engine; it only steps in with an ordinary
   looping <video> if the engine's own loader has visibly given up. */
(function heroFileProtocolFallback() {
  const video = document.querySelector('video[data-sc-scrub]');
  if (!video) return;
  window.setTimeout(() => {
    if (video.classList.contains('sc-has-clip')) return; // engine's own loader succeeded
    const isMobile = window.matchMedia('(max-width: 760px)').matches;
    const src = (isMobile && video.dataset.scSrcMobile) || video.dataset.scSrc;
    if (!src) return;
    video.removeAttribute('data-sc-scrub');
    video.src = src;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.style.opacity = '1';
    const poster = video.parentElement?.querySelector('.sc-stage__poster');
    if (poster) poster.style.opacity = '0';
    video.play().catch(() => {});
  }, 3000);
})();

/* Keeps Tab / Shift+Tab inside an open overlay (menu or dialog) and returns
   focus to whatever opened it. */
function sirosFocusTrap(container) {
  let returnTo = null;
  const focusables = () => [...container.querySelectorAll('a[href], button:not([disabled]), input:not([type=hidden]):not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])')]
    .filter((el) => !el.closest('[hidden]') && el.getClientRects().length);
  function onKey(e) {
    if (e.key !== 'Tab') return;
    const els = focusables();
    if (!els.length) return;
    const first = els[0], last = els[els.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  return {
    activate() { returnTo = document.activeElement; document.addEventListener('keydown', onKey); },
    deactivate() {
      document.removeEventListener('keydown', onKey);
      if (returnTo && document.contains(returnTo)) returnTo.focus({ preventScroll: true });
      returnTo = null;
    },
  };
}

/* --------------------------------------------------------- mobile menu -- */
(function mobileMenu() {
  const btn = document.querySelector('#navMenuBtn');
  const menu = document.querySelector('#mobileMenu');
  const closeBtn = document.querySelector('#mobileMenuClose');
  if (!btn || !menu) return;
  const trap = sirosFocusTrap(menu);
  menu.inert = true;
  function setOpen(open) {
    if (open === menu.classList.contains('is-open')) return;
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    menu.inert = !open;
    document.documentElement.style.overflow = open ? 'hidden' : '';
    if (open) { trap.activate(); menu.querySelector('a')?.focus({ preventScroll: true }); }
    else trap.deactivate();
  }
  btn.addEventListener('click', () => setOpen(btn.getAttribute('aria-expanded') !== 'true'));
  closeBtn?.addEventListener('click', () => setOpen(false));
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
})();

/* --------------------------------------------------------- nav on scroll -- */
(function navShade() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 12);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ------------------------------------------------------------ cost planner -- */
(function costPlanner() {
  const distance = document.querySelector('#distance');
  const distanceValue = document.querySelector('#distanceValue');
  const petrolCost = document.querySelector('#petrolCost');
  const electricCost = document.querySelector('#electricCost');
  const savingCost = document.querySelector('#savingCost');
  if (!distance) return;
  function fmt(v) { return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(v); }
  function update() {
    const km = Number(distance.value);
    const petrol = Math.round(km * 30 * 2.33);
    const electric = Math.round(km * 30 * 0.27);
    distanceValue.textContent = `${km} km / day`;
    petrolCost.textContent = `₹${fmt(petrol)}`;
    electricCost.textContent = `₹${fmt(electric)}`;
    savingCost.textContent = `₹${fmt(petrol - electric)}`;
  }
  distance.addEventListener('input', update);
  update();
})();

/* ------------------------------------------------------------ EMI calculator -- */
(function emiCalculator() {
  const slider = document.querySelector('#emiPrice');
  const output = document.querySelector('#emiPriceValue');
  const tenureEl = document.querySelector('#emiTenure');
  const resultEl = document.querySelector('#emiResult');
  if (!slider || typeof SIROS_EMI_TABLE === 'undefined') return;
  let selectedMonths = null;

  function bandFor(price) { return SIROS_EMI_TABLE.find((b) => b.price === price); }

  function renderTenure(band) {
    const available = band.plans.map((p) => p.months);
    if (!available.includes(selectedMonths)) selectedMonths = available[0];
    tenureEl.innerHTML = band.plans.map((p) =>
      `<button type="button" data-months="${p.months}" class="${p.months === selectedMonths ? 'is-active' : ''}" aria-pressed="${p.months === selectedMonths}">${p.months} mo</button>`
    ).join('');
  }

  function renderResult(band) {
    const plan = band.plans.find((p) => p.months === selectedMonths) || band.plans[0];
    const note = band.plans.length < 3
      ? `<p class="emi-result__note">Only the ${band.plans[0].months}-month plan is recorded at this price in the SIROS financing sheet. Ask SIROS for the others.</p>` : '';
    resultEl.innerHTML = `
      <span class="emi-result__label">You'll pay · ${plan.months}-month plan</span>
      <div class="emi-result__amount">${formatINR(plan.emi)}<span>per month</span></div>
      <div class="emi-result__stats">
        <div class="emi-result__stat"><span>On-road price</span><strong>${formatINR(band.price)}</strong></div>
        <div class="emi-result__stat"><span>Down payment</span><strong>${formatINR(plan.dp)}</strong></div>
      </div>${note}`;
  }

  function render() {
    const price = Number(slider.value);
    output.textContent = formatINR(price);
    const band = bandFor(price);
    if (!band) { tenureEl.innerHTML = ''; resultEl.innerHTML = '<p class="emi-result__note">No reference plan recorded at this price. Ask SIROS directly.</p>'; return; }
    renderTenure(band); renderResult(band);
  }

  slider.addEventListener('input', render);
  tenureEl.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-months]');
    if (!b) return;
    selectedMonths = Number(b.dataset.months);
    render();
  });
  render();
})();

/* ------------------------------------------------------------ range range -- */
(function buildRange() {
  const grid = document.querySelector('#rangeGrid');
  const bands = document.querySelector('#bandRows');
  if (typeof SIROS_MODELS === 'undefined') return;

  // data-static: the cards were written into the HTML by tools/build-model-pages.mjs
  if (grid && !grid.hasAttribute('data-static')) {
    const curated = grid.dataset.curated ? grid.dataset.curated.split(',') : null;
    // models.html lists cards straight under its h1; the homepage under an h2
    const hx = grid.closest('.models-page-section') ? 'h2' : 'h3';
    const list = curated ? curated.map((s) => SIROS_MODELS.find((m) => m.slug === s)).filter(Boolean) : SIROS_MODELS;
    const cards = list.map((m, i) => {
      const from = m.prices ? Math.min(...m.prices) : null;
      // the first few are on screen straight away; the rest load as they near the edge
      const loading = i < 4 ? 'eager' : 'lazy';
      return `
      <article class="range-grid__item">
        <a class="thumb${m.cutout ? ' thumb--cutout' : ''}" href="${sirosModelUrl(m.slug)}" aria-label="View ${m.name}">
          <img src="${SIROS_ROOT}assets/products/${m.photo}-thumb.webp" alt="SIROS ${m.name}" loading="${loading}" decoding="async" width="640" height="853">
        </a>
        <div class="meta">
          <div class="meta__name"><${hx}>${m.name}</${hx}><span class="tag">${m.tag}</span></div>
          <div class="meta__price">${from
            ? `<span>Starting at</span><strong>${formatINR(from)}</strong>`
            : `<span>Price</span><strong>On request</strong>`}</div>
          <div class="meta__actions">
            <a class="card-btn card-btn--primary" href="${sirosModelUrl(m.slug)}">Explore <span aria-hidden="true">→</span></a>
            <a class="card-btn card-btn--ghost" href="${sirosWhatsApp(`Hi SIROS, I'm interested in the ${m.name}. Please share the price and details.`)}" target="_blank" rel="noopener">Enquire</a>
          </div>
        </div>
      </article>`;
    }).join('');
    let endTile = '';
    if (grid.dataset.end === 'brochure') {
      endTile = `
      <div class="range-grid__item range-grid__item--viewall range-grid__item--end">
        <div class="range-grid__item--viewall__inner">
          <h3>The full catalog</h3>
          <p>Specs, features and battery options for every model, in one PDF.</p>
          <a class="card-btn card-btn--primary" href="${SIROS_ROOT}assets/brochure/SIROS-catalog.pdf" download="SIROS-Vehicle-Catalog.pdf">Download brochure</a>
          <a class="card-btn card-btn--ghost" href="${SIROS_ROOT}models.html">Compare all models</a>
        </div>
      </div>`;
    } else if (curated) {
      endTile = `
      <a class="range-grid__item range-grid__item--viewall" href="${SIROS_ROOT}models.html">
        <div class="range-grid__item--viewall__inner">
          <h3>View all models</h3>
          <span class="arrow"><span>See the full range</span><span aria-hidden="true">→</span></span>
        </div>
      </a>`;
    }
    grid.innerHTML = cards + endTile;
  }

  if (bands && typeof SIROS_BATTERY_OPTIONS !== 'undefined') {
    bands.innerHTML = SIROS_BATTERY_OPTIONS.map((b) => `
      <div class="band-card">
        <span class="band-card__volt">${b.volt}</span>
        <span class="band-card__range">${b.range}</span>
        <span class="band-card__cells">${b.chem}</span>
      </div>`).join('');
  }
})();

/* -------------------------------------------------------- battery picker -- */
/* Model pages: picking a battery updates the price, range, the highlighted
   price-list row and the WhatsApp enquiry. The page already shows the
   cheapest option without JavaScript. */
(function batteryPicker() {
  const picker = document.querySelector('[data-battery-picker]');
  if (!picker) return;
  const model = picker.dataset.model;
  const price = document.querySelector('[data-picker-price]');
  const range = document.querySelector('[data-picker-range]');
  const label = document.querySelector('[data-picker-label]');
  const enquire = document.querySelector('[data-picker-enquire]');
  const rows = document.querySelectorAll('.pm-table tr[data-row]');
  function update() {
    const input = picker.querySelector('input:checked');
    if (!input) return;
    const changed = price.textContent !== input.dataset.price;
    price.textContent = input.dataset.price;
    range.textContent = input.dataset.range;
    if (changed) {
      [price, range].forEach((el) => { el.classList.remove('pm-tick'); void el.offsetWidth; el.classList.add('pm-tick'); });
    }
    label.textContent = input.dataset.label;
    rows.forEach((r) => r.classList.toggle('is-current', r.dataset.row === input.value));
    if (enquire) enquire.href = sirosWhatsApp(`Hi SIROS, I'm interested in the ${model} with the ${input.dataset.label} battery (${input.dataset.price}). Please share the details.`);
  }
  picker.addEventListener('change', update);
  update();
})();

/* ----------------------------------------------------------------- rails -- */
/* Sideways shelves: native scroll + snap does the real work (touch swipe and
   trackpads just work). This layer adds arrow buttons, mouse drag with
   momentum, keyboard arrows, the live progress bar and the edge fades. */
(function rails() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-rail]').forEach((rail) => {
    const track = rail.querySelector('[data-rail-track]');
    if (!track) return;
    const prev = rail.querySelector('[data-rail-prev]');
    const next = rail.querySelector('[data-rail-next]');
    const bar = rail.querySelector('.rail-progress');

    const step = () => {
      const item = track.firstElementChild;
      if (!item) return track.clientWidth * 0.8;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      const per = item.getBoundingClientRect().width + gap;
      // move by whole cards, as many as fit, so the next set lands snapped
      return per * Math.max(1, Math.floor(track.clientWidth / per));
    };
    const go = (dir) => track.scrollBy({ left: dir * step(), behavior: reduced ? 'auto' : 'smooth' });

    function update() {
      const max = track.scrollWidth - track.clientWidth;
      const atStart = track.scrollLeft <= 2;
      const atEnd = track.scrollLeft >= max - 2;
      rail.classList.toggle('at-start', atStart);
      rail.classList.toggle('at-end', atEnd);
      if (prev) prev.disabled = atStart;
      if (next) next.disabled = atEnd;
      if (bar) {
        const share = max > 0 ? track.clientWidth / track.scrollWidth : 1;
        const p = max > 0 ? track.scrollLeft / max : 0;
        bar.style.setProperty('--rail-thumb', `${share * 100}%`);
        bar.style.setProperty('--rail-x', `${p * (1 / share - 1) * 100}%`);
        bar.hidden = max <= 0;
      }
    }
    prev?.addEventListener('click', () => go(-1));
    next?.addEventListener('click', () => go(1));
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    track.addEventListener('keydown', (e) => {
      if (e.target !== track) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    });

    // Mouse drag (touch and pen already scroll natively).
    let down = false, moved = false, startX = 0, startLeft = 0, lastX = 0, lastT = 0, vel = 0, dragEnd = 0;
    track.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      down = true; moved = false; startX = lastX = e.clientX; startLeft = track.scrollLeft; lastT = performance.now(); vel = 0;
    });
    window.addEventListener('pointermove', (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 6) { moved = true; track.classList.add('is-dragging'); }
      if (!moved) return;
      const now = performance.now();
      vel = (e.clientX - lastX) / Math.max(1, now - lastT);
      lastX = e.clientX; lastT = now;
      track.scrollLeft = startLeft - dx;
    });
    window.addEventListener('pointerup', () => {
      if (!down) return;
      down = false;
      if (!moved) return;
      // carry a little momentum, then let snap settle on a card
      const fling = reduced ? 0 : -vel * 260;
      dragEnd = performance.now();
      track.classList.remove('is-dragging');
      track.scrollBy({ left: fling, behavior: reduced ? 'auto' : 'smooth' });
    });
    // the click that ends a drag shouldn't open the card underneath
    track.addEventListener('click', (e) => {
      if (performance.now() - dragEnd < 80) { e.preventDefault(); e.stopPropagation(); }
    }, true);

    window.addEventListener('load', update);
    update();
  });
})();

/* --------------------------------------------------------------- dealers -- */
(function dealerLocator() {
  const searchInput = document.querySelector('#dealerSearch');
  const resultsEl = document.querySelector('#dealerResults');
  const metaEl = document.querySelector('#dealerMeta');
  if (!searchInput || typeof SIROS_DEALERS === 'undefined') return;

  const STATE_NAMES = { rj: 'Rajasthan', mp: 'Madhya Pradesh' };
  // dealers.html puts results straight under its h1; the homepage under an h2
  const cardHeading = document.querySelector('.dealers-page-section') ? 'h2' : 'h3';

  function matches(d, q) {
    return !!(d.town && d.town.toLowerCase().includes(q));
  }
  function card(d) {
    const title = d.town || d.firm || 'SIROS dealer';
    const showFirm = d.firm && d.firm !== title;
    const q = encodeURIComponent([d.firm, d.address, d.pin].filter(Boolean).join(', '));
    return `<div class="dealer-card">
      <div class="dealer-card__top"><${cardHeading}>${title}</${cardHeading}><span class="dealer-card__state">${STATE_NAMES[d.state] || d.state}</span></div>
      ${showFirm || d.contact ? `<p class="dealer-card__meta">${[d.firm, d.contact].filter(Boolean).join(' · ')}</p>` : ''}
      ${d.address ? `<address>${d.address}${d.pin ? `, ${d.pin}` : ''}</address>` : ''}
      <a href="https://www.google.com/maps/search/?api=1&query=${q}" target="_blank" rel="noopener">Get directions →</a>
    </div>`;
  }
  function render() {
    const q = searchInput.value.trim().toLowerCase();
    metaEl.textContent = '';
    if (!q) {
      resultsEl.innerHTML = `<div class="dealer-empty"><strong>Search to find your nearest dealer</strong><br>Type your city.</div>`;
      return;
    }
    const matched = SIROS_DEALERS.filter((d) => matches(d, q));
    if (!matched.length) {
      resultsEl.innerHTML = `<div class="dealer-empty"><strong>No dealers found</strong><br>Try a different spelling.</div>`;
      return;
    }
    resultsEl.innerHTML = `<div class="dealer-results">${matched.map(card).join('')}</div>`;
  }
  searchInput.addEventListener('input', render);
  render();
})();

/* -------------------------------------------------------------------- FAQ -- */
(function faq() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach((item) => {
    const btn = item.querySelector('.faq-q');
    btn?.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      items.forEach((o) => o.querySelector('.faq-q').setAttribute('aria-expanded', 'false'));
      btn.setAttribute('aria-expanded', String(!open));
    });
  });
})();

/* ==========================================================================
   PREMIUM MOBILE LAYER
   Phone-only behaviour that pairs with the mobile block in site.css. Each
   piece bails out on desktop, so the large-screen page is unaffected.
   ========================================================================== */

const sirosPhone = window.matchMedia('(max-width: 760px)');

/* ------------------------------------------- top bar: where am I, exactly -- */
/* The top bar names the section under the reader and doubles as the menu
   trigger, so the chrome always says where you are instead of just who we
   are. Sections are matched by selector rather than by markup attributes,
   which keeps the acts themselves untouched. */
(function navSectionLabel() {
  const chip = document.querySelector('#navSection');
  const label = document.querySelector('#navSectionLabel');
  const menuBtn = document.querySelector('#navMenuBtn');
  if (!chip || !label) return;

  const MAP = [
    ['.hero-simple', 'Overview'],
    ['#trust', 'Why SIROS'],
    ['.cost-section', 'Running cost'],
    ['#range', 'Vehicles'],
    ['#emi', 'Ownership'],
    ['.dealers-section', 'Dealers'],
    ['#faq', 'FAQ'],
    ['#close', 'Talk to SIROS'],
  ];
  const marks = MAP
    .map(([sel, text]) => { const el = document.querySelector(sel); return el ? { el, text } : null; })
    .filter(Boolean);
  if (!marks.length) return;

  let current = '';
  let queued = false;
  function apply() {
    queued = false;
    const probe = window.scrollY + 90;
    let next = marks[0].text;
    for (const m of marks) if (m.el.offsetTop <= probe) next = m.text;
    if (next === current) return;
    current = next;
    // Crossfade rather than snapping, so the label change reads as a
    // transition between sections instead of a flicker.
    chip.classList.add('is-swapping');
    window.setTimeout(() => { label.textContent = next; chip.classList.remove('is-swapping'); }, 180);
  }
  window.addEventListener('scroll', () => {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(apply);
  }, { passive: true });
  apply();

  if (!menuBtn) return;
  chip.addEventListener('click', () => menuBtn.click());
  // The chip and the hamburger open the same panel, so they report the same state.
  new MutationObserver(() => {
    chip.setAttribute('aria-expanded', menuBtn.getAttribute('aria-expanded') || 'false');
  }).observe(menuBtn, { attributes: true, attributeFilter: ['aria-expanded'] });
})();

/* ------------------------------------------------ bottom action bar (phone) -- */
/* Both real actions stay within thumb reach for the whole page. It stays
   out of the way over the hero (a plain brand video, no CTAs of its own to
   compete with) and over the closing act (which is one big CTA already). */
(function mobileActionBar() {
  const bar = document.querySelector('#actionBar');
  const hero = document.querySelector('.hero-simple');
  const close = document.querySelector('#close');
  if (!bar) return;
  let queued = false;
  function apply() {
    queued = false;
    if (!sirosPhone.matches) { bar.classList.remove('is-visible'); return; }
    const y = window.scrollY;
    const pastHero = hero ? y > hero.offsetTop + hero.offsetHeight * 0.55 : y > 400;
    const atClose = close ? y + window.innerHeight > close.offsetTop + 120 : false;
    bar.classList.toggle('is-visible', pastHero && !atClose);
  }
  window.addEventListener('scroll', () => {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(apply);
  }, { passive: true });
  window.addEventListener('resize', apply);
  apply();
})();

/* The range shelf's progress rail (#rangeProgress) needs no JS: it reads
   the pinned pan act's own --sc-p custom property straight in CSS. */

/* --------------------------------------------------- footer as accordion -- */
/* Five stacked link columns is a long crawl on a phone. Collapsed, the
   footer is a short index you open only where you need it. Built by
   enhancement so the desktop footer keeps its plain, non-interactive
   headings. */
(function footerAccordion() {
  const footer = document.querySelector('.site-footer');
  if (!footer) return;
  let built = false;

  function build() {
    if (built) return;
    built = true;
    footer.querySelectorAll('.site-footer__col').forEach((col, i) => {
      const heading = col.querySelector('.site-footer__heading');
      if (!heading) return;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'site-footer__heading';
      btn.textContent = heading.textContent;
      btn.setAttribute('aria-expanded', 'false');

      const panel = document.createElement('div');
      panel.className = 'site-footer__panel';
      const inner = document.createElement('div');
      while (heading.nextSibling) inner.appendChild(heading.nextSibling);
      panel.appendChild(inner);

      const panelId = `footerPanel${i}`;
      panel.id = panelId;
      btn.setAttribute('aria-controls', panelId);
      btn.addEventListener('click', () => {
        btn.setAttribute('aria-expanded', String(btn.getAttribute('aria-expanded') !== 'true'));
      });

      heading.replaceWith(btn);
      col.appendChild(panel);
    });
  }

  if (sirosPhone.matches) build();
  // Only ever builds — a desktop visitor who never crosses the breakpoint
  // keeps the plain footer, and one who resizes down gets the accordion.
  const onChange = () => { if (sirosPhone.matches) build(); };
  if (typeof sirosPhone.addEventListener === 'function') sirosPhone.addEventListener('change', onChange);
  else if (typeof sirosPhone.addListener === 'function') sirosPhone.addListener(onChange);
})();

/* ------------------------------------------------------------ scroll reveal -- */
(function scrollReveal() {
  const targets = document.querySelectorAll('[data-sc-in]');
  if (!targets.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    targets.forEach((el) => el.classList.add('sc-in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('sc-in'); io.unobserve(entry.target); }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });
  targets.forEach((el) => io.observe(el));
})();

/* ------------------------------------------------------------ test ride modal -- */
/* Paste your Google Apps Script Web App URL here to log every submission
   into a Google Sheet, in addition to the WhatsApp message it opens. Leave it
   blank and the form still works (WhatsApp only). See
   apps-script/test-ride-sheet.gs for the script this URL comes from. */
const TEST_RIDE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbx3y-ziQXL8bS68UAMFEh-N0KLr-ad4PmG-eRul-YXRJi7diZfAYcby1TKiIaJ_yocJ/exec';

/* Two ways in: an automatic pop, once, the first time a visitor's scroll
   passes the midpoint of the page; and a floating scooter button that stays
   on screen through the whole scroll on every page, for anyone who wants to
   open it on their own terms. sessionStorage caps the automatic one to once
   per tab — the floating button is never capped, since choosing to tap it
   is never an interruption. */
/* Opens WhatsApp in a new tab (the app on phones), falling back to the same
   tab if a popup blocker refuses. Returns the link so the confirmation can
   offer it as a button too. */
function sirosOpenWhatsApp(text) {
  const url = sirosWhatsApp(text);
  const win = window.open(url, '_blank', 'noopener');
  if (!win) window.location.href = url;
  return url;
}
function sirosDoneMessage(title, line, url) {
  const done = document.createElement('div');
  done.className = 'tr-form__done';
  const strong = document.createElement('strong');
  strong.textContent = title;
  const span = document.createElement('span');
  span.textContent = line;
  const a = document.createElement('a');
  a.className = 'tr-form__wa';
  a.href = url; a.target = '_blank'; a.rel = 'noopener';
  a.textContent = 'Open WhatsApp';
  done.append(strong, span, a);
  return done;
}

(function testRideModal() {
  // The dealer-application page is its own B2B flow with its own CTA — a
  // consumer "book a test ride" prompt interrupting it is off-message, so
  // this whole feature sits out on that one page.
  if (document.querySelector('#dealerAppModal')) return;

  const SHOWN_KEY = 'sirosTestRideShown';
  let alreadyShown = false;
  try { alreadyShown = sessionStorage.getItem(SHOWN_KEY) === '1'; } catch (e) { /* private mode etc. */ }

  const modelOptions = typeof SIROS_MODELS !== 'undefined'
    ? SIROS_MODELS.map((m) => `<option value="${m.name}">`).join('')
    : '';

  const modal = document.createElement('div');
  modal.className = 'tr-modal';
  modal.id = 'trModal';
  modal.hidden = true;
  modal.setAttribute('role', 'presentation');
  modal.innerHTML = `
    <div class="tr-modal__backdrop" data-tr-close></div>
    <div class="tr-modal__panel" role="dialog" aria-modal="true" aria-labelledby="trTitle">
      <div class="tr-modal__scan" aria-hidden="true"></div>
      <div class="tr-modal__corner tr-modal__corner--tl" aria-hidden="true"></div>
      <div class="tr-modal__corner tr-modal__corner--tr" aria-hidden="true"></div>
      <div class="tr-modal__corner tr-modal__corner--bl" aria-hidden="true"></div>
      <div class="tr-modal__corner tr-modal__corner--br" aria-hidden="true"></div>
      <button class="tr-modal__close" type="button" data-tr-close aria-label="Close">✕</button>
      <div class="tr-modal__head">
        <span class="tr-modal__eyebrow">// BOOK A TEST RIDE</span>
        <h2 id="trTitle">Feel the <em>electric</em> shift.</h2>
        <p>Pick a model and tell us where you are. A SIROS rep sets up your ride.</p>
      </div>
      <form class="tr-form" id="trForm">
        <label class="tr-field"><span>Full name</span>
          <input type="text" name="name" required autocomplete="name" maxlength="80">
        </label>
        <label class="tr-field"><span>Phone number</span>
          <input type="tel" name="phone" required autocomplete="tel" pattern="[0-9+\\s\\-]{7,15}">
        </label>
        <label class="tr-field"><span>City</span>
          <input type="text" name="city" required autocomplete="address-level2" maxlength="60">
        </label>
        <label class="tr-field"><span>Model you're curious about</span>
          <input type="text" name="model" list="trModelsList" placeholder="e.g. Nexa" autocomplete="off" maxlength="40">
          <datalist id="trModelsList">${modelOptions}</datalist>
        </label>
        <label class="tr-hp" aria-hidden="true">Website<input type="text" name="website" tabindex="-1" autocomplete="off"></label>
        <button class="tr-form__submit" type="submit">
          <span>Book test ride</span><span class="tr-form__submit-arrow" aria-hidden="true">→</span>
        </button>
        <p class="tr-form__note">Opens WhatsApp with your request ready to send to SIROS (+91 96493 19677). Your name, phone and city are used only to arrange this ride.</p>
      </form>
    </div>`;
  document.body.appendChild(modal);

  // The floating trigger: on screen through the entire scroll, on every
  // page, shaped like the thing it's asking you to go ride rather than a
  // generic pill — the icon silhouette IS the button, no chrome around it.
  const fab = document.createElement('button');
  fab.type = 'button';
  fab.className = 'tr-fab';
  fab.id = 'trFab';
  fab.setAttribute('aria-label', 'Book a test ride');
  fab.innerHTML = `
    <span class="tr-fab__ring" aria-hidden="true"></span>
    <svg class="tr-fab__icon" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="11" cy="38" r="6.5" fill="currentColor"/>
      <circle cx="37" cy="38" r="6.5" fill="currentColor"/>
      <path d="M11 31.5H37L39.5 9" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M32 8H46" stroke="currentColor" stroke-width="4.2" stroke-linecap="round"/>
      <circle cx="39.5" cy="9" r="2.1" fill="currentColor"/>
    </svg>
    <span class="tr-fab__label">Test ride</span>`;
  document.body.appendChild(fab);

  const panel = modal.querySelector('.tr-modal__panel');
  const head = modal.querySelector('.tr-modal__head');
  const form = modal.querySelector('#trForm');
  panel.tabIndex = -1;
  const trap = sirosFocusTrap(panel);
  let closeTimer = null;

  function markShown() { try { sessionStorage.setItem(SHOWN_KEY, '1'); } catch (e) { /* ignore */ } }

  function resetForm() {
    clearTimeout(closeTimer);
    const done = panel.querySelector('.tr-form__done');
    if (done) done.remove();
    form.hidden = false;
    head.hidden = false;
    form.reset();
  }

  // auto = opened by the scroll trigger rather than a tap: focus the dialog
  // itself, not the name field, so a phone keyboard doesn't jump up uninvited.
  function open(auto = false) {
    if (!modal.hidden) return;
    markShown();
    detachScrollTrigger();
    resetForm();
    trap.activate();
    modal.hidden = false;
    fab.classList.add('is-hidden');
    document.documentElement.style.overflow = 'hidden';
    // rAF so the browser paints the pre-transition state before .is-open applies.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      modal.classList.add('is-open');
      const target = auto === true ? panel : form.querySelector('input[name="name"]');
      target?.focus({ preventScroll: true });
    }));
  }

  function close() {
    if (modal.hidden) return;
    clearTimeout(closeTimer);
    modal.classList.add('is-closing');
    modal.classList.remove('is-open');
    document.documentElement.style.overflow = '';
    fab.classList.remove('is-hidden');
    trap.deactivate();
    window.setTimeout(() => { modal.hidden = true; modal.classList.remove('is-closing'); }, 200);
  }

  fab.addEventListener('click', () => open());
  // The homepage's own "Test ride" quick-action card used to just scroll to
  // the closing CTA. Now that a real booking form exists, it opens that
  // instead — one "test ride" story across the page, not two.
  document.querySelector('#qaTestRide')?.addEventListener('click', (e) => { e.preventDefault(); open(); });
  modal.querySelectorAll('[data-tr-close]').forEach((el) => el.addEventListener('click', close));
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) close(); });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const phone = String(data.get('phone') || '').trim();
    const city = String(data.get('city') || '').trim();
    const model = String(data.get('model') || '').trim();
    const message = [
      'Hi SIROS, I would like to book a test ride.',
      `Name: ${name}`, `Phone: ${phone}`, `City: ${city}`,
      model ? `Model: ${model}` : null,
    ].filter(Boolean).join('\n');

    // Logged to the Sheet in parallel with WhatsApp, never blocking or
    // gating it: a visitor's confirmation flow can't depend on a network
    // call to a script that might be slow, misconfigured, or (until the
    // constant above is set) simply absent.
    if (TEST_RIDE_SHEET_URL && !data.get('website')) {
      fetch(TEST_RIDE_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: new URLSearchParams({ name, phone, city, model, page: location.pathname }),
      }).catch(() => { /* best-effort; WhatsApp is the real channel */ });
    }

    const url = sirosOpenWhatsApp(message);
    head.hidden = true;
    form.hidden = true;
    panel.appendChild(sirosDoneMessage(`You're set, ${name.split(' ')[0] || 'rider'}.`, 'Send the WhatsApp message that just opened and a SIROS rep will confirm a time.', url));
  });

  let queued = false;
  function onScroll() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      // Measured live, not captured once at load: the scroll-craft engine
      // sets pinned/pan act heights after its own init pass, so the page's
      // true scrollable height is only trustworthy once scrolling has
      // actually started.
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll < 600) return; // too short for "the middle" to mean anything
      if (window.scrollY / maxScroll >= 0.5) open(true);
    });
  }
  function detachScrollTrigger() { window.removeEventListener('scroll', onScroll); }
  // The automatic pop stays capped at once per tab; the floating button
  // above is the permanent, uncapped way in, so it attaches regardless.
  // Model pages already carry their own "Book a test ride" button next to the
  // price, so the automatic pop-up would only interrupt someone comparing.
  const autoAllowed = !document.body.classList.contains('is-model-page');
  if (!alreadyShown && autoAllowed) window.addEventListener('scroll', onScroll, { passive: true });
})();

/* -------------------------------------------------------------- dealer application -- */
/* Paste your Google Apps Script Web App URL here to log dealer applications
   into their own Google Sheet — separate from TEST_RIDE_SHEET_URL above, so
   the two lists never mix. See apps-script/dealer-application-sheet.gs.
   Leave blank and the form still works (WhatsApp only), same as the test-ride
   one. Only dealer.html has the markup this targets, so this whole block is
   a no-op everywhere else. */
const DEALER_APP_SHEET_URL = '';

(function dealerApplicationModal() {
  const modal = document.querySelector('#dealerAppModal');
  const openBtn = document.querySelector('#dealerAppOpen');
  const form = document.querySelector('#dealerAppForm');
  if (!modal || !form) return;

  const panel = modal.querySelector('.tr-modal__panel');
  const head = modal.querySelector('.tr-modal__head');
  const trap = sirosFocusTrap(panel);
  let closeTimer = null;

  function resetForm() {
    clearTimeout(closeTimer);
    const done = panel.querySelector('.tr-form__done');
    if (done) done.remove();
    form.hidden = false;
    head.hidden = false;
    form.reset();
  }

  function open() {
    if (!modal.hidden) return;
    resetForm();
    trap.activate();
    modal.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      modal.classList.add('is-open');
      form.querySelector('input[name="name"]')?.focus({ preventScroll: true });
    }));
  }

  function close() {
    if (modal.hidden) return;
    clearTimeout(closeTimer);
    modal.classList.add('is-closing');
    modal.classList.remove('is-open');
    document.documentElement.style.overflow = '';
    trap.deactivate();
    window.setTimeout(() => { modal.hidden = true; modal.classList.remove('is-closing'); }, 200);
  }

  openBtn?.addEventListener('click', open);
  modal.querySelectorAll('[data-dl-close]').forEach((el) => el.addEventListener('click', close));
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) close(); });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const business = String(data.get('business') || '').trim();
    const phone = String(data.get('phone') || '').trim();
    const city = String(data.get('city') || '').trim();
    const message = String(data.get('message') || '').trim();
    const waText = [
      'Hi SIROS, I would like to apply for a SIROS dealership.',
      `Name: ${name}`, business ? `Business: ${business}` : null,
      `Phone: ${phone}`, `City: ${city}`, message ? `Message: ${message}` : null,
    ].filter(Boolean).join('\n');

    if (DEALER_APP_SHEET_URL && !data.get('website')) {
      fetch(DEALER_APP_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: new URLSearchParams({ name, business, phone, city, message, page: location.pathname }),
      }).catch(() => { /* best-effort; WhatsApp is the real channel */ });
    }

    const url = sirosOpenWhatsApp(waText);
    head.hidden = true;
    form.hidden = true;
    panel.appendChild(sirosDoneMessage(`Thanks, ${name.split(' ')[0] || 'there'}.`, 'Send the WhatsApp message that just opened and the SIROS dealer team will get back to you.', url));
  });
})();
