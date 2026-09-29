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
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Dealer applications')
    || SpreadsheetApp.getActiveSpreadsheet().insertSheet('Dealer applications');

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'Name', 'Business name', 'Phone', 'City', 'Message', 'Page']);
    sheet.setFrozenRows(1);
  }

  var p = e.parameter;
  sheet.appendRow([
    new Date(),
    p.name || '',
    p.business || '',
    p.phone || '',
    p.city || '',
    p.message || '',
    p.page || '',
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
