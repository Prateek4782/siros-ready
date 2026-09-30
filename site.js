const formatINR = (v) => `₹${new Intl.NumberFormat('en-IN').format(v)}`;

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

/* --------------------------------------------------------- mobile menu -- */
(function mobileMenu() {
  const btn = document.querySelector('#navMenuBtn');
  const menu = document.querySelector('#mobileMenu');
  const closeBtn = document.querySelector('#mobileMenuClose');
  if (!btn || !menu) return;
  function setOpen(open) {
    btn.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
    document.documentElement.style.overflow = open ? 'hidden' : '';
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

  if (grid) {
    const curated = grid.dataset.curated ? grid.dataset.curated.split(',') : null;
    const list = curated ? SIROS_MODELS.filter((m) => curated.includes(m.slug)) : SIROS_MODELS;
    const cards = list.map((m) => `
      <article class="range-grid__item">
        <a class="thumb${m.cutout ? ' thumb--cutout' : ''}" href="product.html?model=${m.slug}" aria-label="View ${m.name}">
          <img src="assets/products/${m.photo}.webp" alt="SIROS ${m.name}" loading="lazy">
        </a>
        <div class="meta">
          <div class="meta__brand"><img class="meta__mark" src="assets/brand/mark.png" alt=""><span>SIROS</span></div>
          <div class="meta__name"><h4>${m.name}</h4><span class="tag">${m.tag}</span></div>
          <p class="meta__blurb">${m.blurb || ''}</p>
          <div class="meta__price"><span>On-road price</span><strong>Confirmed at enquiry</strong></div>
          <div class="meta__actions">
            <a class="card-btn card-btn--primary" href="product.html?model=${m.slug}">Explore ${m.name} <span aria-hidden="true">→</span></a>
            <a class="card-btn card-btn--ghost" href="mailto:info@sirosvehicles.com?subject=${encodeURIComponent(m.name + ' enquiry')}">Ask price <span aria-hidden="true">→</span></a>
          </div>
        </div>
      </article>`).join('');
    const viewAll = curated ? `
      <a class="range-grid__item range-grid__item--viewall" href="models.html">
        <div class="range-grid__item--viewall__inner">
          <span class="range-grid__item--viewall__count">${SIROS_MODELS.length}</span>
          <h4>View all models</h4>
          <span class="arrow"><span>See the full range</span><span aria-hidden="true">→</span></span>
        </div>
      </a>` : '';
    grid.innerHTML = cards + viewAll;
  }

  if (bands && typeof SIROS_BATTERY_BANDS !== 'undefined') {
    bands.innerHTML = SIROS_BATTERY_BANDS.map((b) => `
      <div class="band-card">
        <span class="band-card__volt">${b.volt}</span>
        <span class="band-card__range">${b.range}</span>
        <span class="band-card__cells">${b.cells}</span>
      </div>`).join('');
  }
})();

/* --------------------------------------------------------------- dealers -- */
(function dealerLocator() {
  const searchInput = document.querySelector('#dealerSearch');
  const stateSelect = document.querySelector('#dealerState');
  const resultsEl = document.querySelector('#dealerResults');
  const metaEl = document.querySelector('#dealerMeta');
  if (!searchInput || typeof SIROS_DEALERS === 'undefined') return;

  const STATE_NAMES = { rj: 'Rajasthan', mp: 'Madhya Pradesh' };
  const STATE_ORDER = ['rj', 'mp'];
  const mobileMql = window.matchMedia('(max-width: 760px)');

  function matches(d, q) {
    if (!q) return true;
    return [d.firm, d.contact, d.town, d.address, d.pin].filter(Boolean).join(' ').toLowerCase().includes(q);
  }
  function card(d) {
    const title = d.town || d.firm || 'SIROS dealer';
    const showFirm = d.firm && d.firm !== title;
    const q = encodeURIComponent([d.firm, d.address, d.pin].filter(Boolean).join(', '));
    return `<div class="dealer-card">
      <div class="dealer-card__top"><h4>${title}</h4><span class="dealer-card__state">${STATE_NAMES[d.state] || d.state}</span></div>
      ${showFirm || d.contact ? `<p class="dealer-card__meta">${[d.firm, d.contact].filter(Boolean).join(' · ')}</p>` : ''}
      ${d.address ? `<address>${d.address}${d.pin ? `, ${d.pin}` : ''}</address>` : ''}
      <a href="https://www.google.com/maps/search/?api=1&query=${q}" target="_blank" rel="noopener">Get directions →</a>
    </div>`;
  }
  function group(code, list) {
    return `<div class="dealer-group"><div class="dealer-group__head"><h3>${STATE_NAMES[code] || code}</h3><span>${list.length} dealer${list.length === 1 ? '' : 's'}</span></div>
      <div class="dealer-results">${list.map(card).join('')}</div></div>`;
  }
  function render() {
    const q = searchInput.value.trim().toLowerCase();
    const state = stateSelect.value;
    const browsingAll = !q && state === 'all';
    if (browsingAll && mobileMql.matches) {
      metaEl.textContent = 'Dealers across Rajasthan & Madhya Pradesh';
      resultsEl.innerHTML = `<div class="dealer-empty"><strong>Search to find your nearest dealer</strong><br>Type a town, firm or dealer name, or choose a state.</div>`;
      return;
    }
    const matched = SIROS_DEALERS.filter((d) => (state === 'all' || d.state === state) && matches(d, q));
    if (!matched.length) {
      metaEl.textContent = 'No matches';
      resultsEl.innerHTML = `<div class="dealer-empty"><strong>No dealers found</strong><br>Try a different spelling, or search by state.</div>`;
      return;
    }
    metaEl.textContent = q || state !== 'all' ? `${matched.length} dealer${matched.length === 1 ? '' : 's'} found`
      : `${matched.length} dealers across ${STATE_ORDER.filter((s) => matched.some((d) => d.state === s)).map((s) => STATE_NAMES[s]).join(' & ')}`;
    if (browsingAll) {
      resultsEl.innerHTML = STATE_ORDER.map((c) => matched.filter((d) => d.state === c)).filter((g) => g.length).map((g) => group(g[0].state, g)).join('');
    } else {
      resultsEl.innerHTML = `<div class="dealer-results">${matched.map(card).join('')}</div>`;
    }
  }
  searchInput.addEventListener('input', render);
  stateSelect.addEventListener('change', render);
  if (typeof mobileMql.addEventListener === 'function') mobileMql.addEventListener('change', render);
  else if (typeof mobileMql.addListener === 'function') mobileMql.addListener(render);
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
   into a Google Sheet, in addition to the mailto it already sends. Leave it
   blank and the form behaves exactly as before (mailto only). See
   apps-script/test-ride-sheet.gs for the script this URL comes from. */
const TEST_RIDE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbx3y-ziQXL8bS68UAMFEh-N0KLr-ad4PmG-eRul-YXRJi7diZfAYcby1TKiIaJ_yocJ/exec';

/* Two ways in: an automatic pop, once, the first time a visitor's scroll
   passes the midpoint of the page; and a floating scooter button that stays
   on screen through the whole scroll on every page, for anyone who wants to
   open it on their own terms. sessionStorage caps the automatic one to once
   per tab — the floating button is never capped, since choosing to tap it
   is never an interruption. */
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
        <h3 id="trTitle">Feel the <em>electric</em> shift.</h3>
        <p>Pick a model and tell us where you are. A SIROS rep sets up your ride.</p>
      </div>
      <form class="tr-form" id="trForm">
        <label class="tr-field"><span>Full name</span>
          <input type="text" name="name" required autocomplete="name">
        </label>
        <label class="tr-field"><span>Phone number</span>
          <input type="tel" name="phone" required autocomplete="tel" pattern="[0-9+\\s\\-]{7,15}">
        </label>
        <label class="tr-field"><span>City</span>
          <input type="text" name="city" required autocomplete="address-level2">
        </label>
        <label class="tr-field"><span>Model you're curious about</span>
          <input type="text" name="model" list="trModelsList" placeholder="e.g. Nexa" autocomplete="off">
          <datalist id="trModelsList">${modelOptions}</datalist>
        </label>
        <button class="tr-form__submit" type="submit">
          <span>Book test ride</span><span class="tr-form__submit-arrow" aria-hidden="true">→</span>
        </button>
        <p class="tr-form__note">Opens your mail app to info@sirosvehicles.com — a SIROS rep replies with times.</p>
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

  function open() {
    markShown();
    detachScrollTrigger();
    resetForm();
    modal.hidden = false;
    fab.classList.add('is-hidden');
    document.documentElement.style.overflow = 'hidden';
    // rAF so the browser paints the pre-transition state before .is-open applies.
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
    fab.classList.remove('is-hidden');
    window.setTimeout(() => { modal.hidden = true; modal.classList.remove('is-closing'); }, 200);
  }

  fab.addEventListener('click', open);
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
    const subject = encodeURIComponent('Test ride request');
    const bodyLines = [
      `Name: ${name}`, `Phone: ${phone}`, `City: ${city}`,
      model ? `Model: ${model}` : null,
    ].filter(Boolean);
    const body = encodeURIComponent(bodyLines.join('\n'));
    const mailto = `mailto:info@sirosvehicles.com?subject=${subject}&body=${body}`;

    // Logged to the Sheet in parallel with the mailto, never blocking or
    // gating it: a visitor's confirmation flow can't depend on a network
    // call to a script that might be slow, misconfigured, or (until the
    // constant above is set) simply absent.
    if (TEST_RIDE_SHEET_URL) {
      fetch(TEST_RIDE_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: new URLSearchParams({ name, phone, city, model, page: location.pathname }),
      }).catch(() => { /* best-effort; the mailto is the real fallback */ });
    }

    head.hidden = true;
    form.hidden = true;
    const done = document.createElement('div');
    done.className = 'tr-form__done';
    const strong = document.createElement('strong');
    strong.textContent = `You're set, ${name.split(' ')[0] || 'rider'}.`;
    const span = document.createElement('span');
    span.textContent = 'Opening your mail app to confirm a time…';
    done.append(strong, span);
    panel.appendChild(done);
    window.location.href = mailto;
    closeTimer = window.setTimeout(close, 2200);
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
      if (window.scrollY / maxScroll >= 0.5) open();
    });
  }
  function detachScrollTrigger() { window.removeEventListener('scroll', onScroll); }
  // The automatic pop stays capped at once per tab; the floating button
  // above is the permanent, uncapped way in, so it attaches regardless.
  if (!alreadyShown) window.addEventListener('scroll', onScroll, { passive: true });
})();

