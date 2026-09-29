/**
 * Logs SIROS "Book a test ride" form submissions into this spreadsheet.
 *
 * Setup:
 *   1. Go to sheets.google.com, create a new blank spreadsheet (name it
 *      whatever you like, e.g. "SIROS test ride requests").
 *   2. Extensions -> Apps Script. Delete the placeholder code and paste
 *      this whole file in.
 *   3. Click Deploy -> New deployment -> gear icon -> Web app.
 *        Execute as:  Me
 *        Who has access:  Anyone
 *      Deploy, then authorize it with your Google account when prompted
 *      (this is your own script touching your own sheet, so the "Google
 *      hasn't verified this app" warning is expected — click
 *      Advanced -> Go to (your project name), it's safe).
 *   4. Copy the Web app URL it gives you (ends in /exec).
 *   5. Paste that URL into TEST_RIDE_SHEET_URL near the top of site.js.
 *
 * That's it — every submission appends one row, oldest first, with a
 * timestamp. If you ever change the form's fields, add a matching column
 * here and to the URLSearchParams(...) call in site.js's submit handler.
 */
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Test rides')
    || SpreadsheetApp.getActiveSpreadsheet().insertSheet('Test rides');

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'Name', 'Phone', 'City', 'Model', 'Page']);
    sheet.setFrozenRows(1);
  }

  var p = e.parameter;
  sheet.appendRow([
    new Date(),
    p.name || '',
    p.phone || '',
    p.city || '',
    p.model || '',
    p.page || '',
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
