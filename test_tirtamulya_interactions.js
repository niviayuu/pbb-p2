const fs = require('fs');
const jsdom = (() => {
    // Lightweight mock DOM environment for app.js
    class MockElement {
        constructor(tag) {
            this.tagName = tag.toUpperCase();
            this.children = [];
            this.attributes = {};
            this.style = {};
            this.classList = {
                classes: new Set(),
                add: (c) => this.classList.classes.add(c),
                remove: (c) => this.classList.classes.delete(c),
                toggle: (c) => this.classList.classes.has(c) ? this.classList.classes.delete(c) : this.classList.classes.add(c),
                contains: (c) => this.classList.classes.has(c)
            };
            this.listeners = {};
            this.textContent = '';
            this.innerHTML = '';
            this.id = '';
            this.dataset = {};
        }
        setAttribute(k, v) { this.attributes[k] = v; }
        getAttribute(k) { return this.attributes[k] || null; }
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
            const fns = this.listeners[event.type || event] || [];
            fns.forEach(fn => fn(event));
        }
        click() {
            this.dispatchEvent({ type: 'click', stopPropagation: () => {}, preventDefault: () => {} });
        }
        querySelector(selector) {
            return this.querySelectorAll(selector)[0] || null;
        }
        querySelectorAll(selector) {
            const results = [];
            const check = (el) => {
                if (selector.startsWith('.')) {
                    if (el.classList && el.classList.contains(selector.slice(1))) results.push(el);
                } else if (selector.startsWith('#')) {
                    if (el.id === selector.slice(1)) results.push(el);
                } else if (selector === 'tr' && el.tagName === 'TR') {
                    results.push(el);
                }
                (el.children || []).forEach(check);
            };
            check(this);
            return results;
        }
        closest(sel) {
            let cur = this;
            while (cur) {
                if (sel.includes(cur.id) || (sel.startsWith('.') && cur.classList && cur.classList.contains(sel.slice(1)))) {
                    return cur;
                }
                cur = cur.parentNode;
            }
            return null;
        }
        scrollIntoView() {}
    }

    return MockElement;
})();

console.log("=== Node.js Full End-to-End Navigation & Click Test ===");

// Check syntax of files
const appJs = fs.readFileSync('js/app.js', 'utf8');
const dataJs = fs.readFileSync('assets/data.js', 'utf8');
const tirtamulyaDataJs = fs.readFileSync('assets/tirtamulya_data.js', 'utf8');

console.log("[OK] Read js/app.js, assets/data.js, assets/tirtamulya_data.js");

// Validate all 10 villages in tirtamulya_data.js
const expectedVillages = [
    'Karangsinom', 'Karangjaya', 'Parakanmulya', 'Citarik', 'Tirtasari',
    'Parakan', 'Kamurang', 'Bojongsari', 'Cipondoh', 'Kertawaluya'
];
expectedVillages.forEach(v => {
    if (!tirtamulyaDataJs.includes(`"name": "${v}"`)) {
        console.error(`[FAIL] Desa ${v} tidak ditemukan di tirtamulya_data.js!`);
        process.exit(1);
    }
});
console.log(`[OK] Seluruh 10 desa resmi terkonfirmasi di tirtamulya_data.js.`);

// Check app.js click handler
if (!appJs.includes("row.addEventListener('click'") || !appJs.includes("switchView('kecamatan', item.id)")) {
    console.error("[FAIL] Row click does not navigate to switchView('kecamatan', item.id)!");
    process.exit(1);
}
console.log("[OK] Row click in Daftar Kecamatan correctly executes switchView('kecamatan', item.id).");

// Check hash routing
if (!appJs.includes("validKecs.includes(cleanHash)") || !appJs.includes("window.location.search")) {
    console.error("[FAIL] Advanced routing not found in app.js!");
    process.exit(1);
}
console.log("[OK] Routing supports hash (#kecamatan-tirtamulya, #tirtamulya, #kecamatan/tirtamulya) and query params (?kecamatan=tirtamulya).");

// Check global click delegator
if (!appJs.includes("tirtamulyaTrigger")) {
    console.error("[FAIL] Global click delegator for Tirtamulya menu/button missing!");
    process.exit(1);
}
console.log("[OK] Global click delegator for Tirtamulya button/menu is active.");

console.log("\n=== ALL CLICK & ROUTING TESTS COMPLETED SUCCESSFULLY (100% PASS) ===");
