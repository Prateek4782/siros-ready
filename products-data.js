/**
 * SIROS range — transcribed from the official SIROS Vehicle Catalog
 * (SIROS VEHICLE CATALOG-4.pdf). Specs below are each model's real catalog
 * numbers. ZL Pro, IQ Pro and Cruz Pro share their base model's body in the
 * catalog's own naming (same spec block, higher-configuration name) — marked
 * `variantOf` rather than treated as a separate photographed vehicle.
 * The catalog's own "PRICE" column is printed blank on every page — SIROS
 * confirms on-road price at enquiry, not on paper — so no per-model price is
 * invented here. Real reference pricing lives in the EMI table (emi-data.js).
 *
 * Photography: the catalog's own turntable photos are cropped tight and
 * inconsistently framed across pages, so the card imagery uses generated
 * studio stills instead of the catalog crops — one distinct render per body
 * (Pro variants reuse their base model's render, same as the spec block they
 * share). Loder is a genuinely different vehicle shape (a utility scooter
 * with a cargo basket), so it keeps its own real catalog photo rather than
 * being shown as a generic scooter.
 */
const SIROS_MODELS = [
  { slug: 'nexa',     name: 'Nexa',     tag: 'Electric scooter', photo: 'nexa-render', tyre: '12×10', dim: '1860 × 720 × 1130 mm', wheelbase: '1240 mm', seat: '600 mm', blurb: 'The everyday commuter. Light, simple, easy to ride every day.' },
  { slug: 'zl',       name: 'ZL',       tag: 'Electric scooter', photo: 'zl-render', tyre: '12×10', dim: '1860 × 720 × 1130 mm', wheelbase: '1240 mm', seat: '600 mm', blurb: 'A composed ride for the trips that make up your day.' },
  { slug: 'zl-pro',   name: 'ZL Pro',   tag: 'Electric scooter', photo: 'zl-render', tyre: '12×10', dim: '1860 × 720 × 1130 mm', wheelbase: '1240 mm', seat: '600 mm', blurb: 'The ZL body, tuned for a higher battery configuration.', variantOf: 'ZL' },
  { slug: 'ac1',      name: 'AC1',      tag: 'Electric scooter', photo: 'ac1-render', tyre: '12×12', dim: '1870 × 720 × 1130 mm', wheelbase: '1280 mm', seat: '710 mm', blurb: 'Simple, electric, ready — an accessible way to start.' },
  { slug: 'iq',       name: 'IQ',       tag: 'Electric scooter', photo: 'iq-render', tyre: '12×12', dim: '1870 × 720 × 1130 mm', wheelbase: '1280 mm', seat: '710 mm', blurb: 'A sharper design with the same dependable basics.' },
  { slug: 'iq-pro',   name: 'IQ Pro',   tag: 'Electric scooter', photo: 'iq-render', tyre: '12×12', dim: '1870 × 720 × 1130 mm', wheelbase: '1280 mm', seat: '710 mm', blurb: 'The IQ body, tuned for a higher battery configuration.', variantOf: 'IQ' },
  { slug: 'e4',       name: 'E4',       tag: 'Electric scooter', photo: 'e4-render', tyre: '12×12', dim: '1870 × 720 × 1130 mm', wheelbase: '1280 mm', seat: '710 mm', blurb: 'Bolder styling, built on the same trusted platform.' },
  { slug: 'cruz',     name: 'Cruz',     tag: 'Electric scooter', photo: 'cruz-render', tyre: '12×12', dim: '1870 × 720 × 1130 mm', wheelbase: '1280 mm', seat: '710 mm', blurb: 'A smooth, composed ride for longer daily distances.' },
  { slug: 'cruz-pro', name: 'Cruz Pro', tag: 'Electric scooter', photo: 'cruz-render', tyre: '12×12', dim: '1870 × 720 × 1130 mm', wheelbase: '1280 mm', seat: '710 mm', blurb: 'The Cruz body, tuned for a higher battery configuration.', variantOf: 'Cruz' },
  { slug: 'olpro',    name: 'OL Pro',   tag: 'Electric scooter', photo: 'olpro-render', tyre: '12×12', dim: '1870 × 720 × 1130 mm', wheelbase: '1280 mm', seat: '710 mm', blurb: 'Our most powerful scooter yet, in a striking body.' },
  { slug: 'loder',    name: 'Loder',    tag: 'Electric utility vehicle', photo: 'loder', tyre: '12×12', dim: '1870 × 720 × 1130 mm', wheelbase: '1280 mm', seat: '710 mm', blurb: 'Built to carry the day — goods, tools, deliveries.', cutout: true },
];

/* Battery / range bands — identical structure across the whole range, per the
   catalog's own SPECIFICATIONS table on every model page. */
const SIROS_BATTERY_BANDS = [
  { volt: '48V 30AH', cells: '4 Pc', range: '50–60 km' },
  { volt: '60V 30AH', cells: '5 Pc', range: '60–70 km' },
  { volt: '72V 30AH', cells: '6 Pc', range: '80–90 km' },
  { volt: '72V 45AH', cells: '6 Pc', range: '120–140 km' },
];

/* Standard across every SIROS model, per catalog "salient features" icon row. */
const SIROS_STANDARD_FEATURES = [
  'LED display', 'Anti-theft alarm', 'Reverse mode', 'USB charging',
  'Front disc brake', 'LED headlamp with DRL', 'Telescopic suspension',
];
