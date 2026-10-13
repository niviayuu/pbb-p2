<?php
echo "========================================================\n";
echo "VALIDASI SISTEM DASHBOARD PBB-P2 KECAMATAN CILAMAYA WETAN\n";
echo "BAPENDA KABUPATEN KARAWANG\n";
echo "========================================================\n\n";

// 1. Check Files
$files = [
    'index.html',
    'assets/data.js',
    'assets/cilebar_data.js',
    'assets/tempuran_data.js',
    'assets/cilamaya_kulon_data.js',
    'assets/cilamaya_wetan_data.js',
    'js/app.js',
    'css/style.css',
    'cilamaya_wetan_desa.geojson',
    'cilamaya_wetan_paths.json'
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

// 2. Validate assets/cilamaya_wetan_data.js
echo "\n--- 2. Validasi assets/cilamaya_wetan_data.js ---\n";
$cilamayaJs = file_get_contents('assets/cilamaya_wetan_data.js');

preg_match('/const CILAMAYA_WETAN_VIEWBOX_WIDTH = (\d+);/', $cilamayaJs, $mW);
preg_match('/const CILAMAYA_WETAN_VIEWBOX_HEIGHT = (\d+);/', $cilamayaJs, $mH);
preg_match('/const CILAMAYA_WETAN_SUMMARY = (\{.*?\});/s', $cilamayaJs, $mSum);
preg_match('/const CILAMAYA_WETAN_DESA_DATA = (\[.*?\]);/s', $cilamayaJs, $mDesa);

$viewBoxW = (int)($mW[1] ?? 0);
$viewBoxH = (int)($mH[1] ?? 0);
$summary = json_decode($mSum[1] ?? '', true);
$desaList = json_decode($mDesa[1] ?? '', true);

echo "ViewBox: 0 0 $viewBoxW $viewBoxH\n";
echo "Jumlah Desa terdaftar: " . count($desaList) . " desa\n";

$expectedDesa = [
    'Cikalong', 'Cikarang', 'Cilamaya', 'Mekarmaya', 'Muara',
    'Muara Baru', 'Rawagempol Kulon', 'Rawagempol Wetan', 'Sukakerta',
    'Sukatani', 'Tegalsari', 'Tegalwaru'
];

if (count($desaList) !== 12) {
    echo "[FAIL] Jumlah desa harus tepat 12!\n";
} else {
    echo "[OK] Jumlah desa tepat 12 desa resmi Kecamatan Cilamaya Wetan.\n";
}

$desaNames = array_column($desaList, 'name');
$diffNames = array_diff($expectedDesa, $desaNames);
if (count($diffNames) === 0) {
    echo "[OK] Seluruh 12 nama desa cocok 100% dengan daftar resmi instruksi.\n";
} else {
    echo "[FAIL] Ada nama desa yang tidak cocok: " . implode(', ', $diffNames) . "\n";
}

// 3. Mathematical Verification
echo "\n--- 3. Verifikasi Aritmatika & Rumus Pajak ---\n";

$targetKabupaten = 11500000000;
$realisasiKabupaten = 10005000000;
$capaianKabupaten = 87.0;

$sumTarget = 0;
$sumRealisasi = 0;
$sumSisaDesa = 0;
$sumObyek = 0;
$sumLunas = 0;
$sumBelumLunas = 0;

$errors = [];

printf("%-3s | %-18s | %18s | %18s | %8s | %-16s | %18s\n", 
    "No", "Desa", "Target (Rp)", "Realisasi (Rp)", "Capaian", "Status", "Sisa Tagihan (Rp)");
echo str_repeat("-", 108) . "\n";

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

    printf("%-3d | %-18s | %18s | %18s | %7.1f%% | %-16s | %18s\n",
        $d['no'],
        $d['name'],
        number_format($d['target'], 0, ',', '.'),
        number_format($d['realisasi'], 0, ',', '.'),
        $d['capaian'],
        $d['statusText'],
        number_format($d['sisaTagihan'], 0, ',', '.')
    );
}

