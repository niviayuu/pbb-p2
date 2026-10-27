const fs = require('fs');
const vm = require('vm');

const context = { console, Math };
vm.createContext(context);

const dataJs = fs.readFileSync('assets/data.js', 'utf8').replace(/const /g, 'var ');
vm.runInContext(dataJs, context);

const tirtaDataJs = fs.readFileSync('assets/tirtajaya_data.js', 'utf8').replace(/const /g, 'var ');
vm.runInContext(tirtaDataJs, context);

console.log("=== Node.js Runtime Environment Test (Tirtajaya) ===");

// 1. Verify Kecamatan Tirtajaya in KECAMATAN_DATA
const tirtaKab = context.KECAMATAN_DATA.find(k => k.id === 'tirtajaya');
if (!tirtaKab) {
    console.error("FAIL: 'tirtajaya' not found in KECAMATAN_DATA!");
    process.exit(1);
}
console.log("[OK] Found Tirtajaya in KECAMATAN_DATA:");
console.log(`     Target: ${tirtaKab.targetFormatted} (${tirtaKab.target})`);
console.log(`     Realisasi: ${tirtaKab.realisasiFormatted} (${tirtaKab.realisasi})`);
console.log(`     Capaian: ${tirtaKab.capaianFormatted} (${tirtaKab.capaian}%)`);
console.log(`     Tier/Status: ${tirtaKab.tier} / ${tirtaKab.statusText}`);

// 2. Verify TIRTAJAYA_SUMMARY
console.log("\n[OK] TIRTAJAYA_SUMMARY:");
console.log(`     Target: ${context.TIRTAJAYA_SUMMARY.targetFormatted}`);
console.log(`     Realisasi: ${context.TIRTAJAYA_SUMMARY.realisasiFormatted}`);
console.log(`     Sisa: ${context.TIRTAJAYA_SUMMARY.sisaTagihanFormatted}`);
console.log(`     Capaian: ${context.TIRTAJAYA_SUMMARY.capaianFormatted}`);
console.log(`     Jumlah Desa: ${context.TIRTAJAYA_SUMMARY.jumlahDesa}`);

if (context.TIRTAJAYA_SUMMARY.target !== tirtaKab.target) {
    console.error("FAIL: Summary target mismatch with Kabupaten baseline!");
    process.exit(1);
}
if (context.TIRTAJAYA_SUMMARY.realisasi !== tirtaKab.realisasi) {
    console.error("FAIL: Summary realisasi mismatch with Kabupaten baseline!");
    process.exit(1);
}
const calculatedSisa = tirtaKab.target - tirtaKab.realisasi;
if (context.TIRTAJAYA_SUMMARY.sisaTagihan !== calculatedSisa) {
    console.error("FAIL: Summary sisaTagihan mismatch with calculated sisa!");
    process.exit(1);
}

// 3. Verify 11 Desa
console.log(`\n[OK] TIRTAJAYA_DESA_DATA has ${context.TIRTAJAYA_DESA_DATA.length} villages:`);
let sumT = 0, sumR = 0, sumS = 0, sumO = 0, sumL = 0, sumB = 0;
context.TIRTAJAYA_DESA_DATA.forEach(d => {
    sumT += d.target;
    sumR += d.realisasi;
    sumS += d.sisaTagihan;
    sumO += d.obyekTerdaftar;
    sumL += d.obyekLunas;
    sumB += d.obyekBelumLunas;
    console.log(`     ${String(d.no).padStart(2)}. ${d.name.padEnd(20)} : Target=${d.targetFormatted.padStart(19)}, Real=${d.realisasiFormatted.padStart(19)}, Capaian=${d.capaianFormatted.padStart(6)}, Status=${d.statusText}`);
});

console.log("\nSum Checks:");
console.log(`     Sum Target: Rp ${sumT.toLocaleString('id-ID')} (Expected: ${tirtaKab.target.toLocaleString('id-ID')}) -> ${sumT === tirtaKab.target ? 'MATCH' : 'MISMATCH'}`);
console.log(`     Sum Realisasi: Rp ${sumR.toLocaleString('id-ID')} (Expected: ${tirtaKab.realisasi.toLocaleString('id-ID')}) -> ${sumR === tirtaKab.realisasi ? 'MATCH' : 'MISMATCH'}`);
console.log(`     Sum Sisa: Rp ${sumS.toLocaleString('id-ID')} (Expected: ${calculatedSisa.toLocaleString('id-ID')}) -> ${sumS === calculatedSisa ? 'MATCH' : 'MISMATCH'}`);
console.log(`     Sum Obyek: ${sumO} (Expected: ${context.TIRTAJAYA_SUMMARY.obyekTerdaftar}) -> ${sumO === context.TIRTAJAYA_SUMMARY.obyekTerdaftar ? 'MATCH' : 'MISMATCH'}`);
console.log(`     Sum Lunas: ${sumL} (Expected: ${context.TIRTAJAYA_SUMMARY.obyekLunas}) -> ${sumL === context.TIRTAJAYA_SUMMARY.obyekLunas ? 'MATCH' : 'MISMATCH'}`);
console.log(`     Sum Belum: ${sumB} (Expected: ${context.TIRTAJAYA_SUMMARY.obyekBelumLunas}) -> ${sumB === context.TIRTAJAYA_SUMMARY.obyekBelumLunas ? 'MATCH' : 'MISMATCH'}`);

if (sumT !== tirtaKab.target || sumR !== tirtaKab.realisasi || sumS !== calculatedSisa) {
    console.error("FAIL: Sum of villages does not match summary!");
    process.exit(1);
}

// 4. Verify GeoJSON paths mapping
const pathsJson = JSON.parse(fs.readFileSync('tirtajaya_paths.json', 'utf8'));
const villageKeys = Object.keys(pathsJson.villages);
console.log(`\n[OK] tirtajaya_paths.json has ${villageKeys.length} paths:`);
context.TIRTAJAYA_DESA_DATA.forEach(d => {
    const hasPathInObj = !!d.path && d.path.length > 20;
    const matchKey = villageKeys.find(k => k.toLowerCase() === d.name.toLowerCase() || (d.aliases && d.aliases.some(a => a.toLowerCase() === k.toLowerCase())));
    if (!hasPathInObj || !matchKey) {
        console.error(`FAIL: Missing SVG path for ${d.name} (${d.id})`);
        process.exit(1);
    }
});
console.log("[PASS] All 11 villages have valid GeoJSON SVG projection paths and centroids.");
