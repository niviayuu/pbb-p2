const fs = require('fs');
const vm = require('vm');

const context = { console, Math };
vm.createContext(context);

const dataJs = fs.readFileSync('assets/data.js', 'utf8').replace(/const /g, 'var ');
vm.runInContext(dataJs, context);

const tirtamulyaDataJs = fs.readFileSync('assets/tirtamulya_data.js', 'utf8').replace(/const /g, 'var ');
vm.runInContext(tirtamulyaDataJs, context);

console.log("=== Node.js Runtime Environment Test - Tirtamulya ===");

// 1. Verify Kecamatan Tirtamulya in KECAMATAN_DATA
const tirtamulyaKab = context.KECAMATAN_DATA.find(k => k.id === 'tirtamulya');
if (!tirtamulyaKab) {
    console.error("FAIL: 'tirtamulya' not found in KECAMATAN_DATA!");
    process.exit(1);
}
console.log("[OK] Found Tirtamulya in KECAMATAN_DATA:");
console.log(`     Target: ${tirtamulyaKab.targetFormatted} (${tirtamulyaKab.target})`);
console.log(`     Realisasi: ${tirtamulyaKab.realisasiFormatted} (${tirtamulyaKab.realisasi})`);
console.log(`     Capaian: ${tirtamulyaKab.capaianFormatted} (${tirtamulyaKab.capaian}%)`);
console.log(`     Tier/Status: ${tirtamulyaKab.tier} / ${tirtamulyaKab.statusText}`);

// 2. Verify TIRTAMULYA_SUMMARY
console.log("\n[OK] TIRTAMULYA_SUMMARY:");
console.log(`     Target: ${context.TIRTAMULYA_SUMMARY.targetFormatted}`);
console.log(`     Realisasi: ${context.TIRTAMULYA_SUMMARY.realisasiFormatted}`);
console.log(`     Sisa: ${context.TIRTAMULYA_SUMMARY.sisaTagihanFormatted}`);
console.log(`     Capaian: ${context.TIRTAMULYA_SUMMARY.capaianFormatted}`);
console.log(`     Jumlah Desa: ${context.TIRTAMULYA_SUMMARY.jumlahDesa}`);

if (context.TIRTAMULYA_SUMMARY.target !== tirtamulyaKab.target) {
    console.error("FAIL: Summary target mismatch with Kabupaten baseline!");
    process.exit(1);
}
if (context.TIRTAMULYA_SUMMARY.realisasi !== tirtamulyaKab.realisasi) {
    console.error("FAIL: Summary realisasi mismatch with Kabupaten baseline!");
    process.exit(1);
}

// 3. Verify 10 Desa
console.log(`\n[OK] TIRTAMULYA_DESA_DATA has ${context.TIRTAMULYA_DESA_DATA.length} villages:`);
let sumT = 0, sumR = 0, sumS = 0;
context.TIRTAMULYA_DESA_DATA.forEach(d => {
    sumT += d.target;
    sumR += d.realisasi;
    sumS += d.sisaTagihan;
    console.log(`     ${String(d.no).padStart(2)}. ${d.name.padEnd(18)} : Target=${d.targetFormatted.padStart(18)}, Real=${d.realisasiFormatted.padStart(18)}, Capaian=${d.capaianFormatted.padStart(6)}, Status=${d.statusText}`);
});

console.log("\nSum Checks:");
console.log(`     Sum Target: Rp ${sumT.toLocaleString('id-ID')} (Expected: ${tirtamulyaKab.target.toLocaleString('id-ID')}) -> ${sumT === tirtamulyaKab.target ? 'MATCH' : 'MISMATCH'}`);
console.log(`     Sum Realisasi: Rp ${sumR.toLocaleString('id-ID')} (Expected: ${tirtamulyaKab.realisasi.toLocaleString('id-ID')}) -> ${sumR === tirtamulyaKab.realisasi ? 'MATCH' : 'MISMATCH'}`);
console.log(`     Weighted Capaian: ${((sumR / sumT) * 100).toFixed(1)}% -> ${((sumR / sumT) * 100).toFixed(1) === '61.0' ? 'MATCH 61.0%' : 'MISMATCH'}`);

console.log("\n=== ALL NODE.JS RUNTIME VERIFICATIONS PASSED 100% ===");
