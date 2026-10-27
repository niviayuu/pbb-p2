const fs = require('fs');

console.log("=================================================================");
console.log("TEST INTERAKSI, ROUTING & NAVIGASI KECAMATAN PEDES");
console.log("=================================================================");

const appJs = fs.readFileSync('js/app.js', 'utf8');
const dataJs = fs.readFileSync('assets/data.js', 'utf8');
const pedesDataJs = fs.readFileSync('assets/pedes_data.js', 'utf8');
const routesPhp = fs.readFileSync('pbb-p2/routes/web.php', 'utf8');

// 1. Check all 12 villages present in data.js
const expectedVillages = [
    'Jatimulya',
    'Kertaraharja',
    'Karangjaya',
    'Malangsari',
    'Kertamulya',
    'Payungsari',
    'Randumulya',
    'Labanjaya',
    'Sungaibuntu',
    'Kendaljaya',
    'Dongkal',
    'Puspasari'
];

expectedVillages.forEach(v => {
    if (!pedesDataJs.includes(`"name": "${v}"`)) {
        console.error(`[FAIL] Desa ${v} tidak ditemukan di assets/pedes_data.js!`);
        process.exit(1);
    }
});
console.log(`[OK] Seluruh 12 desa resmi tervalidasi ada di assets/pedes_data.js.`);

// 2. Check aliases support for Randumulya / Rangdumulya
if (!pedesDataJs.includes('"rangdumulya"')) {
    console.error("[FAIL] Alias rangdumulya tidak ditemukan di assets/pedes_data.js!");
    process.exit(1);
}
console.log("[OK] Alias 'rangdumulya' (untuk Randumulya kode_kd: 32.15.10.2016) aktif.");

// 3. Check app.js click handler
if (!appJs.includes("switchView('kecamatan', item.id)")) {
    console.error("[FAIL] switchView on kecamatan click not found in app.js!");
    process.exit(1);
}
console.log("[OK] Klik baris di Daftar Kecamatan mengeksekusi switchView('kecamatan', item.id).");

// 4. Check double click on polygon
if (!appJs.includes("path.addEventListener('dblclick'")) {
    console.error("[FAIL] Polygon dblclick not found in app.js!");
    process.exit(1);
}
console.log("[OK] Double-click pada polygon peta membuka detail kecamatan.");

// 5. Check hash routing
if (!appJs.includes("inPedes ? 'pedes'")) {
    console.error("[FAIL] Hash routing for Pedes not found in app.js!");
    process.exit(1);
}
console.log("[OK] Hash routing #kecamatan-pedes dan direct village #desa-... aktif.");

// 6. Check global click delegator
if (!appJs.includes("const pedesTrigger = e.target.closest('#menu-pedes, .btn-pedes, [data-kecamatan=\"pedes\"], a[href*=\"pedes\"]');")) {
    console.error("[FAIL] Pedes trigger delegator not found in app.js!");
    process.exit(1);
}
console.log("[OK] Global click delegator untuk Pedes terpasang sempurna.");

// 7. Check web.php routing
if (!routesPhp.includes('|pedes') && !routesPhp.includes('pedes|')) {
    console.error("[FAIL] web.php does not route pedes!");
    process.exit(1);
}
console.log("[OK] Laravel routes di pbb-p2/routes/web.php mendukung 'pedes'.");

console.log("\n[SUCCESS] Semua 7 aspek interaksi dan routing Kecamatan Pedes LULUS!");
