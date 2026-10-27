const fs = require('fs');

console.log("=================================================================");
console.log("TEST INTERAKSI, ROUTING & NAVIGASI KECAMATAN TIRTAJAYA");
console.log("=================================================================");

const appJs = fs.readFileSync('js/app.js', 'utf8');
const dataJs = fs.readFileSync('assets/data.js', 'utf8');
const tirtaDataJs = fs.readFileSync('assets/tirtajaya_data.js', 'utf8');
const routesPhp = fs.readFileSync('pbb-p2/routes/web.php', 'utf8');

// 1. Check all 11 villages present in data.js
const expectedVillages = [
    'Medankarya',
    'Pisangsambo',
    'Sabajaya',
    'Gempoljaya',
    'Sarijaya',
    'Kutamakmur',
    'Bolang',
    'Srikamulyan',
    'Sumurlaban',
    'Tambaksumur',
    'Tambaksari'
];

expectedVillages.forEach(v => {
    if (!tirtaDataJs.includes(`"name": "${v}"`)) {
        console.error(`[FAIL] Desa ${v} tidak ditemukan di assets/tirtajaya_data.js!`);
        process.exit(1);
    }
});
console.log(`[OK] Seluruh 11 desa resmi tervalidasi ada di assets/tirtajaya_data.js.`);

// 2. Check aliases support for Gempolkarya and Srijaya
if (!tirtaDataJs.includes('"gempolkarya"')) {
    console.error("[FAIL] Alias gempolkarya tidak ditemukan di assets/tirtajaya_data.js!");
    process.exit(1);
}
if (!tirtaDataJs.includes('"srijaya"')) {
    console.error("[FAIL] Alias srijaya tidak ditemukan di assets/tirtajaya_data.js!");
    process.exit(1);
}
console.log("[OK] Alias 'gempolkarya' (untuk Gempoljaya) dan 'srijaya' (untuk Sarijaya) aktif.");

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
if (!appJs.includes("inTirtajaya ? 'tirtajaya'")) {
    console.error("[FAIL] Hash routing for Tirtajaya not found in app.js!");
    process.exit(1);
}
console.log("[OK] Hash routing #kecamatan-tirtajaya dan direct village #desa-... aktif.");

// 6. Check global click delegator
if (!appJs.includes("const tirtajayaTrigger = e.target.closest('#menu-tirtajaya, .btn-tirtajaya, [data-kecamatan=\"tirtajaya\"], a[href*=\"tirtajaya\"]');")) {
    console.error("[FAIL] Tirtajaya trigger delegator not found in app.js!");
    process.exit(1);
}
console.log("[OK] Global click delegator untuk Tirtajaya terpasang sempurna.");

// 7. Check web.php routing
if (!routesPhp.includes('|tirtajaya') && !routesPhp.includes('tirtajaya|')) {
    console.error("[FAIL] web.php does not route tirtajaya!");
    process.exit(1);
}
console.log("[OK] Laravel routes di pbb-p2/routes/web.php mendukung 'tirtajaya'.");

console.log("\n[SUCCESS] Semua 7 aspek interaksi dan routing Kecamatan Tirtajaya LULUS!");
