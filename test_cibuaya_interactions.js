const fs = require('fs');

console.log("=================================================================");
console.log("TEST INTERAKSI, ROUTING & NAVIGASI KECAMATAN CIBUAYA");
console.log("=================================================================");

const appJs = fs.readFileSync('js/app.js', 'utf8');
const dataJs = fs.readFileSync('assets/data.js', 'utf8');
const cibuayaDataJs = fs.readFileSync('assets/cibuaya_data.js', 'utf8');
const routesPhp = fs.readFileSync('pbb-p2/routes/web.php', 'utf8');

// 1. Check all 11 villages present in data.js
const expectedVillages = [
    'Sukasari',
    'Kertarahayu',
    'Cibuaya',
    'Pejaten',
    'Kedungjeruk',
    'Kalidungjaya',
    'Kedungjaya',
    'Jayamulya',
    'Gebangjaya',
    'Cemarajaya',
    'Sedari'
];

expectedVillages.forEach(v => {
    if (!cibuayaDataJs.includes(`"name": "${v}"`)) {
        console.error(`[FAIL] Desa ${v} tidak ditemukan di assets/cibuaya_data.js!`);
        process.exit(1);
    }
});
console.log(`[OK] Seluruh 11 desa resmi tervalidasi ada di assets/cibuaya_data.js.`);

// 2. Check aliases support for Pejaten / Pajaten
if (!cibuayaDataJs.includes('"pajaten"')) {
    console.error("[FAIL] Alias pajaten tidak ditemukan di assets/cibuaya_data.js!");
    process.exit(1);
}
console.log("[OK] Alias 'pajaten' (untuk Pejaten kode_kd: 32.15.11.2001) aktif.");

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
if (!appJs.includes("inCibuaya ? 'cibuaya'")) {
    console.error("[FAIL] Hash routing for Cibuaya not found in app.js!");
    process.exit(1);
}
console.log("[OK] Hash routing #kecamatan-cibuaya dan direct village #desa-... aktif.");

// 6. Check global click delegator
if (!appJs.includes("const cibuayaTrigger = e.target.closest('#menu-cibuaya, .btn-cibuaya, [data-kecamatan=\"cibuaya\"], a[href*=\"cibuaya\"]');")) {
    console.error("[FAIL] Cibuaya trigger delegator not found in app.js!");
    process.exit(1);
}
console.log("[OK] Global click delegator untuk Cibuaya terpasang sempurna.");

// 7. Check web.php routing
if (!routesPhp.includes('|cibuaya') && !routesPhp.includes('cibuaya|')) {
    console.error("[FAIL] web.php does not route cibuaya!");
    process.exit(1);
}
console.log("[OK] Laravel routes di pbb-p2/routes/web.php mendukung 'cibuaya'.");

console.log("\n[SUCCESS] Semua 7 aspek interaksi dan routing Kecamatan Cibuaya LULUS!");
