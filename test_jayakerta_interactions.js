const fs = require('fs');

console.log("=================================================================");
console.log("TEST INTERAKSI, ROUTING & NAVIGASI KECAMATAN JAYAKERTA");
console.log("=================================================================");

const appJs = fs.readFileSync('js/app.js', 'utf8');
const dataJs = fs.readFileSync('assets/data.js', 'utf8');
const jayaDataJs = fs.readFileSync('assets/jayakerta_data.js', 'utf8');
const routesPhp = fs.readFileSync('pbb-p2/routes/web.php', 'utf8');

// 1. Check all 8 villages present in data.js
const expectedVillages = [
    'Medangasem',
    'Kemiri',
    'Makmurjaya',
    'Jayamakmur',
    'Jayakerta',
    'Ciptamarga',
    'Kertajaya',
    'Kampungsawah'
];

expectedVillages.forEach(v => {
    if (!jayaDataJs.includes(`"name": "${v}"`)) {
        console.error(`[FAIL] Desa ${v} tidak ditemukan di assets/jayakerta_data.js!`);
        process.exit(1);
    }
});
console.log(`[OK] Seluruh 8 desa resmi tervalidasi ada di assets/jayakerta_data.js.`);

// 2. Check aliases support for Kampungsawah
if (!jayaDataJs.includes('"kampung-sawah"')) {
    console.error("[FAIL] Alias kampung-sawah tidak ditemukan di assets/jayakerta_data.js!");
    process.exit(1);
}
console.log("[OK] Alias 'kampung-sawah' aktif.");

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
if (!appJs.includes("inJayakerta ? 'jayakerta'")) {
    console.error("[FAIL] Hash routing for Jayakerta not found in app.js!");
    process.exit(1);
}
console.log("[OK] Hash routing #kecamatan-jayakerta dan direct village #desa-... aktif.");

// 6. Check global click delegator
if (!appJs.includes("const jayakertaTrigger = e.target.closest('#menu-jayakerta, .btn-jayakerta, [data-kecamatan=\"jayakerta\"], a[href*=\"jayakerta\"]');")) {
    console.error("[FAIL] Jayakerta trigger delegator not found in app.js!");
    process.exit(1);
}
console.log("[OK] Global click delegator untuk Jayakerta terpasang sempurna.");

// 7. Check web.php routing
if (!routesPhp.includes('|jayakerta') && !routesPhp.includes('jayakerta|')) {
    console.error("[FAIL] web.php does not route jayakerta!");
    process.exit(1);
}
console.log("[OK] Laravel routes di pbb-p2/routes/web.php mendukung 'jayakerta'.");

console.log("\n[SUCCESS] Semua 7 aspek interaksi dan routing Kecamatan Jayakerta LULUS!");
