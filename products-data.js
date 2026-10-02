/**
 * SIROS range. Model names and prices follow the SIROS website rate sheet
 * (WEBSITE RATES.xlsx); dimensions and tyre sizes follow the SIROS vehicle
 * catalog. Each model's `prices` array lines up index-for-index with
 * SIROS_BATTERY_OPTIONS below.
 *
 * Photos: each `photo` is the model it actually depicts. Pro / OLA variants
 * reuse their base model's photo (marked `variantOf`) until a dedicated shot
 * exists. `colours` points at an official colour-lineup image when SIROS has
 * supplied one for that exact model.
 */
const SIROS_BATTERY_OPTIONS = [
  { chem: 'Lead-acid', volt: '48V 32AH', range: '50 km/charge' },
  { chem: 'Lead-acid', volt: '60V 32AH', range: '70 km/charge' },
  { chem: 'Lead-acid', volt: '72V 32AH', range: '90 km/charge' },
  { chem: 'Lead-acid', volt: '72V 45AH', range: '120 km/charge' },
  { chem: 'Lithium',   volt: '60V 32AH', range: '80 km/charge' },
  { chem: 'Lithium',   volt: '60V 45AH', range: '110 km/charge' },
];

const SIROS_DIM_SMALL = { tyre: '12×10', dim: '1860 × 720 × 1130 mm', wheelbase: '1240 mm', seat: '600 mm' };
const SIROS_DIM_LARGE = { tyre: '12×12', dim: '1870 × 720 × 1130 mm', wheelbase: '1280 mm', seat: '710 mm' };

const SIROS_MODELS = [
  { slug: 'nexa', name: 'Nexa', tag: 'Electric scooter', photo: 'nexa-render', ...SIROS_DIM_SMALL,
    prices: [46000, 48500, 51000, 60000, 64000, 73000],
    blurb: 'The everyday commuter. Light, simple, easy to ride every day.' },
  { slug: 'zl', name: 'ZL', tag: 'Electric scooter', photo: 'zl-render', ...SIROS_DIM_SMALL,
    prices: [48000, 50500, 53000, 62000, 66000, 75000],
    blurb: 'Sporty lines and a composed ride for the trips that make up your day.' },
  { slug: 'zl-pro', name: 'ZL Pro', tag: 'Electric scooter', photo: 'zl-render', ...SIROS_DIM_SMALL, variantOf: 'ZL',
    prices: [50000, 52500, 55000, 64000, 68000, 77000],
    blurb: 'The ZL, stepped up to Pro spec.' },
  { slug: 'ac1', name: 'AC1', tag: 'Electric scooter', photo: 'ac1-render', ...SIROS_DIM_LARGE,
    prices: [63000, 65500, 68000, 77000, 81000, 90000],
    colours: { image: 'ac1-colours', names: ['Black', 'White', 'Silver', 'Navy Blue', 'Red'] },
    blurb: 'Clean lines and a chrome-trimmed front. An easy way to go electric.' },
  { slug: 'iq', name: 'IQ', tag: 'Electric scooter', photo: 'iq-render', ...SIROS_DIM_LARGE,
    prices: [64000, 66500, 69000, 78000, 82000, 91000],
    blurb: 'Retro-modern styling with a chrome grille up front.' },
  { slug: 'iq-pro', name: 'IQ Pro', tag: 'Electric scooter', photo: 'iq-render', ...SIROS_DIM_LARGE, variantOf: 'IQ',
    prices: [66000, 68500, 71000, 80000, 84000, 93000],
    blurb: 'The IQ, stepped up to Pro spec.' },
  { slug: 'cruze', name: 'Cruze', tag: 'Electric scooter', photo: 'cruze-render', ...SIROS_DIM_LARGE,
    prices: [66000, 68500, 71000, 80000, 84000, 93000],
    colours: { image: 'cruze-colours', names: [] },
    blurb: 'Classic round-headlamp styling for relaxed everyday rides.' },
  { slug: 'cruze-pro', name: 'Cruze Pro', tag: 'Electric scooter', photo: 'cruze-pro-render', ...SIROS_DIM_LARGE,
    prices: [66000, 68500, 71000, 80000, 84000, 93000],
    colours: { image: 'cruze-pro-colours', names: ['White', 'Black', 'Baby Blue', 'Silver', 'Teal'] },
    blurb: 'A modern take on the classic scooter, with a digital face.' },
  { slug: 'e4', name: 'E4', tag: 'Electric scooter', photo: 'e4-render', ...SIROS_DIM_LARGE,
    prices: [66000, 68500, 71000, 80000, 84000, 93000],
    colours: { image: 'e4-colours', names: ['White', 'Black', 'Green', 'Grey', 'Baby Blue'] },
    blurb: 'Bold, upright styling with a windscreen up front.' },
  { slug: 'ol', name: 'OL', tag: 'Electric scooter', photo: 'ol-render', ...SIROS_DIM_LARGE,
    prices: [63000, 65500, 68000, 77000, 81000, 90000],
    colours: { image: 'ol-colours', names: ['White', 'Black', 'Baby Blue', 'Silver', 'Teal'] },
    blurb: 'A clean, modern body with signature light strips.' },
  { slug: 'ola', name: 'OLA', tag: 'Electric scooter', photo: 'ol-render', ...SIROS_DIM_LARGE, variantOf: 'OL',
    prices: [64000, 66500, 69000, 78000, 82000, 91000],
    blurb: 'Modern styling from the OL family.' },
  { slug: 'loder', name: 'Loder', tag: 'Electric utility vehicle', photo: 'loder', ...SIROS_DIM_LARGE, cutout: true,
    blurb: 'Built to carry the day: goods, tools, deliveries.' },
];

/* Standard across every SIROS model, per catalog "salient features" icon row. */
const SIROS_STANDARD_FEATURES = [
  'LED display', 'Anti-theft alarm', 'Reverse mode', 'USB charging',
  'Front disc brake', 'LED headlamp with DRL', 'Telescopic suspension',
];
