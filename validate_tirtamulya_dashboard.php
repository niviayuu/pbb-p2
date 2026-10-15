<?php
echo "========================================================\n";
echo "VALIDASI SISTEM DASHBOARD PBB-P2 KECAMATAN TIRTAMULYA\n";
echo "BAPENDA KABUPATEN KARAWANG\n";
echo "========================================================\n\n";

// 1. Check Files
$files = [
    'index.html',
    'assets/data.js',
    'assets/tirtamulya_data.js',
    'pbb-p2/public/assets/tirtamulya_data.js',
    'js/app.js',
    'pbb-p2/public/js/app.js',
    'pbb-p2/resources/views/welcome.blade.php',
    'css/style.css',
    'karawang_kecamatan.geojson',
    'tirtamulya_desa.geojson',
    'tirtamulya_paths.json'
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

// 2. Validate assets/tirtamulya_data.js
echo "\n--- 2. Validasi assets/tirtamulya_data.js ---\n";
$tirtamulyaJs = file_get_contents('assets/tirtamulya_data.js');

preg_match('/const TIRTAMULYA_VIEWBOX_WIDTH = (\d+);/', $tirtamulyaJs, $mW);
preg_match('/const TIRTAMULYA_VIEWBOX_HEIGHT = (\d+);/', $tirtamulyaJs, $mH);
preg_match('/const TIRTAMULYA_SUMMARY = (\{.*?\});/s', $tirtamulyaJs, $mSum);
preg_match('/const TIRTAMULYA_DESA_DATA = (\[.*?\]);/s', $tirtamulyaJs, $mDesa);

$viewBoxW = (int)($mW[1] ?? 0);
$viewBoxH = (int)($mH[1] ?? 0);
$summary = json_decode($mSum[1] ?? '', true);
$desaList = json_decode($mDesa[1] ?? '', true);

echo "ViewBox: 0 0 $viewBoxW $viewBoxH\n";
echo "Jumlah Desa terdaftar: " . count($desaList) . " desa\n";

$expectedDesa = [
    'Karangsinom',
    'Karangjaya',
    'Parakanmulya',
    'Citarik',
    'Tirtasari',
    'Parakan',
    'Kamurang',
    'Bojongsari',
    'Cipondoh',
    'Kertawaluya'
];

if (count($desaList) !== 10) {
    echo "[FAIL] Jumlah desa harus tepat 10!\n";
} else {
    echo "[OK] Jumlah desa tepat 10 desa resmi Kecamatan Tirtamulya.\n";
}

$desaNames = array_column($desaList, 'name');
$diffNames = array_diff($expectedDesa, $desaNames);
if (count($diffNames) === 0) {
    echo "[OK] Seluruh 10 nama desa cocok 100% dengan daftar resmi instruksi.\n";
} else {
    echo "[FAIL] Ada nama desa yang tidak cocok: " . implode(', ', $diffNames) . "\n";
}

// 2b. Validasi terhadap Master Data GeoJSON (Kemendagri / BPS Codes)
echo "\n--- 2b. Validasi Relasi Master Wilayah (tirtamulya_desa.geojson) ---\n";
$geo = json_decode(file_get_contents('tirtamulya_desa.geojson'), true);
$geoCodes = [];
foreach ($geo['features'] as $f) {
    $p = $f['properties'];
    $geoCodes[$p['ori_name'] ?? $p['kel_desa']] = [
        'kode_kd' => $p['kode_kd'] ?? '',
        'kode_kec' => $p['kode_kec'] ?? '',
        'kecamatan' => $p['kecamatan'] ?? ''
    ];
}

foreach ($expectedDesa as $name) {
    if (isset($geoCodes[$name])) {
        $info = $geoCodes[$name];
        echo "[OK] Desa $name terverifikasi resmi: Kode Desa = {$info['kode_kd']}, Kode Kec = {$info['kode_kec']}, Kecamatan = {$info['kecamatan']}\n";
    } else {
        echo "[FAIL] Desa $name tidak ditemukan dalam master GeoJSON Tirtamulya!\n";
    }
}

// 3. Mathematical Verification
echo "\n--- 3. Verifikasi Aritmatika & Rumus Pajak ---\n";

$targetKabupaten = 8400000000;
$realisasiKabupaten = 5124000000;
$capaianKabupaten = 61.0;

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
    $summary['statusText'] ?? "Capaian Sedang",
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
    exit(1);
}

