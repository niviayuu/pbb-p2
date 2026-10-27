const fs = require('fs');
const vm = require('vm');

console.log("======================================================================");
console.log("PENGUJIAN INTEGRASI & VERIFIKASI HALAMAN INFORMASI BAPENDA KARAWANG");
console.log("======================================================================\n");

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`  [FAIL] ${message}`);
  }
}

// -----------------------------------------------------------------------------
// 1. UJI STRUKTUR FILE & DATA
// -----------------------------------------------------------------------------
console.log("--- 1. Uji Keberadaan File & Aset ---");
assert(fs.existsSync('assets/berita_tirtamulya.jpg'), 'Thumbnail berita 1 (Tirtamulya) ada di root');
assert(fs.existsSync('assets/berita_cek_online.jpg'), 'Thumbnail berita 2 (Cek Online) ada di root');
assert(fs.existsSync('assets/berita_realisasi.jpg'), 'Thumbnail berita 3 (Realisasi) ada di root');
assert(fs.existsSync('assets/informasi_data.js'), 'File assets/informasi_data.js ada di root');

assert(fs.existsSync('pbb-p2/public/assets/berita_tirtamulya.jpg'), 'Thumbnail berita 1 ada di Laravel public');
assert(fs.existsSync('pbb-p2/public/assets/berita_cek_online.jpg'), 'Thumbnail berita 2 ada di Laravel public');
assert(fs.existsSync('pbb-p2/public/assets/berita_realisasi.jpg'), 'Thumbnail berita 3 ada di Laravel public');
assert(fs.existsSync('pbb-p2/public/assets/informasi_data.js'), 'File assets/informasi_data.js ada di Laravel public');

const infoData = require('./assets/informasi_data.js');
assert(typeof infoData.INFORMASI_BASE_DATA === 'object', 'INFORMASI_BASE_DATA terdefinisi');
assert(Array.isArray(infoData.INFORMASI_BASE_DATA.berita) && infoData.INFORMASI_BASE_DATA.berita.length === 3, 'Data berita memuat 3 artikel sesuai referensi');
assert(Array.isArray(infoData.INFORMASI_BASE_DATA.pengumuman) && infoData.INFORMASI_BASE_DATA.pengumuman.length === 3, 'Data pengumuman memuat 3 pengumuman sesuai referensi');
assert(Array.isArray(infoData.INFORMASI_BASE_DATA.regulasi) && infoData.INFORMASI_BASE_DATA.regulasi.length === 3, 'Data regulasi memuat 3 dokumen sesuai referensi');
assert(Array.isArray(infoData.INFORMASI_BASE_DATA.faq) && infoData.INFORMASI_BASE_DATA.faq.length >= 4, 'Data FAQ memuat 4 tanya jawab resmi');

// Test getInformasiFilteredData
const filteredAll = infoData.getInformasiFilteredData('semua', '2026-01-01', '2026-12-31');
assert(filteredAll.berita.length === 3, 'Filter tab "semua" mengembalikan 3 berita');
assert(filteredAll.pengumuman.length === 3, 'Filter tab "semua" mengembalikan 3 pengumuman');

const filteredOutside = infoData.getInformasiFilteredData('semua', '2025-01-01', '2025-06-30');
assert(filteredOutside.berita.length === 0, 'Filter tanggal di luar 2026 menghasilkan berita kosong');
assert(filteredOutside.pengumuman.length === 0, 'Filter tanggal di luar 2026 menghasilkan pengumuman kosong');

// -----------------------------------------------------------------------------
// 2. UJI INTEGRASI HTML
// -----------------------------------------------------------------------------
console.log("\n--- 2. Uji Integrasi Markup HTML ---");
const indexHtml = fs.readFileSync('index.html', 'utf8');
const bladeHtml = fs.readFileSync('pbb-p2/resources/views/welcome.blade.php', 'utf8');

assert(indexHtml.includes('id="menu-informasi"'), 'index.html memiliki #menu-informasi di sidebar');
assert(indexHtml.includes('id="viewInformasi"'), 'index.html memiliki #viewInformasi');
assert(indexHtml.includes('assets/informasi_data.js'), 'index.html memuat skrip assets/informasi_data.js');
assert(indexHtml.includes('data-tab="semua"') && indexHtml.includes('data-tab="berita"'), 'index.html memiliki tab filter Semua dan Berita');
assert(indexHtml.includes('id="infoDetailModal"'), 'index.html memiliki modal detail informasi');

