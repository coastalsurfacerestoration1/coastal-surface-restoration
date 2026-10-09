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
// Tyler's to fill in by hand, and so are T and W, the two appointment dates.
// Other scripts and agents read this sheet by position, so columns are only
// ever added on the right, never moved.
const COL_NAME = 2; // B
const COL_PHONE = 4; // D
const COL_STREET = 5; // E
const COL_CITY = 6; // F
const COL_SMS_CONSENT = 12; // L
const COL_JOB_FOLDER = 17; // Q
const COL_APPOINTMENT = 20; // T, the job date, typed by Tyler, e.g. 10/15/2026 9:00 AM
const COL_CONFIRMATION_TEXT = 21; // U, written by this script
const COL_REMINDER_TEXT = 22; // V, written by this script
const COL_WALKTHROUGH = 23; // W, the walkthrough (site visit) date, typed by Tyler
const COL_WALKTHROUGH_CONFIRMATION = 24; // X, written by this script
const COL_WALKTHROUGH_REMINDER = 25; // Y, written by this script
const ADDED_HEADERS = [
  [17, 'Job Folder'],
  [18, 'How They Heard'],
  [19, 'Referred By'],
  [COL_APPOINTMENT, 'Job Date'],
  [COL_CONFIRMATION_TEXT, 'Confirmation Text'],
  [COL_REMINDER_TEXT, 'Reminder Text'],
  [COL_WALKTHROUGH, 'Walkthrough'],
  [COL_WALKTHROUGH_CONFIRMATION, 'Walkthrough Confirmation Text'],
  [COL_WALKTHROUGH_REMINDER, 'Walkthrough Reminder Text'],
];

// A customer can have a walkthrough to measure and quote, and later a job.
// Each has its own date column and its own two status columns, and the site
// words the texts to fit. Neither one ever reads or writes the other's cells.
const APPOINTMENTS = [
  { type: 'job', label: 'job date', when: COL_APPOINTMENT,
    confirmation: COL_CONFIRMATION_TEXT, reminder: COL_REMINDER_TEXT },
  { type: 'walkthrough', label: 'walkthrough', when: COL_WALKTHROUGH,
    confirmation: COL_WALKTHROUGH_CONFIRMATION, reminder: COL_WALKTHROUGH_REMINDER },
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
  if (body.action === 'consent') {
    return recordConsent(body);
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
 * Sets up the triggers behind the appointment texts, and the T to Y
 * headers: one on edit, so a new appointment is checked straight away, and one
 * hourly, which sends the reminders that have come due. Safe to run again: it
 * replaces its own triggers rather than adding more, which would double send.
 *
 * Installable, not a simple onEdit, because only an installable trigger may
 * call out to the site.
 */
function installTriggers() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  ScriptApp.getProjectTriggers().forEach(function (trigger) {
    var handler = trigger.getHandlerFunction();
    if (handler === 'onSheetEdit' || handler === 'sendDueReminders') ScriptApp.deleteTrigger(trigger);
  });
  ScriptApp.newTrigger('onSheetEdit').forSpreadsheet(spreadsheet).onEdit().create();
  ScriptApp.newTrigger('sendDueReminders').timeBased().everyHours(1).create();
  ensureHeaders(spreadsheet.getSheets()[0]);
}

/**
 * Hourly. Asks the site about every row whose reminder is still waiting, and
 * the site sends the ones that are due: 5 PM the evening before, never
 * outside 8 AM to 9 PM.
 */
function sendDueReminders() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var last = sheet.getLastRow();
  if (last < 2) return;
  // U to Y in one read: both types' status cells, with W between them.
  var first = COL_CONFIRMATION_TEXT;
  var notes = sheet.getRange(2, first, last - 1, COL_WALKTHROUGH_REMINDER - first + 1).getValues();
  for (var i = 0; i < notes.length; i++) {
    APPOINTMENTS.forEach(function (slot) {
      if (/^Waiting/.test(String(notes[i][slot.confirmation - first])) ||
          /^Waiting/.test(String(notes[i][slot.reminder - first]))) {
        sendAppointmentText(sheet, i + 2, slot);
      }
    });
  }
}

/**
 * Handles both texts for an appointment when its date cell is filled in: the
 * confirmation straight away, and the reminder before it. Job Date (T) reports
 * in U and V, Walkthrough (W) in X and Y.
 *
 * Each status cell says what happened: "Waiting: ..." until it is due,
 * "Sent <time> for <appointment>" once it is, "Not sent: <reason>", or
 * "Cancelled: ..." when the date is cleared before it went. Each appointment
 * time gets one of each. Re-entering the same time sends nothing new, while
 * moving it to a new time confirms the new one and schedules a new reminder.
 * Edits made by this script do not fire the trigger, so writing the status
 * cells cannot loop.
 */
function onSheetEdit(e) {
  var range = e && e.range;
  if (!range) return;
  var sheet = range.getSheet();
  if (sheet.getIndex() !== 1) return;

  APPOINTMENTS.forEach(function (slot) {
    if (range.getColumn() > slot.when || range.getLastColumn() < slot.when) return;
    for (var row = Math.max(2, range.getRow()); row <= range.getLastRow(); row++) {
      sendAppointmentText(sheet, row, slot);
    }
  });
}

function sendAppointmentText(sheet, row, slot) {
  // The edit and hourly triggers can overlap. One at a time, so a row due
  // right as it is edited is not texted twice.
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) return;
  try {
    checkReminder(sheet, row, slot);
  } finally {
    lock.releaseLock();
  }
}

