<?php
echo "========================================================\n";
echo "VALIDASI SISTEM DASHBOARD PBB-P2 KECAMATAN KUTAWALUYA\n";
echo "BAPENDA KABUPATEN KARAWANG\n";
echo "========================================================\n\n";

// 1. Check Files
$files = [
    'index.html',
    'assets/data.js',
    'assets/kutawaluya_data.js',
    'pbb-p2/public/assets/kutawaluya_data.js',
    'js/app.js',
    'pbb-p2/public/js/app.js',
    'pbb-p2/resources/views/welcome.blade.php',
    'pbb-p2/routes/web.php',
    'css/style.css',
    'karawang_kecamatan.geojson',
    'kutawaluya_desa.geojson',
    'kutawaluya_paths.json'
];

$allExist = true;
foreach ($files as $f) {
    if (file_exists($f)) {
        echo "[OK] File ada: $f (" . number_format(filesize($f)) . " bytes)\n";
    } else {
        echo "[FAIL] File tidak ditemukan: $f\n";
        $allExist = false;
    }
}
if (!$allExist) die("Validasi file gagal.\n");

// 2. Validate assets/kutawaluya_data.js
echo "\n--- 2. Validasi assets/kutawaluya_data.js ---\n";
$kutawaluyaJs = file_get_contents('assets/kutawaluya_data.js');

preg_match('/const KUTAWALUYA_VIEWBOX_WIDTH = (\d+);/', $kutawaluyaJs, $mW);
preg_match('/const KUTAWALUYA_VIEWBOX_HEIGHT = (\d+);/', $kutawaluyaJs, $mH);
preg_match('/const KUTAWALUYA_SUMMARY = (\{.*?\});/s', $kutawaluyaJs, $mSum);
preg_match('/const KUTAWALUYA_DESA_DATA = (\[.*?\]);/s', $kutawaluyaJs, $mDesa);

if (!$mW || !$mH || !$mSum || !$mDesa) {
    die("[FAIL] Variabel konstanta Kutawaluya tidak lengkap di assets/kutawaluya_data.js\n");
}

$viewBoxW = intval($mW[1]);
$viewBoxH = intval($mH[1]);
$summary = json_decode($mSum[1], true);
$desaData = json_decode($mDesa[1], true);

echo "ViewBox: 0 0 $viewBoxW $viewBoxH\n";
echo "Jumlah Desa terdaftar: " . count($desaData) . " desa\n";

if (count($desaData) !== 12) {
    die("[FAIL] Jumlah desa di data.js bukan 12!\n");
}
echo "[OK] Jumlah desa tepat 12 desa resmi Kecamatan Kutawaluya.\n";

$expectedDesa = [
    'Sindangkarya', 'Sindangmukti', 'Sindangmulya', 'Mulyajaya', 'Kutakarya',
    'Kutagandok', 'Waluya', 'Sampalan', 'Sindangsari', 'Kutaraja',
    'Kutamukti', 'Kutajaya'
];

$actualDesa = array_map(function($d) { return $d['name']; }, $desaData);

foreach ($expectedDesa as $idx => $exp) {
    $act = $desaData[$idx]['name'];
    if ($act !== $exp) {
        die("[FAIL] Desa urutan " . ($idx+1) . " diharapkan '$exp', didapat '$act'\n");
    }
    // Check SVG path exists
    if (empty($desaData[$idx]['path']) || substr($desaData[$idx]['path'], 0, 1) !== 'M') {
        die("[FAIL] Desa $act tidak memiliki SVG path yang valid!\n");
    }
}
echo "[OK] Urutan dan nama 12 desa 100% presisi sesuai master data.\n";

// 3. Rekonsiliasi Aritmatika & Data Kabupaten
echo "\n--- 3. Rekonsiliasi Aritmatika & Data Kabupaten ---\n";
$sumTarget = array_sum(array_column($desaData, 'target'));
$sumRealisasi = array_sum(array_column($desaData, 'realisasi'));
$sumSisa = array_sum(array_column($desaData, 'sisaTagihan'));
$weightedCapaian = round(($sumRealisasi / $sumTarget) * 100, 1);

