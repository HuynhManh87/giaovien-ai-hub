const FALLBACK_APPS = [
  {id:'tich-hop-ai',name:'Tích hợp NLS – AI – Hòa nhập',description:'Tích hợp tự động năng lực số, giáo dục AI và nội dung hòa nhập vào giáo án theo đúng yêu cầu.',category:'Giáo án',version:'V14',icon:'🤖',url:'https://giao-an-tich-hop-all-in.bacgptplus27.chatgpt.site/',metadataUrl:'https://giao-an-tich-hop-all-in.bacgptplus27.chatgpt.site/app-info.js',updated:'2026-09-11',featured:true},
  {id:'giao-an-song-ngu',name:'Giáo án song ngữ',description:'Tra cứu và dịch thuật ngữ song ngữ, hỗ trợ xuất Word và giữ cấu trúc tài liệu.',category:'Giáo án',version:'V4.5.1',icon:'🌐',url:'https://giaoansongngu.vercel.app/',metadataUrl:'https://giaoansongngu.vercel.app/app-info.js',updated:'2026-09-08',featured:true},
  {id:'toan-ai',name:'Phiếu bài tập Toán THCS',description:'Tạo phiếu học tập, bài tập, đề kiểm tra và hỗ trợ hình học cho môn Toán THCS.',category:'Dạy học',version:'V35',icon:'➗',url:'https://phieu-toan-thcs.bacgptplus27.chatgpt.site/',metadataUrl:'https://phieu-toan-thcs.bacgptplus27.chatgpt.site/app-info.js',updated:'2026-09-11',featured:true},
  {id:'khtn-ai',name:'Phiếu bài tập KHTN',description:'Hỗ trợ xây dựng câu hỏi, bài tập và hoạt động vận dụng thực tế cho Khoa học tự nhiên.',category:'Dạy học',version:'V42',icon:'🧪',url:'https://phieu-khtn-ai.bacgptplus27.chatgpt.site/',metadataUrl:'https://phieu-khtn-ai.bacgptplus27.chatgpt.site/app-info.js',updated:'2026-09-11',featured:true},
  {id:'tkb',name:'Xem thời khóa biểu',description:'Tra cứu thời khóa biểu nhà trường nhanh chóng trên máy tính và điện thoại.',category:'Quản lý',school:'THCS Long Bình',version:'V1',icon:'🗓️',url:'https://tkb-school-long-binh.vercel.app/',metadataUrl:'https://tkb-school-long-binh.vercel.app/app-info.js',updated:'2026-09-11',featured:false},
  {id:'quan-ly-hoc-them',name:'Quản lý học thêm',description:'Theo dõi lớp học, học sinh, học phí, điểm danh và lịch học trên một nơi.',category:'Quản lý',version:'V1',icon:'👥',url:'',metadataUrl:'',updated:'2026-09-09',featured:false},
  {id:'chuan-hoa-giao-an',name:'Chuẩn hóa giáo án',description:'Rà soát, định dạng và hoàn thiện giáo án theo mẫu thống nhất của nhà trường.',category:'Giáo án',version:'V1',icon:'📄',url:'',metadataUrl:'',updated:'2026-09-08',featured:false},
  {id:'quan-ly-cong-viec',name:'Quản lý công việc',description:'Theo dõi nhiệm vụ, tiến độ, nhắc việc và phân loại công việc hằng ngày.',category:'Quản lý',version:'V1',icon:'✅',url:'',metadataUrl:'',updated:'2026-09-08',featured:false},
  {id:'ke-hoach-ca-nhan',name:'Kế hoạch cá nhân giáo viên THCS',description:'Lập và theo dõi kế hoạch cá nhân, công việc và tiến độ thực hiện dành cho giáo viên THCS.',category:'Quản lý',school:'THCS Long Bình',version:'V1',icon:'📋',url:'https://ke-hoach-ca-nhan-giao-vien-thcs.ava-collins809512.chatgpt.site/',metadataUrl:'https://ke-hoach-ca-nhan-giao-vien-thcs.ava-collins809512.chatgpt.site/app-info.js',updated:'2026-09-11',featured:false}
];

const CONFIG = Object.assign({
  statsApiUrl: '',
  statsSiteKey: 'MANH_LB_HUB_2026'
}, window.GVAI_CONFIG || {});

function getLocalDateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function addDays(date, delta) {
  const d = new Date(date.getTime());
  d.setDate(d.getDate() + delta);
  return d;
}

function recordLocalVisit() {
  const now = new Date();
  const todayKey = getLocalDateKey(now);
  const history = JSON.parse(localStorage.getItem('gvai_visit_history') || '{}');
  history[todayKey] = Number(history[todayKey] || 0) + 1;
  localStorage.setItem('gvai_visit_history', JSON.stringify(history));

  let total = Number(localStorage.getItem('gvai_visits_total') || 0) + 1;
  localStorage.setItem('gvai_visits_total', String(total));

  const yesterdayKey = getLocalDateKey(addDays(now, -1));
  const monthPrefix = todayKey.slice(0, 7);
  let last7Days = 0;
  let thisMonth = 0;
  for (let i = 0; i < 7; i++) last7Days += Number(history[getLocalDateKey(addDays(now, -i))] || 0);
  Object.entries(history).forEach(([day, count]) => {
    if (day.startsWith(monthPrefix)) thisMonth += Number(count || 0);
  });

  return {
    today: Number(history[todayKey] || 0),
    yesterday: Number(history[yesterdayKey] || 0),
    last7Days,
    thisMonth,
    total,
    appOpensTotal: Number(localStorage.getItem('gvai_launches') || 0),
    appTotals: {},
    scope: 'local'
  };
}

async function jsonpRequest(action, params = {}, timeoutMs = 20000) {
  // V1.6.4: gọi API cùng tên miền Vercel để tránh trình duyệt chặn script bên thứ ba.
  // Tên hàm được giữ nguyên để không phải sửa các chỗ gọi cũ.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const qs = new URLSearchParams({ action, ...params, _: String(Date.now()) });
    const response = await fetch(`/api/stats?${qs.toString()}`, {
      method: 'GET',
      cache: 'no-store',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });
    let data = null;
    try { data = await response.json(); } catch (_) {}
    if (!response.ok) {
      throw new Error((data && data.error) || `Stats API HTTP ${response.status}`);
    }
    if (!data || data.ok === false) {
      throw new Error((data && data.error) || 'Stats API error');
    }
    return data;
  } catch (err) {
    if (err && err.name === 'AbortError') throw new Error('Stats API timeout');
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

async function recordVisit(localStats = null) {
  const local = localStats || recordLocalVisit();
  // V1.6.4 dùng proxy /api/stats cùng tên miền; không phụ thuộc JSONP/CORS.

  // Ưu tiên đọc thống kê chung trước để giao diện không rơi về "Cục bộ"
  // chỉ vì thao tác ghi lượt truy cập trên Google Sheets phản hồi chậm.
  try {
    const snapshot = await jsonpRequest('stats', {}, 20000);
    const globalStats = normalizeStats(snapshot, 'global');

    // Ghi lượt truy cập ở nền. Khi Google Sheets trả kết quả, cập nhật lại số liệu.
    jsonpRequest('visit', {}, 30000)
      .then(data => {
        const fresh = normalizeStats(data, 'global');
        saveGlobalStatsCache(fresh);
        applyStats(fresh);
        renderAll();
      })
      .catch(err => console.warn('[GVAI Stats] Không ghi được lượt truy cập:', err));

    return globalStats;
  } catch (statsErr) {
    console.warn('[GVAI Stats] Không đọc được thống kê chung:', statsErr);

    // Thử trực tiếp action=visit thêm một lần trước khi dùng bộ đếm cục bộ.
    try {
      const data = await jsonpRequest('visit', {}, 30000);
      return normalizeStats(data, 'global');
    } catch (visitErr) {
      console.warn('[GVAI Stats] Chuyển sang bộ đếm cục bộ:', visitErr);
      return local;
    }
  }
}

function saveGlobalStatsCache(stats) {
  try {
    localStorage.setItem('gvai_global_stats_cache', JSON.stringify({
      savedAt: Date.now(),
      data: stats
    }));
  } catch (_) {}
}

function loadGlobalStatsCache() {
  try {
    const raw = localStorage.getItem('gvai_global_stats_cache');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.data) return null;
    // Chỉ dùng cache tối đa 10 phút để giao diện hiện số ngay, sau đó cập nhật nền.
    if (Date.now() - Number(parsed.savedAt || 0) > 10 * 60 * 1000) return null;
    return normalizeStats(parsed.data, 'global');
  } catch (_) {
    return null;
  }
}

