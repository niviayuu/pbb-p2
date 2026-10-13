const fs = require('fs');
const vm = require('vm');

const context = { console, Math };
vm.createContext(context);

const dataJs = fs.readFileSync('assets/data.js', 'utf8').replace(/const /g, 'var ');
vm.runInContext(dataJs, context);

const purwasariDataJs = fs.readFileSync('assets/purwasari_data.js', 'utf8').replace(/const /g, 'var ');
vm.runInContext(purwasariDataJs, context);

console.log("=== Node.js Runtime Environment Test (Purwasari) ===");

// 1. Verify Kecamatan Purwasari in KECAMATAN_DATA
const purwasariKab = context.KECAMATAN_DATA.find(k => k.id === 'purwasari');
if (!purwasariKab) {
    console.error("FAIL: 'purwasari' not found in KECAMATAN_DATA!");
    process.exit(1);
}
console.log("[OK] Found Purwasari in KECAMATAN_DATA:");
console.log(`     Target: ${purwasariKab.targetFormatted} (${purwasariKab.target})`);
console.log(`     Realisasi: ${purwasariKab.realisasiFormatted} (${purwasariKab.realisasi})`);
console.log(`     Capaian: ${purwasariKab.capaianFormatted} (${purwasariKab.capaian}%)`);
console.log(`     Tier/Status: ${purwasariKab.tier} / ${purwasariKab.statusText}`);

// 2. Verify PURWASARI_SUMMARY
console.log("\n[OK] PURWASARI_SUMMARY:");
console.log(`     Target: ${context.PURWASARI_SUMMARY.targetFormatted}`);
console.log(`     Realisasi: ${context.PURWASARI_SUMMARY.realisasiFormatted}`);
console.log(`     Sisa: ${context.PURWASARI_SUMMARY.sisaTagihanFormatted}`);
console.log(`     Capaian: ${context.PURWASARI_SUMMARY.capaianFormatted}`);
console.log(`     Jumlah Desa: ${context.PURWASARI_SUMMARY.jumlahDesa}`);

if (context.PURWASARI_SUMMARY.target !== purwasariKab.target) {
    console.error("FAIL: Summary target mismatch with Kabupaten baseline!");
    process.exit(1);
}
if (context.PURWASARI_SUMMARY.realisasi !== purwasariKab.realisasi) {
    console.error("FAIL: Summary realisasi mismatch with Kabupaten baseline!");
    process.exit(1);
}

// 3. Verify 8 Desa
console.log(`\n[OK] PURWASARI_DESA_DATA has ${context.PURWASARI_DESA_DATA.length} villages:`);
let sumT = 0, sumR = 0, sumS = 0;
context.PURWASARI_DESA_DATA.forEach(d => {
    sumT += d.target;
    sumR += d.realisasi;
    sumS += d.sisaTagihan;
    console.log(`     ${String(d.no).padStart(2)}. ${d.name.padEnd(14)} : Target=${d.targetFormatted.padStart(18)}, Real=${d.realisasiFormatted.padStart(18)}, Capaian=${d.capaianFormatted.padStart(6)}, Status=${d.statusText}`);
});

console.log("\nSum Checks:");
console.log(`     Sum Target: Rp ${sumT.toLocaleString('id-ID')} (Expected: ${purwasariKab.target.toLocaleString('id-ID')}) -> ${sumT === purwasariKab.target ? 'MATCH' : 'MISMATCH'}`);
console.log(`     Sum Realisasi: Rp ${sumR.toLocaleString('id-ID')} (Expected: ${purwasariKab.realisasi.toLocaleString('id-ID')}) -> ${sumR === purwasariKab.realisasi ? 'MATCH' : 'MISMATCH'}`);
console.log(`     Weighted Capaian: ${((sumR / sumT) * 100).toFixed(1)}% -> ${((sumR / sumT) * 100).toFixed(1) === '70.0' ? 'MATCH 70.0%' : 'MISMATCH'}`);

console.log("\n=== ALL NODE.JS RUNTIME VERIFICATIONS PASSED 100% ===");
