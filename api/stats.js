const UPSTREAM_URL = process.env.GVAI_STATS_UPSTREAM || 'https://script.google.com/macros/s/AKfycbx-knyvhwMMr9NqwLoaa4i5XPGxZIKkbXKVuYWrYNVY78SaHMtCfCplIqEoqre94Yq-/exec';
const SITE_KEY = process.env.GVAI_STATS_SITE_KEY || 'MANH_LB_HUB_2026';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  const action = String(req.query.action || 'stats');
  const qs = new URLSearchParams({ action, siteKey: SITE_KEY });
  if (req.query.appId) qs.set('appId', String(req.query.appId));
  if (req.query.appName) qs.set('appName', String(req.query.appName));
  qs.set('_', String(Date.now()));

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25000);
  try {
    const upstream = await fetch(`${UPSTREAM_URL}?${qs.toString()}`, {
      method: 'GET',
      redirect: 'follow',
      cache: 'no-store',
      headers: { 'Accept': 'application/json,text/plain,*/*' },
      signal: controller.signal
    });
    const text = await upstream.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (_) {
      return res.status(502).json({
        ok: false,
        error: 'upstream_not_json',
        status: upstream.status,
        preview: text.slice(0, 180)
      });
    }
    return res.status(upstream.ok ? 200 : 502).json(data);
  } catch (err) {
    const msg = err && err.name === 'AbortError' ? 'upstream_timeout' : String(err && err.message ? err.message : err);
    return res.status(502).json({ ok: false, error: msg });
  } finally {
    clearTimeout(timer);
  }
}
