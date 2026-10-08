/**
 * Apps Script web app behind the Quote Requests Log sheet.
 *
 * The same file runs on the live sheet and on the TEST copy. Deploy it with
 * `node scripts/deploy-apps-script.mjs test|live`, which fills in the two
 * placeholders below from a git-ignored env file. See QUOTE-PIPELINE.md.
 *
 * Runs as the sheet owner, so Drive access comes from that account. No
 * service account is involved.
 */

// Long random string. Must match QUOTE_SHEET_SECRET in Vercel for the
// environment that points at this deployment.
const SECRET = '__SECRET__';

// LIVE: 1py4OwKoqrxhwDcBn7IPpIt6kH9UyRfxF  ("15 - Jobs")
// TEST: 1zDzvf3chhgm_BJUKCvQYBiXBWqfAG12Y  ("15 - Jobs (TEST)")
const JOBS_FOLDER_ID = '__JOBS_FOLDER_ID__';
const TEST_JOBS_FOLDER_ID = '1zDzvf3chhgm_BJUKCvQYBiXBWqfAG12Y';

// Where this sheet's site lives, for the appointment text. The live sheet calls
// the live site and the TEST sheet calls a branch preview, which also needs
// Vercel's protection bypass. Blank on live.
const SITE_URL = '__SITE_URL__';
const VERCEL_BYPASS = '__VERCEL_BYPASS__';

const PHOTOS_SUBFOLDER = 'Photos (Before & After)';
const JOB_SUBFOLDERS = [PHOTOS_SUBFOLDER, 'Quotes & Invoices', 'Signed Forms'];

// 1-based columns. A to N are the form fields, O and P (Status, Notes) are
// Tyler's to fill in by hand, and so is T, the appointment.
const COL_NAME = 2; // B
const COL_PHONE = 4; // D
const COL_STREET = 5; // E
const COL_CITY = 6; // F
const COL_SMS_CONSENT = 12; // L
const COL_JOB_FOLDER = 17; // Q
const COL_APPOINTMENT = 20; // T, typed by Tyler, e.g. 10/15/2026 9:00 AM
const COL_APPOINTMENT_TEXT = 21; // U, written by this script
const ADDED_HEADERS = [
  [17, 'Job Folder'],
  [18, 'How They Heard'],
  [19, 'Referred By'],
  [COL_APPOINTMENT, 'Appointment'],
  [COL_APPOINTMENT_TEXT, 'Appointment Text'],
];

function doPost(e) {
  var body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return reply('bad request');
  }

  if (body.secret !== SECRET) {
    return reply('forbidden');
  }

  if (body.action === 'photos') {
    return savePhotos(body);
  }
  if (body.action === 'verify') {
    return verify(body);
  }
  return logQuote(body);
}

/**
 * Run once from the editor after the first deploy, so Google asks for Drive
 * and Sheets access. The web app runs as the owner and cannot ask on its own.
 */
function authorize() {
  DriveApp.getFolderById(JOBS_FOLDER_ID).getName();
  SpreadsheetApp.getActiveSpreadsheet().getName();
  installTriggers();
}

/**
 * Sets up the edit trigger behind the appointment text, and the T and U
 * headers. Safe to run again: it replaces its own trigger rather than adding a
 * second one, which would send every text twice.
 *
 * An installable trigger, not a simple onEdit, because only an installable one
 * may call out to the site.
 */
function installTriggers() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  ScriptApp.getProjectTriggers().forEach(function (trigger) {
    if (trigger.getHandlerFunction() === 'onSheetEdit') ScriptApp.deleteTrigger(trigger);
  });
  ScriptApp.newTrigger('onSheetEdit').forSpreadsheet(spreadsheet).onEdit().create();
  ensureHeaders(spreadsheet.getSheets()[0]);
}

/**
 * Sends the appointment text when an Appointment cell (column T) is filled in.
 *
 * Fires once per row: column U records "Sent" with the time, and a row that
 * says Sent is never texted again, even if the appointment is changed. A row
 * that says "Not sent: <reason>" is retried on the next edit of its T cell, so
 * fixing the problem and re-entering the time is all it takes. Edits made by
 * this script do not fire the trigger, so writing U cannot loop.
 */
function onSheetEdit(e) {
  var range = e && e.range;
  if (!range) return;
  var sheet = range.getSheet();
  if (sheet.getIndex() !== 1) return;
  if (range.getColumn() > COL_APPOINTMENT || range.getLastColumn() < COL_APPOINTMENT) return;

  for (var row = Math.max(2, range.getRow()); row <= range.getLastRow(); row++) {
    sendAppointmentText(sheet, row);
  }
}

