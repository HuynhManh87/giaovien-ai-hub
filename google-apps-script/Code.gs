/**
 * CỔNG ỨNG DỤNG GIÁO VIÊN AI - BỘ ĐẾM TOÀN HỆ THỐNG V1.5
 * Tác giả hiển thị trên Hub: Mạnh LB - Zalo 0352.891.487
 *
 * Cách dùng:
 * 1) Tạo Google Sheet mới.
 * 2) Extensions > Apps Script.
 * 3) Dán toàn bộ file này vào Code.gs.
 * 4) Deploy > New deployment > Web app.
 * 5) Execute as: Me; Who has access: Anyone.
 * 6) Copy URL /exec và dán vào config.js của Hub.
 */

const SITE_KEY = 'MANH_LB_HUB_2026';
const SHEET_DAILY = 'DailyStats';
const SHEET_APPS = 'AppStats';
const DEFAULT_TIMEZONE = 'Asia/Ho_Chi_Minh';

function doGet(e) {
  const p = (e && e.parameter) || {};
  const callback = sanitizeCallback_(p.callback || '');
  const action = String(p.action || 'stats').toLowerCase();

  if (String(p.siteKey || '') !== SITE_KEY) {
    return respond_({ ok: false, error: 'invalid_site_key' }, callback);
  }

  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    ensureSheets_();

    if (action === 'visit') {
      incrementDaily_(1, 0);
      return respond_(Object.assign({ ok: true }, buildStats_()), callback);
    }

    if (action === 'open') {
      const appId = cleanText_(p.appId || '', 80);
      const appName = cleanText_(p.appName || '', 160);
      if (!appId) return respond_({ ok: false, error: 'missing_app_id' }, callback);
      incrementDaily_(0, 1);
      incrementApp_(appId, appName);
      return respond_(Object.assign({ ok: true }, buildStats_()), callback);
    }

    if (action === 'stats') {
      return respond_(Object.assign({ ok: true }, buildStats_()), callback);
    }

    if (action === 'ping') {
      return respond_({ ok: true, message: 'GVAI Stats API is running' }, callback);
    }

    return respond_({ ok: false, error: 'unknown_action' }, callback);
  } catch (err) {
    return respond_({ ok: false, error: String(err && err.message ? err.message : err) }, callback);
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}

function ensureSheets_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('Không tìm thấy Google Sheet gắn với Apps Script.');

  let daily = ss.getSheetByName(SHEET_DAILY);
  if (!daily) {
    daily = ss.insertSheet(SHEET_DAILY);
    daily.getRange(1, 1, 1, 3).setValues([['Date', 'Visits', 'AppOpens']]);
    daily.setFrozenRows(1);
  }

  let apps = ss.getSheetByName(SHEET_APPS);
  if (!apps) {
    apps = ss.insertSheet(SHEET_APPS);
    apps.getRange(1, 1, 1, 4).setValues([['Date', 'AppId', 'AppName', 'Opens']]);
    apps.setFrozenRows(1);
  }
}

function incrementDaily_(visitDelta, openDelta) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(SHEET_DAILY);
  const dateKey = dateKey_(new Date());
  const lastRow = sh.getLastRow();

  if (lastRow >= 2) {
    const values = sh.getRange(2, 1, lastRow - 1, 3).getValues();
    for (let i = values.length - 1; i >= 0; i--) {
      if (normalizeSheetDate_(values[i][0]) === dateKey) {
        const row = i + 2;
        sh.getRange(row, 2).setValue(Number(values[i][1] || 0) + Number(visitDelta || 0));
        sh.getRange(row, 3).setValue(Number(values[i][2] || 0) + Number(openDelta || 0));
        return;
      }
    }
  }

  sh.appendRow([dateKey, Number(visitDelta || 0), Number(openDelta || 0)]);
}

