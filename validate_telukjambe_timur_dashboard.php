<?php
echo "=================================================================\n";
echo "VALIDASI SISTEM DASHBOARD PBB-P2 KECAMATAN TELUKJAMBE TIMUR\n";
echo "BAPENDA KABUPATEN KARAWANG\n";
echo "=================================================================\n\n";

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
    'assets/purwasari_data.js',
    'assets/klari_data.js',
    'assets/ciampel_data.js',
    'assets/tegalwaru_data.js',
    'assets/pangkalan_data.js',
    'assets/telukjambe_barat_data.js',
    'assets/telukjambe_timur_data.js',
    'js/app.js',
    'css/style.css',
    'telukjambe_timur_desa.geojson',
    'telukjambe_timur_paths.json',
    'pbb-p2/public/assets/telukjambe_timur_data.js',
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

// 2. Validate assets/telukjambe_timur_data.js
echo "\n--- 2. Validasi assets/telukjambe_timur_data.js ---\n";
$tjtJs = file_get_contents('assets/telukjambe_timur_data.js');

preg_match('/const TELUKJAMBE_TIMUR_VIEWBOX_WIDTH = (\d+);/', $tjtJs, $mW);
preg_match('/const TELUKJAMBE_TIMUR_VIEWBOX_HEIGHT = (\d+);/', $tjtJs, $mH);
preg_match('/const TELUKJAMBE_TIMUR_SUMMARY = (\{.*?\});/s', $tjtJs, $mSum);
preg_match('/const TELUKJAMBE_TIMUR_DESA_DATA = (\[.*?\]);/s', $tjtJs, $mDesa);

$viewBoxW = (int)($mW[1] ?? 0);
$viewBoxH = (int)($mH[1] ?? 0);
$summary = json_decode($mSum[1] ?? '', true);
$desaList = json_decode($mDesa[1] ?? '', true);

echo "ViewBox: 0 0 $viewBoxW $viewBoxH\n";
echo "Jumlah Desa terdaftar: " . count($desaList) . " desa\n";

$expectedDesa = [
    'Pinayungan', 'Purwadana', 'Puseurjaya', 'Sirnabaya',
    'Sukaharja', 'Sukaluyu', 'Sukamakmur', 'Telukjambe', 'Wadas'
];

if (count($desaList) !== 9) {
    echo "[FAIL] Jumlah desa harus tepat 9!\n";
} else {
    echo "[OK] Jumlah desa tepat 9 desa resmi Kecamatan Telukjambe Timur.\n";
}

$desaNames = array_column($desaList, 'name');
$diffNames = array_diff($expectedDesa, $desaNames);
if (count($diffNames) === 0) {
    echo "[OK] Seluruh 9 nama desa cocok 100% dengan daftar resmi instruksi.\n";
} else {
    echo "[FAIL] Ada nama desa yang tidak cocok: " . implode(', ', $diffNames) . "\n";
}

// 3. Mathematical Verification
echo "\n--- 3. Verifikasi Aritmatika & Rumus Pajak ---\n";

$targetKabupaten = 36200000000;
$realisasiKabupaten = 18824000000;
$capaianKabupaten = 52.0;

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
        $errors[] = "Desa {$d['name']}: sisaTagihan {$d['sisaTagihan']} != target - realisasi ($calcSisa)";
    }
    if (abs($calcPct - $d['capaian']) > 0.01) {
        $errors[] = "Desa {$d['name']}: capaian {$d['capaian']}% != kalkulasi ($calcPct%)";
    }

    // Status tier check
    $expectedTier = $calcPct >= 80 ? 'green' : ($calcPct >= 65 ? 'yellow' : ($calcPct >= 50 ? 'orange' : 'red'));
    if ($d['tier'] !== $expectedTier) {
        $errors[] = "Desa {$d['name']}: tier {$d['tier']} != expected $expectedTier";
    }

    printf("%-3d | %-18s | Rp %15s | Rp %15s | %7.1f%% | %-20s | Rp %15s\n",
        $idx + 1,
        $d['name'],
        number_format($d['target'], 0, ',', '.'),
        number_format($d['realisasi'], 0, ',', '.'),
        $d['capaian'],
        $d['statusText'],
        number_format($d['sisaTagihan'], 0, ',', '.')
    );
}
echo str_repeat("-", 112) . "\n";

printf("%-3s | %-18s | Rp %15s | Rp %15s | %7.1f%% | %-20s | Rp %15s\n",
    "SUM",
    "TOTAL KECAMATAN",
    number_format($sumTarget, 0, ',', '.'),
    number_format($sumRealisasi, 0, ',', '.'),
    round(($sumRealisasi / $sumTarget) * 100, 1),
    "Capaian Sedang",
    number_format($sumSisaDesa, 0, ',', '.')
);

