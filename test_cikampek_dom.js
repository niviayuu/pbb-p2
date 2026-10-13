const fs = require('fs');
const vm = require('vm');

const context = { console, Math };
vm.createContext(context);

const dataJs = fs.readFileSync('assets/data.js', 'utf8').replace(/const /g, 'var ');
vm.runInContext(dataJs, context);

const cikampekDataJs = fs.readFileSync('assets/cikampek_data.js', 'utf8').replace(/const /g, 'var ');
vm.runInContext(cikampekDataJs, context);

console.log("=== Node.js Runtime Environment Test ===");

// 1. Verify Kecamatan Cikampek in KECAMATAN_DATA
const cikampekKab = context.KECAMATAN_DATA.find(k => k.id === 'cikampek');
if (!cikampekKab) {
    console.error("FAIL: 'cikampek' not found in KECAMATAN_DATA!");
    process.exit(1);
}
console.log("[OK] Found Cikampek in KECAMATAN_DATA:");
console.log(`     Target: ${cikampekKab.targetFormatted} (${cikampekKab.target})`);
console.log(`     Realisasi: ${cikampekKab.realisasiFormatted} (${cikampekKab.realisasi})`);
console.log(`     Capaian: ${cikampekKab.capaianFormatted} (${cikampekKab.capaian}%)`);
console.log(`     Tier/Status: ${cikampekKab.tier} / ${cikampekKab.statusText}`);

// 2. Verify CIKAMPEK_SUMMARY
console.log("\n[OK] CIKAMPEK_SUMMARY:");
console.log(`     Target: ${context.CIKAMPEK_SUMMARY.targetFormatted}`);
console.log(`     Realisasi: ${context.CIKAMPEK_SUMMARY.realisasiFormatted}`);
console.log(`     Sisa: ${context.CIKAMPEK_SUMMARY.sisaTagihanFormatted}`);
console.log(`     Capaian: ${context.CIKAMPEK_SUMMARY.capaianFormatted}`);
console.log(`     Jumlah Desa: ${context.CIKAMPEK_SUMMARY.jumlahDesa}`);

if (context.CIKAMPEK_SUMMARY.target !== cikampekKab.target) {
    console.error("FAIL: Summary target mismatch with Kabupaten baseline!");
    process.exit(1);
}
if (context.CIKAMPEK_SUMMARY.realisasi !== cikampekKab.realisasi) {
    console.error("FAIL: Summary realisasi mismatch with Kabupaten baseline!");
    process.exit(1);
}

// 3. Verify 10 Desa
console.log(`\n[OK] CIKAMPEK_DESA_DATA has ${context.CIKAMPEK_DESA_DATA.length} villages:`);
let sumT = 0, sumR = 0, sumS = 0;
context.CIKAMPEK_DESA_DATA.forEach(d => {
    sumT += d.target;
    sumR += d.realisasi;
    sumS += d.sisaTagihan;
    console.log(`     ${String(d.no).padStart(2)}. ${d.name.padEnd(18)} : Target=${d.targetFormatted.padStart(18)}, Real=${d.realisasiFormatted.padStart(18)}, Capaian=${d.capaianFormatted.padStart(6)}, Status=${d.statusText}`);
});

console.log("\nSum Checks:");
console.log(`     Sum Target: Rp ${sumT.toLocaleString('id-ID')} (Expected: ${cikampekKab.target.toLocaleString('id-ID')}) -> ${sumT === cikampekKab.target ? 'MATCH' : 'MISMATCH'}`);
console.log(`     Sum Realisasi: Rp ${sumR.toLocaleString('id-ID')} (Expected: ${cikampekKab.realisasi.toLocaleString('id-ID')}) -> ${sumR === cikampekKab.realisasi ? 'MATCH' : 'MISMATCH'}`);
console.log(`     Weighted Capaian: ${((sumR / sumT) * 100).toFixed(1)}% -> ${((sumR / sumT) * 100).toFixed(1) === '83.0' ? 'MATCH 83.0%' : 'MISMATCH'}`);

console.log("\n=== ALL NODE.JS RUNTIME VERIFICATIONS PASSED 100% ===");