function sendAppointmentText(sheet, row) {
  var status = sheet.getRange(row, COL_APPOINTMENT_TEXT);
  if (/^Sent/.test(String(status.getValue()))) return;

  var values = sheet.getRange(row, 1, 1, COL_APPOINTMENT).getValues()[0];
  var when = values[COL_APPOINTMENT - 1];
  if (when === '' || when === null) return;

  if (!(when instanceof Date) || isNaN(when.getTime())) {
    status.setValue('Not sent: not a date and time. Type it like 10/15/2026 9:00 AM');
    return;
  }
  // A bare date reads as midnight. Nobody books a midnight job, so it means
  // the time was left off, and a text saying 12:00 AM would be wrong.
  if (when.getHours() === 0 && when.getMinutes() === 0) {
    status.setValue('Not sent: add a time, like 10/15/2026 9:00 AM');
    return;
  }

  var headers = {};
  if (VERCEL_BYPASS) headers['x-vercel-protection-bypass'] = VERCEL_BYPASS;
  try {
    var res = UrlFetchApp.fetch(SITE_URL + '/api/appointment-text', {
      method: 'post',
      contentType: 'application/json',
      headers: headers,
      muteHttpExceptions: true,
      payload: JSON.stringify({
        secret: SECRET,
        name: values[COL_NAME - 1],
        phone: String(values[COL_PHONE - 1]),
        street: values[COL_STREET - 1],
        city: values[COL_CITY - 1],
        smsConsent: values[COL_SMS_CONSENT - 1],
        appointment: when.toISOString(),
      }),
    });
    var result;
    try {
      result = JSON.parse(res.getContentText());
    } catch (err) {
      result = { sent: false, reason: 'site answered ' + res.getResponseCode() };
    }
    status.setValue(
      result.sent
        ? 'Sent ' + Utilities.formatDate(new Date(), 'America/New_York', 'M/d/yyyy h:mm a')
        : 'Not sent: ' + result.reason,
    );
  } catch (err) {
    status.setValue('Not sent: ' + String(err).slice(0, 200));
  }
}

/**
 * Test only. Reports the job folders and sheet row for one test customer name,
 * so the end to end test can check what actually landed in Drive. Refuses to
 * run anywhere but the TEST Jobs folder, so the live deployment never exposes
 * customer folders through it.
 */
function verify(body) {
  if (JOBS_FOLDER_ID !== TEST_JOBS_FOLDER_ID) return reply('forbidden');

  var wanted = ' ' + clean(body.name) + ', ';
  var folders = [];
  var it = DriveApp.getFolderById(JOBS_FOLDER_ID).getFolders();
  while (it.hasNext()) {
    var folder = it.next();
    if (folder.getName().indexOf(wanted) === -1) continue;

    var subfolders = {};
    var subs = folder.getFolders();
    while (subs.hasNext()) {
      var sub = subs.next();
      var files = [];
      var fileIt = sub.getFiles();
      while (fileIt.hasNext()) {
        var file = fileIt.next();
        files.push({ name: file.getName(), mimeType: file.getMimeType(), size: file.getSize() });
      }
      subfolders[sub.getName()] = files;
    }
    folders.push({ name: folder.getName(), url: folder.getUrl(), subfolders: subfolders });
  }

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var values = sheet.getDataRange().getValues();
  var headers = values[0];
  var rows = values.slice(1).filter(function (r) { return r[1] === body.name; }).map(function (r) {
    var row = {};
    headers.forEach(function (h, i) { row[h] = r[i]; });
    return row;
  });

  var highest = 0;
  var all = DriveApp.getFolderById(JOBS_FOLDER_ID).getFolders();
  while (all.hasNext()) {
    var m = /^J-\d{4}-(\d{3,})/.exec(all.next().getName());
    if (m) highest = Math.max(highest, parseInt(m[1], 10));
  }

  return reply('ok\n' + JSON.stringify({ folders: folders, rows: rows, highestJobNumber: highest }));
}

function reply(text) {
  return ContentService.createTextOutput(text);
}

/**
 * Writes the row, then makes the job folder.
 *
 * The row is the critical path and is written no matter what. Everything
 * after it is wrapped so a Drive failure still answers "ok". The second line
 * of the reply tells the site whether the folder was made.
 */
