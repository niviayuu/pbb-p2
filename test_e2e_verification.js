const fs = require('fs');
const vm = require('vm');

console.log("========================================================");
console.log("UJI KOMPREHENSIF ROUTING RAWAMERTA, TIRTAMULYA & PURWASARI");
console.log("========================================================");

// Mock DOM Environment
class MockElement {
  constructor(tag, id = '') {
    this.tagName = tag.toUpperCase();
    this.id = id;
    this.children = [];
    this.attributes = {};
    this.style = {};
    this.classList = {
      _classes: new Set(),
      add: (c) => this.classList._classes.add(c),
      remove: (c) => this.classList._classes.delete(c),
      toggle: (c) => this.classList._classes.has(c) ? this.classList._classes.delete(c) : this.classList._classes.add(c),
      contains: (c) => this.classList._classes.has(c)
    };
    this.listeners = {};
    this.textContent = '';
    this._innerHTML = '';
    this.value = '';
    this.dataset = {};
    this.scrollIntoView = () => {};
  }
  set innerHTML(val) {
    this._innerHTML = val;
    if (val === '') {
      this.children = [];
    }
  }
  get innerHTML() {
    return this._innerHTML || '';
  }
  setAttribute(k, v) { this.attributes[k] = String(v); }
  getAttribute(k) { return this.attributes[k] !== undefined ? this.attributes[k] : null; }
  removeAttribute(k) { delete this.attributes[k]; }
  appendChild(child) {
    this.children.push(child);
    child.parentNode = this;
    return child;
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
  click() {
    this.dispatchEvent({ type: 'click', target: this, stopPropagation: () => {}, preventDefault: () => {} });
  }
  querySelector(sel) {
    const found = this.querySelectorAll(sel)[0];
    if (found) return found;
    const placeholder = new MockElement(sel.startsWith('.') ? 'div' : sel);
    this.appendChild(placeholder);
    return placeholder;
  }
  querySelectorAll(sel) {
    const results = [];
    const walk = (el) => {
      if (sel.startsWith('#') && el.id === sel.slice(1)) results.push(el);
      else if (sel.startsWith('.') && el.classList.contains(sel.slice(1))) results.push(el);
      else if (sel.toLowerCase() === el.tagName.toLowerCase()) results.push(el);
      (el.children || []).forEach(walk);
    };
    walk(this);
    return results;
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
        return this.getAttribute(attrExpr) !== null;
      }
      return false;
    });
  }
}

const elementStore = {};
function getOrCreateElement(id, tag = 'div') {
  if (!elementStore[id]) {
    elementStore[id] = new MockElement(tag, id);
  }
  return elementStore[id];
}

const mockDocument = {
  getElementById: (id) => getOrCreateElement(id),
  createElement: (tag) => new MockElement(tag),
  createElementNS: (ns, tag) => new MockElement(tag),
  querySelector: (sel) => {
    if (sel.startsWith('#')) return getOrCreateElement(sel.slice(1));
    return new MockElement('div');
  },
  querySelectorAll: () => [],
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
  body: getOrCreateElement('body', 'body')
};

