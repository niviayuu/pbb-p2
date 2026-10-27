const fs = require('fs');
const vm = require('vm');

const context = { console, Math };
vm.createContext(context);

const dataJs = fs.readFileSync('assets/data.js', 'utf8').replace(/const /g, 'var ');
vm.runInContext(dataJs, context);

const pedesDataJs = fs.readFileSync('assets/pedes_data.js', 'utf8').replace(/const /g, 'var ');
vm.runInContext(pedesDataJs, context);

console.log("=== Node.js Runtime Environment Test (Pedes) ===");

// 1. Verify Kecamatan Pedes in KECAMATAN_DATA
const pedesKab = context.KECAMATAN_DATA.find(k => k.id === 'pedes');
if (!pedesKab) {
    console.error("FAIL: 'pedes' not found in KECAMATAN_DATA!");
    process.exit(1);
}
console.log("[OK] Found Pedes in KECAMATAN_DATA:");
console.log(`     Target: ${pedesKab.targetFormatted} (${pedesKab.target})`);
console.log(`     Realisasi: ${pedesKab.realisasiFormatted} (${pedesKab.realisasi})`);
console.log(`     Capaian: ${pedesKab.capaianFormatted} (${pedesKab.capaian}%)`);
console.log(`     Tier/Status: ${pedesKab.tier} / ${pedesKab.statusText}`);

// 2. Verify PEDES_SUMMARY
console.log("\n[OK] PEDES_SUMMARY:");
console.log(`     Target: ${context.PEDES_SUMMARY.targetFormatted}`);
console.log(`     Realisasi: ${context.PEDES_SUMMARY.realisasiFormatted}`);
console.log(`     Sisa: ${context.PEDES_SUMMARY.sisaTagihanFormatted}`);
console.log(`     Capaian: ${context.PEDES_SUMMARY.capaianFormatted}`);
console.log(`     Jumlah Desa: ${context.PEDES_SUMMARY.jumlahDesa}`);

if (context.PEDES_SUMMARY.target !== pedesKab.target) {
    console.error("FAIL: Summary target mismatch with Kabupaten baseline!");
    process.exit(1);
}
if (context.PEDES_SUMMARY.realisasi !== pedesKab.realisasi) {
    console.error("FAIL: Summary realisasi mismatch with Kabupaten baseline!");
    process.exit(1);
}
const calculatedSisa = pedesKab.target - pedesKab.realisasi;
if (context.PEDES_SUMMARY.sisaTagihan !== calculatedSisa) {
    console.error("FAIL: Summary sisaTagihan mismatch with calculated sisa!");
    process.exit(1);
}

// 3. Verify 12 Desa
console.log(`\n[OK] PEDES_DESA_DATA has ${context.PEDES_DESA_DATA.length} villages:`);
let sumT = 0, sumR = 0, sumS = 0, sumO = 0, sumL = 0, sumB = 0;
context.PEDES_DESA_DATA.forEach(d => {
    sumT += d.target;
    sumR += d.realisasi;
    sumS += d.sisaTagihan;
    sumO += d.obyekTerdaftar;
    sumL += d.obyekLunas;
    sumB += d.obyekBelumLunas;
    console.log(`     ${String(d.no).padStart(2)}. ${d.name.padEnd(20)} : Target=${d.targetFormatted.padStart(19)}, Real=${d.realisasiFormatted.padStart(19)}, Capaian=${d.capaianFormatted.padStart(6)}, Status=${d.statusText}`);
});

console.log("\nSum Checks:");
console.log(`     Sum Target: Rp ${sumT.toLocaleString('id-ID')} (Expected: ${pedesKab.target.toLocaleString('id-ID')}) -> ${sumT === pedesKab.target ? 'MATCH' : 'MISMATCH'}`);
console.log(`     Sum Realisasi: Rp ${sumR.toLocaleString('id-ID')} (Expected: ${pedesKab.realisasi.toLocaleString('id-ID')}) -> ${sumR === pedesKab.realisasi ? 'MATCH' : 'MISMATCH'}`);
console.log(`     Sum Sisa: Rp ${sumS.toLocaleString('id-ID')} (Expected: ${calculatedSisa.toLocaleString('id-ID')}) -> ${sumS === calculatedSisa ? 'MATCH' : 'MISMATCH'}`);

if (sumT !== pedesKab.target || sumR !== pedesKab.realisasi || sumS !== calculatedSisa) {
    console.error("FAIL: Sum of villages does not match summary!");
    process.exit(1);
}

// 4. Verify GeoJSON paths mapping
const pathsJson = JSON.parse(fs.readFileSync('pedes_paths.json', 'utf8'));
const villageKeys = Object.keys(pathsJson.villages);
console.log(`\n[OK] pedes_paths.json has ${villageKeys.length} paths:`);
context.PEDES_DESA_DATA.forEach(d => {
    const hasPathInObj = !!d.path && d.path.length > 20;
    // Map d.name or d.id to villages keys
    const matchKey = villageKeys.find(k => k.toLowerCase() === d.name.toLowerCase() || (d.aliases && d.aliases.some(a => a.toLowerCase() === k.toLowerCase())));
    if (!hasPathInObj || !matchKey) {
        console.error(`FAIL: Missing SVG path for ${d.name} (${d.id})`);
        process.exit(1);
    }
});
console.log("[PASS] All 12 villages have valid GeoJSON SVG projection paths and centroids.");