echo "Total Target Desa       : Rp " . number_format($sumTarget, 0, ',', '.') . "\n";
echo "Total Realisasi Desa    : Rp " . number_format($sumRealisasi, 0, ',', '.') . "\n";
echo "Total Sisa Tagihan Desa : Rp " . number_format($sumSisa, 0, ',', '.') . "\n";
echo "Capaian Agregat Desa    : " . number_format($weightedCapaian, 1, ',', '.') . "%\n";

if ($sumTarget !== 6500000000) {
    die("[FAIL] Target akumulasi tidak sama dengan Rp 6.500.000.000!\n");
}
if ($sumRealisasi !== 1820000000) {
    die("[FAIL] Realisasi akumulasi tidak sama dengan Rp 1.820.000.000!\n");
}
if ($sumSisa !== 4680000000) {
    die("[FAIL] Sisa akumulasi tidak sama dengan Rp 4.680.000.000!\n");
}
if ($weightedCapaian !== 28.0) {
    die("[FAIL] Persentase capaian bukan 28,0%!\n");
}
echo "[OK] Aritmatika desa presisi tanpa selisih (Selisih: Rp 0, 0%).\n";

// Verify with assets/data.js
$dataJs = file_get_contents('assets/data.js');
preg_match('/const KECAMATAN_DATA = (\[.*?\]);/s', $dataJs, $mKab);
$kabData = json_decode($mKab[1], true);
$kutawaluyaKab = null;
foreach ($kabData as $k) {
    if ($k['id'] === 'kutawaluya') {
        $kutawaluyaKab = $k;
        break;
    }
}
if (!$kutawaluyaKab) {
    die("[FAIL] Kutawaluya tidak ditemukan di KECAMATAN_DATA assets/data.js\n");
}
echo "[OK] Ditemukan Kutawaluya di level Kabupaten:\n";
echo "     Target Kab    : Rp " . number_format($kutawaluyaKab['target'], 0, ',', '.') . "\n";
echo "     Realisasi Kab : Rp " . number_format($kutawaluyaKab['realisasi'], 0, ',', '.') . "\n";
echo "     Capaian Kab   : " . $kutawaluyaKab['capaian'] . "%\n";

if ($kutawaluyaKab['target'] !== $sumTarget || $kutawaluyaKab['realisasi'] !== $sumRealisasi) {
    die("[FAIL] Data desa tidak match dengan data kabupaten!\n");
}
echo "[OK] Rekonsiliasi 100% sempurna dengan baseline Kabupaten Karawang.\n";

// 4. Validasi GeoJSON dan Kemendagri ID
echo "\n--- 4. Validasi Geometri & Kemendagri ID ---\n";
$geo = json_decode(file_get_contents('kutawaluya_desa.geojson'), true);
if (count($geo['features']) !== 12) {
    die("[FAIL] kutawaluya_desa.geojson tidak memiliki 12 fitur desa!\n");
}
echo "[OK] kutawaluya_desa.geojson memiliki 12 fitur poligon resmi.\n";
foreach ($geo['features'] as $f) {
    $kode = $f['properties']['KODE_KD'] ?? $f['properties']['kode_kd'] ?? '';
    $nama = $f['properties']['NAMOBJ'] ?? $f['properties']['desa'] ?? '';
    if (substr($kode, 0, 8) !== '32.15.07') {
        die("[FAIL] Kode wilayah $kode untuk $nama bukan kode resmi Kutawaluya (32.15.07)!\n");
    }
}
echo "[OK] Seluruh 12 fitur terverifikasi memiliki kode wilayah resmi Kemendagri 32.15.07.xxxx.\n";

// 5. Validasi Routing & app.js
echo "\n--- 5. Validasi Routing & Integrasi app.js ---\n";
$appJs = file_get_contents('js/app.js');
$pubAppJs = file_get_contents('pbb-p2/public/js/app.js');
$webPhp = file_get_contents('pbb-p2/routes/web.php');
$indexHtml = file_get_contents('index.html');
$bladeHtml = file_get_contents('pbb-p2/resources/views/welcome.blade.php');