assert(bladeHtml.includes('id="menu-informasi"'), 'welcome.blade.php memiliki #menu-informasi di sidebar');
assert(bladeHtml.includes('id="viewInformasi"'), 'welcome.blade.php memiliki #viewInformasi');
assert(bladeHtml.includes('assets/informasi_data.js'), 'welcome.blade.php memuat skrip assets/informasi_data.js');
assert(bladeHtml.includes('$isInformasi'), 'welcome.blade.php mendukung variabel $isInformasi');

// -----------------------------------------------------------------------------
// 3. UJI ROUTING LARAVEL (web.php)
// -----------------------------------------------------------------------------
console.log("\n--- 3. Uji Routing Laravel (web.php) ---");
const webPhp = fs.readFileSync('pbb-p2/routes/web.php', 'utf8');
assert(webPhp.includes("Route::get('/informasi'"), 'Route /informasi terdaftar di web.php');
assert(webPhp.includes("Route::get('/info'"), 'Route /info terdaftar di web.php');

// -----------------------------------------------------------------------------
// 4. UJI SIMULASI DOM & LOGIKA NAVIGASI DI JS/APP.JS
// -----------------------------------------------------------------------------
console.log("\n--- 4. Uji Simulasi DOM & Logika Navigasi di js/app.js ---");

class MockElement {
  constructor(tag, id = '') {
    this.tagName = tag.toUpperCase();
    this.id = id;
    this.children = [];
    this.parentNode = null;
    this.attributes = {};
    if (id) this.attributes['id'] = id;
    this.style = {};
    this.classList = {
      _classes: new Set(),
      add: (...cls) => cls.forEach(c => this.classList._classes.add(c)),
      remove: (...cls) => cls.forEach(c => this.classList._classes.delete(c)),
      toggle: (c) => this.classList._classes.has(c) ? this.classList._classes.delete(c) : this.classList._classes.add(c),
      contains: (c) => this.classList._classes.has(c)
    };
    this.listeners = {};
    this.textContent = '';
    this._innerHTML = '';
    this.value = '';
    this.dataset = {};
  }
  set innerHTML(val) {
    this._innerHTML = val;
    this.children = [];
  }
  get innerHTML() { return this._innerHTML || ''; }
  setAttribute(k, v) { this.attributes[k] = String(v); }
  getAttribute(k) { return this.attributes[k] !== undefined ? this.attributes[k] : null; }
  hasAttribute(k) { return this.attributes[k] !== undefined; }
  removeAttribute(k) { delete this.attributes[k]; }
  appendChild(child) {
    this.children.push(child);
    child.parentNode = this;
    return child;
  }
  get parentElement() {
    return this.parentNode;
  }
  contains(child) {
    if (!child) return false;
    if (child === this) return true;
    let curr = child.parentNode;
    while (curr) {
      if (curr === this) return true;
      curr = curr.parentNode;
    }
    return false;
  }
  addEventListener(event, fn) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(fn);
  }
  dispatchEvent(event) {
    const ev = typeof event === 'string' ? { type: event } : event;
    if (!ev.stopPropagation) ev.stopPropagation = () => {};
    if (!ev.preventDefault) ev.preventDefault = () => {};
    if (!ev.target) ev.target = this;
    const fns = this.listeners[ev.type] || [];
    fns.forEach(fn => fn(ev));
  }
  closest(sel) {
    let cur = this;
    while (cur) {
      if (cur.matches && cur.matches(sel)) return cur;
      cur = cur.parentNode;
    }
    return null;
  }
  matches(sel) {
    const parts = sel.split(',').map(s => s.trim());
    return parts.some(part => {
      if (part.startsWith('#')) return this.id === part.slice(1);
      if (part.startsWith('.')) return this.classList.contains(part.slice(1));
      if (part.startsWith('[') && part.endsWith(']')) {
        const attrExpr = part.slice(1, -1);
        if (attrExpr.includes('=')) {
          const [attr, val] = attrExpr.split('=');
          const cleanVal = val.replace(/['"]/g, '');
          if (attr.endsWith('*')) {
            const rawAttr = attr.slice(0, -1);
            return (this.getAttribute(rawAttr) || '').includes(cleanVal);
          }
          return this.getAttribute(attr) === cleanVal;
        }
        return this.hasAttribute(attrExpr);
      }
      if (part.toLowerCase() === this.tagName.toLowerCase()) return true;
      return false;
    });
  }
  querySelector(sel) {
    for (let c of this.children) {
      if (c.matches && c.matches(sel)) return c;
      const sub = c.querySelector(sel);
      if (sub && sub.id !== '') return sub;
    }
    const fallback = new MockElement('div');
    this.appendChild(fallback);
    return fallback;
  }
  querySelectorAll(sel) {
    let res = [];
    for (let c of this.children) {
      if (c.matches && c.matches(sel)) res.push(c);
      res = res.concat(c.querySelectorAll(sel));
    }
    return res;
  }
  scrollIntoView() {}
}

const idRegex = /id="([^"]+)"/g;
const allIds = new Set();
let match;
while ((match = idRegex.exec(indexHtml)) !== null) {
  allIds.add(match[1]);
}

