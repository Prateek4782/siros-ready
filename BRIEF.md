# SIROS — BRIEF

Self-authored under explicit creative delegation, grounded in real answers given
in the interview. The user delegated the signature move and the deep aesthetic
calls ("let me pick for you"), but gave hard, explicit direction on: competitor
benchmarks (Ola Electric, Ather Energy, warivo.com — warivo.com did not resolve,
domain-parked), a **large SIROS wordmark**, **readable fonts**, and **do not keep
the theme dark** (currently dark, must go light). Those are treated as
non-negotiable, not authored guesses.

## 1. Vibe

Premium, trusted — "Apple or Mercedes," pitched above Ola/Ather/Bajaj EV sites,
not alongside them. Competitor research (live browse):
- **Ola Electric**: light canvas, bold black wordmark, clean product cards on
  soft gradient tiles, confident but somewhat busy/promotional.
- **Ather Energy**: warm amber/cream studio-cove backdrop behind the product,
  black pill nav, restrained chrome, the product photographed like a watch ad.
  Closest existing-market reference to what SIROS should feel like.
- Neither is Apple/Mercedes-tier: both still lean on promo banners and dense
  navs. SIROS should read calmer, slower, with more air and fewer competing
  claims per screen.

## 2. Journey (their words → beats)

1. Recognition — the vehicle itself, in motion (real SIROS build footage).
2. Trust — SIROS is not a new badge: 10 years, own plant, real warranty terms.
3. Substance — the running-cost argument (petrol vs electric), honestly framed.
4. Range — the actual model lineup, photographed, real specs.
5. Ownership — EMI calculator with the real financing sheet numbers.
6. Presence — the real 28-dealer network, searchable.
7. Resolve — FAQ, then one clear way to start a conversation.

## 3. Energy curve

Calm and controlled throughout, one lift at the trust act (the plant/warranty
reveal — this is the credibility turn) and one lift at the range act (seeing the
real lineup). Never loud. No rhythmic-cutlist energy; this is a considered
purchase, not an impulse one.

## 4. Feeling curve

```
1  Recognition   the real build film, a SIROS coming together, held and calm
2  Reassurance   10 years named plainly, own plant, real warranty terms — the
                 brand stops being "another new EV badge" and becomes established
3  Candor        the cost math shown honestly, own numbers, own caveats
4  Desire        the real lineup, photographed properly, specs that hold up
5  Clarity       EMI numbers that are real, not "starting from", a slider that
                 answers the actual question a buyer has
6  Confidence    28 real dealers, searchable — SIROS is not a website with no
                 address behind it
7  Resolve       FAQ answers the last doubts, one calm way to start
```

## 5. The peak

**Reassurance, Act 2 (trust).** The sentence a visitor would say to a friend:
*"It stopped feeling like a new scooter brand the moment I saw it's been
building its own vehicles at its own plant for ten years."*
This act gets the manufacturing still, the largest span after the hero, and the
signature move fires here first.

## 6. Tell-someone sentence

**"It's the site where a small checklist quietly fills up with real facts as you
scroll, and by the time you reach the bottom you've got a completed dossier on
why this brand can be trusted, not just a claim you have to take on faith."**

## 7. One thing no EV site does (signature move — authored, delegated)

**The Trust Ledger.** A slim panel fixed at the lower edge of the viewport,
present from the trust act onward. Each time the visitor's scroll passes a
verified claim — own plant in Sirsa, 3-year lithium / 1-year lead-acid battery
warranty, real finance and insurance partners (Bajaj Finserv, ICICI Lombard),
28 dealers across two states — a line stamps into the ledger with a checkmark,
stays, and the ledger never removes a line. By the footer it reads as a short,
totalled dossier of everything just verified, and doubles as a table of contents
for what the visitor already knows. Every line is a real, checkable fact from
the SIROS catalog and dealer/EMI data — nothing invented. Coded bespoke in the
page against `--sc-p` / scroll position; not a kit device.

## 8. Aesthetic range

Premium-minimal, per the user's explicit choice. Quiet, restrained motion,
generous air, one accent used with discipline.

## 9. Structure: distinct scenes vs. one world