/* -------------------------------------------------------------- dealer application -- */
/* Paste your Google Apps Script Web App URL here to log dealer applications
   into their own Google Sheet — separate from TEST_RIDE_SHEET_URL above, so
   the two lists never mix. See apps-script/dealer-application-sheet.gs.
   Leave blank and the form still works (mailto only), same as the test-ride
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
    resetForm();
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
    const subject = encodeURIComponent('Dealer application');
    const bodyLines = [
      `Name: ${name}`, business ? `Business: ${business}` : null,
      `Phone: ${phone}`, `City: ${city}`, message ? `Message: ${message}` : null,
    ].filter(Boolean);
    const body = encodeURIComponent(bodyLines.join('\n'));
    const mailto = `mailto:info@sirosvehicles.com?subject=${subject}&body=${body}`;

    if (DEALER_APP_SHEET_URL) {
      fetch(DEALER_APP_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: new URLSearchParams({ name, business, phone, city, message, page: location.pathname }),
      }).catch(() => { /* best-effort; the mailto is the real fallback */ });
    }

    head.hidden = true;
    form.hidden = true;
    const done = document.createElement('div');
    done.className = 'tr-form__done';
    const strong = document.createElement('strong');
    strong.textContent = `Thanks, ${name.split(' ')[0] || 'there'}.`;
    const span = document.createElement('span');
    span.textContent = 'Opening your mail app to send it through…';
    done.append(strong, span);
    panel.appendChild(done);
    window.location.href = mailto;
    closeTimer = window.setTimeout(close, 2200);
  });
})();