function normalizeStats(data, scope = 'global') {
  return {
    today: Number(data.today || 0),
    yesterday: Number(data.yesterday || 0),
    last7Days: Number(data.last7Days || 0),
    thisMonth: Number(data.thisMonth || 0),
    total: Number(data.total || 0),
    appOpensTotal: Number(data.appOpensTotal || 0),
    appTotals: data.appTotals && typeof data.appTotals === 'object' ? data.appTotals : {},
    scope
  };
}

const state = {
  apps: [],
  category: 'Tất cả',
  query: '',
  view: 'home',
  favorites: new Set(JSON.parse(localStorage.getItem('gvai_favorites') || '[]')),
  launches: Number(localStorage.getItem('gvai_launches') || 0),
  syncedCount: 0,
  visitsToday: 0,
  visitsYesterday: 0,
  visits7Days: 0,
  visitsMonth: 0,
  visitsTotal: 0,
  appLaunchesTotal: 0,
  appTotals: {},
  visitsScope: 'local'
};

const remoteInfoBuffer = new Map();
window.registerGvAiAppInfo = function registerGvAiAppInfo(info) {
  if (!info || typeof info !== 'object' || !info.id) return;
  remoteInfoBuffer.set(String(info.id), info);
};

const el = id => document.getElementById(id);
const appGrid = el('appGrid');
const categoryTabs = el('categoryTabs');
const searchInput = el('searchInput');
const emptyState = el('emptyState');
const sectionTitle = el('sectionTitle');
const sectionSubtitle = el('sectionSubtitle');

function normalizeText(str='') {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase();
}

