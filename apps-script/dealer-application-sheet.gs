/**
 * Logs SIROS "Become a Dealer" applications into this spreadsheet.
 *
 * Separate from test-ride-sheet.gs on purpose — dealer applications and
 * test-ride requests are different lists for different people to work,
 * so keep them in different sheets rather than mixing rows together.
 *
 * Setup (same steps as the test-ride one, do this again for a NEW sheet):
 *   1. sheets.google.com -> new blank spreadsheet (e.g. "SIROS dealer
 *      applications").
 *   2. Extensions -> Apps Script. Delete the placeholder, paste this file in.
 *   3. Deploy -> New deployment -> gear icon -> Web app.
 *        Execute as:  Me
 *        Who has access:  Anyone
 *      Deploy, authorize with your Google account (click through the
 *      "unverified app" warning — it's your own script).
 *   4. Copy the Web app URL (ends in /exec).
 *   5. Paste it into DEALER_APP_SHEET_URL near the top of site.js.
 */
// Public URL, so every value is untrusted: length-capped, and prefixed with '
// if it starts with = + - @ so Sheets stores it as text, never as a formula.
function clean_(v, max) {
  var s = String(v || '').trim().slice(0, max);
  return /^[=+\-@\t\r]/.test(s) ? "'" + s : s;
}

function doPost(e) {
  var p = (e && e.parameter) || {};
  if (p.website) { // honeypot field: filled only by bots
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  }

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Dealer applications')
    || SpreadsheetApp.getActiveSpreadsheet().insertSheet('Dealer applications');

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'Name', 'Business name', 'Phone', 'City', 'Message', 'Page']);
    sheet.setFrozenRows(1);
  }

  sheet.appendRow([
    new Date(),
    clean_(p.name, 80),
    clean_(p.business, 100),
    clean_(p.phone, 20),
    clean_(p.city, 60),
    clean_(p.message, 300),
    clean_(p.page, 120),
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