// Checks in js/app.js
$checks = [
    "'kutawaluya' in validKecs" => strpos($appJs, "'kutawaluya'") !== false,
    "initKecamatanView kutawaluya branch" => strpos($appJs, "kecId === 'kutawaluya'") !== false,
    "KUTAWALUYA_DESA_DATA assigned" => strpos($appJs, "KUTAWALUYA_DESA_DATA") !== false,
    "KUTAWALUYA_SUMMARY assigned" => strpos($appJs, "KUTAWALUYA_SUMMARY") !== false,
    "KecName Kutawaluya title mapping" => strpos($appJs, "'Kutawaluya'") !== false,
    "inKutawaluya hash routing" => strpos($appJs, "inKutawaluya") !== false,
    "Specific click trigger for kutawaluya" => strpos($appJs, "menu-kutawaluya") !== false,
];

foreach ($checks as $name => $ok) {
    if ($ok) {
        echo "[OK] js/app.js: $name\n";
    } else {
        die("[FAIL] js/app.js: $name TIDAK ditemukan!\n");
    }
}

// Check public/js/app.js identical
if ($appJs !== $pubAppJs) {
    die("[FAIL] js/app.js dan pbb-p2/public/js/app.js tidak identik!\n");
}
echo "[OK] js/app.js dan pbb-p2/public/js/app.js tersinkronisasi 100% identik.\n";

// Check routes/web.php
if (strpos($webPhp, 'kutawaluya|') !== false) {
    echo "[OK] pbb-p2/routes/web.php: Regex constraint memuat 'kutawaluya|'\n";
} else {
    die("[FAIL] pbb-p2/routes/web.php: Regex constraint TIDAK memuat 'kutawaluya|'!\n");
}

// Check script tags
if (strpos($indexHtml, 'assets/kutawaluya_data.js') !== false) {
    echo "[OK] index.html: Script kutawaluya_data.js dimuat di HTML\n";
} else {
    die("[FAIL] index.html: Script kutawaluya_data.js TIDAK dimuat!\n");
}

if (strpos($bladeHtml, 'assets/kutawaluya_data.js') !== false) {
    echo "[OK] welcome.blade.php: Script kutawaluya_data.js dimuat di HTML\n";
} else {
    die("[FAIL] welcome.blade.php: Script kutawaluya_data.js TIDAK dimuat!\n");
}

// 6. Validasi Perlindungan Peta Utama & Kecamatan Lain
echo "\n--- 6. Validasi Perlindungan Peta Utama & Kecamatan Lain ---\n";
$mainGeo = json_decode(file_get_contents('karawang_kecamatan.geojson'), true);
if (count($mainGeo['features']) !== 30) {
    die("[FAIL] Geometri utama Karawang berubah! Harusnya 30 kecamatan, ada " . count($mainGeo['features']) . "\n");
}
echo "[OK] Peta utama Karawang utuh sempurna (30 kecamatan).\n";

if (count($kabData) !== 30) {
    die("[FAIL] Master KECAMATAN_DATA berubah! Harusnya 30 kecamatan.\n");
}
echo "[OK] KECAMATAN_DATA utuh sempurna (30 kecamatan).\n";

// Check Purwasari & Tirtamulya & Rawamerta still present
$existing = ['purwasari', 'tirtamulya', 'rawamerta'];
foreach ($existing as $ex) {
    if (strpos($appJs, "'$ex'") === false) {
        die("[FAIL] Kecamatan $ex hilang dari konfigurasi app.js!\n");
    }
}
echo "[OK] Konfigurasi Purwasari, Tirtamulya, dan Rawamerta tetap utuh dan terlindungi.\n";

echo "\n========================================================\n";
echo "SEMUA VALIDASI BERHASIL! (100% PASS)\n";
echo "========================================================\n";