async function loadApps() {
  try {
    // Cho phép trình duyệt revalidate thay vì bắt tải mới hoàn toàn mỗi lần mở trang.
    const res = await fetch('./apps.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error('Không đọc được apps.json');
    state.apps = await res.json();
  } catch (e) {
    state.apps = FALLBACK_APPS;
  }

  state.apps = state.apps.map(app => ({ ...app, syncState: app.metadataUrl ? 'checking' : 'local' }));
  // Hiện card ngay. Đồng bộ app-info.js chạy nền, không chặn giao diện.
  renderAll();
  setTimeout(() => {
    syncAllRemoteMetadata()
      .then(() => renderAll())
      .catch(err => console.warn('[GVAI Metadata] Đồng bộ nền thất bại:', err));
  }, 700);
}

async function syncAllRemoteMetadata() {
  const jobs = state.apps.map(app => syncRemoteMetadata(app));
  await Promise.allSettled(jobs);
  state.syncedCount = state.apps.filter(app => app.syncState === 'synced').length;
}

function syncRemoteMetadata(app) {
  if (!app.metadataUrl) {
    app.syncState = 'local';
    return Promise.resolve(false);
  }

  return new Promise(resolve => {
    const script = document.createElement('script');
    const separator = app.metadataUrl.includes('?') ? '&' : '?';
    script.src = `${app.metadataUrl}${separator}_hub=${Date.now()}`;
    script.async = true;

    const finish = ok => {
      clearTimeout(timer);
      script.remove();
      if (!ok) app.syncState = 'fallback';
      resolve(ok);
    };

    script.onload = () => {
      const info = remoteInfoBuffer.get(String(app.id));
      if (!info) return finish(false);
      applyRemoteInfo(app, info);
      remoteInfoBuffer.delete(String(app.id));
      app.syncState = 'synced';
      finish(true);
    };

    script.onerror = () => finish(false);
    const timer = setTimeout(() => finish(false), 4500);
    document.head.appendChild(script);
  });
}

function applyRemoteInfo(app, info) {
  const allowed = ['version', 'updated', 'note', 'status'];
  allowed.forEach(key => {
    if (typeof info[key] === 'string' && info[key].trim()) app[key] = info[key].trim();
  });
}

function getCategories() {
  return ['Tất cả', ...new Set(state.apps.map(x => x.category))];
}

function renderCategories() {
  categoryTabs.innerHTML = '';
  getCategories().forEach(cat => {
    const btn = document.createElement('button');
    btn.className = `category-btn ${state.category === cat ? 'active' : ''}`;
    btn.textContent = cat;
    btn.onclick = () => {
      state.category = cat;
      state.view = 'all';
      setActiveNav('all');
      renderAll();
    };
    categoryTabs.appendChild(btn);
  });
}

function getVisibleApps() {
  let list = [...state.apps];
  if (state.view === 'home') list = list.filter(x => x.featured);
  if (state.view === 'longbinh') list = list.filter(x => x.school === 'THCS Long Bình' || ['tkb','ke-hoach-ca-nhan'].includes(x.id));
  if (state.view === 'favorites') list = list.filter(x => state.favorites.has(x.id));
  if (state.view === 'recent') list.sort((a,b) => new Date(b.updated) - new Date(a.updated));
  if (state.category !== 'Tất cả') list = list.filter(x => x.category === state.category);
  if (state.query) {
    const q = normalizeText(state.query);
    list = list.filter(x => normalizeText(`${x.name} ${x.description} ${x.category} ${x.version} ${x.note || ''}`).includes(q));
  }
  return list;
}

function renderApps() {
  const list = getVisibleApps();
  appGrid.innerHTML = '';
  emptyState.classList.toggle('hidden', list.length > 0);

  list.forEach(app => {
    const linked = Boolean(app.url && app.url.trim());
    const fav = state.favorites.has(app.id);
    const status = (app.status || 'online').toLowerCase();
    const isMaintenance = status === 'maintenance' || status === 'bao-tri' || status === 'bảo trì';
    const syncBadge = getSyncBadge(app);
    const globalOpens = Number(state.appTotals[app.id] || 0);
    const card = document.createElement('article');
    card.className = 'app-card';
    card.innerHTML = `
      <div class="app-top">
        <div class="app-icon" aria-hidden="true">${app.icon || '🧩'}</div>
        <button class="favorite-btn ${fav ? 'is-favorite' : ''}" aria-label="${fav ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}" title="${fav ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}">${fav ? '★' : '☆'}</button>
      </div>
      <h3>${escapeHtml(app.name)}</h3>
      <p class="app-description">${escapeHtml(app.description)}</p>
      ${app.note ? `<div class="update-note" title="${escapeHtml(app.note)}">🆕 ${escapeHtml(app.note)}</div>` : ''}
      <div class="app-meta">
        <span class="badge">${escapeHtml(app.category)}</span>
        <span class="badge version-badge">${escapeHtml(app.version || '')}</span>
        ${syncBadge}
        ${isMaintenance ? '<span class="badge maintenance">Bảo trì</span>' : !linked ? '<span class="badge missing">Sắp ra mắt</span>' : ''}
        ${state.visitsScope === 'global' && globalOpens ? `<span class="badge usage-badge">👆 ${globalOpens.toLocaleString('vi-VN')} lượt mở</span>` : ''}
      </div>
      <div class="app-actions">
        <button class="open-btn" ${linked && !isMaintenance ? '' : 'disabled'}>${isMaintenance ? 'Đang bảo trì' : linked ? 'Mở app →' : 'Sắp ra mắt'}</button>
      </div>`;

    card.querySelector('.favorite-btn').onclick = () => toggleFavorite(app.id);
    const openBtn = card.querySelector('.open-btn');
    if (linked && !isMaintenance) openBtn.onclick = () => openApp(app);
    appGrid.appendChild(card);
  });
}

function getSyncBadge(app) {
  if (app.syncState === 'synced') return '<span class="badge sync-ok" title="Phiên bản được cập nhật tự động">✓ Tự đồng bộ</span>';
  return '';
}

function renderRecent() {
  const list = [...state.apps].sort((a,b) => new Date(b.updated) - new Date(a.updated)).slice(0, 4);
  el('recentList').innerHTML = list.map(app => `
    <div class="recent-item">
      <div>
        <div class="recent-name">${escapeHtml(app.name)}</div>
        <span class="badge">${escapeHtml(app.version || '')}</span>
        ${app.syncState === 'synced' ? '<span class="mini-sync">✓</span>' : ''}
      </div>
      <div class="recent-date">${formatDate(app.updated)}</div>
    </div>`).join('');
}

function renderStats() {
  const quickVals = {
    statVisitsToday: state.visitsToday,
    statVisitsMonth: state.visitsMonth,
    statVisitsTotal: state.visitsTotal,
    statLaunches: state.visitsScope === 'global' ? state.appLaunchesTotal : state.launches
  };
  const detailVals = {
    detailVisitsToday: state.visitsToday,
    detailVisitsYesterday: state.visitsYesterday,
    detailVisits7Days: state.visits7Days,
    detailVisitsMonth: state.visitsMonth,
    detailVisitsTotal: state.visitsTotal,
    detailLaunches: state.visitsScope === 'global' ? state.appLaunchesTotal : state.launches,
    detailApps: state.apps.length,
    detailSynced: state.syncedCount
  };
  Object.entries({ ...quickVals, ...detailVals }).forEach(([id, value]) => {
    const node = el(id);
    if (node) node.textContent = Number(value || 0).toLocaleString('vi-VN');
  });

  const scopeHtml = state.visitsScope === 'global'
    ? '🌐 <strong>Toàn hệ thống</strong> · Google Sheets'
    : '💻 <strong>Cục bộ</strong> · Chưa kết nối thống kê chung';
  const scopeEl = el('statsScope');
  if (scopeEl) scopeEl.innerHTML = scopeHtml;
  const detailScope = el('statsScopeDetail');
  if (detailScope) detailScope.innerHTML = scopeHtml;
  renderAppRanking();
}

function renderAppRanking() {
  const box = el('appRanking');
  if (!box) return;
  const ranked = state.apps
    .filter(app => app.url && app.url.trim())
    .map(app => ({ ...app, opens: Number(state.appTotals[app.id] || 0) }))
    .sort((a, b) => b.opens - a.opens || a.name.localeCompare(b.name, 'vi'));

  if (state.visitsScope !== 'global') {
    box.innerHTML = '<div class="ranking-empty">Kết nối Google Apps Script để xem xếp hạng lượt mở ứng dụng trên toàn hệ thống.</div>';
    return;
  }
  if (!ranked.length || ranked.every(x => x.opens === 0)) {
    box.innerHTML = '<div class="ranking-empty">Chưa có dữ liệu lượt mở ứng dụng.</div>';
    return;
  }

  const max = Math.max(...ranked.map(x => x.opens), 1);
  box.innerHTML = ranked.map((app, index) => {
    const pct = Math.max(4, Math.round(app.opens / max * 100));
    return `
      <div class="ranking-row">
        <div class="ranking-index">${index + 1}</div>
        <div class="ranking-icon">${app.icon || '🧩'}</div>
        <div class="ranking-main">
          <div class="ranking-title"><strong>${escapeHtml(app.name)}</strong><span>${app.opens.toLocaleString('vi-VN')} lượt</span></div>
          <div class="ranking-track"><span style="width:${pct}%"></span></div>
        </div>
      </div>`;
  }).join('');
}

function renderHeaderText() {
  const config = {
    home: ['Ứng dụng nổi bật', 'Những công cụ thầy/cô có thể mở nhanh từ cổng chung.'],
    all: ['Tất cả ứng dụng', 'Lọc theo nhóm hoặc gõ từ khóa để tìm đúng công cụ cần dùng.'],
    longbinh: ['THCS Long Bình', 'Các ứng dụng dành riêng cho giáo viên Trường THCS Long Bình.'],
    favorites: ['Ứng dụng yêu thích', 'Các ứng dụng đã được đánh dấu sao trên trình duyệt này.'],
    recent: ['Mới cập nhật', 'Phiên bản và ngày cập nhật được ưu tiên lấy tự động từ từng app khi có app-info.js.'],
    stats: ['Thống kê sử dụng', 'Theo dõi lượt truy cập theo ngày, theo tháng, toàn thời gian và lượt mở ứng dụng.']
  };
  const [title, sub] = config[state.view] || config.all;
  sectionTitle.textContent = title;
  sectionSubtitle.textContent = sub;
}

function renderAll() {
  renderCategories();
  renderHeaderText();
  renderViewLayout();
  renderApps();
  renderRecent();
  renderStats();
}

function renderViewLayout() {
  const isStats = state.view === 'stats';
  const hero = el('heroSection');
  const layout = el('mainLayout');
  const statsDetail = el('statsDetail');
  if (hero) hero.classList.toggle('hidden', isStats);
  if (layout) layout.classList.toggle('hidden', isStats);
  if (statsDetail) statsDetail.classList.toggle('hidden', !isStats);
  if (categoryTabs) categoryTabs.classList.toggle('hidden', isStats || state.view === 'longbinh');
}

function toggleFavorite(id) {
  if (state.favorites.has(id)) state.favorites.delete(id); else state.favorites.add(id);
  localStorage.setItem('gvai_favorites', JSON.stringify([...state.favorites]));
  renderAll();
  toast(state.favorites.has(id) ? 'Đã thêm vào Yêu thích.' : 'Đã bỏ khỏi Yêu thích.');
}

function applyStats(stats) {
  state.visitsToday = stats.today;
  state.visitsYesterday = stats.yesterday;
  state.visits7Days = stats.last7Days;
  state.visitsMonth = stats.thisMonth;
  state.visitsTotal = stats.total;
  state.appLaunchesTotal = stats.appOpensTotal;
  state.appTotals = stats.appTotals || {};
  state.visitsScope = stats.scope || 'local';
}

function openApp(app) {
  state.launches += 1;
  localStorage.setItem('gvai_launches', String(state.launches));
  renderStats();

  // Mở app ngay để không bị trình duyệt chặn popup.
  window.open(app.url, '_blank', 'noopener,noreferrer');

  jsonpRequest('open', { appId: app.id, appName: app.name }, 30000)
    .then(data => {
      applyStats(normalizeStats(data, 'global'));
      renderAll();
    })
    .catch(err => console.warn('[GVAI Stats] Không ghi được lượt mở app:', err));
}

function setActiveNav(view) {
  document.querySelectorAll('.nav-item').forEach(btn => btn.classList.toggle('active', btn.dataset.view === view));
}

function changeView(view) {
  if (view === 'admin') {
    toast('Quản trị nâng cao sẽ được bổ sung sau. Hiện tại ứng dụng được quản lý bằng apps.json.');
    return;
  }
  state.view = view;
  if (view === 'home' || view === 'stats' || view === 'longbinh') state.category = 'Tất cả';
  setActiveNav(view);
  renderAll();
  document.querySelector('.sidebar').classList.remove('open');
}

document.querySelectorAll('.nav-item, .admin-link').forEach(btn => btn.addEventListener('click', () => changeView(btn.dataset.view)));

searchInput.addEventListener('input', e => {
  state.query = e.target.value.trim();
  if (state.query && (state.view === 'home' || state.view === 'stats')) { state.view = 'all'; setActiveNav('all'); }
  renderAll();
});

document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault(); searchInput.focus(); searchInput.select();
  }
  if (e.key === 'Escape') searchInput.blur();
});

