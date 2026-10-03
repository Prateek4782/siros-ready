// Builds one static page per model at /models/<slug>/index.html, plus
// sitemap.xml, from products-data.js (the single source of truth).
//
//   node tools/build-model-pages.mjs
//
// Run it again after any change to products-data.js (names, prices, photos,
// colours). Pages use root-relative URLs (/assets/...), so test through a
// local server (see "Open Website.bat"), not by double-clicking the file.

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://siroselectric.com/';
const WA = '919649319677';
const EMAIL = 'siroselectric@gmail.com';
const TODAY = new Date().toISOString().slice(0, 10);

// ---- data ----------------------------------------------------------------
const sandbox = {};
vm.runInNewContext(
  fs.readFileSync(path.join(ROOT, 'products-data.js'), 'utf8') +
    '\n;this.__d = { SIROS_MODELS, SIROS_BATTERY_OPTIONS, SIROS_STANDARD_FEATURES };',
  sandbox,
);
const { SIROS_MODELS: MODELS, SIROS_BATTERY_OPTIONS: BATTERY, SIROS_STANDARD_FEATURES: FEATURES } = sandbox.__d;

// ---- helpers -------------------------------------------------------------
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const inr = (v) => `₹${new Intl.NumberFormat('en-IN').format(v)}`;
const wa = (text) => `https://wa.me/${WA}?text=${encodeURIComponent(text)}`;
const modelUrl = (slug) => `/models/${slug}/`;

function webpSize(file) {
  const b = fs.readFileSync(file);
  const chunk = b.toString('ascii', 12, 16);
  if (chunk === 'VP8X') return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)];
  if (chunk === 'VP8L') {
    const bits = b.readUInt32LE(21);
    return [1 + (bits & 0x3fff), 1 + ((bits >> 14) & 0x3fff)];
  }
  if (chunk === 'VP8 ') return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
  throw new Error(`unrecognised webp: ${file}`);
}
const asset = (rel) => path.join(ROOT, rel);

const WA_ICON = '<svg class="wa-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4.5 19.5l1.1-3.6A8 8 0 1 1 8.4 18.6z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M9.2 8.6c.2 1.9 2.3 4.3 4.6 4.9l1.2-1.1 1.6.8c-.2 1-1.1 1.7-2.2 1.6-3.1-.4-5.8-3-6.2-6.2-.1-1 .6-2 1.6-2.2l.8 1.6z" fill="currentColor"/></svg>';
const DL_ICON = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5M5 19.5h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const GENERAL_WA = wa("Hi SIROS, I'd like to know more about your electric scooters.");
const EXT = 'target="_blank" rel="noopener"';

// ---- shared chrome -------------------------------------------------------
const nav = () => `<a class="skip-link" href="#main">Skip to main content</a>
<nav class="nav" aria-label="Primary">
  <a class="nav__brand" href="/">
    <img src="/assets/brand/logo-96.png" alt="" width="44" height="44">
    <span class="nav__wordmark">SIROS</span>
  </a>
  <div class="nav__links">
    <a href="/#range">Vehicles</a>
    <a href="/#trust">Why SIROS</a>
    <a href="/#emi">Ownership</a>
    <a href="/dealers.html">Dealers</a>
    <a href="/dealer.html">Become a Dealer</a>
    <a href="/#faq">FAQ</a>
  </div>
  <div class="nav__actions">
    <a class="btn btn--accent btn--wa" href="${GENERAL_WA}" ${EXT}>${WA_ICON}WhatsApp us</a>
    <button class="nav__menu-btn" id="navMenuBtn" aria-label="Open menu" aria-expanded="false" aria-controls="mobileMenu"><span></span></button>
  </div>
</nav>

<div class="mobile-menu" id="mobileMenu" aria-hidden="true">
  <button class="mobile-menu__close" id="mobileMenuClose" aria-label="Close menu">✕</button>
  <a href="/#range">Vehicles</a>
  <a href="/#trust">Why SIROS</a>
  <a href="/#emi">Ownership</a>
  <a href="/dealers.html">Dealers</a>
  <a href="/dealer.html">Become a Dealer</a>
  <a href="/#faq">FAQ</a>
  <a href="/assets/brochure/SIROS-catalog.pdf" download="SIROS-Vehicle-Catalog.pdf">Download brochure</a>
  <a href="${GENERAL_WA}" ${EXT}>WhatsApp SIROS</a>
</div>`;