function createEnvironment(initialHash = '', initialPathname = '/', bodyDataset = {}) {
  const elementsById = {};
  allIds.forEach(id => {
    elementsById[id] = new MockElement('div', id);
  });
  if (elementsById['viewKabupaten']) elementsById['viewKabupaten'].style.display = 'block';
  if (elementsById['viewKecamatan']) elementsById['viewKecamatan'].style.display = 'none';
  if (elementsById['viewPenggunaan']) elementsById['viewPenggunaan'].style.display = 'none';
  if (elementsById['viewInformasi']) elementsById['viewInformasi'].style.display = 'none';

  const menuDefinitions = [
    { id: 'menu-beranda', href: '#beranda', text: 'Beranda' },
    { id: 'menu-peta', href: '#peta', text: 'Peta PBB-P2', active: true },
    { id: 'menu-realisasi', href: '#realisasi', text: 'Realisasi & Target' },
    { id: 'menu-penggunaan', href: '#penggunaan', text: 'Penggunaan Pajak', dataView: 'penggunaan' },
    { id: 'menu-informasi', href: '#informasi', text: 'Informasi', dataView: 'informasi' },
  ];

  const sidebarNav = new MockElement('nav', 'sidebarNav');
  sidebarNav.classList.add('sidebar-menu');

  const createdMenuItems = menuDefinitions.map(m => {
    const a = new MockElement('a', m.id);
    a.classList.add('menu-item');
    if (m.active && !initialHash.includes('pengguna') && !initialHash.includes('informasi') && bodyDataset.initialView !== 'penggunaan' && bodyDataset.initialView !== 'informasi') {
      a.classList.add('active');
    }
    a.setAttribute('href', m.href);
    if (m.dataView) a.dataset.view = m.dataView;
    const span = new MockElement('span');
    span.textContent = m.text;
    a.appendChild(span);
    sidebarNav.appendChild(a);
    elementsById[m.id] = a;
    return a;
  });

  // Tab buttons
  const tabNames = ['semua', 'berita', 'pengumuman', 'regulasi', 'faq'];
  const createdTabBtns = tabNames.map(t => {
    const btn = new MockElement('button', 'tabBtn-' + t);
    btn.classList.add('info-tab-btn');
    if (t === 'semua') btn.classList.add('active');
    btn.setAttribute('data-tab', t);
    return btn;
  });

  const mockDocument = {
    getElementById: (id) => {
      if (!elementsById[id]) elementsById[id] = new MockElement('div', id);
      return elementsById[id];
    },
    createElement: (tag) => new MockElement(tag),
    createElementNS: (ns, tag) => new MockElement(tag),
    querySelector: (sel) => {
      if (sel.startsWith('#')) return mockDocument.getElementById(sel.slice(1));
      if (sel === 'a[href="#penggunaan"]') return elementsById['menu-penggunaan'];
      if (sel === 'a[href="#informasi"]') return elementsById['menu-informasi'];
      if (sel.includes('data-tab="')) {
        const tMatch = sel.match(/data-tab="([^"]+)"/);
        if (tMatch) return createdTabBtns.find(b => b.getAttribute('data-tab') === tMatch[1]) || null;
      }
      return new MockElement('div');
    },
    querySelectorAll: (sel) => {
      if (sel === '.menu-item') return createdMenuItems;
      if (sel === '.info-tab-btn') return createdTabBtns;
      return [];
    },
    addEventListener: (event, fn) => {
      if (!mockDocument.listeners[event]) mockDocument.listeners[event] = [];
      mockDocument.listeners[event].push(fn);
    },
    dispatchEvent: (event) => {
      const ev = typeof event === 'string' ? { type: event } : event;
      if (!ev.target) ev.target = mockDocument;
      const fns = mockDocument.listeners[ev.type] || [];
      fns.forEach(fn => fn(ev));
    },
    listeners: {},
    body: elementsById['body'] || new MockElement('body')
  };

  mockDocument.body.dataset = { ...bodyDataset };

  const mockWindow = {
    location: {
      hash: initialHash,
      pathname: initialPathname,
      search: '',
      href: 'http://localhost/pbb-p2-1/' + (initialHash ? initialHash : '')
    },
    addEventListener: (event, fn) => {
      if (!mockWindow.listeners[event]) mockWindow.listeners[event] = [];
      mockWindow.listeners[event].push(fn);
    },
    dispatchEvent: (event) => {
      const ev = typeof event === 'string' ? { type: event } : event;
      const fns = mockWindow.listeners[ev.type] || [];
      fns.forEach(fn => fn(ev));
    },
    listeners: {},
    scrollTo: () => {}
  };

  const sandbox = {
    window: mockWindow,
    document: mockDocument,
    console: console,
    Math: Math,
    setTimeout: (fn) => fn(),
    clearTimeout: () => {},
    setInterval: () => {},
    clearInterval: () => {},
    Number: Number,
    String: String,
    Array: Array,
    Object: Object,
    URLSearchParams: URLSearchParams,
    parseInt: parseInt,
    parseFloat: parseFloat,
    Date: Date
  };
  vm.createContext(sandbox);

  vm.runInContext(fs.readFileSync('assets/data.js', 'utf8').replace(/const /g, 'var '), sandbox);
  vm.runInContext(fs.readFileSync('assets/penggunaan_data.js', 'utf8').replace(/const /g, 'var '), sandbox);
  vm.runInContext(fs.readFileSync('assets/informasi_data.js', 'utf8').replace(/const /g, 'var '), sandbox);
  vm.runInContext(fs.readFileSync('js/app.js', 'utf8'), sandbox);

  // Trigger DOMContentLoaded
  mockDocument.dispatchEvent({ type: 'DOMContentLoaded' });

  return { mockWindow, mockDocument, elementsById, createdMenuItems, createdTabBtns };
}

