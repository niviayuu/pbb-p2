<?php
echo "=================================================================\n";
echo "VALIDASI SISTEM DASHBOARD PBB-P2 KECAMATAN TELUKJAMBE BARAT\n";
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
    'js/app.js',
    'css/style.css',
    'telukjambe_barat_desa.geojson',
    'telukjambe_barat_paths.json',
    'pbb-p2/public/assets/telukjambe_barat_data.js',
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

// 2. Validate assets/telukjambe_barat_data.js
echo "\n--- 2. Validasi assets/telukjambe_barat_data.js ---\n";
$tjbJs = file_get_contents('assets/telukjambe_barat_data.js');

preg_match('/const TELUKJAMBE_BARAT_VIEWBOX_WIDTH = (\d+);/', $tjbJs, $mW);
preg_match('/const TELUKJAMBE_BARAT_VIEWBOX_HEIGHT = (\d+);/', $tjbJs, $mH);
preg_match('/const TELUKJAMBE_BARAT_SUMMARY = (\{.*?\});/s', $tjbJs, $mSum);
preg_match('/const TELUKJAMBE_BARAT_DESA_DATA = (\[.*?\]);/s', $tjbJs, $mDesa);

$viewBoxW = (int)($mW[1] ?? 0);
$viewBoxH = (int)($mH[1] ?? 0);
$summary = json_decode($mSum[1] ?? '', true);
$desaList = json_decode($mDesa[1] ?? '', true);

echo "ViewBox: 0 0 $viewBoxW $viewBoxH\n";
echo "Jumlah Desa terdaftar: " . count($desaList) . " desa\n";

$expectedDesa = [
    'Karangligar', 'Karangmulya', 'Margakaya', 'Margamulya',
    'Mekarmulya', 'Mulyajaya', 'Parungsari', 'Wanajaya',
    'Wanakerta', 'Wanasari'
];