const footer = () => `<footer class="site-footer site-footer--simple">
    <div class="site-footer__bottom">
      <span>© ${new Date().getFullYear()} SIROS Vehicles Pvt. Ltd.</span>
      <span>Sirsa, Haryana · Jhalawar, Rajasthan · Gurugram, Haryana</span>
      <span class="site-footer__contact"><a href="${GENERAL_WA}" ${EXT}>WhatsApp +91 96493 19677</a><a href="mailto:${EMAIL}">${EMAIL}</a><a href="/privacy.html">Privacy</a></span>
    </div>
  </footer>`;

// prefix: '/' on generated pages, '' for root pages (index.html, models.html)
function card(m, { hx = 'h3', prefix = '/', eager = false } = {}) {
  const from = m.prices ? Math.min(...m.prices) : null;
  const href = `${prefix}models/${m.slug}/`;
  return `
        <article class="range-grid__item">
          <a class="thumb${m.cutout ? ' thumb--cutout' : ''}" href="${href}" aria-label="View ${esc(m.name)}">
            <img src="${prefix}assets/products/${m.photo}-thumb.webp" alt="SIROS ${esc(m.name)}" loading="${eager ? 'eager' : 'lazy'}" decoding="async" width="640" height="853">
          </a>
          <div class="meta">
            <div class="meta__name"><${hx}>${esc(m.name)}</${hx}><span class="tag">${esc(m.tag)}</span></div>
            <div class="meta__price">${from ? `<span>Starting at</span><strong>${inr(from)}</strong>` : '<span>Price</span><strong>On request</strong>'}</div>
            <div class="meta__actions">
              <a class="card-btn card-btn--primary" href="${href}">Explore <span aria-hidden="true">→</span></a>
              <a class="card-btn card-btn--ghost" href="${wa(`Hi SIROS, I'm interested in the ${m.name}. Please share the price and details.`)}" ${EXT}>Enquire</a>
            </div>
          </div>
        </article>`;
}

// ---- page ----------------------------------------------------------------
function page(m) {
  const url = `${SITE}models/${m.slug}/`;
  const photoRel = `assets/products/${m.photo}.webp`;
  const [pw, ph] = webpSize(asset(photoRel));
  const hasPrice = Array.isArray(m.prices);
  const lowI = hasPrice ? m.prices.indexOf(Math.min(...m.prices)) : -1;
  const highI = hasPrice ? m.prices.indexOf(Math.max(...m.prices)) : -1;
  const low = hasPrice ? m.prices[lowI] : null;
  const high = hasPrice ? m.prices[highI] : null;
  const tagLower = m.tag.toLowerCase();
  const fullName = `SIROS ${m.name}`;

  const title = hasPrice ? `${fullName} ${tagLower}: price from ${inr(low)}` : `${fullName} ${tagLower}: specs and enquiry`;
  const description = hasPrice
    ? `${m.blurb} The ${fullName} starts at ${inr(low)} (${BATTERY[lowI].volt} ${BATTERY[lowI].chem.toLowerCase()}, ${BATTERY[lowI].range}) and goes up to ${inr(high)} (${BATTERY[highI].volt} ${BATTERY[highI].chem.toLowerCase()}). Built in Sirsa, Haryana.`
    : `${m.blurb} See the ${fullName} specifications and ask SIROS for the price on WhatsApp. Built in Sirsa, Haryana.`;

  const ld = [{
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
      { '@type': 'ListItem', position: 2, name: 'All models', item: `${SITE}models.html` },
      { '@type': 'ListItem', position: 3, name: fullName, item: url },
    ],
  }];
  if (hasPrice) {
    ld.push({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: fullName,
      brand: { '@type': 'Brand', name: 'SIROS' },
      manufacturer: { '@type': 'Organization', name: 'SIROS Vehicles Pvt. Ltd.', url: SITE },
      category: m.tag,
      description: m.blurb,
      image: `${SITE}${photoRel}`,
      url,
      offers: { '@type': 'AggregateOffer', priceCurrency: 'INR', lowPrice: low, highPrice: high, offerCount: m.prices.length, url },
    });
  }

  const enquireWa = wa(`Hi SIROS, I'm interested in the ${m.name}. Please share the price and details.`);
  const rows = BATTERY.map((b, i) => `            <tr><td>${b.volt}</td><td>${b.chem}</td><td>${b.range}</td><td class="price">${hasPrice ? inr(m.prices[i]) : 'On request'}</td></tr>`).join('\n');

  let colours = '';
  if (m.colours) {
    const cRel = `assets/lineup/${m.colours.image}.webp`;
    const [cw, ch] = webpSize(asset(cRel));
    const names = m.colours.names.length ? `\n      <div class="p-colours__names">${m.colours.names.map((c) => `<span class="features-chip">${esc(c)}</span>`).join('')}</div>` : '';
    const alt = m.colours.names.length ? `${fullName} in ${m.colours.names.join(', ')}` : `${fullName} colour options`;
    colours = `
    <section class="p-section p-colours" aria-labelledby="coloursTitle">
      <p class="eyebrow">Available colours</p>
      <h2 class="sc-display" id="coloursTitle">${esc(fullName)} colours</h2>${names}
      <img src="/assets/lineup/${m.colours.image}-800.webp" srcset="/assets/lineup/${m.colours.image}-800.webp 800w, /${cRel} ${cw}w" sizes="(max-width: 900px) 92vw, 72rem" alt="${esc(alt)}" width="${cw}" height="${ch}" loading="lazy" decoding="async">
    </section>`;
  }

  const answers = [];
  if (hasPrice) {
    answers.push([`How much does the ${fullName} cost?`,
      `From ${inr(low)} with a ${BATTERY[lowI].volt} ${BATTERY[lowI].chem.toLowerCase()} battery (${BATTERY[lowI].range}) up to ${inr(high)} with a ${BATTERY[highI].volt} ${BATTERY[highI].chem.toLowerCase()} battery. The table above lists every option. Your dealer confirms the final on-road price.`]);
    answers.push([`How far does the ${fullName} go on one charge?`,
      `Between 50 and 120 km per charge depending on the battery: 50 km with 48V 32AH lead-acid, up to 120 km with 72V 45AH lead-acid, and 80 or 110 km with the lithium options. Actual range varies with load and riding conditions.`]);
  } else {
    answers.push([`How much does the ${fullName} cost?`,
      `The ${m.name} is priced on request. <a href="${enquireWa}" ${EXT}>Ask SIROS on WhatsApp</a> for the current price and battery options.`]);
  }
  answers.push(['How long does charging take?', 'Lithium batteries charge in about 3–4 hours and lead-acid batteries in about 7–8 hours, as stated in the SIROS vehicle catalog.']);
  answers.push(['What warranty comes with it?', '3 years on lithium battery packs and 1 year on lead-acid packs, standard across the SIROS range.']);
  answers.push([`Where can I see or test ride the ${m.name}?`,
    `At SIROS dealers across Rajasthan and Madhya Pradesh. <a href="/dealers.html">Find your nearest dealer</a>, or <a href="${wa(`Hi SIROS, I'd like a test ride of the ${m.name}. My city is: `)}" ${EXT}>book a test ride on WhatsApp</a>.`]);
  answers.push(['Can I buy it on EMI?', 'Yes. Finance is available through SIROS finance partners; <a href="/#emi">see the EMI reference plans</a>. The final plan depends on your eligibility.']);

  const others = MODELS.filter((o) => o.slug !== m.slug);

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
<meta name="theme-color" content="#181E22">
<meta property="og:site_name" content="SIROS">
<meta property="og:type" content="product">
<meta property="og:locale" content="en_IN">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}assets/og/${m.slug}.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(fullName)}">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">${JSON.stringify(ld.length === 1 ? ld[0] : ld)}</script>
<link rel="icon" type="image/png" sizes="32x32" href="/assets/brand/favicon-32.png">
<link rel="apple-touch-icon" href="/assets/brand/logo-192.png">
<link rel="preload" as="image" href="/${photoRel}" fetchpriority="high">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,500;0,600;0,700;0,800;1,600&family=Manrope:wght@400;500;600;700;800&family=Noto+Sans+Devanagari:wght@500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/scrollcraft.css">
<link rel="stylesheet" href="/site.css">
</head>
<body>
<!-- Generated by tools/build-model-pages.mjs from products-data.js. Edit the data, then re-run the script; don't edit this file by hand. -->
${nav()}

<main id="main" tabindex="-1">
  <nav class="p-crumbs" aria-label="Breadcrumb">
    <ol>
      <li><a href="/">Home</a></li>
      <li><a href="/models.html">All models</a></li>
      <li aria-current="page">${esc(fullName)}</li>
    </ol>
  </nav>

  <section class="p-hero">
    <figure class="p-hero__media${m.cutout ? ' p-hero__media--cutout' : ''}">
      <img src="/${photoRel}" alt="${esc(fullName)} ${esc(tagLower)}" width="${pw}" height="${ph}" fetchpriority="high">
    </figure>
    <div class="p-hero__body">
      <p class="eyebrow">${esc(m.tag)}</p>
      <h1 class="sc-display">${esc(fullName)}</h1>
      <p class="lede">${esc(m.blurb)}</p>${m.variantOf ? `\n      <p class="p-variant-note">Shares its body with the <a href="${modelUrl(MODELS.find((o) => o.name === m.variantOf)?.slug || '')}">${esc(m.variantOf)}</a></p>` : ''}
      <div class="p-price">${hasPrice
        ? `<span>Starting at</span><strong>${inr(low)}</strong><small>with ${BATTERY[lowI].volt} ${BATTERY[lowI].chem.toLowerCase()} battery · ${BATTERY[lowI].range}</small>`
        : '<span>Price</span><strong>On request</strong>'}</div>
      <div class="p-cta-row">
        <a class="btn btn--accent btn--wa" href="${enquireWa}" ${EXT}>${WA_ICON}Enquire on WhatsApp</a>
        <a class="btn" href="#testride" id="qaTestRide">Book a test ride</a>
        <a class="btn btn--brochure" href="/assets/brochure/SIROS-catalog.pdf" download="SIROS-Vehicle-Catalog.pdf">${DL_ICON}Brochure</a>
      </div>
    </div>
  </section>

  <div class="p-wrap">
    <dl class="p-specs">
      <div><dt>Tyre size</dt><dd>${esc(m.tyre)} in</dd></div>
      <div><dt>Dimensions</dt><dd>${esc(m.dim)}</dd></div>
      <div><dt>Wheelbase</dt><dd>${esc(m.wheelbase)}</dd></div>
      <div><dt>Seat length</dt><dd>${esc(m.seat)}</dd></div>
    </dl>
  </div>

  <section class="p-section p-two-col">
    <div>
      <p class="eyebrow">Price by battery</p>
      <h2 class="sc-display">${esc(m.name)} price list</h2>
      <table class="band-table">
        <caption class="visually-hidden">${esc(fullName)} price for each battery option</caption>
        <thead><tr><th scope="col">Battery</th><th scope="col">Type</th><th scope="col">Range</th><th scope="col">Price</th></tr></thead>
        <tbody>
${rows}
        </tbody>
      </table>
      <p class="p-note">Prices as per the SIROS rate list; your dealer confirms the final on-road price. Range per charge as stated by SIROS and varies with load and riding conditions. Payload 150 kg.</p>
    </div>
    <div>
      <p class="eyebrow">Standard, on every model</p>
      <h2 class="sc-display">What comes with it</h2>
      <div class="features-strip" style="margin-top:1.2rem">${FEATURES.map((f) => `<span class="features-chip">${esc(f)}</span>`).join('')}</div>
    </div>
  </section>
${colours}
  <section class="p-section" aria-labelledby="answersTitle">
    <p class="eyebrow">Quick answers</p>
    <h2 class="sc-display" id="answersTitle">${esc(fullName)}: questions buyers ask</h2>
    <div class="p-answers">
${answers.map(([q, a]) => `      <div><h3>${esc(q)}</h3><p>${a}</p></div>`).join('\n')}
    </div>
  </section>

  <section class="p-section" data-rail aria-labelledby="moreTitle" style="padding-left:0;padding-right:0">
    <div class="rail-head" style="padding-inline:var(--sc-gutter)">
      <div class="rail-head__copy">
        <p class="eyebrow">Compare</p>
        <h2 class="section-heading" id="moreTitle">More SIROS models</h2>
      </div>
      <div class="rail-head__actions">
        <div class="rail-nav">
          <button class="rail-btn" type="button" data-rail-prev aria-label="Previous models"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
          <button class="rail-btn" type="button" data-rail-next aria-label="Next models"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        </div>
      </div>
    </div>
    <div class="rail">
      <div class="range-grid" data-rail-track tabindex="0" role="region" aria-label="Other SIROS models">${others.map((o) => card(o)).join('')}
      </div>
    </div>
    <div class="rail-progress" aria-hidden="true"><span></span></div>
  </section>

  <section class="p-closing">
    <p>Ready to ride the ${esc(fullName)}?</p>
    <div class="p-cta-row">
      <a class="btn btn--accent btn--wa" href="${enquireWa}" ${EXT}>${WA_ICON}Chat on WhatsApp</a>
      <a class="btn" href="/dealers.html">Find a dealer</a>
    </div>
  </section>

  ${footer()}
</main>

<script src="/products-data.js"></script>
<script src="/site.js"></script>
</body>
</html>
`;
}

// ---- write -----------------------------------------------------------------
for (const m of MODELS) {
  const dir = path.join(ROOT, 'models', m.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), page(m).replace(/\r?\n/g, '\r\n'));
}

// Static cards inside the homepage rail and the all-models grid, so every
// model link is in the HTML itself (crawlable without JavaScript).
const END_TILE = `
        <div class="range-grid__item range-grid__item--viewall range-grid__item--end">
          <div class="range-grid__item--viewall__inner">
            <h3>The full catalog</h3>
            <p>Specs, features and battery options for every model, in one PDF.</p>
            <a class="card-btn card-btn--primary" href="assets/brochure/SIROS-catalog.pdf" download="SIROS-Vehicle-Catalog.pdf">Download brochure</a>
            <a class="card-btn card-btn--ghost" href="models.html">Compare all models</a>
          </div>
        </div>`;
function inject(file, inner) {
  const p = path.join(ROOT, file);
  let s = fs.readFileSync(p, 'utf8');
  // first run: an empty grid; later runs: replace everything up to the end marker
  const re = s.includes('<!-- /cards -->')
    ? /(<div class="range-grid" id="rangeGrid"[^>]*>)[\s\S]*?<!-- \/cards --><\/div>/
    : /(<div class="range-grid" id="rangeGrid"[^>]*>)\s*<\/div>/;
  if (!re.test(s)) throw new Error(`no #rangeGrid in ${file}`);
  s = s.replace(re, (_, open) => `${open.includes('data-static') ? open : open.replace(/>$/, ' data-static>')}<!-- cards: generated by tools/build-model-pages.mjs -->${inner}\n      <!-- /cards --></div>`);
  fs.writeFileSync(p, s.replace(/\r?\n/g, '\r\n'));
}
inject('index.html', MODELS.map((m, i) => card(m, { hx: 'h3', prefix: '', eager: i < 4 })).join('') + END_TILE);
inject('models.html', MODELS.map((m, i) => card(m, { hx: 'h2', prefix: '', eager: i < 4 })).join(''));

const urls = [['', '1.0'], ['models.html', '0.9'], ['dealers.html', '0.8'], ['dealer.html', '0.8'], ['privacy.html', '0.3'], ...MODELS.map((m) => [`models/${m.slug}/`, '0.8'])];
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'),
  ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(([p, pr]) => `  <url><loc>${SITE}${p}</loc><lastmod>${TODAY}</lastmod><priority>${pr}</priority></url>`),
    '</urlset>', ''].join('\n'));

console.log(`built ${MODELS.length} model pages and sitemap.xml (${urls.length} urls)`);