function incrementApp_(appId, appName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(SHEET_APPS);
  const dateKey = dateKey_(new Date());
  const lastRow = sh.getLastRow();

  if (lastRow >= 2) {
    const values = sh.getRange(2, 1, lastRow - 1, 4).getValues();
    for (let i = values.length - 1; i >= 0; i--) {
      if (normalizeSheetDate_(values[i][0]) === dateKey && String(values[i][1]) === appId) {
        const row = i + 2;
        if (appName && String(values[i][2] || '') !== appName) sh.getRange(row, 3).setValue(appName);
        sh.getRange(row, 4).setValue(Number(values[i][3] || 0) + 1);
        return;
      }
    }
  }

  sh.appendRow([dateKey, appId, appName, 1]);
}

function buildStats_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const daily = ss.getSheetByName(SHEET_DAILY);
  const apps = ss.getSheetByName(SHEET_APPS);
  const now = new Date();
  const today = dateKey_(now);
  const yesterday = dateKey_(addDays_(now, -1));
  const monthPrefix = today.slice(0, 7);
  const last7Set = {};
  for (let i = 0; i < 7; i++) last7Set[dateKey_(addDays_(now, -i))] = true;

  let todayVisits = 0;
  let yesterdayVisits = 0;
  let last7Days = 0;
  let thisMonth = 0;
  let total = 0;
  let appOpensTotal = 0;

  const dailyRows = daily.getLastRow() >= 2
    ? daily.getRange(2, 1, daily.getLastRow() - 1, 3).getValues()
    : [];

  dailyRows.forEach(r => {
    const day = normalizeSheetDate_(r[0]);
    const visits = Number(r[1] || 0);
    const opens = Number(r[2] || 0);
    total += visits;
    appOpensTotal += opens;
    if (day === today) todayVisits += visits;
    if (day === yesterday) yesterdayVisits += visits;
    if (last7Set[day]) last7Days += visits;
    if (day.indexOf(monthPrefix) === 0) thisMonth += visits;
  });

  const appTotals = {};
  const appNames = {};
  const appRows = apps.getLastRow() >= 2
    ? apps.getRange(2, 1, apps.getLastRow() - 1, 4).getValues()
    : [];

  appRows.forEach(r => {
    const appId = String(r[1] || '');
    if (!appId) return;
    appTotals[appId] = Number(appTotals[appId] || 0) + Number(r[3] || 0);
    if (r[2]) appNames[appId] = String(r[2]);
  });

  const topApps = Object.keys(appTotals)
    .map(id => ({ id: id, name: appNames[id] || id, opens: appTotals[id] }))
    .sort((a, b) => b.opens - a.opens)
    .slice(0, 10);

  return {
    scope: 'global',
    today: todayVisits,
    yesterday: yesterdayVisits,
    last7Days: last7Days,
    thisMonth: thisMonth,
    total: total,
    appOpensTotal: appOpensTotal,
    appTotals: appTotals,
    topApps: topApps,
    date: today,
    updatedAt: Utilities.formatDate(now, timezone_(), "yyyy-MM-dd'T'HH:mm:ssXXX")
  };
}

function dateKey_(date) {
  return Utilities.formatDate(date, timezone_(), 'yyyy-MM-dd');
}

function addDays_(date, delta) {
  const d = new Date(date.getTime());
  d.setDate(d.getDate() + delta);
  return d;
}

function timezone_() {
  return Session.getScriptTimeZone() || DEFAULT_TIMEZONE;
}

function normalizeSheetDate_(value) {
  if (value instanceof Date) return dateKey_(value);
  return String(value || '').slice(0, 10);
}

function cleanText_(value, maxLen) {
  return String(value || '').replace(/[<>\r\n]/g, ' ').trim().slice(0, maxLen || 200);
}

function sanitizeCallback_(value) {
  const s = String(value || '');
  return /^[A-Za-z_$][0-9A-Za-z_$\.]{0,120}$/.test(s) ? s : '';
}

function respond_(payload, callback) {
  const json = JSON.stringify(payload);
  if (callback) {
    return ContentService
      .createTextOutput(callback + '(' + json + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService
    .createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}
