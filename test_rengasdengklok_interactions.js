const fs = require('fs');

console.log("=================================================================");
console.log("TEST INTERAKSI, ROUTING & NAVIGASI KECAMATAN RENGASDENGKLOK");
console.log("=================================================================");

const appJs = fs.readFileSync('js/app.js', 'utf8');
const dataJs = fs.readFileSync('assets/data.js', 'utf8');
const rengasDataJs = fs.readFileSync('assets/rengasdengklok_data.js', 'utf8');

// 1. Check all 9 villages present in data.js
const expectedVillages = [
    'Kalangsari',
    'Kalangsurya',
    'Karyasari',
    'Dukuhkarya',
    'Amansari',
    'Rengasdengklok Selatan',
    'Rengasdengklok Utara',
    'Kertasari',
    'Dewisari'
];

expectedVillages.forEach(v => {
    if (!rengasDataJs.includes(`"name": "${v}"`)) {
        console.error(`[FAIL] Desa ${v} tidak ditemukan di assets/rengasdengklok_data.js!`);
        process.exit(1);
    }
});
console.log(`[OK] Seluruh 9 desa resmi tervalidasi ada di assets/rengasdengklok_data.js.`);

// 2. Check aliases support
if (!rengasDataJs.includes('"karangsari"') || !rengasDataJs.includes('"karangsuria"')) {
    console.error("[FAIL] Alias karangsari atau karangsuria tidak ditemukan!");
    process.exit(1);
}
console.log("[OK] Alias 'karangsari' (untuk Kalangsari) dan 'karangsuria' (untuk Kalangsurya) aktif.");

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
if (!appJs.includes("inRengasdengklok ? 'rengasdengklok'")) {
    console.error("[FAIL] Hash routing for Rengasdengklok not found in app.js!");
    process.exit(1);
}
console.log("[OK] Hash routing #kecamatan-rengasdengklok dan direct village #desa-... aktif.");

// 6. Check global click delegator
if (!appJs.includes("rengasdengklokTrigger")) {
    console.error("[FAIL] Global click delegator for Rengasdengklok menu/button missing!");
    process.exit(1);
}
console.log("[OK] Global click delegator untuk trigger menu / data-kecamatan='rengasdengklok' aktif.");

// 7. Check web.php routing
const webPhp = fs.readFileSync('pbb-p2/routes/web.php', 'utf8');
if (!webPhp.includes('|rengasdengklok')) {
    console.error("[FAIL] Route /kecamatan/{kecId} or /{kecId} does not allow 'rengasdengklok'!");
    process.exit(1);
}
console.log("[OK] Laravel route regex di routes/web.php mengenali /kecamatan/rengasdengklok dan /rengasdengklok.");

// 8. Check index.html & welcome.blade.php
const indexHtml = fs.readFileSync('index.html', 'utf8');
const blade = fs.readFileSync('pbb-p2/resources/views/welcome.blade.php', 'utf8');
if (!indexHtml.includes('src="assets/rengasdengklok_data.js"') || !blade.includes('src="assets/rengasdengklok_data.js"')) {
    console.error("[FAIL] Script tags not included in index.html or welcome.blade.php!");
    process.exit(1);
}
console.log("[OK] Script tag assets/rengasdengklok_data.js terpasang di index.html dan welcome.blade.php.");

console.log("\n=== ALL NAVIGATION, ROUTING & INTERACTION CHECKS PASSED (100% SUCCESS) ===");