Distinct scenes (filmic one-shot grammar — see below), not a continuous world.
The content genuinely has different modes (cinematic trust story vs. a real EMI
calculator vs. a real searchable dealer list) that a single unbroken camera
flight cannot honestly hold. Reasoning against the other 6 non-filmic grammars:
- **Chaptered editorial**: too documentary/static for a vehicle brand that has
  real motion footage to spend; bans the scrub hero this brand's real asset earns.
- **Live surface**: wrong shape — SIROS is not a software product; the EMI/dealer
  tools are utilities inside the argument, not the whole argument.
- **Continuous world**: no real single "place" to travel through; forcing one
  would fabricate a journey the brand doesn't have, and the skill flags this as
  the most fragile, most over-budget choice for content this data-heavy.
- **Typographic poster**: would waste the one asset this brand actually has —
  real footage of a SIROS scooter being built — by banning photographic ground.
- **Gallery/catalog**: bans the opening trust claim and the cost-of-ownership
  argument act, both of which are load-bearing here.
- **Split stage**: no natural two-sided comparison spans the whole page.
- **Rhythmic cutlist**: wrong energy for a considered purchase; this brand's
  argument is confidence, not adrenaline.

**Filmic one-shot** is the only grammar whose leans-on list (`scrub`, `pin`,
`drift`, `kinetic`) matches the one real cinematic asset this brand has (the
build footage) while still allowing real flow-section utilities (EMI slider,
dealer search, FAQ) to sit inside it undisguised. This is a real build with
functioning tools, not a pure mood film, so those utility sections are `flow`
acts with real markup and real state — not decoration.

## 10. Assets on hand

- Real hero footage: `assets/scooter-film.mp4` / `.webm` (desktop) and
  `assets/scooter-film-mobile.mp4` — a single continuous take of a SIROS
  scooter assembling itself. This is the scrub hero's asset; re-encoded for
  dense-GOP scrubbing.
- Real product photography, extracted directly from the official 12-page SIROS
  Vehicle Catalog PDF (studio turntable shots, white background): Nexa, ZL,
  AC1, Loder, OL Pro, IQ, E4, Cruz. Cropped and cleaned for the range act.
  Cropped from `D:\downloads 10-09-2026\SIROS VEHICLE CATALOG-4.pdf`.
- Real brand mark (infinity-swirl logo, black + gold) and wordmark, extracted
  from the catalog cover.
- Real vision/mission copy, real finance/insurance/battery/tyre partner logos
  (Bajaj Finserv, ICICI Lombard, Amptek, Ampure, Ralco Tyres), all from the
  catalog.
- Real dealer data (28 dealers, `dealers.js`) and real EMI reference table
  (`emi-data.js`), both already verified/sourced in the prior build and kept
  verbatim.
- No plant/manufacturing photography exists, so one architectural still is
  generated for the trust act (labelled honestly as illustrative in intent,
  not claimed as a specific documentary photo).
- No generated studio backdrop existed for a *light* canvas: one high-key
  studio-floor still is generated to seat the real product photography on,
  matching the Ather-style cove reference from competitor research.

## 11. Brand facts locked from the catalog (not invented)

- SIROS Vehicles Pvt. Ltd. (EV World). Tagline: "10 साल का भरोसा" — ten years
  of trust.
- Vision: build a well-established national-level brand recognised for
  uncompromising service and advanced products with cutting-edge technology.
- Mission: manufacture EV vehicles on a lower budget while providing warranty
  and spare parts on time.
- Battery warranty: Li-ion 3 years, lead-acid 1 year. Charging: Li-ion 3–4 hrs,
  lead-acid 7–8 hrs. Payload 150 kg on every model. Standard across the range:
  LED display, anti-theft alarm, reverse mode, USB charging, front disc brake,
  LED headlamp with DRL.
- Finance partner: Bajaj Finserv. Insurance: ICICI Lombard. Battery: Amptek,
  Ampure. Tyres: Ralco.
- Manufacturing: own plant, Sirsa, Haryana. Showroom: Jhalrapatan, Jhalawar,
  Rajasthan. Office: Gurugram, Haryana.
- 28 dealers across Rajasthan and Madhya Pradesh (existing verified data, kept).

## 12. Authored silence

The trust act (2) opens on the manufacturing still held for a beat with no cue
before the first ledger line stamps in — this is intentional quiet in front of
the peak, not dead scroll.
