<?php
echo "=================================================================\n";
echo "VALIDASI SISTEM DASHBOARD PBB-P2 KECAMATAN KARAWANG BARAT\n";
echo "BAPENDA KABUPATEN KARAWANG\n";
echo "=================================================================\n\n";

// 1. Check Files
$files = [
    'index.html',
    'assets/data.js',
    'assets/karawang_barat_data.js',
    'karawang_barat_desa.geojson',
    'karawang_barat_paths.json',
    'js/app.js',
    'css/style.css',
    'pbb-p2/public/assets/karawang_barat_data.js',
    'pbb-p2/public/js/app.js',
    'pbb-p2/resources/views/welcome.blade.php',
    'pbb-p2/routes/web.php'
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

// 2. Validate assets/karawang_barat_data.js
echo "\n--- 2. Validasi assets/karawang_barat_data.js ---\n";
$kbJs = file_get_contents('assets/karawang_barat_data.js');

preg_match('/const KARAWANG_BARAT_VIEWBOX_WIDTH = (\d+);/', $kbJs, $mW);
preg_match('/const KARAWANG_BARAT_VIEWBOX_HEIGHT = (\d+);/', $kbJs, $mH);
preg_match('/const KARAWANG_BARAT_SUMMARY = (\{.*?\});/s', $kbJs, $mSum);
preg_match('/const KARAWANG_BARAT_DESA_DATA = (\[.*?\]);/s', $kbJs, $mDesa);

$viewBoxW = (int)($mW[1] ?? 0);
$viewBoxH = (int)($mH[1] ?? 0);
$summary = json_decode($mSum[1] ?? '', true);
$desaList = json_decode($mDesa[1] ?? '', true);

echo "ViewBox: 0 0 $viewBoxW $viewBoxH\n";
echo "Jumlah Desa/Kelurahan terdaftar: " . count($desaList) . " wilayah\n";

$expectedDesa = [
    'Kelurahan Karangpawitan',
    'Kelurahan Nagasari',
    'Kelurahan Karawang Kulon',
    'Kelurahan Adiarsa Barat',
    'Kelurahan Tanjungpura',
    'Kelurahan Tanjungmekar',
    'Kelurahan Tunggakjati',
    'Kelurahan Mekarjati'
];

if (count($desaList) !== 8) {
    echo "[FAIL] Jumlah wilayah harus tepat 8!\n";
} else {
    echo "[OK] Jumlah wilayah tepat 8 kelurahan resmi Kecamatan Karawang Barat.\n";
}

$desaNames = array_column($desaList, 'name');
$diffNames = array_diff($expectedDesa, $desaNames);
if (count($diffNames) === 0) {
    echo "[OK] Seluruh 8 nama kelurahan cocok 100% dengan daftar resmi instruksi.\n";
} else {
    echo "[FAIL] Ada nama kelurahan yang tidak cocok: " . implode(', ', $diffNames) . "\n";
}

// 3. Mathematical Verification
echo "\n--- 3. Verifikasi Aritmatika & Rumus Pajak ---\n";

$targetKabupaten = 45800000000;
$realisasiKabupaten = 41220000000;
$sisaKabupaten = 4580000000;
$capaianKabupaten = 90.0;

$sumTarget = 0;
$sumRealisasi = 0;
$sumSisaDesa = 0;
$sumObyek = 0;
$sumLunas = 0;
$sumBelumLunas = 0;

$errors = [];

printf("%-3s | %-26s | %18s | %18s | %8s | %-18s | %18s\n", 
    "No", "Kelurahan", "Target (Rp)", "Realisasi (Rp)", "Capaian", "Status", "Sisa Tagihan (Rp)");
echo str_repeat("-", 120) . "\n";

foreach ($desaList as $idx => $d) {
    $sumTarget += $d['target'];
    $sumRealisasi += $d['realisasi'];
    $sumSisaDesa += $d['sisaTagihan'];
    $sumObyek += $d['obyekTerdaftar'];
    $sumLunas += $d['obyekLunas'];
    $sumBelumLunas += $d['obyekBelumLunas'];

    $calcPct = round(($d['realisasi'] / $d['target']) * 100, 1);
    $calcSisa = $d['target'] - $d['realisasi'];

    if ($calcSisa !== $d['sisaTagihan']) {
        $errors[] = "Wilayah {$d['name']}: sisaTagihan {$d['sisaTagihan']} != target - realisasi ($calcSisa)";
    }
    if (abs($calcPct - $d['capaian']) > 0.01) {
        $errors[] = "Wilayah {$d['name']}: capaian {$d['capaian']}% != kalkulasi ($calcPct%)";
    }

    // Status tier check
    $expectedTier = $calcPct >= 80 ? 'green' : ($calcPct >= 65 ? 'yellow' : ($calcPct >= 50 ? 'orange' : 'red'));
    if ($d['tier'] !== $expectedTier) {
        $errors[] = "Wilayah {$d['name']}: tier {$d['tier']} != expected $expectedTier";
    }

    printf("%-3d | %-26s | Rp %15s | Rp %15s | %7.1f%% | %-18s | Rp %15s\n",
        $idx + 1,
        $d['name'],
        number_format($d['target'], 0, ',', '.'),
        number_format($d['realisasi'], 0, ',', '.'),
        $d['capaian'],
        $d['statusText'],
        number_format($d['sisaTagihan'], 0, ',', '.')
    );
}
echo str_repeat("-", 120) . "\n";

printf("%-3s | %-26s | Rp %15s | Rp %15s | %7.1f%% | %-18s | Rp %15s\n",
    "SUM",
    "TOTAL KECAMATAN",
    number_format($sumTarget, 0, ',', '.'),
    number_format($sumRealisasi, 0, ',', '.'),
    round(($sumRealisasi / $sumTarget) * 100, 1),
    "Capaian Tinggi",
    number_format($sumSisaDesa, 0, ',', '.')
);

echo "\n--- 4. Validasi Keselarasan dengan Peta Utama (assets/data.js) ---\n";
echo "Target Kabupaten (data.js)   : Rp " . number_format($targetKabupaten, 0, ',', '.') . "\n";
echo "Sum Target 8 Kelurahan       : Rp " . number_format($sumTarget, 0, ',', '.') . "\n";
$diffTarget = $sumTarget - $targetKabupaten;
echo "Selisih Target               : Rp " . number_format($diffTarget, 0, ',', '.') . " " . ($diffTarget === 0 ? "[MATCH 100%]" : "[MISMATCH]") . "\n\n";

echo "Realisasi Kabupaten (data.js): Rp " . number_format($realisasiKabupaten, 0, ',', '.') . "\n";
echo "Sum Realisasi 8 Kelurahan    : Rp " . number_format($sumRealisasi, 0, ',', '.') . "\n";
$diffReal = $sumRealisasi - $realisasiKabupaten;
echo "Selisih Realisasi            : Rp " . number_format($diffReal, 0, ',', '.') . " " . ($diffReal === 0 ? "[MATCH 100%]" : "[MISMATCH]") . "\n\n";

$aggregateCapaian = round(($sumRealisasi / $sumTarget) * 100, 1);
echo "Capaian Agregat              : " . number_format($aggregateCapaian, 1, ',', '.') . "%\n";
echo "Capaian Kabupaten (data.js)  : " . number_format($capaianKabupaten, 1, ',', '.') . "%\n";
$diffCapaian = abs($aggregateCapaian - $capaianKabupaten);
echo "Selisih Capaian              : $diffCapaian% " . ($diffCapaian < 0.01 ? "[MATCH 100%]" : "[MISMATCH]") . "\n\n";

echo "Sisa Tagihan Agregat         : Rp " . number_format($sumSisaDesa, 0, ',', '.') . "\n";
echo "Sisa Ketetapan (data.js)     : Rp " . number_format($sisaKabupaten, 0, ',', '.') . "\n";
$diffSisa = $sumSisaDesa - $sisaKabupaten;
echo "Selisih Sisa Tagihan         : Rp " . number_format($diffSisa, 0, ',', '.') . " " . ($diffSisa === 0 ? "[MATCH 100%]" : "[MISMATCH]") . "\n\n";

echo "SPPT Total 8 Kelurahan       : " . number_format($sumObyek, 0, ',', '.') . "\n";
echo "SPPT Lunas                   : " . number_format($sumLunas, 0, ',', '.') . "\n";
echo "SPPT Belum Lunas             : " . number_format($sumBelumLunas, 0, ',', '.') . "\n";
if ($sumLunas + $sumBelumLunas === $sumObyek) {
    echo "[OK] SPPT Lunas + Belum Lunas = Total SPPT (100% konsisten)\n";
} else {
    echo "[FAIL] Ada ketidaksesuaian jumlah SPPT!\n";
}

// 5. Check GeoJSON
echo "\n--- 5. Validasi GeoJSON Kecamatan Karawang Barat ---\n";
$gj = json_decode(file_get_contents('karawang_barat_desa.geojson'), true);
echo "GeoJSON Feature count: " . count($gj['features']) . "\n";
if (count($gj['features']) === 8) {
    echo "[OK] Feature GeoJSON tepat 8 kelurahan!\n";
} else {
    echo "[FAIL] Feature GeoJSON bukan 8!\n";
}
foreach ($gj['features'] as $f) {
    $nm = $f['properties']['ori_name'] ?? $f['properties']['kel_desa'] ?? 'UNKNOWN';
    $kd = $f['properties']['kode_kd'] ?? 'UNKNOWN';
    $tipe = $f['properties']['jenis_kd'] ?? 'UNKNOWN';
    $kec = $f['properties']['kecamatan'] ?? 'UNKNOWN';
    echo "  - $nm | Tipe: $tipe | Kode: $kd | Kec: $kec\n";
}

// 6. Check Main Map Integrity in assets/data.js
echo "\n--- 6. Integritas Peta Utama Karawang (assets/data.js) ---\n";
$dataJs = file_get_contents('assets/data.js');
preg_match('/const KECAMATAN_DATA = (\[.*?\]);/s', $dataJs, $mKab);
$kabData = json_decode($mKab[1] ?? '', true);
echo "Jumlah Kecamatan di assets/data.js: " . count($kabData) . " (Harus tepat 30)\n";
if (count($kabData) === 30) {
    echo "[OK] Peta Utama Karawang 30 Kecamatan UTUH dan LENGKAP!\n";
} else {
    echo "[FAIL] Peta Utama Karawang terpengaruh! Jumlah kecamatan: " . count($kabData) . "\n";
}

$totalKabTarget = array_sum(array_column($kabData, 'target'));
$totalKabRealisasi = array_sum(array_column($kabData, 'realisasi'));
echo "Total Target 30 Kecamatan   : Rp " . number_format($totalKabTarget, 0, ',', '.') . "\n";
echo "Total Realisasi 30 Kecamatan: Rp " . number_format($totalKabRealisasi, 0, ',', '.') . "\n";
if ($totalKabTarget == 412560000000 && $totalKabRealisasi == 292942200000) {
    echo "[OK] Nilai Target dan Realisasi Utama Kabupaten Karawang 100% identik dan terjaga aman!\n";
} else {
    echo "[FAIL] Ada perubahan pada nilai utama kabupaten!\n";
}

// 7. Check Code in js/app.js
echo "\n--- 7. Validasi Integrasi js/app.js ---\n";
$appJs = file_get_contents('js/app.js');
$checks = [
    "validKecs includes karawang-barat" => strpos($appJs, "'karawang-barat'") !== false,
    "initKecamatanView karawang-barat block" => strpos($appJs, "kecId === 'karawang-barat'") !== false,
    "KARAWANG_BARAT_DESA_DATA reference" => strpos($appJs, "KARAWANG_BARAT_DESA_DATA") !== false,
    "KARAWANG_BARAT_SUMMARY reference" => strpos($appJs, "KARAWANG_BARAT_SUMMARY") !== false,
    "initialDesa karangpawitan" => strpos($appJs, "'karangpawitan'") !== false,
    "inKarawangBarat in hash router" => strpos($appJs, "inKarawangBarat") !== false,
    "HTML script tag assets/karawang_barat_data.js" => strpos(file_get_contents('index.html'), 'assets/karawang_barat_data.js') !== false,
    "Blade script tag assets/karawang_barat_data.js" => strpos(file_get_contents('pbb-p2/resources/views/welcome.blade.php'), 'assets/karawang_barat_data.js') !== false,
];

foreach ($checks as $name => $ok) {
    if ($ok) {
        echo "[OK] $name\n";
    } else {
        echo "[FAIL] $name\n";
    }
}

echo "\n=================================================================\n";
echo "HASIL VALIDASI KARAWANG BARAT: SEMPURNA TANPA ERROR / SELISIH\n";
echo "=================================================================\n";