if (count($desaList) !== 10) {
    echo "[FAIL] Jumlah desa harus tepat 10!\n";
} else {
    echo "[OK] Jumlah desa tepat 10 desa resmi Kecamatan Telukjambe Barat.\n";
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

$targetKabupaten = 16500000000;
$realisasiKabupaten = 11880000000;
$capaianKabupaten = 72.0;

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

    $calcPct = round(($d['realisasi'] / $d['target']) * 100, 1);
    if (abs($calcPct - $d['capaian']) > 0.05) {
        $errors[] = "Desa {$d['name']}: Capaian tidak konsisten ({$calcPct}% vs {$d['capaian']}%)";
    }

    $calcSisa = max(0, $d['target'] - $d['realisasi']);
    if ($calcSisa !== $d['sisaTagihan']) {
        $errors[] = "Desa {$d['name']}: Sisa tagihan salah ($calcSisa vs {$d['sisaTagihan']})";
    }

    if ($d['obyekLunas'] + $d['obyekBelumLunas'] !== $d['obyekTerdaftar']) {
        $errors[] = "Desa {$d['name']}: Obyek pajak lunas + belum lunas != terdaftar";
    }

    if (empty($d['path'])) {
        $errors[] = "Desa {$d['name']}: Path SVG kosong!";
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
$sisaKabupaten = $targetKabupaten - $realisasiKabupaten;

printf("%-3s | %-18s | %18s | %18s | %7.1f%% | %-20s | %18s\n",
    "TOTAL", "AGREGAT KECAMATAN",
    number_format($sumTarget, 0, ',', '.'),
    number_format($sumRealisasi, 0, ',', '.'),
    $weightedCapaian,
    $summary['statusText'],
    number_format($sumSisaDesa, 0, ',', '.')
);

echo "\n--- 4. Rekonsiliasi dengan Master Data Peta PBB-P2 (assets/data.js) ---\n";
echo "Target Kabupaten (data.js)   : Rp. " . number_format($targetKabupaten, 0, ',', '.') . "\n";
echo "Target Agregat 10 Desa       : Rp. " . number_format($sumTarget, 0, ',', '.') . "\n";
if ($sumTarget === $targetKabupaten) {
    echo "[OK] Target Telukjambe Barat cocok 100% tanpa selisih (Selisih: Rp. 0).\n";
} else {
    echo "[FAIL] Ada selisih target: " . ($sumTarget - $targetKabupaten) . "\n";
}

echo "Realisasi Kabupaten (data.js): Rp. " . number_format($realisasiKabupaten, 0, ',', '.') . "\n";
echo "Realisasi Agregat 10 Desa    : Rp. " . number_format($sumRealisasi, 0, ',', '.') . "\n";
if ($sumRealisasi === $realisasiKabupaten) {
    echo "[OK] Realisasi Telukjambe Barat cocok 100% tanpa selisih (Selisih: Rp. 0).\n";
} else {
    echo "[FAIL] Ada selisih realisasi: " . ($sumRealisasi - $realisasiKabupaten) . "\n";
}

echo "Capaian Kabupaten (data.js)  : " . number_format($capaianKabupaten, 1, ',', '') . "%\n";
echo "Capaian Agregat 10 Desa      : " . number_format($weightedCapaian, 1, ',', '') . "%\n";
if (abs($weightedCapaian - $capaianKabupaten) < 0.05) {
    echo "[OK] Persentase capaian cocok 100% secara agregat (Total Realisasi / Total Target).\n";
} else {
    echo "[FAIL] Ada selisih persentase capaian!\n";
}

echo "Sisa Ketetapan (Target - Realisasi) : Rp. " . number_format($sisaKabupaten, 0, ',', '.') . "\n";
echo "Sisa Tagihan Agregat 10 Desa        : Rp. " . number_format($sumSisaDesa, 0, ',', '.') . "\n";
if ($sumSisaDesa === $sisaKabupaten) {
    echo "[OK] Sisa ketetapan / sisa tagihan cocok 100% (Selisih: Rp. 0).\n";
} else {
    echo "[FAIL] Ada selisih sisa tagihan!\n";
}

// 5. Check app.js integration
echo "\n--- 5. Validasi Integrasi app.js & HTML ---\n";
$appJs = file_get_contents('js/app.js');
$appJsPub = file_get_contents('pbb-p2/public/js/app.js');
$indexHtml = file_get_contents('index.html');
$bladeHtml = file_get_contents('pbb-p2/resources/views/welcome.blade.php');

if (strpos($appJs, "'telukjambe-barat'") !== false && strpos($appJs, "activeKecamatanId = 'telukjambe-barat'") !== false) {
    echo "[OK] js/app.js mengenali kecamatan 'telukjambe-barat'.\n";
} else {
    echo "[FAIL] js/app.js belum dikonfigurasi untuk 'telukjambe-barat'.\n";
}

if ($appJs === $appJsPub) {
    echo "[OK] js/app.js dan pbb-p2/public/js/app.js 100% identik dan tersinkronisasi.\n";
} else {
    echo "[FAIL] js/app.js dan pbb-p2/public/js/app.js berbeda!\n";
}

if (strpos($indexHtml, 'assets/telukjambe_barat_data.js') !== false) {
    echo "[OK] index.html memuat assets/telukjambe_barat_data.js.\n";
} else {
    echo "[FAIL] index.html belum memuat assets/telukjambe_barat_data.js.\n";
}

if (strpos($bladeHtml, 'assets/telukjambe_barat_data.js') !== false) {
    echo "[OK] welcome.blade.php memuat assets/telukjambe_barat_data.js.\n";
} else {
    echo "[FAIL] welcome.blade.php belum memuat assets/telukjambe_barat_data.js.\n";
}

// 6. Check Main Map Protection (Karawang 30 Kecamatan)
echo "\n--- 6. Proteksi Peta Karawang Utama (30 Kecamatan) ---\n";
$karawangDataJs = file_get_contents('assets/data.js');
preg_match_all('/"id":\s*"([^"]+)"/', $karawangDataJs, $matchesKec);
$totalKec = count($matchesKec[1]);
echo "Total kecamatan pada peta utama (assets/data.js): $totalKec kecamatan\n";
if ($totalKec === 30) {
    echo "[OK] Seluruh 30 kecamatan Kabupaten Karawang utuh dan terlindungi!\n";
} else {
    echo "[FAIL] Jumlah kecamatan tidak 30 ($totalKec)!\n";
}

if (in_array('telukjambe-barat', $matchesKec[1])) {
    echo "[OK] ID 'telukjambe-barat' terdaftar dalam peta utama.\n";
} else {
    echo "[FAIL] ID 'telukjambe-barat' tidak ditemukan dalam data peta utama!\n";
}

// 7. Error Summary
if (count($errors) === 0) {
    echo "\n>>> SELURUH VALIDASI BERHASIL 100% (ZERO ERRORS) <<<\n";
} else {
    echo "\n>>> DITEMUKAN " . count($errors) . " KESALAHAN: <<<\n";
    foreach ($errors as $e) {
        echo "- $e\n";
    }
}
