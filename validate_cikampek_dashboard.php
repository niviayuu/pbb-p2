<?php
echo "========================================================\n";
echo "VALIDASI SISTEM DASHBOARD PBB-P2 KECAMATAN CIKAMPEK\n";
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
    'assets/banyusari_data.js',
    'assets/jatisari_data.js',
    'assets/kotabaru_data.js',
    'assets/cikampek_data.js',
    'js/app.js',
    'css/style.css',
    'cikampek_desa.geojson',
    'cikampek_paths.json',
    'pbb-p2/public/assets/cikampek_data.js',
    'pbb-p2/public/js/app.js',
    'pbb-p2/resources/views/welcome.blade.php'
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

// 2. Validate assets/cikampek_data.js
echo "\n--- 2. Validasi assets/cikampek_data.js ---\n";
$cikampekJs = file_get_contents('assets/cikampek_data.js');

preg_match('/const CIKAMPEK_VIEWBOX_WIDTH = (\d+);/', $cikampekJs, $mW);
preg_match('/const CIKAMPEK_VIEWBOX_HEIGHT = (\d+);/', $cikampekJs, $mH);
preg_match('/const CIKAMPEK_SUMMARY = (\{.*?\});/s', $cikampekJs, $mSum);
preg_match('/const CIKAMPEK_DESA_DATA = (\[.*?\]);/s', $cikampekJs, $mDesa);

$viewBoxW = (int)($mW[1] ?? 0);
$viewBoxH = (int)($mH[1] ?? 0);
$summary = json_decode($mSum[1] ?? '', true);
$desaList = json_decode($mDesa[1] ?? '', true);

echo "ViewBox: 0 0 $viewBoxW $viewBoxH\n";
echo "Jumlah Desa terdaftar: " . count($desaList) . " desa\n";

$expectedDesa = [
    'Cikampek Barat', 'Cikampek Kota', 'Cikampek Pusaka', 'Cikampek Selatan',
    'Cikampek Timur', 'Dawuan Barat', 'Dawuan Tengah', 'Dawuan Timur',
    'Kalihurip', 'Kamojing'
];

if (count($desaList) !== 10) {
    echo "[FAIL] Jumlah desa harus tepat 10!\n";
} else {
    echo "[OK] Jumlah desa tepat 10 desa resmi Kecamatan Cikampek.\n";
}

$desaNames = array_column($desaList, 'name');
$diffNames = array_diff($expectedDesa, $desaNames);
if (count($diffNames) === 0) {
    echo "[OK] Seluruh 10 nama desa cocok 100% dengan daftar resmi instruksi.\n";
} else {
    echo "[FAIL] Ada nama desa yang tidak cocok: " . implode(', ', $diffNames) . "\n";
}

// 3. Mathematical Verification
echo "\n--- 3. Verifikasi Aritmatika & Rumus Pajak ---\n";

$targetKabupaten = 28600000000;
$realisasiKabupaten = 23738000000;
$capaianKabupaten = 83.0;

$sumTarget = 0;
$sumRealisasi = 0;
$sumSisaDesa = 0;
$sumObyek = 0;
$sumLunas = 0;
$sumBelumLunas = 0;

$errors = [];

printf("%-3s | %-18s | %18s | %18s | %8s | %-20s | %18s\n", 
    "No", "Desa", "Target (Rp)", "Realisasi (Rp)", "Capaian", "Status", "Sisa Tagihan (Rp)");
echo str_repeat("-", 112) . "\n";

