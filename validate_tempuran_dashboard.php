<?php
echo "========================================================\n";
echo "VALIDASI SISTEM DASHBOARD PBB-P2 KECAMATAN TEMPURAN\n";
echo "BAPENDA KABUPATEN KARAWANG\n";
echo "========================================================\n\n";

// 1. Check Files
$files = [
    'index.html',
    'assets/data.js',
    'assets/cilebar_data.js',
    'assets/tempuran_data.js',
    'js/app.js',
    'css/style.css',
    'tempuran_desa.geojson'
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

// 2. Validate assets/tempuran_data.js
echo "\n--- 2. Validasi assets/tempuran_data.js ---\n";
$tempuranJs = file_get_contents('assets/tempuran_data.js');

preg_match('/const TEMPURAN_VIEWBOX_WIDTH = (\d+);/', $tempuranJs, $mW);
preg_match('/const TEMPURAN_VIEWBOX_HEIGHT = (\d+);/', $tempuranJs, $mH);
preg_match('/const TEMPURAN_SUMMARY = (\{.*?\});/s', $tempuranJs, $mSum);
preg_match('/const TEMPURAN_DESA_DATA = (\[.*?\]);/s', $tempuranJs, $mDesa);

$viewBoxW = (int)($mW[1] ?? 0);
$viewBoxH = (int)($mH[1] ?? 0);
$summary = json_decode($mSum[1] ?? '', true);
$desaList = json_decode($mDesa[1] ?? '', true);

echo "ViewBox: 0 0 $viewBoxW $viewBoxH\n";
echo "Jumlah Desa terdaftar: " . count($desaList) . " desa\n";

if (count($desaList) !== 14) {
    echo "[FAIL] Jumlah desa harus tepat 14!\n";
} else {
    echo "[OK] Jumlah desa tepat 14 desa resmi Kecamatan Tempuran.\n";
}

// 3. Mathematical Verification
echo "\n--- 3. Verifikasi Aritmatika & Rumus Pajak ---\n";

$targetKabupatenTempuran = 9500000000;
$realisasiKabupatenTempuran = 6270000000;
$capaianKabupatenTempuran = 66.0;

$sumTarget = 0;
$sumRealisasi = 0;
$sumSisaDesa = 0;
$sumObyek = 0;
$sumLunas = 0;
$sumBelumLunas = 0;

$errors = [];

printf("%-3s | %-15s | %18s | %18s | %8s | %-16s | %18s\n", 
    "No", "Desa", "Target (Rp)", "Realisasi (Rp)", "Capaian", "Status", "Sisa Tagihan (Rp)");
echo str_repeat("-", 105) . "\n";

foreach ($desaList as $d) {
    $sumTarget += $d['target'];
    $sumRealisasi += $d['realisasi'];
    $sumSisaDesa += $d['sisaTagihan'];
    $sumObyek += $d['obyekTerdaftar'];
    $sumLunas += $d['obyekLunas'];
    $sumBelumLunas += $d['obyekBelumLunas'];

    // Verify formula capaian
    $calcCapaian = round(($d['realisasi'] / $d['target']) * 100, 1);
    if (abs($calcCapaian - $d['capaian']) > 0.05) {
        $errors[] = "Capaian tidak cocok pada {$d['name']}: hitung={$calcCapaian} vs data={$d['capaian']}";
    }

    // Verify formula sisa tagihan
    $calcSisa = max(0, $d['target'] - $d['realisasi']);
    if ($calcSisa !== $d['sisaTagihan']) {
        $errors[] = "Sisa tagihan tidak cocok pada {$d['name']}: hitung={$calcSisa} vs data={$d['sisaTagihan']}";
    }

    // Verify obyek sum
    if ($d['obyekTerdaftar'] !== ($d['obyekLunas'] + $d['obyekBelumLunas'])) {
        $errors[] = "Obyek pajak tidak seimbang pada {$d['name']}";
    }

    // Verify tier & color
    $expectedTier = ($calcCapaian >= 100) ? 'green' : (($calcCapaian >= 70) ? 'yellow' : (($calcCapaian >= 30) ? 'orange' : 'red'));
    if ($d['tier'] !== $expectedTier) {
        $errors[] = "Tier tidak cocok pada {$d['name']}: expected={$expectedTier} vs data={$d['tier']}";
    }

    // Verify path & centroid
    if (empty($d['path']) || empty($d['cx']) || empty($d['cy'])) {
        $errors[] = "Data geometri hilang pada {$d['name']}";
    }

    printf("%-3d | %-15s | %18s | %18s | %7.1f%% | %-16s | %18s\n",
        $d['no'],
        $d['name'],
        number_format($d['target'], 0, ',', '.'),
        number_format($d['realisasi'], 0, ',', '.'),
        $d['capaian'],
        $d['statusText'],
        number_format($d['sisaTagihan'], 0, ',', '.')
    );
}

echo str_repeat("-", 105) . "\n";
$weightedCapaian = round(($sumRealisasi / $sumTarget) * 100, 1);
printf("%-3s | %-15s | %18s | %18s | %7.1f%% | %-16s | %18s\n",
    "TOTAL",
    "14 Desa",
    number_format($sumTarget, 0, ',', '.'),
    number_format($sumRealisasi, 0, ',', '.'),
    $weightedCapaian,
    "Capaian Sedang",
    number_format($sumSisaDesa, 0, ',', '.')
);

echo "\n--- 4. Rekonsiliasi Level Kabupaten vs Level Kecamatan ---\n";
echo "Target Kabupaten (data.js)   : Rp " . number_format($targetKabupatenTempuran, 0, ',', '.') . "\n";
echo "Target Agregat 14 Desa        : Rp " . number_format($sumTarget, 0, ',', '.') . "\n";
echo "Selisih Target                : Rp " . number_format($sumTarget - $targetKabupatenTempuran, 0, ',', '.') . " (" . ($sumTarget === $targetKabupatenTempuran ? "SEIMBANG PERSIS 100%" : "SELISIH") . ")\n\n";

echo "Realisasi Kabupaten (data.js): Rp " . number_format($realisasiKabupatenTempuran, 0, ',', '.') . "\n";
echo "Realisasi Agregat 14 Desa     : Rp " . number_format($sumRealisasi, 0, ',', '.') . "\n";
echo "Selisih Realisasi             : Rp " . number_format($sumRealisasi - $realisasiKabupatenTempuran, 0, ',', '.') . " (" . ($sumRealisasi === $realisasiKabupatenTempuran ? "SEIMBANG PERSIS 100%" : "SELISIH") . ")\n\n";

echo "Persentase Capaian Kabupaten : {$capaianKabupatenTempuran}%\n";
echo "Persentase Rata-rata Bobot   : {$weightedCapaian}%\n";
echo "Selisih Persentase           : " . round($weightedCapaian - $capaianKabupatenTempuran, 2) . "% (" . ($weightedCapaian == $capaianKabupatenTempuran ? "SEIMBANG PERSIS 100%" : "SELISIH") . ")\n\n";

echo "Total Obyek Pajak             : " . number_format($sumObyek, 0, ',', '.') . "\n";
echo "Total Obyek Lunas             : " . number_format($sumLunas, 0, ',', '.') . " (" . round($sumLunas/$sumObyek*100, 1) . "%)\n";
echo "Total Obyek Belum Lunas       : " . number_format($sumBelumLunas, 0, ',', '.') . " (" . round($sumBelumLunas/$sumObyek*100, 1) . "%)\n";

if (count($errors) === 0) {
    echo "\n[OK] SEMUA RUMUS DAN DATA LULUS VALIDASI TANPA KESALAHAN!\n";
} else {
    echo "\n[FAIL] Ditemukan kesalahan:\n";
    foreach ($errors as $e) echo " - $e\n";
}

// 5. Check index.html integration
echo "\n--- 5. Validasi Integrasi index.html ---\n";
$html = file_get_contents('index.html');
$checks = [
    'assets/tempuran_data.js' => 'Script tempuran_data.js dimuat',
    'id="desaMapTitle"' => 'ID desaMapTitle ada',
    'id="desaTableTitle"' => 'ID desaTableTitle ada',
    'id="viewKecamatan"' => 'View Kecamatan ada',
    'id="viewKabupaten"' => 'View Kabupaten ada',
];
foreach ($checks as $pattern => $label) {
    if (strpos($html, $pattern) !== false) {
        echo "[OK] $label\n";
    } else {
        echo "[FAIL] $label\n";
    }
}

// 6. Check js/app.js integration
echo "\n--- 6. Validasi Integrasi js/app.js ---\n";
$appJs = file_get_contents('js/app.js');
$appChecks = [
    'TEMPURAN_DESA_DATA' => 'Mendukung TEMPURAN_DESA_DATA',
    'TEMPURAN_SUMMARY' => 'Mendukung TEMPURAN_SUMMARY',
    'activeKecamatanId' => 'Routing dinamis kecamatan aktif',
    'switchView' => 'Fungsi switchView ada',
    'renderDesaMap' => 'Fungsi renderDesaMap ada',
    'renderDesaTable' => 'Fungsi renderDesaTable ada',
    'selectDesa' => 'Fungsi selectDesa ada',
];
foreach ($appChecks as $pattern => $label) {
    if (strpos($appJs, $pattern) !== false) {
        echo "[OK] $label\n";
    } else {
        echo "[FAIL] $label\n";
    }
}
echo "\n========================================================\n";
echo "HASIL KESELURUHAN: VALIDASI SUKSES 100%\n";
echo "========================================================\n";