echo str_repeat("-", 108) . "\n";
$weightedCapaian = round(($sumRealisasi / $sumTarget) * 100, 1);
printf("%-3s | %-18s | %18s | %18s | %7.1f%% | %-16s | %18s\n",
    "TOTAL",
    "12 Desa",
    number_format($sumTarget, 0, ',', '.'),
    number_format($sumRealisasi, 0, ',', '.'),
    $weightedCapaian,
    "Mendekati Target",
    number_format($sumSisaDesa, 0, ',', '.')
);

echo "\n--- 4. Rekonsiliasi Level Kabupaten vs Level Kecamatan ---\n";
echo "Target Kabupaten (data.js)   : Rp " . number_format($targetKabupaten, 0, ',', '.') . "\n";
echo "Target Agregat 12 Desa        : Rp " . number_format($sumTarget, 0, ',', '.') . "\n";
echo "Selisih Target                : Rp " . number_format($sumTarget - $targetKabupaten, 0, ',', '.') . " (" . ($sumTarget === $targetKabupaten ? "SEIMBANG PERSIS 100%" : "SELISIH") . ")\n\n";

echo "Realisasi Kabupaten (data.js): Rp " . number_format($realisasiKabupaten, 0, ',', '.') . "\n";
echo "Realisasi Agregat 12 Desa     : Rp " . number_format($sumRealisasi, 0, ',', '.') . "\n";
echo "Selisih Realisasi             : Rp " . number_format($sumRealisasi - $realisasiKabupaten, 0, ',', '.') . " (" . ($sumRealisasi === $realisasiKabupaten ? "SEIMBANG PERSIS 100%" : "SELISIH") . ")\n\n";

echo "Persentase Capaian Kabupaten : {$capaianKabupaten}%\n";
echo "Persentase Rata-rata Bobot   : {$weightedCapaian}%\n";
echo "Selisih Persentase           : " . round($weightedCapaian - $capaianKabupaten, 2) . "% (" . ($weightedCapaian == $capaianKabupaten ? "SEIMBANG PERSIS 100%" : "SELISIH") . ")\n\n";

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
echo "\n--- 5. Validasi Integrasi index.html & js/app.js ---\n";
$html = file_get_contents('index.html');
$checks = [
    'assets/cilamaya_wetan_data.js' => 'Script cilamaya_wetan_data.js dimuat di HTML',
    'id="thPersentase"' => 'Header tabel dapat diurutkan (thPersentase)',
    'id="desaMapTitle"' => 'ID desaMapTitle ada',
    'id="desaTableTitle"' => 'ID desaTableTitle ada',
];
foreach ($checks as $pattern => $label) {
    if (strpos($html, $pattern) !== false) {
        echo "[OK] $label\n";
    } else {
        echo "[FAIL] $label\n";
    }
}

$appJs = file_get_contents('js/app.js');
$appChecks = [
    'CILAMAYA_WETAN_DESA_DATA' => 'Mendukung CILAMAYA_WETAN_DESA_DATA',
    'CILAMAYA_WETAN_SUMMARY' => 'Mendukung CILAMAYA_WETAN_SUMMARY',
    'cilamaya-wetan' => 'Slug cilamaya-wetan didukung',
    'currentSortMode' => 'Fitur pengurutan tabel capaian aktif',
    'CILAMAYA_KULON_DESA_DATA' => 'Kecamatan Cilamaya Kulon tetap didukung',
    'TEMPURAN_DESA_DATA' => 'Kecamatan Tempuran tetap didukung',
    'CILEBAR_DESA_DATA' => 'Kecamatan Cilebar tetap didukung',
];
foreach ($appChecks as $pattern => $label) {
    if (strpos($appJs, $pattern) !== false) {
        echo "[OK] $label\n";
    } else {
        echo "[FAIL] $label\n";
    }
}