function logQuote(body) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

  // Serializes job numbering. Two quotes landing together would otherwise
  // both read the same highest number and make two folders with one number.
  // If the lock cannot be had, the row still goes in and the folder is
  // skipped, since a missing folder is easy to fix and a missing row is not.
  var lock = LockService.getScriptLock();
  var locked = lock.tryLock(20000);

  try {
    try {
      ensureHeaders(sheet);
    } catch (err) {
      // Cosmetic only. Never let a header problem stop the row.
    }

    sheet.appendRow([
      body.timestamp,
      body.name,
      body.email,
      body.phone,
      body.street,
      body.city,
      body.state,
      body.zip,
      body.service,
      body.description,
      body.photos,
      body.smsConsent,
      body.outOfArea,
      body.spamFlag,
      '', // Status
      '', // Notes
      '', // Job Folder, filled in below
      body.howHeard || '',
      body.referredBy || '',
    ]);
    var row = sheet.getLastRow();

    var report;
    if (body.spamFlag) {
      // A bot hammering the form would otherwise fill 15 - Jobs and burn job
      // numbers. The row and the email still arrive, so a real customer who
      // tripped the flag (autofill has done it) gets a folder made by hand.
      report = { folderError: 'skipped, flagged as possible spam' };
    } else if (!locked) {
      report = { folderError: 'could not get the script lock, folder skipped' };
    } else {
      try {
        var job = createJobFolder(body);
        sheet.getRange(row, COL_JOB_FOLDER).setValue(job.url);
        report = { jobFolderUrl: job.url, photosFolderId: job.photosFolderId };
      } catch (err) {
        console.error('Job folder not created: ' + err);
        report = { folderError: String(err) };
      }
    }

    return reply('ok\n' + JSON.stringify(report));
  } finally {
    if (locked) lock.releaseLock();
  }
}

function ensureHeaders(sheet) {
  ADDED_HEADERS.forEach(function (pair) {
    var cell = sheet.getRange(1, pair[0]);
    if (cell.getValue() === '') cell.setValue(pair[1]);
  });
}

/**
 * Makes "J-2026-005 Name, Street" and its three subfolders.
 *
 * The number is the highest existing J-YYYY-NNN in the Jobs folder plus one,
 * so hand-made folders count too. The year comes from the date in Charleston,
 * which means numbering starts again at 001 each January.
 */
function createJobFolder(body) {
  var parent = DriveApp.getFolderById(JOBS_FOLDER_ID);
  var year = Utilities.formatDate(new Date(), 'America/New_York', 'yyyy');
  var pattern = new RegExp('^J-' + year + '-(\\d{3,})');

  var highest = 0;
  var folders = parent.getFolders();
  while (folders.hasNext()) {
    var match = pattern.exec(folders.next().getName());
    if (match) highest = Math.max(highest, parseInt(match[1], 10));
  }

  var number = 'J-' + year + '-' + String(highest + 1).padStart(3, '0');
  var name = number + ' ' + clean(body.name) + ', ' + clean(body.street);
  var folder = parent.createFolder(name);

  var photosFolderId = '';
  JOB_SUBFOLDERS.forEach(function (sub) {
    var created = folder.createFolder(sub);
    if (sub === PHOTOS_SUBFOLDER) photosFolderId = created.getId();
  });

  return { url: folder.getUrl(), photosFolderId: photosFolderId };
}

/** Form text in a folder name: one line, no slashes, not absurdly long. */
function clean(value) {
  return String(value || '')
    .replace(/[\r\n\t\/\\]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80);
}

/**
 * Saves the quote photos into a job's Photos (Before & After) folder.
 *
 * Only ever into that subfolder of a job under JOBS_FOLDER_ID, so the secret
 * alone is not enough to write files anywhere else in Drive.
 */
function savePhotos(body) {
  try {
    var folder = DriveApp.getFolderById(body.folderId);
    if (folder.getName() !== PHOTOS_SUBFOLDER || !isInsideJobs(folder)) {
      return reply('forbidden folder');
    }

    var saved = 0;
    (body.photos || []).slice(0, 4).forEach(function (photo) {
      var bytes = Utilities.base64Decode(photo.content);
      folder.createFile(Utilities.newBlob(bytes, photo.mimeType, photo.filename));
      saved++;
    });

    return reply('ok\n' + JSON.stringify({ saved: saved }));
  } catch (err) {
    console.error('Quote photos not saved: ' + err);
    return reply('error: ' + String(err));
  }
}

/** True when the folder's parent is a job folder directly under the Jobs root. */
function isInsideJobs(folder) {
  var jobs = folder.getParents();
  while (jobs.hasNext()) {
    var roots = jobs.next().getParents();
    while (roots.hasNext()) {
      if (roots.next().getId() === JOBS_FOLDER_ID) return true;
    }
  }
  return false;
}