// -------------------------------------------------------------
// TEST 1: Default Cold Load
// -------------------------------------------------------------
console.log("\n--- TEST 1: COLD LOAD KABUPATEN DEFAULT ---");
const env1 = createEnvironment('', '/');
const vKab1 = env1.elementsById['viewKabupaten'];
const vInfo1 = env1.elementsById['viewInformasi'];
const menuPeta1 = env1.elementsById['menu-peta'];
const menuInfo1 = env1.elementsById['menu-informasi'];

assert(vKab1.style.display === 'block', 'Default viewKabupaten tampil (block)');
assert(vInfo1.style.display === 'none', 'Default viewInformasi tersembunyi (none)');
assert(menuPeta1.classList.contains('active'), 'Menu Peta aktif saat cold load default');
assert(!menuInfo1.classList.contains('active'), 'Menu Informasi tidak aktif');

// -------------------------------------------------------------
// TEST 2: Klik Menu Informasi dari Sidebar
// -------------------------------------------------------------
console.log("\n--- TEST 2: KLIK MENU INFORMASI DARI SIDEBAR ---");
const spanInMenu = menuInfo1.children[0];

mockDocClick(env1, spanInMenu);

assert(vInfo1.style.display === 'block', 'Klik menu-informasi menampilkan #viewInformasi (display: block)');
assert(vInfo1.classList.contains('active'), '#viewInformasi berkelas .active');
assert(vKab1.style.display === 'none', '#viewKabupaten disembunyikan');
assert(menuInfo1.classList.contains('active'), '#menu-informasi berstatus .active');
assert(!menuPeta1.classList.contains('active'), '#menu-peta dinonaktifkan');
assert(env1.mockWindow.location.hash === '#informasi', 'Hash berganti menjadi #informasi');