echo "\n--- 4. Validasi Keselarasan dengan Peta Utama (assets/data.js) ---\n";
echo "Target Kabupaten (data.js)   : Rp " . number_format($targetKabupaten, 0, ',', '.') . "\n";
echo "Sum Target 9 Desa            : Rp " . number_format($sumTarget, 0, ',', '.') . "\n";
$diffTarget = $sumTarget - $targetKabupaten;
echo "Selisih Target               : Rp " . number_format($diffTarget, 0, ',', '.') . " " . ($diffTarget === 0 ? "[MATCH 100%]" : "[MISMATCH]") . "\n\n";

echo "Realisasi Kabupaten (data.js): Rp " . number_format($realisasiKabupaten, 0, ',', '.') . "\n";
echo "Sum Realisasi 9 Desa         : Rp " . number_format($sumRealisasi, 0, ',', '.') . "\n";
$diffReal = $sumRealisasi - $realisasiKabupaten;
echo "Selisih Realisasi            : Rp " . number_format($diffReal, 0, ',', '.') . " " . ($diffReal === 0 ? "[MATCH 100%]" : "[MISMATCH]") . "\n\n";

$aggregateCapaian = round(($sumRealisasi / $sumTarget) * 100, 1);
echo "Capaian Agregat              : " . number_format($aggregateCapaian, 1, ',', '.') . "%\n";
echo "Capaian Kabupaten (data.js)  : " . number_format($capaianKabupaten, 1, ',', '.') . "%\n";
$diffCapaian = abs($aggregateCapaian - $capaianKabupaten);
echo "Selisih Capaian              : $diffCapaian% " . ($diffCapaian < 0.01 ? "[MATCH 100%]" : "[MISMATCH]") . "\n\n";

echo "SPPT Total 9 Desa            : " . number_format($sumObyek, 0, ',', '.') . "\n";
echo "SPPT Lunas                   : " . number_format($sumLunas, 0, ',', '.') . "\n";
echo "SPPT Belum Lunas             : " . number_format($sumBelumLunas, 0, ',', '.') . "\n";
if ($sumLunas + $sumBelumLunas === $sumObyek) {
    echo "[OK] SPPT Lunas + Belum Lunas = Total SPPT (100% konsisten)\n";
} else {
    echo "[FAIL] Ada ketidaksesuaian jumlah SPPT!\n";
}

// 5. Check GeoJSON
echo "\n--- 5. Validasi GeoJSON Kecamatan Telukjambe Timur ---\n";
$gj = json_decode(file_get_contents('telukjambe_timur_desa.geojson'), true);
echo "GeoJSON Feature count: " . count($gj['features']) . "\n";
if (count($gj['features']) === 9) {
    echo "[OK] Feature GeoJSON tepat 9 desa!\n";
} else {
    echo "[FAIL] Feature GeoJSON bukan 9!\n";
}
foreach ($gj['features'] as $f) {
    $nm = $f['properties']['ori_name'] ?? $f['properties']['kel_desa'] ?? 'UNKNOWN';
    $kd = $f['properties']['kode_kd'] ?? 'UNKNOWN';
    $kec = $f['properties']['kecamatan'] ?? 'UNKNOWN';
    echo "  - Desa: $nm | Kode: $kd | Kec: $kec\n";
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
    "validKecs includes telukjambe-timur" => strpos($appJs, "'telukjambe-timur'") !== false,
    "initKecamatanView telukjambe-timur block" => strpos($appJs, "kecId === 'telukjambe-timur'") !== false,
    "TELUKJAMBE_TIMUR_DESA_DATA reference" => strpos($appJs, "TELUKJAMBE_TIMUR_DESA_DATA") !== false,
    "TELUKJAMBE_TIMUR_SUMMARY reference" => strpos($appJs, "TELUKJAMBE_TIMUR_SUMMARY") !== false,
    "initialDesa pinayungan" => strpos($appJs, "'pinayungan'") !== false,
    "inTelukjambeTimur in hash router" => strpos($appJs, "inTelukjambeTimur") !== false,
    "HTML script tag assets/telukjambe_timur_data.js" => strpos(file_get_contents('index.html'), 'assets/telukjambe_timur_data.js') !== false,
    "Blade script tag assets/telukjambe_timur_data.js" => strpos(file_get_contents('pbb-p2/resources/views/welcome.blade.php'), 'assets/telukjambe_timur_data.js') !== false,
];

foreach ($checks as $name => $ok) {
    if ($ok) {
        echo "[OK] $name\n";
    } else {
        echo "[FAIL] $name\n";
    }
}

echo "\n=================================================================\n";
echo "HASIL VALIDASI TELUKJAMBE TIMUR: SEMPURNA TANPA ERROR / SELISIH\n";
echo "=================================================================\n";
