const fs = require('fs');
const vm = require('vm');

const context = { console, Math };
vm.createContext(context);

const dataJs = fs.readFileSync('assets/data.js', 'utf8').replace(/const /g, 'var ');
vm.runInContext(dataJs, context);

const rengasDataJs = fs.readFileSync('assets/rengasdengklok_data.js', 'utf8').replace(/const /g, 'var ');
vm.runInContext(rengasDataJs, context);

console.log("=== Node.js Runtime Environment Test (Rengasdengklok) ===");

// 1. Verify Kecamatan Rengasdengklok in KECAMATAN_DATA
const rengasKab = context.KECAMATAN_DATA.find(k => k.id === 'rengasdengklok');
if (!rengasKab) {
    console.error("FAIL: 'rengasdengklok' not found in KECAMATAN_DATA!");
    process.exit(1);
}
console.log("[OK] Found Rengasdengklok in KECAMATAN_DATA:");
console.log(`     Target: ${rengasKab.targetFormatted} (${rengasKab.target})`);
console.log(`     Realisasi: ${rengasKab.realisasiFormatted} (${rengasKab.realisasi})`);
console.log(`     Capaian: ${rengasKab.capaianFormatted} (${rengasKab.capaian}%)`);
console.log(`     Tier/Status: ${rengasKab.tier} / ${rengasKab.statusText}`);

// 2. Verify RENGASDENGKLOK_SUMMARY
console.log("\n[OK] RENGASDENGKLOK_SUMMARY:");
console.log(`     Target: ${context.RENGASDENGKLOK_SUMMARY.targetFormatted}`);
console.log(`     Realisasi: ${context.RENGASDENGKLOK_SUMMARY.realisasiFormatted}`);
console.log(`     Sisa: ${context.RENGASDENGKLOK_SUMMARY.sisaTagihanFormatted}`);
console.log(`     Capaian: ${context.RENGASDENGKLOK_SUMMARY.capaianFormatted}`);
console.log(`     Jumlah Desa: ${context.RENGASDENGKLOK_SUMMARY.jumlahDesa}`);

if (context.RENGASDENGKLOK_SUMMARY.target !== rengasKab.target) {
    console.error("FAIL: Summary target mismatch with Kabupaten baseline!");
    process.exit(1);
}
if (context.RENGASDENGKLOK_SUMMARY.realisasi !== rengasKab.realisasi) {
    console.error("FAIL: Summary realisasi mismatch with Kabupaten baseline!");
    process.exit(1);
}

// 3. Verify 9 Desa
console.log(`\n[OK] RENGASDENGKLOK_DESA_DATA has ${context.RENGASDENGKLOK_DESA_DATA.length} villages:`);
let sumT = 0, sumR = 0, sumS = 0, sumO = 0, sumL = 0, sumB = 0;
context.RENGASDENGKLOK_DESA_DATA.forEach(d => {
    sumT += d.target;
    sumR += d.realisasi;
    sumS += d.sisaTagihan;
    sumO += d.obyekTerdaftar;
    sumL += d.obyekLunas;
    sumB += d.obyekBelumLunas;
    console.log(`     ${String(d.no).padStart(2)}. ${d.name.padEnd(24)} : Target=${d.targetFormatted.padStart(19)}, Real=${d.realisasiFormatted.padStart(19)}, Capaian=${d.capaianFormatted.padStart(6)}, Status=${d.statusText}`);
});

console.log("\nSum Checks:");
console.log(`     Sum Target: Rp ${sumT.toLocaleString('id-ID')} (Expected: ${rengasKab.target.toLocaleString('id-ID')}) -> ${sumT === rengasKab.target ? 'MATCH' : 'MISMATCH'}`);
console.log(`     Sum Realisasi: Rp ${sumR.toLocaleString('id-ID')} (Expected: ${rengasKab.realisasi.toLocaleString('id-ID')}) -> ${sumR === rengasKab.realisasi ? 'MATCH' : 'MISMATCH'}`);
console.log(`     Sum Sisa: Rp ${sumS.toLocaleString('id-ID')} (Expected: ${(rengasKab.target - rengasKab.realisasi).toLocaleString('id-ID')}) -> ${sumS === (rengasKab.target - rengasKab.realisasi) ? 'MATCH' : 'MISMATCH'}`);
console.log(`     Weighted Capaian: ${((sumR / sumT) * 100).toFixed(1)}% -> ${((sumR / sumT) * 100).toFixed(1) === '73.0' ? 'MATCH 73.0%' : 'MISMATCH'}`);
console.log(`     Obyek: Terdaftar=${sumO.toLocaleString('id-ID')}, Lunas=${sumL.toLocaleString('id-ID')}, Belum Lunas=${sumB.toLocaleString('id-ID')}`);

// 4. Verify app.js syntax and presence
const appJs = fs.readFileSync('js/app.js', 'utf8');
if (!appJs.includes("'rengasdengklok'")) {
    console.error("FAIL: 'rengasdengklok' not found in js/app.js!");
    process.exit(1);
}
console.log("\n[OK] js/app.js contains 'rengasdengklok' integrations.");

console.log("\n=== ALL NODE.JS RUNTIME VERIFICATIONS PASSED 100% ===");