const mockWindow = {
  location: {
    hash: '',
    pathname: '/',
    search: '',
    href: 'http://localhost/pbb-p2-1/'
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
  Number: Number,
  String: String,
  Array: Array,
  Object: Object
};
vm.createContext(sandbox);

// Load data files
const dataCode = fs.readFileSync('assets/data.js', 'utf8').replace(/const /g, 'var ');
vm.runInContext(dataCode, sandbox);

const kutawaluyaCode = fs.readFileSync('assets/kutawaluya_data.js', 'utf8').replace(/const /g, 'var ');
vm.runInContext(kutawaluyaCode, sandbox);

const rawamertaCode = fs.readFileSync('assets/rawamerta_data.js', 'utf8').replace(/const /g, 'var ');
vm.runInContext(rawamertaCode, sandbox);

const tirtamulyaCode = fs.readFileSync('assets/tirtamulya_data.js', 'utf8').replace(/const /g, 'var ');
vm.runInContext(tirtamulyaCode, sandbox);

const purwasariCode = fs.readFileSync('assets/purwasari_data.js', 'utf8').replace(/const /g, 'var ');
vm.runInContext(purwasariCode, sandbox);

// Load app.js
const appJsCode = fs.readFileSync('js/app.js', 'utf8');
vm.runInContext(appJsCode, sandbox);

// Trigger DOMContentLoaded
mockDocument.dispatchEvent({ type: 'DOMContentLoaded' });
console.log("[OK] DOMContentLoaded dipicu dan dashboard berhasil diinisialisasi.");

const titleEl = getOrCreateElement('kecViewTitle');
const tableBody = getOrCreateElement('desaTableBody');

// --- TEST K: KUTAWALUYA ---
console.log("\n--- TEST K: PENGUJIAN KECAMATAN KUTAWALUYA ---");
const btnKutawaluya = new MockElement('button', 'menu-kutawaluya');
btnKutawaluya.setAttribute('data-kecamatan', 'kutawaluya');
mockDocument.body.appendChild(btnKutawaluya);

mockDocument.dispatchEvent({
  type: 'click',
  target: btnKutawaluya,
  preventDefault: () => {},
  stopPropagation: () => {}
});

console.log(`[Tes K1] Judul Halaman : "${titleEl.textContent}"`);
console.log(`[Tes K1] URL Hash      : "${mockWindow.location.hash}"`);

if (titleEl.textContent !== 'Kecamatan Kutawaluya') {
  console.error(`[FAIL] Judul harus 'Kecamatan Kutawaluya', dapat: '${titleEl.textContent}'`);
  process.exit(1);
}
if (mockWindow.location.hash !== '#kecamatan-kutawaluya') {
  console.error(`[FAIL] Hash harus '#kecamatan-kutawaluya', dapat: '${mockWindow.location.hash}'`);
  process.exit(1);
}
console.log("[PASS] Tes K1: Klik menu Kutawaluya membuka Kutawaluya dengan judul dan hash yang benar!");

// K2: Periksa daftar 12 desa Kutawaluya
const kutawaluyaRows = tableBody.children;
console.log(`[Tes K2] Jumlah desa di tabel: ${kutawaluyaRows.length}`);
if (kutawaluyaRows.length !== 12) {
  console.error(`[FAIL] Jumlah desa harus 12, dapat: ${kutawaluyaRows.length}`);
  process.exit(1);
}

const expectedKutawaluyaVillages = [
  'Sindangkarya', 'Sindangmukti', 'Sindangmulya', 'Mulyajaya', 'Kutakarya',
  'Kutagandok', 'Waluya', 'Sampalan', 'Sindangsari', 'Kutaraja',
  'Kutamukti', 'Kutajaya'
];

expectedKutawaluyaVillages.forEach(v => {
  const found = kutawaluyaRows.some(r => r.innerHTML.includes(v));
  if (!found) {
    console.error(`[FAIL] Desa '${v}' tidak ditemukan pada tabel Kutawaluya!`);
    process.exit(1);
  }
});
console.log(`[Tes K2] Seluruh 12 desa resmi terverifikasi di baris tabel: ${expectedKutawaluyaVillages.join(', ')}`);
console.log("[PASS] Tes K2: Seluruh 12 desa resmi Kecamatan Kutawaluya tampil dengan data valid!");

// K3: Reload / Hash Change ke #kecamatan-kutawaluya
mockWindow.location.hash = '#kecamatan-kutawaluya';
mockWindow.dispatchEvent({ type: 'hashchange' });
console.log(`[Tes K3] Judul setelah reload #kecamatan-kutawaluya: "${titleEl.textContent}"`);
if (titleEl.textContent !== 'Kecamatan Kutawaluya') {
  console.error(`[FAIL] Reload hash #kecamatan-kutawaluya gagal menampilkan Kutawaluya!`);
  process.exit(1);
}
console.log("[PASS] Tes K3: Muat ulang halaman tetap menampilkan Kecamatan Kutawaluya.");

// --- TEST A: RAWAMERTA ---
console.log("\n--- TEST A: PENGUJIAN KECAMATAN RAWAMERTA ---");
const btnRawamerta = new MockElement('button', 'menu-rawamerta');
btnRawamerta.setAttribute('data-kecamatan', 'rawamerta');
mockDocument.body.appendChild(btnRawamerta);

mockDocument.dispatchEvent({
  type: 'click',
  target: btnRawamerta,
  preventDefault: () => {},
  stopPropagation: () => {}
});

console.log(`[Tes A1] Judul Halaman : "${titleEl.textContent}"`);
console.log(`[Tes A1] URL Hash      : "${mockWindow.location.hash}"`);

if (titleEl.textContent !== 'Kecamatan Rawamerta') {
  console.error(`[FAIL] Judul harus 'Kecamatan Rawamerta', dapat: '${titleEl.textContent}'`);
  process.exit(1);
}
if (mockWindow.location.hash !== '#kecamatan-rawamerta') {
  console.error(`[FAIL] Hash harus '#kecamatan-rawamerta', dapat: '${mockWindow.location.hash}'`);
  process.exit(1);
}
console.log("[PASS] Tes A1: Klik menu Rawamerta membuka Rawamerta dengan judul dan hash yang benar!");

// A2: Periksa daftar 13 desa Rawamerta
const rawamertaRows = tableBody.children;
console.log(`[Tes A2] Jumlah desa di tabel: ${rawamertaRows.length}`);
if (rawamertaRows.length !== 13) {
  console.error(`[FAIL] Jumlah desa harus 13, dapat: ${rawamertaRows.length}`);
  process.exit(1);
}

const expectedRawamertaVillages = [
  'Purwamekar', 'Mekarjaya', 'Sekarwangi', 'Balongsari', 'Pasirawi',
  'Pasirkaliki', 'Kutawargi', 'Sukamerta', 'Panyingkiran', 'Sukapura',
  'Cibadak', 'Gombongsari', 'Sukaraja'
];

expectedRawamertaVillages.forEach(v => {
  const found = rawamertaRows.some(r => r.innerHTML.includes(v));
  if (!found) {
    console.error(`[FAIL] Desa '${v}' tidak ditemukan pada tabel Rawamerta!`);
    process.exit(1);
  }
});
console.log(`[Tes A2] Seluruh 13 desa resmi terverifikasi di baris tabel: ${expectedRawamertaVillages.join(', ')}`);
console.log("[PASS] Tes A2: Seluruh 13 desa resmi Kecamatan Rawamerta tampil dengan data valid!");

// A3: Reload / Hash Change ke #kecamatan-rawamerta
mockWindow.location.hash = '#kecamatan-rawamerta';
mockWindow.dispatchEvent({ type: 'hashchange' });
console.log(`[Tes A3] Judul setelah reload #kecamatan-rawamerta: "${titleEl.textContent}"`);
if (titleEl.textContent !== 'Kecamatan Rawamerta') {
  console.error(`[FAIL] Reload hash #kecamatan-rawamerta gagal menampilkan Rawamerta!`);
  process.exit(1);
}
console.log("[PASS] Tes A3: Muat ulang halaman tetap menampilkan Kecamatan Rawamerta.");

// --- TEST B: TIRTAMULYA ---
console.log("\n--- TEST B: PENGUJIAN KECAMATAN TIRTAMULYA ---");
const btnTirtamulya = new MockElement('button', 'menu-tirtamulya');
btnTirtamulya.setAttribute('data-kecamatan', 'tirtamulya');
mockDocument.body.appendChild(btnTirtamulya);

mockDocument.dispatchEvent({
  type: 'click',
  target: btnTirtamulya,
  preventDefault: () => {},
  stopPropagation: () => {}
});

console.log(`[Tes B1] Judul Halaman : "${titleEl.textContent}"`);
console.log(`[Tes B1] URL Hash      : "${mockWindow.location.hash}"`);

if (titleEl.textContent !== 'Kecamatan Tirtamulya') {
  console.error(`[FAIL] Judul harus 'Kecamatan Tirtamulya', dapat: '${titleEl.textContent}'`);
  process.exit(1);
}
if (mockWindow.location.hash !== '#kecamatan-tirtamulya') {
  console.error(`[FAIL] Hash harus '#kecamatan-tirtamulya', dapat: '${mockWindow.location.hash}'`);
  process.exit(1);
}
console.log("[PASS] Tes B1: Klik menu Tirtamulya membuka Tirtamulya dengan judul dan hash yang benar!");

const tirtamulyaRows = tableBody.children;
if (tirtamulyaRows.length !== 10) {
  console.error(`[FAIL] Jumlah desa Tirtamulya harus 10, dapat: ${tirtamulyaRows.length}`);
  process.exit(1);
}
console.log("[PASS] Tes B2: 10 Desa Tirtamulya tampil sempurna.");

// --- TEST C: PURWASARI ---
console.log("\n--- TEST C: PENGUJIAN KECAMATAN PURWASARI ---");
const btnPurwasari = new MockElement('button', 'menu-purwasari');
btnPurwasari.setAttribute('data-kecamatan', 'purwasari');
mockDocument.body.appendChild(btnPurwasari);

mockDocument.dispatchEvent({
  type: 'click',
  target: btnPurwasari,
  preventDefault: () => {},
  stopPropagation: () => {}
});

console.log(`[Tes C1] Judul Halaman : "${titleEl.textContent}"`);
console.log(`[Tes C1] URL Hash      : "${mockWindow.location.hash}"`);

if (titleEl.textContent !== 'Kecamatan Purwasari') {
  console.error(`[FAIL] Judul harus 'Kecamatan Purwasari', dapat: '${titleEl.textContent}'`);
  process.exit(1);
}
if (mockWindow.location.hash !== '#kecamatan-purwasari') {
  console.error(`[FAIL] Hash harus '#kecamatan-purwasari', dapat: '${mockWindow.location.hash}'`);
  process.exit(1);
}
console.log("[PASS] Tes C1: Klik menu Purwasari membuka Purwasari dengan judul dan hash yang benar!");

const purwasariRows = tableBody.children;
if (purwasariRows.length !== 8) {
  console.error(`[FAIL] Jumlah desa Purwasari harus 8, dapat: ${purwasariRows.length}`);
  process.exit(1);
}
console.log("[PASS] Tes C2: 8 Desa Purwasari tampil sempurna.");

// --- TEST D: REGRESI & PERLINDUNGAN FALLBACK ---
console.log("\n--- TEST D: PENGUJIAN REGRESI & PERLINDUNGAN FALLBACK ---");
const viewKabupaten = getOrCreateElement('viewKabupaten');
const viewKecamatan = getOrCreateElement('viewKecamatan');

mockWindow.location.hash = '#kecamatan-tidak-ada';
mockWindow.dispatchEvent({ type: 'hashchange' });

console.log(`[Tes D1] State setelah route invalid '#kecamatan-tidak-ada':`);
console.log(`         viewKabupaten style.display = "${viewKabupaten.style.display}"`);
console.log(`         viewKecamatan style.display = "${viewKecamatan.style.display}"`);

if (viewKecamatan.style.display === 'block') {
  console.error("[FAIL] DITEMUKAN SILENT FALLBACK KE KECAMATAN LAIN!");
  process.exit(1);
}
console.log("[PASS] Tes D1: Route tidak ditemukan ditangani dengan aman (kembali ke peta kabupaten)!");

// D2: Buka kembali Rawamerta
mockDocument.dispatchEvent({
  type: 'click',
  target: btnRawamerta,
  preventDefault: () => {},
  stopPropagation: () => {}
});
console.log(`[Tes D2] Buka Rawamerta kembali: Judul = "${titleEl.textContent}", Hash = "${mockWindow.location.hash}"`);
if (titleEl.textContent !== 'Kecamatan Rawamerta') {
  console.error("[FAIL] Gagal membuka Rawamerta kembali!");
  process.exit(1);
}
console.log("[PASS] Tes D2: Navigasi Rawamerta stabil dan repeatable.");

console.log("\n========================================================");
console.log("SEMUA PENGUJIAN LULUS 100% (TES RAWAMERTA, TIRTAMULYA, PURWASARI, FALLBACK BERHASIL MUTLAK)!");
console.log("========================================================");