foreach ($desaList as $d) {
    $sumTarget += $d['target'];
    $sumRealisasi += $d['realisasi'];
    $sumSisaDesa += $d['sisaTagihan'];
    $sumObyek += $d['obyekTerdaftar'];
    $sumLunas += $d['obyekLunas'];
    $sumBelumLunas += $d['obyekBelumLunas'];

    // Verify formula capaian
    if ($d['target'] > 0) {
        $calcCapaian = round(($d['realisasi'] / $d['target']) * 100, 1);
        if (abs($calcCapaian - $d['capaian']) > 0.05) {
            $errors[] = "Capaian tidak cocok pada {$d['name']}: hitung={$calcCapaian} vs data={$d['capaian']}";
        }
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

    // Verify path & centroid
    if (empty($d['path']) || empty($d['cx']) || empty($d['cy'])) {
        $errors[] = "Data geometri hilang pada {$d['name']}";
    }

    printf("%-3d | %-18s | %18s | %18s | %7.1f%% | %-20s | %18s\n",
        $d['no'],
        $d['name'],
        number_format($d['target'], 0, ',', '.'),
        number_format($d['realisasi'], 0, ',', '.'),
        $d['capaian'],
        $d['statusText'],
        number_format($d['sisaTagihan'], 0, ',', '.')
    );
}

echo str_repeat("-", 112) . "\n";
$weightedCapaian = round(($sumRealisasi / $sumTarget) * 100, 1);
printf("%-3s | %-18s | %18s | %18s | %7.1f%% | %-20s | %18s\n",
    "TOTAL",
    "10 Desa",
    number_format($sumTarget, 0, ',', '.'),
    number_format($sumRealisasi, 0, ',', '.'),
    $weightedCapaian,
    "Mendekati Target",
    number_format($sumSisaDesa, 0, ',', '.')
);

echo "\n--- 4. Rekonsiliasi Level Kabupaten vs Level Kecamatan ---\n";
echo "Target Kabupaten (data.js)   : Rp " . number_format($targetKabupaten, 0, ',', '.') . "\n";
echo "Target Agregat 10 Desa       : Rp " . number_format($sumTarget, 0, ',', '.') . "\n";
echo "Selisih Target                : Rp " . number_format($sumTarget - $targetKabupaten, 0, ',', '.') . " (" . ($sumTarget === $targetKabupaten ? "SEIMBANG PERSIS 100%" : "SELISIH") . ")\n\n";

echo "Realisasi Kabupaten (data.js): Rp " . number_format($realisasiKabupaten, 0, ',', '.') . "\n";
echo "Realisasi Agregat 10 Desa    : Rp " . number_format($sumRealisasi, 0, ',', '.') . "\n";
echo "Selisih Realisasi             : Rp " . number_format($sumRealisasi - $realisasiKabupaten, 0, ',', '.') . " (" . ($sumRealisasi === $realisasiKabupaten ? "SEIMBANG PERSIS 100%" : "SELISIH") . ")\n\n";

echo "Persentase Capaian Kabupaten : {$capaianKabupaten}%\n";
echo "Persentase Rata-rata Bobot   : {$weightedCapaian}%\n";
echo "Selisih Persentase           : " . round($weightedCapaian - $capaianKabupaten, 2) . "% (" . ($weightedCapaian == $capaianKabupaten ? "SEIMBANG PERSIS 100%" : "SELISIH") . ")\n\n";

echo "Total Obyek Pajak             : " . number_format($sumObyek, 0, ',', '.') . "\n";
echo "Total Obyek Lunas             : " . number_format($sumLunas, 0, ',', '.') . " (" . ($sumObyek > 0 ? round($sumLunas/$sumObyek*100, 1) : 0) . "%)\n";
echo "Total Obyek Belum Lunas       : " . number_format($sumBelumLunas, 0, ',', '.') . " (" . ($sumObyek > 0 ? round($sumBelumLunas/$sumObyek*100, 1) : 0) . "%)\n";

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
    'assets/cikampek_data.js' => 'Script cikampek_data.js dimuat di HTML',
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
    'CIKAMPEK_DESA_DATA' => 'Mendukung CIKAMPEK_DESA_DATA',
    'CIKAMPEK_SUMMARY' => 'Mendukung CIKAMPEK_SUMMARY',
    'cikampek' => 'Slug cikampek didukung',
    'currentSortMode' => 'Fitur pengurutan tabel capaian aktif',
    'KOTABARU_DESA_DATA' => 'Kecamatan Kotabaru tetap didukung',
    'JATISARI_DESA_DATA' => 'Kecamatan Jatisari tetap didukung',
    'BANYUSARI_DESA_DATA' => 'Kecamatan Banyusari tetap didukung',
    'CILAMAYA_WETAN_DESA_DATA' => 'Kecamatan Cilamaya Wetan tetap didukung',
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
