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

const PHOTOS_SUBFOLDER = 'Photos (Before & After)';
const JOB_SUBFOLDERS = [PHOTOS_SUBFOLDER, 'Quotes & Invoices', 'Signed Forms'];

// 1-based columns. A to N are the form fields, O and P (Status, Notes) are
// Tyler's to fill in by hand.
const COL_JOB_FOLDER = 17; // Q
const ADDED_HEADERS = [
  [17, 'Job Folder'],
  [18, 'How They Heard'],
  [19, 'Referred By'],
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
    var m = /^J-\d{4}-(\d{3})/.exec(all.next().getName());
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
    if (!locked) {
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
  var pattern = new RegExp('^J-' + year + '-(\\d{3})');

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
