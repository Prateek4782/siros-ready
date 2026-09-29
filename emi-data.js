/**
 * EMI reference table, transcribed from the SIROS financing sheet (handwritten).
 * For each on-road price band: down payment + monthly instalment at three tenures.
 * The 80,000 band is torn in the source photo, so only one tenure is recorded —
 * shown honestly as partial rather than guessed.
 */
const SIROS_EMI_TABLE = [
  { price: 40000, plans: [
    { months: 16, dp: 18150, emi: 1933 },
    { months: 12, dp: 18060, emi: 2444 },
    { months: 8, dp: 19150, emi: 3422 },
  ]},
  { price: 45000, plans: [
    { months: 16, dp: 20100, emi: 2166 },
    { months: 12, dp: 20060, emi: 2738 },
    { months: 8, dp: 20220, emi: 3838 },
  ]},
  { price: 50000, plans: [
    { months: 16, dp: 22060, emi: 2400 },
    { months: 12, dp: 22060, emi: 3033 },
    { months: 8, dp: 23300, emi: 4255 },
  ]},
  { price: 55000, plans: [
    { months: 16, dp: 24010, emi: 2633 },
    { months: 12, dp: 24060, emi: 3327 },
    { months: 8, dp: 28650, emi: 4672 },
  ]},
  { price: 60000, plans: [
    { months: 16, dp: 25960, emi: 2866 },
    { months: 12, dp: 26070, emi: 3622 },
    { months: 8, dp: 27460, emi: 5088 },
  ]},
  { price: 65000, plans: [
    { months: 16, dp: 27920, emi: 3109 },
    { months: 12, dp: 28070, emi: 3916 },
    { months: 8, dp: 29540, emi: 5505 },
  ]},
  { price: 70000, plans: [
    { months: 16, dp: 29872, emi: 3333 },
    { months: 12, dp: 33210, emi: 3977 },
    { months: 8, dp: 31620, emi: 5922 },
  ]},
  { price: 75000, plans: [
    { months: 16, dp: 31830, emi: 3566 },
    { months: 12, dp: 35420, emi: 4255 },
    { months: 8, dp: 33700, emi: 6338 },
  ]},
  { price: 80000, plans: [
    { months: 12, dp: 37630, emi: 4533 },
  ]},
];
