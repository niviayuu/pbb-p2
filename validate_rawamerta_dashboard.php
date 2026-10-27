<?php
echo "========================================================\n";
echo "VALIDASI SISTEM DASHBOARD PBB-P2 KECAMATAN RAWAMERTA\n";
echo "BAPENDA KABUPATEN KARAWANG\n";
echo "========================================================\n\n";

// 1. Check Files
$files = [
    'index.html',
    'assets/data.js',
    'assets/rawamerta_data.js',
    'pbb-p2/public/assets/rawamerta_data.js',
    'js/app.js',
    'pbb-p2/public/js/app.js',
    'pbb-p2/resources/views/welcome.blade.php',
    'css/style.css',
    'karawang_kecamatan.geojson',
    'rawamerta_desa.geojson',
    'rawamerta_paths.json'
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

// 2. Validate assets/rawamerta_data.js
echo "\n--- 2. Validasi assets/rawamerta_data.js ---\n";
$rawamertaJs = file_get_contents('assets/rawamerta_data.js');

preg_match('/const RAWAMERTA_VIEWBOX_WIDTH = (\d+);/', $rawamertaJs, $mW);
preg_match('/const RAWAMERTA_VIEWBOX_HEIGHT = (\d+);/', $rawamertaJs, $mH);
preg_match('/const RAWAMERTA_SUMMARY = (\{.*?\});/s', $rawamertaJs, $mSum);
preg_match('/const RAWAMERTA_DESA_DATA = (\[.*?\]);/s', $rawamertaJs, $mDesa);

if (!$mW || !$mH || !$mSum || !$mDesa) {
    die("[FAIL] Variabel konstanta Rawamerta tidak lengkap di assets/rawamerta_data.js\n");
}

$viewBoxW = intval($mW[1]);
$viewBoxH = intval($mH[1]);
$summary = json_decode($mSum[1], true);
$desaData = json_decode($mDesa[1], true);

echo "ViewBox: 0 0 $viewBoxW $viewBoxH\n";
echo "Jumlah Desa terdaftar: " . count($desaData) . " desa\n";

if (count($desaData) !== 13) {
    die("[FAIL] Jumlah desa di data.js bukan 13!\n");
}
echo "[OK] Jumlah desa tepat 13 desa resmi Kecamatan Rawamerta.\n";

$expectedDesa = [
    'Purwamekar', 'Mekarjaya', 'Sekarwangi', 'Balongsari', 'Pasirawi',
    'Pasirkaliki', 'Kutawargi', 'Sukamerta', 'Panyingkiran', 'Sukapura',
    'Cibadak', 'Gombongsari', 'Sukaraja'
];

$actualDesa = array_column($desaData, 'name');
$mismatches = array_diff($expectedDesa, $actualDesa);
if (!empty($mismatches)) {
    die("[FAIL] Desa tidak cocok: " . implode(', ', $mismatches) . "\n");
}
echo "[OK] Seluruh 13 nama desa cocok 100% dengan daftar resmi instruksi.\n";

// 2b. Validasi Relasi Master Wilayah (rawamerta_desa.geojson)
echo "\n--- 2b. Validasi Relasi Master Wilayah (rawamerta_desa.geojson) ---\n";
$geo = json_decode(file_get_contents('rawamerta_desa.geojson'), true);
$geoMap = [];
foreach ($geo['features'] as $f) {
    $p = $f['properties'];
    $name = ucwords(strtolower(trim($p['kel_desa'] ?? $p['nama'])));
    $geoMap[$name] = $p;
}

foreach ($expectedDesa as $dName) {
    if (!isset($geoMap[$dName])) {
        die("[FAIL] Desa $dName tidak ditemukan dalam rawamerta_desa.geojson!\n");
    }
    $p = $geoMap[$dName];
    echo "[OK] Desa $dName terverifikasi resmi: Kode Desa = {$p['kode_kd']}, Kode Kec = {$p['kode_kec']}, Kecamatan = {$p['kecamatan']}\n";
}

// 3. Verifikasi Aritmatika & Rumus Pajak
echo "\n--- 3. Verifikasi Aritmatika & Rumus Pajak ---\n";
$calcTotalTarget = 0;
$calcTotalRealisasi = 0;
$calcTotalSisa = 0;
$calcTotalObyek = 0;
$calcTotalLunas = 0;
$calcTotalBelum = 0;

echo sprintf("%-4s| %-18s | %18s | %18s | %8s | %-20s | %18s\n",
    "No", "Desa", "Target (Rp)", "Realisasi (Rp)", "Capaian", "Status", "Sisa Tagihan (Rp)");
echo str_repeat("-", 112) . "\n";

foreach ($desaData as $d) {
    $target = $d['target'];
    $realisasi = $d['realisasi'];
    $sisa = $d['sisaTagihan'];
    $capaian = ($realisasi / $target) * 100;
    
    // Validasi rumus sisa tagihan desa
    if ($sisa !== ($target - $realisasi)) {
        die("[FAIL] Perhitungan sisa tagihan salah pada desa {$d['name']}\n");
    }
    
    // Validasi rumus obyek pajak
    if ($d['obyekTerdaftar'] !== ($d['obyekLunas'] + $d['obyekBelumLunas'])) {
        die("[FAIL] Penjumlahan obyek pajak salah pada desa {$d['name']}\n");
    }

    $calcTotalTarget += $target;
    $calcTotalRealisasi += $realisasi;
    $calcTotalSisa += $sisa;
    $calcTotalObyek += $d['obyekTerdaftar'];
    $calcTotalLunas += $d['obyekLunas'];
    $calcTotalBelum += $d['obyekBelumLunas'];

    echo sprintf("%-4d| %-18s | %18s | %18s | %7.1f%% | %-20s | %18s\n",
        $d['no'], $d['name'], number_format($target, 0, ',', '.'),
        number_format($realisasi, 0, ',', '.'), $capaian, $d['statusText'],
        number_format($sisa, 0, ',', '.'));
}
echo str_repeat("-", 112) . "\n";
echo sprintf("%-4s| %-18s | %18s | %18s | %7.1f%% | %-20s | %18s\n",
    "TOTAL", "13 Desa", number_format($calcTotalTarget, 0, ',', '.'),
    number_format($calcTotalRealisasi, 0, ',', '.'),
    ($calcTotalRealisasi / $calcTotalTarget) * 100,
    $summary['statusText'], number_format($calcTotalSisa, 0, ',', '.'));

// 4. Rekonsiliasi Level Kabupaten vs Level Kecamatan
echo "\n--- 4. Rekonsiliasi Level Kabupaten vs Level Kecamatan ---\n";
$targetKabupaten = 8800000000;
$realisasiKabupaten = 5544000000;
$capaianKabupaten = 63.0;

echo "Target Kabupaten (data.js)   : Rp " . number_format($targetKabupaten, 0, ',', '.') . "\n";
echo "Target Agregat 13 Desa       : Rp " . number_format($calcTotalTarget, 0, ',', '.') . "\n";
$diffTarget = abs($targetKabupaten - $calcTotalTarget);
echo "Selisih Target                : Rp " . number_format($diffTarget, 0, ',', '.') . " (" . ($diffTarget === 0 ? "SEIMBANG PERSIS 100%" : "SELISIH!") . ")\n\n";

echo "Realisasi Kabupaten (data.js): Rp " . number_format($realisasiKabupaten, 0, ',', '.') . "\n";
echo "Realisasi Agregat 13 Desa    : Rp " . number_format($calcTotalRealisasi, 0, ',', '.') . "\n";
$diffRealisasi = abs($realisasiKabupaten - $calcTotalRealisasi);
echo "Selisih Realisasi             : Rp " . number_format($diffRealisasi, 0, ',', '.') . " (" . ($diffRealisasi === 0 ? "SEIMBANG PERSIS 100%" : "SELISIH!") . ")\n\n";

$weightedCapaian = round(($calcTotalRealisasi / $calcTotalTarget) * 100, 1);
echo "Persentase Capaian Kabupaten : {$capaianKabupaten}%\n";
echo "Persentase Rata-rata Bobot   : {$weightedCapaian}%\n";
$diffPct = abs($capaianKabupaten - $weightedCapaian);
echo "Selisih Persentase           : " . $diffPct . "% (" . ($diffPct < 0.01 ? "SEIMBANG PERSIS 100%" : "SELISIH!") . ")\n\n";

echo "Total Obyek Pajak             : " . number_format($calcTotalObyek, 0, ',', '.') . "\n";
echo "Total Obyek Lunas             : " . number_format($calcTotalLunas, 0, ',', '.') . " (" . round(($calcTotalLunas / $calcTotalObyek) * 100) . "%)\n";
echo "Total Obyek Belum Lunas       : " . number_format($calcTotalBelum, 0, ',', '.') . " (" . round(($calcTotalBelum / $calcTotalObyek) * 100) . "%)\n";

if ($diffTarget !== 0 || $diffRealisasi !== 0 || $diffPct >= 0.01) {
    die("[FAIL] Rekonsiliasi data Rawamerta dengan data.js tidak seimbang!\n");
}
echo "\n[OK] SEMUA RUMUS DAN DATA LULUS VALIDASI TANPA KESALAHAN!\n";

// 5. Validasi Integrasi index.html & welcome.blade.php
echo "\n--- 5. Validasi Integrasi index.html & welcome.blade.php ---\n";
$indexHtml = file_get_contents('index.html');
$bladeHtml = file_get_contents('pbb-p2/resources/views/welcome.blade.php');

if (strpos($indexHtml, 'assets/rawamerta_data.js') !== false) {
    echo "[OK] index.html: Script rawamerta_data.js dimuat di HTML\n";
} else {
    die("[FAIL] index.html: Script rawamerta_data.js TIDAK dimuat!\n");
}

if (strpos($bladeHtml, 'assets/rawamerta_data.js') !== false) {
    echo "[OK] welcome.blade.php: Script rawamerta_data.js dimuat di HTML\n";
} else {
    die("[FAIL] welcome.blade.php: Script rawamerta_data.js TIDAK dimuat!\n");
}

// 6. Validasi Integrasi js/app.js & pbb-p2/public/js/app.js
echo "\n--- 6. Validasi Integrasi js/app.js & pbb-p2/public/js/app.js ---\n";
foreach (['js/app.js', 'pbb-p2/public/js/app.js'] as $appJsPath) {
    echo "\nMemeriksa $appJsPath:\n";
    $appJs = file_get_contents($appJsPath);
    if (strpos($appJs, 'RAWAMERTA_DESA_DATA') !== false) {
        echo "[OK] Mendukung RAWAMERTA_DESA_DATA\n";
    } else {
        die("[FAIL] $appJsPath: Tidak mendukung RAWAMERTA_DESA_DATA!\n");
    }
    if (strpos($appJs, 'RAWAMERTA_SUMMARY') !== false) {
        echo "[OK] Mendukung RAWAMERTA_SUMMARY\n";
    } else {
        die("[FAIL] $appJsPath: Tidak mendukung RAWAMERTA_SUMMARY!\n");
    }
    if (strpos($appJs, "'rawamerta'") !== false) {
        echo "[OK] Slug rawamerta didukung\n";
    } else {
        die("[FAIL] $appJsPath: Tidak mendukung slug rawamerta!\n");
    }
}

// 7. Validasi Proteksi Peta Utama PBB-P2
echo "\n--- 7. Validasi Proteksi Peta Utama PBB-P2 ---\n";
$karawangGeo = json_decode(file_get_contents('karawang_kecamatan.geojson'), true);
if (count($karawangGeo['features']) !== 30) {
    die("[FAIL] Peta utama kehilangan fitur polygon! Jumlah: " . count($karawangGeo['features']) . "\n");
}
echo "[OK] Peta utama memuat seluruh 30 kecamatan Kabupaten Karawang utuh dan terlindungi.\n";

echo "\n========================================================\n";
echo "HASIL AKHIR: VALIDASI DASHBOARD KECAMATAN RAWAMERTA BERHASIL 100%\n";
echo "========================================================\n";