function checkReminder(sheet, row, slot) {
  var confirmation = sheet.getRange(row, slot.confirmation);
  var reminder = sheet.getRange(row, slot.reminder);
  var values = sheet.getRange(row, 1, 1, slot.when).getValues()[0];
  var when = values[slot.when - 1];
  if (when === '' || when === null) {
    // Cleared. Whatever had not gone out yet never will, and the hourly run
    // stops asking. What already went out stays on record.
    [confirmation, reminder].forEach(function (cell) {
      if (/^Waiting/.test(String(cell.getValue()))) {
        cell.setValue('Cancelled: ' + slot.label + ' cleared, nothing sent');
      }
    });
    return;
  }

  if (!(when instanceof Date) || isNaN(when.getTime())) {
    confirmation.setValue('Not sent: not a date and time. Type it like 10/15/2026 9:00 AM');
    reminder.setValue('');
    return;
  }
  // The wall time exactly as typed, read in the spreadsheet's own time zone.
  // A Date from a cell is an instant in that zone, and the sheet's zone is
  // whatever the account was set to (the TEST copy is Pacific), so sending the
  // instant would turn a typed 9:00 AM into noon in Charleston. The site reads
  // this as Charleston time.
  var zone = SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone();
  var local = Utilities.formatDate(when, zone, "yyyy-MM-dd'T'HH:mm");
  // A bare date reads as midnight. Nobody books a midnight job, so it means
  // the time was left off, and a text saying 12:00 AM would be wrong.
  if (/T00:00$/.test(local)) {
    confirmation.setValue('Not sent: add a time, like 10/15/2026 9:00 AM');
    reminder.setValue('');
    return;
  }

  var row_ = {
    name: values[COL_NAME - 1],
    phone: String(values[COL_PHONE - 1]),
    street: values[COL_STREET - 1],
    city: values[COL_CITY - 1],
    smsConsent: values[COL_SMS_CONSENT - 1],
    appointment: local,
    type: slot.type,
  };

  // Confirmation first. If it goes out in this same pass, the site is told,
  // so a reminder already due (booked the evening before) is skipped instead
  // of landing a minute after the confirmation.
  var justConfirmed = false;
  if (!sentFor(confirmation, local)) {
    justConfirmed = askSite(confirmation, row_, 'confirmation', false, local);
  }
  if (!sentFor(reminder, local)) {
    askSite(reminder, row_, 'reminder', justConfirmed, local);
  }
}

/** True when this status cell already records a text for this appointment. */
function sentFor(cell, local) {
  var note = String(cell.getValue());
  return note.indexOf('Sent ') === 0 && note.indexOf(' for ' + local) !== -1;
}

/** Asks the site to send one text, writes the outcome, and says whether it went. */
function askSite(cell, row, kind, confirmedJustNow, local) {
  var headers = {};
  if (VERCEL_BYPASS) headers['x-vercel-protection-bypass'] = VERCEL_BYPASS;
  var payload = { secret: SECRET, kind: kind, confirmedJustNow: confirmedJustNow };
  for (var key in row) payload[key] = row[key];
  try {
    var res = UrlFetchApp.fetch(SITE_URL + '/api/appointment-text', {
      method: 'post',
      contentType: 'application/json',
      headers: headers,
      muteHttpExceptions: true,
      payload: JSON.stringify(payload),
    });
    var result;
    try {
      result = JSON.parse(res.getContentText());
    } catch (err) {
      result = { sent: false, reason: 'site answered ' + res.getResponseCode() };
    }
    if (result.sent) {
      cell.setValue('Sent ' + Utilities.formatDate(new Date(), 'America/New_York', 'M/d/yyyy h:mm a') +
        ' for ' + local);
      return true;
    }
    cell.setValue((result.wait ? 'Waiting: ' : 'Not sent: ') + result.reason);
  } catch (err) {
    // The site being unreachable is temporary, so keep it in the hourly check.
    cell.setValue('Waiting: could not reach the site, will retry (' + String(err).slice(0, 150) + ')');
  }
  return false;
}

/**
 * Marks SMS Consent (column L) on every row with this phone number, after the
 * customer texts STOP or START. Twilio enforces the opt-out by itself; this
 * keeps the sheet saying the same thing. Matched on the last ten digits, since
 * the sheet stores 843-555-0100 and Twilio sends +18435550100.
 */
function recordConsent(body) {
  var digits = String(body.phone || '').replace(/\D/g, '').slice(-10);
  if (digits.length !== 10 || (body.consent !== 'yes' && body.consent !== 'no')) {
    return reply('bad request');
  }
  var stamp = Utilities.formatDate(new Date(), 'America/New_York', 'M/d/yyyy');
  var value = body.consent === 'no' ? 'no (replied STOP ' + stamp + ')' : 'yes (replied START ' + stamp + ')';

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var last = sheet.getLastRow();
  var changed = 0;
  if (last >= 2) {
    var phones = sheet.getRange(2, COL_PHONE, last - 1, 1).getValues();
    for (var i = 0; i < phones.length; i++) {
      if (String(phones[i][0]).replace(/\D/g, '').slice(-10) === digits) {
        sheet.getRange(i + 2, COL_SMS_CONSENT).setValue(value);
        changed++;
      }
    }
  }
  return reply('ok\n' + JSON.stringify({ rows: changed }));
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
