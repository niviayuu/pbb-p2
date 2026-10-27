const fs = require('fs');
const vm = require('vm');

console.log("========================================================");
console.log("UJI KOMPREHENSIF NAVIGASI & ROUTING PENGGUNAAN PAJAK");
console.log("========================================================");

// Extract all IDs and elements from index.html
const html = fs.readFileSync('index.html', 'utf8');

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
      add: (...classes) => classes.forEach(c => this.classList._classes.add(c)),
      remove: (...classes) => classes.forEach(c => this.classList._classes.delete(c)),
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
    return new MockElement('div');
  }
  querySelectorAll(sel) {
    return [];
  }
  scrollIntoView() {}
}

const idRegex = /id="([^"]+)"/g;
const allIds = new Set();
let match;
while ((match = idRegex.exec(html)) !== null) {
  allIds.add(match[1]);
}

function createEnvironment(initialHash = '', initialPathname = '/', bodyDataset = {}) {
  const elementsById = {};
  allIds.forEach(id => {
    elementsById[id] = new MockElement('div', id);
  });

  // Setup sidebar menu items
  const menuDefinitions = [
    { id: 'menu-beranda', href: '#beranda', text: 'Beranda' },
    { id: 'menu-peta', href: '#peta', text: 'Peta PBB-P2', active: true },
    { id: 'menu-realisasi', href: '#realisasi', text: 'Realisasi & Target' },
    { id: 'menu-penggunaan', href: '#penggunaan', text: 'Penggunaan Pajak', dataView: 'penggunaan' },
    { id: 'menu-informasi', href: '#informasi', text: 'Informasi' },
  ];

  const sidebarNav = new MockElement('nav', 'sidebarNav');
  sidebarNav.classList.add('sidebar-menu');

  const createdMenuItems = menuDefinitions.map(m => {
    const a = new MockElement('a', m.id);
    a.classList.add('menu-item');
    if (m.active && !initialHash.includes('pengguna') && bodyDataset.initialView !== 'penggunaan') {
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
      return new MockElement('div');
    },
    querySelectorAll: (sel) => {
      if (sel === '.menu-item') return createdMenuItems;
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
    Number: Number,
    String: String,
    Array: Array,
    Object: Object
  };
  vm.createContext(sandbox);

  vm.runInContext(fs.readFileSync('assets/data.js', 'utf8').replace(/const /g, 'var '), sandbox);
  vm.runInContext(fs.readFileSync('assets/penggunaan_data.js', 'utf8').replace(/const /g, 'var '), sandbox);
  vm.runInContext(fs.readFileSync('js/app.js', 'utf8'), sandbox);

  mockDocument.dispatchEvent({ type: 'DOMContentLoaded' });

  return { mockWindow, mockDocument, elementsById, createdMenuItems };
}

// -------------------------------------------------------------
// TEST 1: Default Cold Load -> Kabupaten View Active
// -------------------------------------------------------------
console.log("\n--- TEST 1: COLD LOAD KABUPATEN DEFAULT ---");
const env1 = createEnvironment('', '/');
const vKab1 = env1.elementsById['viewKabupaten'];
const vPeng1 = env1.elementsById['viewPenggunaan'];
const menuPeng1 = env1.elementsById['menu-penggunaan'];
const menuPeta1 = env1.elementsById['menu-peta'];

console.log(`[Tes 1.1] viewKabupaten.style.display = "${vKab1.style.display}" (harus 'block')`);
console.log(`[Tes 1.1] viewPenggunaan.style.display = "${vPeng1.style.display}" (harus 'none')`);
console.log(`[Tes 1.1] menuPeta active? ${menuPeta1.classList.contains('active')}`);
console.log(`[Tes 1.1] menuPenggunaan active? ${menuPeng1.classList.contains('active')}`);

if (vKab1.style.display !== 'block' || vPeng1.style.display !== 'none' || !menuPeta1.classList.contains('active') || menuPeng1.classList.contains('active')) {
  console.error("[FAIL] Test 1: Cold load kabupaten view tidak sesuai harapan!");
  process.exit(1);
}
console.log("[PASS] Test 1: Cold load default membuka Peta Kabupaten secara sempurna!");

// -------------------------------------------------------------
// TEST 2: Click Menu Penggunaan Pajak from Sidebar
// -------------------------------------------------------------
console.log("\n--- TEST 2: KLIK MENU PENGGUNAAN PAJAK ---");
// Simulate clicking the span child of the menu
const spanInMenu = menuPeng1.children[0];
const clickEv = {
  type: 'click',
  target: spanInMenu,
  preventDefault: () => {},
  stopPropagation: () => {}
};

// Dispatch click to menuPeng1 and document
menuPeng1.dispatchEvent(clickEv);
env1.mockDocument.dispatchEvent(clickEv);

console.log(`[Tes 2.1] viewKabupaten.style.display = "${vKab1.style.display}" (harus 'none')`);
console.log(`[Tes 2.1] viewPenggunaan.style.display = "${vPeng1.style.display}" (harus 'block')`);
console.log(`[Tes 2.1] viewPenggunaan has 'active' class? ${vPeng1.classList.contains('active')}`);
console.log(`[Tes 2.1] menuPenggunaan active? ${menuPeng1.classList.contains('active')}`);
console.log(`[Tes 2.1] location.hash = "${env1.mockWindow.location.hash}"`);

if (vPeng1.style.display !== 'block' || !vPeng1.classList.contains('active') || vKab1.style.display !== 'none' || !menuPeng1.classList.contains('active') || env1.mockWindow.location.hash !== '#penggunaan') {
  console.error("[FAIL] Test 2: Klik menu Penggunaan Pajak gagal memunculkan halaman!");
  process.exit(1);
}

// Check data rendering in cards
const elPenerimaan = env1.elementsById['pjTotalPenerimaan'];
const elPenggunaan = env1.elementsById['pjTotalPenggunaan'];
const elSisa = env1.elementsById['pjSisaDana'];
const donutPct = env1.elementsById['pjDonutPct'];

console.log(`[Tes 2.2] Total Penerimaan : "${elPenerimaan.textContent}"`);
console.log(`[Tes 2.2] Total Penggunaan : "${elPenggunaan.textContent}"`);
console.log(`[Tes 2.2] Sisa Dana        : "${elSisa.textContent}"`);
console.log(`[Tes 2.2] Persen Terserap  : "${donutPct.textContent}"`);

if (!elPenerimaan.textContent.includes('292.942.200.000') || !elPenggunaan.textContent.includes('247.560.800.000') || !elSisa.textContent.includes('45.381.400.000') || donutPct.textContent !== '84,5%') {
  console.error("[FAIL] Test 2: Data ringkasan tidak cocok dengan baseline yang diharapkan!");
  process.exit(1);
}
console.log("[PASS] Test 2: Klik menu Penggunaan Pajak menampilkan halaman lengkap beserta data valid!");

// -------------------------------------------------------------
// TEST 3: Switch from Penggunaan Pajak to Beranda and Back
// -------------------------------------------------------------
console.log("\n--- TEST 3: NAVIGASI KE BERANDA KEMUDIAN KEMBALI KE PENGGUNAAN PAJAK ---");
const menuBeranda1 = env1.elementsById['menu-beranda'];
const clickBeranda = { type: 'click', target: menuBeranda1, preventDefault: () => {}, stopPropagation: () => {} };
menuBeranda1.dispatchEvent(clickBeranda);
env1.mockDocument.dispatchEvent(clickBeranda);

console.log(`[Tes 3.1] Setelah klik Beranda:`);
console.log(`         viewKabupaten.style.display = "${vKab1.style.display}" (harus 'block')`);
console.log(`         viewPenggunaan.style.display = "${vPeng1.style.display}" (harus 'none')`);
console.log(`         menuPeta active? ${menuPeta1.classList.contains('active')}`);
console.log(`         menuPenggunaan active? ${menuPeng1.classList.contains('active')}`);

if (vKab1.style.display !== 'block' || vPeng1.style.display !== 'none' || menuPeng1.classList.contains('active')) {
  console.error("[FAIL] Test 3: Gagal kembali ke Beranda / Kabupaten!");
  process.exit(1);
}

// Kembali ke Penggunaan Pajak
menuPeng1.dispatchEvent(clickEv);
env1.mockDocument.dispatchEvent(clickEv);

console.log(`[Tes 3.2] Setelah klik kembali ke Penggunaan Pajak:`);
console.log(`         viewKabupaten.style.display = "${vKab1.style.display}" (harus 'none')`);
console.log(`         viewPenggunaan.style.display = "${vPeng1.style.display}" (harus 'block')`);
console.log(`         menuPenggunaan active? ${menuPeng1.classList.contains('active')}`);

if (vPeng1.style.display !== 'block' || !menuPeng1.classList.contains('active')) {
  console.error("[FAIL] Test 3: Gagal membuka kembali halaman Penggunaan Pajak!");
  process.exit(1);
}
console.log("[PASS] Test 3: Navigasi bolak-balik antara menu lain dan Penggunaan Pajak 100% stabil!");

// -------------------------------------------------------------
// TEST 4: Direct URL Access and Browser Refresh Simulation
// -------------------------------------------------------------
console.log("\n--- TEST 4: AKSES LANGSUNG MELALUI URL & REFRESH ---");

// 4.1 Access via hash #penggunaan
console.log("[Tes 4.1] Akses langsung URL '#penggunaan':");
const envHash = createEnvironment('#penggunaan', '/');
const vPengHash = envHash.elementsById['viewPenggunaan'];
const menuPengHash = envHash.elementsById['menu-penggunaan'];
console.log(`          viewPenggunaan.style.display = "${vPengHash.style.display}" (harus 'block')`);
console.log(`          menuPenggunaan active? ${menuPengHash.classList.contains('active')}`);
if (vPengHash.style.display !== 'block' || !menuPengHash.classList.contains('active')) {
  console.error("[FAIL] Tes 4.1: Akses via URL hash '#penggunaan' gagal!");
  process.exit(1);
}
console.log("[PASS] Tes 4.1: Akses langsung hash '#penggunaan' sukses!");

// 4.2 Access via hash #penggunaan-pajak
console.log("[Tes 4.2] Akses langsung URL '#penggunaan-pajak':");
const envHashSlug = createEnvironment('#penggunaan-pajak', '/');
const vPengHashSlug = envHashSlug.elementsById['viewPenggunaan'];
const menuPengHashSlug = envHashSlug.elementsById['menu-penggunaan'];
if (vPengHashSlug.style.display !== 'block' || !menuPengHashSlug.classList.contains('active')) {
  console.error("[FAIL] Tes 4.2: Akses via URL hash '#penggunaan-pajak' gagal!");
  process.exit(1);
}
console.log("[PASS] Tes 4.2: Akses langsung hash '#penggunaan-pajak' sukses!");

// 4.3 Access via Laravel Path /penggunaan-pajak (cold load)
console.log("[Tes 4.3] Akses langsung Laravel route '/penggunaan-pajak':");
const envLaravelPath = createEnvironment('', '/pbb-p2/public/penggunaan-pajak', { initialView: 'penggunaan' });
const vPengLaravel = envLaravelPath.elementsById['viewPenggunaan'];
const menuPengLaravel = envLaravelPath.elementsById['menu-penggunaan'];
console.log(`          viewPenggunaan.style.display = "${vPengLaravel.style.display}" (harus 'block')`);
console.log(`          menuPenggunaan active? ${menuPengLaravel.classList.contains('active')}`);
if (vPengLaravel.style.display !== 'block' || !menuPengLaravel.classList.contains('active')) {
  console.error("[FAIL] Tes 4.3: Akses via Laravel route '/penggunaan-pajak' gagal!");
  process.exit(1);
}
console.log("[PASS] Tes 4.3: Akses via Laravel route '/penggunaan-pajak' sukses!");

// -------------------------------------------------------------
// TEST 5: Backward-compatibility with #menu-pengguna ID
// -------------------------------------------------------------
console.log("\n--- TEST 5: KOMPATIBILITAS SELEKTOR DUAL ID (#menu-pengguna & #menu-penggunaan) ---");
const envDual = createEnvironment('', '/');
// Simulate legacy element with id="menu-pengguna"
const legacyMenuPengguna = new MockElement('a', 'menu-pengguna');
legacyMenuPengguna.classList.add('menu-item');
legacyMenuPengguna.setAttribute('href', '#penggunaan');
envDual.elementsById['menu-pengguna'] = legacyMenuPengguna;

const legacyClickEv = { type: 'click', target: legacyMenuPengguna, preventDefault: () => {}, stopPropagation: () => {} };
envDual.mockDocument.dispatchEvent(legacyClickEv);

const vPengDual = envDual.elementsById['viewPenggunaan'];
console.log(`          viewPenggunaan.style.display = "${vPengDual.style.display}" (harus 'block')`);
if (vPengDual.style.display !== 'block') {
  console.error("[FAIL] Tes 5: Trigger dengan legacy ID '#menu-pengguna' gagal!");
  process.exit(1);
}
console.log("[PASS] Tes 5: Kompatibilitas dual ID '#menu-penggunaan' dan '#menu-pengguna' berhasil mutlak!");

console.log("\n========================================================");
console.log("SEMUA PENGUJIAN NAVIGASI PENGGUNAAN PAJAK LULUS 100%!");
console.log("========================================================");