// Check news content rendered
const beritaList = env1.elementsById['infoBeritaList'];
assert(beritaList.innerHTML.includes('Sosialisasi PBB-P2 di Kecamatan Tirtamulya'), 'Berita Tirtamulya dirender');
assert(beritaList.innerHTML.includes('Peningkatan Layanan Cek PBB Online'), 'Berita Layanan Cek Online dirender');
assert(beritaList.innerHTML.includes('Realisasi PBB-P2 Triwulan III Capai 76,6%'), 'Berita Realisasi Triwulan III dirender');

// Check pengumuman content rendered
const pengumumanList = env1.elementsById['infoPengumumanList'];
assert(pengumumanList.innerHTML.includes('Jadwal Pembayaran PBB-P2 Tahap IV Tahun 2026'), 'Pengumuman Tahap IV dirender');
assert(pengumumanList.innerHTML.includes('Perpanjangan Layanan Cek PBB Online'), 'Pengumuman Perpanjangan Layanan dirender');
assert(pengumumanList.innerHTML.includes('Himbauan Pembayaran PBB-P2 Tepat Waktu'), 'Pengumuman Himbauan dirender');

// Check regulasi content rendered
const regulasiList = env1.elementsById['infoRegulasiList'];
assert(regulasiList.innerHTML.includes('Perda Kab.Karawang No. 11 Tahun 2021'), 'Regulasi Perda 11 Tahun 2021 dirender');
assert(regulasiList.innerHTML.includes('Perbup Karawang No. 77 Tahun 2021'), 'Regulasi Perbup 77 Tahun 2021 dirender');
assert(regulasiList.innerHTML.includes('Peraturan Bupati tentang PBB-P2'), 'Regulasi Perbup PBB-P2 dirender');

// Check FAQ content rendered
const faqList = env1.elementsById['infoFaqList'];
assert(faqList.innerHTML.includes('Bagaimana cara cek PBB Online?'), 'FAQ Cara Cek PBB Online dirender');

// -------------------------------------------------------------
// TEST 3: Klik Tab Berita
// -------------------------------------------------------------
console.log("\n--- TEST 3: KLIK FILTER TAB BERITA ---");
const tabBeritaBtn = env1.createdTabBtns.find(b => b.getAttribute('data-tab') === 'berita');
mockDocClick(env1, tabBeritaBtn);

const layoutGrid = env1.elementsById['infoContentLayout'];
const fullscreenContainer = env1.elementsById['infoTabFullscreenContainer'];
const fullscreenTitle = env1.elementsById['infoFullscreenTitle'];

assert(layoutGrid.style.display === 'none', 'Grid 2-kolom disembunyikan saat masuk tab Berita');
assert(fullscreenContainer.style.display === 'flex', 'Kontainer fullscreen dibuka');
assert(fullscreenTitle.textContent === 'Daftar Berita PBB-P2', 'Judul fullscreen sesuai kategori Berita');
assert(tabBeritaBtn.classList.contains('active'), 'Tombol tab Berita berstatus .active');

// -------------------------------------------------------------
// TEST 4: Klik Kembali ke Semua
// -------------------------------------------------------------
console.log("\n--- TEST 4: KLIK KEMBALI KE SEMUA INFORMASI ---");
const btnBack = env1.elementsById['btnBackToSemua'];
mockDocClick(env1, btnBack);

assert(layoutGrid.style.display === 'grid', 'Grid 2-kolom ditampilkan kembali');
assert(fullscreenContainer.style.display === 'none', 'Kontainer fullscreen disembunyikan');

// -------------------------------------------------------------
// TEST 5: Tombol "Lihat Semua" pada Pengumuman
// -------------------------------------------------------------
console.log("\n--- TEST 5: TOMBOL LIHAT SEMUA PENGUMUMAN ---");
const btnViewAllPengumuman = env1.elementsById['btnLihatSemuaPengumuman'];
btnViewAllPengumuman.classList.add('info-btn-view-all');
btnViewAllPengumuman.setAttribute('data-target-tab', 'pengumuman');
mockDocClick(env1, btnViewAllPengumuman);

assert(fullscreenTitle.textContent === 'Daftar Pengumuman Resmi PBB-P2', 'Tombol Lihat Semua Pengumuman membuka fullscreen pengumuman');