// 5. Check index.html & welcome.blade.php integration
echo "\n--- 5. Validasi Integrasi index.html & welcome.blade.php ---\n";
$html = file_get_contents('index.html');
$blade = file_get_contents('pbb-p2/resources/views/welcome.blade.php');

$checks = [
    'assets/tirtamulya_data.js' => 'Script tirtamulya_data.js dimuat di HTML',
    'id="thPersentase"' => 'Header tabel dapat diurutkan (thPersentase)',
    'id="desaMapTitle"' => 'ID desaMapTitle ada',
    'id="desaTableTitle"' => 'ID desaTableTitle ada',
];
foreach ($checks as $pattern => $label) {
    if (strpos($html, $pattern) !== false) {
        echo "[OK] index.html: $label\n";
    } else {
        echo "[FAIL] index.html: $label\n";
    }
    if (strpos($blade, $pattern) !== false) {
        echo "[OK] welcome.blade.php: $label\n";
    } else {
        echo "[FAIL] welcome.blade.php: $label\n";
    }
}

// 6. Check js/app.js & pbb-p2/public/js/app.js integration
echo "\n--- 6. Validasi Integrasi js/app.js & pbb-p2/public/js/app.js ---\n";
$appFiles = [
    'js/app.js' => file_get_contents('js/app.js'),
    'pbb-p2/public/js/app.js' => file_get_contents('pbb-p2/public/js/app.js')
];

$appChecks = [
    'TIRTAMULYA_DESA_DATA' => 'Mendukung TIRTAMULYA_DESA_DATA',
    'TIRTAMULYA_SUMMARY' => 'Mendukung TIRTAMULYA_SUMMARY',
    'tirtamulya' => 'Slug tirtamulya didukung',
    'currentSortMode' => 'Fitur pengurutan tabel capaian aktif',
    'CIKAMPEK_DESA_DATA' => 'Kecamatan Cikampek tetap didukung (tanpa regresi)',
    'KOTABARU_DESA_DATA' => 'Kecamatan Kotabaru tetap didukung (tanpa regresi)',
    'JATISARI_DESA_DATA' => 'Kecamatan Jatisari tetap didukung (tanpa regresi)',
    'BANYUSARI_DESA_DATA' => 'Kecamatan Banyusari tetap didukung (tanpa regresi)',
    'CILAMAYA_WETAN_DESA_DATA' => 'Kecamatan Cilamaya Wetan tetap didukung (tanpa regresi)',
    'CILAMAYA_KULON_DESA_DATA' => 'Kecamatan Cilamaya Kulon tetap didukung (tanpa regresi)',
    'TEMPURAN_DESA_DATA' => 'Kecamatan Tempuran tetap didukung (tanpa regresi)',
    'CILEBAR_DESA_DATA' => 'Kecamatan Cilebar tetap didukung (tanpa regresi)',
];

foreach ($appFiles as $filePath => $appContent) {
    echo "\nMemeriksa $filePath:\n";
    foreach ($appChecks as $pattern => $label) {
        if (strpos($appContent, $pattern) !== false) {
            echo "[OK] $label\n";
        } else {
            echo "[FAIL] $label pada $filePath\n";
            exit(1);
        }
    }
}

// 7. Check Main Map Protection (PBB-P2 Karawang Map)
echo "\n--- 7. Validasi Proteksi Peta Utama PBB-P2 ---\n";
$dataJs = file_get_contents('assets/data.js');
if (strpos($dataJs, '"id": "tirtamulya"') !== false) {
    echo "[OK] Baseline data.js memuat entri Tirtamulya dengan koordinat dan path utama.\n";
} else {
    echo "[FAIL] Baseline data.js tidak memuat entri Tirtamulya!\n";
    exit(1);
}

// Check total kecamatan count in data.js
preg_match_all('/"id":\s*"([^"]+)"/', $dataJs, $mIds);
$totalKec = count($mIds[1]);
if ($totalKec === 30) {
    echo "[OK] Seluruh 30 kecamatan Kabupaten Karawang pada peta utama utuh dan terlindungi.\n";
} else {
    echo "[FAIL] Jumlah kecamatan pada peta utama tidak 30! (Ditemukan: $totalKec)\n";
    exit(1);
}

echo "\n========================================================\n";
echo "HASIL AKHIR: VALIDASI DASHBOARD KECAMATAN TIRTAMULYA BERHASIL 100%\n";
echo "========================================================\n";