el('viewRecentBtn').onclick = () => changeView('recent');
if (el('viewStatsBtn')) el('viewStatsBtn').onclick = () => changeView('stats');
el('mobileMenu').onclick = () => el('sidebar').classList.toggle('open');
el('clearFavoritesBtn').onclick = () => {
  if (!state.favorites.size) return toast('Chưa có ứng dụng yêu thích để xóa.');
  state.favorites.clear();
  localStorage.setItem('gvai_favorites', '[]');
  renderAll();
  toast('Đã xóa toàn bộ ứng dụng yêu thích trên trình duyệt này.');
};

function toast(message) {
  const t = el('toast');
  t.textContent = message;
  t.classList.add('show');
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(d.getTime())) return escapeHtml(dateStr);
  return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d);
}

function escapeHtml(value='') {
  return String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
}

function boot() {
  // V1.6.5: ưu tiên tốc độ hiển thị. Không chờ Google Sheets/Apps Script trước khi tải ứng dụng.
  const local = recordLocalVisit();
  const cachedGlobal = loadGlobalStatsCache();
  applyStats(cachedGlobal || local);

  // Tải danh sách app ngay lập tức.
  loadApps().catch(err => console.warn('[GVAI] Không tải được danh sách ứng dụng:', err));

  // Thống kê toàn hệ thống chạy nền sau một nhịp ngắn để không chặn First Paint.
  setTimeout(() => {
    recordVisit(local)
      .then(stats => {
        if (stats && stats.scope === 'global') saveGlobalStatsCache(stats);
        applyStats(stats);
        renderAll();
      })
      .catch(err => console.warn('[GVAI Stats] Cập nhật nền thất bại:', err));
  }, 250);
}

boot();