// -------------------------------------------------------------
// TEST 6: FAQ Accordion Toggle
// -------------------------------------------------------------
console.log("\n--- TEST 6: FAQ ACCORDION INTERACTION ---");
// Switch back to semua
mockDocClick(env1, btnBack);

// Create accordion element click inside infoFaqList
const accordionItem = new MockElement('div');
accordionItem.classList.add('info-faq-accordion-item');
accordionItem.setAttribute('data-faq-id', 'faq-1');
const faqQBtn = new MockElement('button');
faqQBtn.classList.add('info-faq-question-btn');
accordionItem.appendChild(faqQBtn);
env1.elementsById['infoFaqList'].appendChild(accordionItem);

mockDocClick(env1, faqQBtn);
assert(accordionItem.classList.contains('is-open'), 'Klik pertanyaan FAQ membuka accordion (is-open)');
mockDocClick(env1, faqQBtn);
assert(!accordionItem.classList.contains('is-open'), 'Klik ulang pertanyaan FAQ menutup accordion');

// -------------------------------------------------------------
// TEST 7: Modal Detail Berita
// -------------------------------------------------------------
console.log("\n--- TEST 7: MODAL DETAIL BACA BERITA ---");
const beritaItem = new MockElement('div');
beritaItem.setAttribute('data-id', 'berita-1');
beritaItem.setAttribute('data-type', 'berita');
env1.elementsById['infoBeritaList'].appendChild(beritaItem);

mockDocClick(env1, beritaItem);
const modalEl = env1.elementsById['infoDetailModal'];
const modalTitle = env1.elementsById['infoModalBody'];
assert(modalEl.style.display === 'flex', 'Klik item berita membuka modal detail (display: flex)');
assert(modalTitle.innerHTML.includes('Sosialisasi PBB-P2 di Kecamatan Tirtamulya'), 'Modal memuat judul berita yang diklik');

// Close modal
const btnClose = env1.elementsById['btnInfoModalClose'];
btnClose.setAttribute('id', 'btnInfoModalClose');
mockDocClick(env1, btnClose);
assert(modalEl.style.display === 'none', 'Klik tombol close menutup modal detail');

// -------------------------------------------------------------
// TEST 8: Direct URL Access via Hash (#informasi)
// -------------------------------------------------------------
console.log("\n--- TEST 8: DIRECT HASH ROUTING (#informasi) ---");
const envHash = createEnvironment('#informasi', '/');
assert(envHash.elementsById['viewInformasi'].style.display === 'block', 'Direct hash #informasi langsung membuka #viewInformasi');
assert(envHash.elementsById['menu-informasi'].classList.contains('active'), 'Menu Informasi langsung aktif');
assert(envHash.elementsById['viewKabupaten'].style.display === 'none', 'View Kabupaten disembunyikan');

// -------------------------------------------------------------
// TEST 9: Navigasi Balik ke Peta & Penggunaan Pajak Tidak Rusak
// -------------------------------------------------------------
console.log("\n--- TEST 9: REGRESI VIEW LAIN (PETA & PENGGUNAAN PAJAK) ---");
const menuPeng = env1.elementsById['menu-penggunaan'];
mockDocClick(env1, menuPeng);
assert(env1.elementsById['viewPenggunaan'].style.display === 'block', 'Navigasi ke Penggunaan Pajak tetap berjalan');
assert(env1.elementsById['viewInformasi'].style.display === 'none', '#viewInformasi disembunyikan saat pindah ke Penggunaan');

const menuPeta = env1.elementsById['menu-peta'];
mockDocClick(env1, menuPeta);
assert(env1.elementsById['viewKabupaten'].style.display === 'block', 'Navigasi ke Peta PBB-P2 tetap berjalan');
assert(env1.elementsById['viewInformasi'].style.display === 'none', '#viewInformasi tetap tersembunyi');

console.log("\n======================================================================");
console.log(`HASIL AKHIR: ${passedTests} DARI ${totalTests} PENGUJIAN LULUS (${Math.round(passedTests/totalTests*100)}%)`);
console.log("======================================================================");

function mockDocClick(env, targetEl) {
  const ev = {
    type: 'click',
    target: targetEl,
    preventDefault: () => {},
    stopPropagation: () => {}
  };
  let curr = targetEl;
  while (curr) {
    curr.dispatchEvent(ev);
    curr = curr.parentNode;
  }
  env.mockDocument.dispatchEvent(ev);
}
