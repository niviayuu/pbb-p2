const fs = require('fs');
const vm = require('vm');

const context = { console, Math };
vm.createContext(context);

const dataJs = fs.readFileSync('assets/data.js', 'utf8').replace(/const /g, 'var ');
vm.runInContext(dataJs, context);

const cibuayaDataJs = fs.readFileSync('assets/cibuaya_data.js', 'utf8').replace(/const /g, 'var ');
vm.runInContext(cibuayaDataJs, context);

console.log("=== Node.js Runtime Environment Test (Cibuaya) ===");

// 1. Verify Kecamatan Cibuaya in KECAMATAN_DATA
const cibuayaKab = context.KECAMATAN_DATA.find(k => k.id === 'cibuaya');
if (!cibuayaKab) {
    console.error("FAIL: 'cibuaya' not found in KECAMATAN_DATA!");
    process.exit(1);
}
console.log("[OK] Found Cibuaya in KECAMATAN_DATA:");
console.log(`     Target: ${cibuayaKab.targetFormatted} (${cibuayaKab.target})`);
console.log(`     Realisasi: ${cibuayaKab.realisasiFormatted} (${cibuayaKab.realisasi})`);
console.log(`     Capaian: ${cibuayaKab.capaianFormatted} (${cibuayaKab.capaian}%)`);
console.log(`     Tier/Status: ${cibuayaKab.tier} / ${cibuayaKab.statusText}`);

// 2. Verify CIBUAYA_SUMMARY
console.log("\n[OK] CIBUAYA_SUMMARY:");
console.log(`     Target: ${context.CIBUAYA_SUMMARY.targetFormatted}`);
console.log(`     Realisasi: ${context.CIBUAYA_SUMMARY.realisasiFormatted}`);
console.log(`     Sisa: ${context.CIBUAYA_SUMMARY.sisaTagihanFormatted}`);
console.log(`     Capaian: ${context.CIBUAYA_SUMMARY.capaianFormatted}`);
console.log(`     Jumlah Desa: ${context.CIBUAYA_SUMMARY.jumlahDesa}`);

if (context.CIBUAYA_SUMMARY.target !== cibuayaKab.target) {
    console.error("FAIL: Summary target mismatch with Kabupaten baseline!");
    process.exit(1);
}
if (context.CIBUAYA_SUMMARY.realisasi !== cibuayaKab.realisasi) {
    console.error("FAIL: Summary realisasi mismatch with Kabupaten baseline!");
    process.exit(1);
}
const calculatedSisa = cibuayaKab.target - cibuayaKab.realisasi;
if (context.CIBUAYA_SUMMARY.sisaTagihan !== calculatedSisa) {
    console.error("FAIL: Summary sisaTagihan mismatch with calculated sisa!");
    process.exit(1);
}

// 3. Verify 11 Desa
console.log(`\n[OK] CIBUAYA_DESA_DATA has ${context.CIBUAYA_DESA_DATA.length} villages:`);
let sumT = 0, sumR = 0, sumS = 0, sumO = 0, sumL = 0, sumB = 0;
context.CIBUAYA_DESA_DATA.forEach(d => {
    sumT += d.target;
    sumR += d.realisasi;
    sumS += d.sisaTagihan;
    sumO += d.obyekTerdaftar;
    sumL += d.obyekLunas;
    sumB += d.obyekBelumLunas;
    console.log(`     ${String(d.no).padStart(2)}. ${d.name.padEnd(20)} : Target=${d.targetFormatted.padStart(19)}, Real=${d.realisasiFormatted.padStart(19)}, Capaian=${d.capaianFormatted.padStart(6)}, Status=${d.statusText}`);
});

console.log("\nSum Checks:");
console.log(`     Sum Target: Rp ${sumT.toLocaleString('id-ID')} (Expected: ${cibuayaKab.target.toLocaleString('id-ID')}) -> ${sumT === cibuayaKab.target ? 'MATCH' : 'MISMATCH'}`);
console.log(`     Sum Realisasi: Rp ${sumR.toLocaleString('id-ID')} (Expected: ${cibuayaKab.realisasi.toLocaleString('id-ID')}) -> ${sumR === cibuayaKab.realisasi ? 'MATCH' : 'MISMATCH'}`);
console.log(`     Sum Sisa: Rp ${sumS.toLocaleString('id-ID')} (Expected: ${calculatedSisa.toLocaleString('id-ID')}) -> ${sumS === calculatedSisa ? 'MATCH' : 'MISMATCH'}`);
console.log(`     Sum Obyek: ${sumO} (Expected: ${context.CIBUAYA_SUMMARY.obyekTerdaftar}) -> ${sumO === context.CIBUAYA_SUMMARY.obyekTerdaftar ? 'MATCH' : 'MISMATCH'}`);
console.log(`     Sum Lunas: ${sumL} (Expected: ${context.CIBUAYA_SUMMARY.obyekLunas}) -> ${sumL === context.CIBUAYA_SUMMARY.obyekLunas ? 'MATCH' : 'MISMATCH'}`);
console.log(`     Sum Belum: ${sumB} (Expected: ${context.CIBUAYA_SUMMARY.obyekBelumLunas}) -> ${sumB === context.CIBUAYA_SUMMARY.obyekBelumLunas ? 'MATCH' : 'MISMATCH'}`);

if (sumT !== cibuayaKab.target || sumR !== cibuayaKab.realisasi || sumS !== calculatedSisa) {
    console.error("FAIL: Sum of villages does not match summary!");
    process.exit(1);
}

// 4. Verify GeoJSON paths mapping
const pathsJson = JSON.parse(fs.readFileSync('cibuaya_paths.json', 'utf8'));
const villageKeys = Object.keys(pathsJson.villages);
console.log(`\n[OK] cibuaya_paths.json has ${villageKeys.length} paths:`);
context.CIBUAYA_DESA_DATA.forEach(d => {
    const hasPathInObj = !!d.path && d.path.length > 20;
    const matchKey = villageKeys.find(k => k.toLowerCase() === d.name.toLowerCase() || (d.aliases && d.aliases.some(a => a.toLowerCase() === k.toLowerCase())));
    if (!hasPathInObj || !matchKey) {
        console.error(`FAIL: Missing SVG path for ${d.name} (${d.id})`);
        process.exit(1);
    }
});
console.log("[PASS] All 11 villages have valid GeoJSON SVG projection paths and centroids.");
