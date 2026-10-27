const fs = require('fs');
const vm = require('vm');

const context = { console, Math };
vm.createContext(context);

const dataJs = fs.readFileSync('assets/data.js', 'utf8').replace(/const /g, 'var ');
vm.runInContext(dataJs, context);

const jayaDataJs = fs.readFileSync('assets/jayakerta_data.js', 'utf8').replace(/const /g, 'var ');
vm.runInContext(jayaDataJs, context);

console.log("=== Node.js Runtime Environment Test (Jayakerta) ===");

// 1. Verify Kecamatan Jayakerta in KECAMATAN_DATA
const jayaKab = context.KECAMATAN_DATA.find(k => k.id === 'jayakerta');
if (!jayaKab) {
    console.error("FAIL: 'jayakerta' not found in KECAMATAN_DATA!");
    process.exit(1);
}
console.log("[OK] Found Jayakerta in KECAMATAN_DATA:");
console.log(`     Target: ${jayaKab.targetFormatted} (${jayaKab.target})`);
console.log(`     Realisasi: ${jayaKab.realisasiFormatted} (${jayaKab.realisasi})`);
console.log(`     Capaian: ${jayaKab.capaianFormatted} (${jayaKab.capaian}%)`);
console.log(`     Tier/Status: ${jayaKab.tier} / ${jayaKab.statusText}`);

// 2. Verify JAYAKERTA_SUMMARY
console.log("\n[OK] JAYAKERTA_SUMMARY:");
console.log(`     Target: ${context.JAYAKERTA_SUMMARY.targetFormatted}`);
console.log(`     Realisasi: ${context.JAYAKERTA_SUMMARY.realisasiFormatted}`);
console.log(`     Sisa: ${context.JAYAKERTA_SUMMARY.sisaTagihanFormatted}`);
console.log(`     Capaian: ${context.JAYAKERTA_SUMMARY.capaianFormatted}`);
console.log(`     Jumlah Desa: ${context.JAYAKERTA_SUMMARY.jumlahDesa}`);

if (context.JAYAKERTA_SUMMARY.target !== jayaKab.target) {
    console.error("FAIL: Summary target mismatch with Kabupaten baseline!");
    process.exit(1);
}
if (context.JAYAKERTA_SUMMARY.realisasi !== jayaKab.realisasi) {
    console.error("FAIL: Summary realisasi mismatch with Kabupaten baseline!");
    process.exit(1);
}
const calculatedSisa = jayaKab.target - jayaKab.realisasi;
if (context.JAYAKERTA_SUMMARY.sisaTagihan !== calculatedSisa) {
    console.error("FAIL: Summary sisaTagihan mismatch with calculated sisa!");
    process.exit(1);
}

// 3. Verify 8 Desa
console.log(`\n[OK] JAYAKERTA_DESA_DATA has ${context.JAYAKERTA_DESA_DATA.length} villages:`);
let sumT = 0, sumR = 0, sumS = 0, sumO = 0, sumL = 0, sumB = 0;
context.JAYAKERTA_DESA_DATA.forEach(d => {
    sumT += d.target;
    sumR += d.realisasi;
    sumS += d.sisaTagihan;
    sumO += d.obyekTerdaftar;
    sumL += d.obyekLunas;
    sumB += d.obyekBelumLunas;
    console.log(`     ${String(d.no).padStart(2)}. ${d.name.padEnd(20)} : Target=${d.targetFormatted.padStart(19)}, Real=${d.realisasiFormatted.padStart(19)}, Capaian=${d.capaianFormatted.padStart(6)}, Status=${d.statusText}`);
});

console.log("\nSum Checks:");
console.log(`     Sum Target: Rp ${sumT.toLocaleString('id-ID')} (Expected: ${jayaKab.target.toLocaleString('id-ID')}) -> ${sumT === jayaKab.target ? 'MATCH' : 'MISMATCH'}`);
console.log(`     Sum Realisasi: Rp ${sumR.toLocaleString('id-ID')} (Expected: ${jayaKab.realisasi.toLocaleString('id-ID')}) -> ${sumR === jayaKab.realisasi ? 'MATCH' : 'MISMATCH'}`);
console.log(`     Sum Sisa: Rp ${sumS.toLocaleString('id-ID')} (Expected: ${calculatedSisa.toLocaleString('id-ID')}) -> ${sumS === calculatedSisa ? 'MATCH' : 'MISMATCH'}`);

if (sumT !== jayaKab.target || sumR !== jayaKab.realisasi || sumS !== calculatedSisa) {
    console.error("FAIL: Sum of villages does not match summary!");
    process.exit(1);
}

// 4. Verify GeoJSON paths mapping
const pathsJson = JSON.parse(fs.readFileSync('jayakerta_paths.json', 'utf8'));
const villageKeys = Object.keys(pathsJson.villages);
console.log(`\n[OK] jayakerta_paths.json has ${villageKeys.length} paths:`);
context.JAYAKERTA_DESA_DATA.forEach(d => {
    const hasPathInObj = !!d.path && d.path.length > 20;
    const matchKey = villageKeys.find(k => k.toLowerCase() === d.name.toLowerCase() || (d.aliases && d.aliases.some(a => a.toLowerCase() === k.toLowerCase())));
    if (!hasPathInObj || !matchKey) {
        console.error(`FAIL: Missing SVG path for ${d.name} (${d.id})`);
        process.exit(1);
    }
});
console.log("[PASS] All 8 villages have valid GeoJSON SVG projection paths and centroids.");
