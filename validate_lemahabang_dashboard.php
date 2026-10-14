<?php
// Comprehensive Validation Script for Kecamatan Lemahabang PBB-P2 Dashboard
$errors = [];
$successes = [];

function check($cond, $msg) {
    global $errors, $successes;
    if ($cond) {
        $successes[] = "[PASS] $msg";
    } else {
        $errors[] = "[FAIL] $msg";
    }
}

echo "======================================================\n";
echo "VALIDASI SISTEM: KECAMATAN LEMAHABANG PBB-P2 DASHBOARD\n";
echo "======================================================\n\n";

// 1. Files existence
$files = [
    'assets/data.js',
    'assets/lemahabang_data.js',
    'pbb-p2/public/assets/lemahabang_data.js',
    'lemahabang_desa.geojson',
    'lemahabang_paths.json',
    'js/app.js',
    'pbb-p2/public/js/app.js',
    'index.html',
    'pbb-p2/resources/views/welcome.blade.php'
];

foreach ($files as $f) {
    check(file_exists($f), "File $f exists");
}

// 2. Index.html & welcome.blade.php script tags
$indexHtml = file_get_contents('index.html');
$blade = file_get_contents('pbb-p2/resources/views/welcome.blade.php');

check(strpos($indexHtml, 'src="assets/lemahabang_data.js"') !== false, "index.html includes assets/lemahabang_data.js");
check(strpos($blade, 'src="assets/lemahabang_data.js"') !== false, "welcome.blade.php includes assets/lemahabang_data.js");

// 3. Main map in assets/data.js intact
$dataJs = file_get_contents('assets/data.js');
preg_match_all('/"id":\s*"([^"]+)"/', $dataJs, $kecMatches);
$totalKec = count($kecMatches[1]);
check($totalKec === 30, "Main map has exactly 30 kecamatan in assets/data.js (Count: $totalKec)");
check(in_array('lemahabang', $kecMatches[1]), "assets/data.js contains 'lemahabang'");

// Check baseline numbers for lemahabang in assets/data.js
preg_match('/\{\s*"id":\s*"lemahabang",\s*"name":\s*"Lemahabang",\s*"target":\s*(\d+),\s*"targetFormatted":\s*"([^"]+)",\s*"realisasi":\s*(\d+),\s*"realisasiFormatted":\s*"([^"]+)",\s*"capaian":\s*(\d+)/s', $dataJs, $baseMatch);
if ($baseMatch) {
    $baselineTarget = (int)$baseMatch[1];
    $baselineRealisasi = (int)$baseMatch[3];
    $baselineCapaian = (int)$baseMatch[5];
    check($baselineTarget === 12400000000, "assets/data.js Lemahabang target is 12.400.000.000");
    check($baselineRealisasi === 8804000000, "assets/data.js Lemahabang realisasi is 8.804.000.000");
    check($baselineCapaian === 71, "assets/data.js Lemahabang capaian is 71%");
} else {
    $errors[] = "[FAIL] Lemahabang data regex match in assets/data.js failed";
}

// 4. Lemahabang data validation
$lemahabangContent = file_get_contents('assets/lemahabang_data.js');
preg_match('/const LEMAHABANG_SUMMARY = (\{.*?\});/s', $lemahabangContent, $sm);
preg_match('/const LEMAHABANG_DESA_DATA = (\[.*?\]);/s', $lemahabangContent, $dm);

if ($sm && $dm) {
    $summary = json_decode($sm[1], true);
    $desaData = json_decode($dm[1], true);

    check(is_array($summary), "LEMAHABANG_SUMMARY is valid JSON");
    check(is_array($desaData), "LEMAHABANG_DESA_DATA is valid JSON");

    check($summary['target'] === 12400000000, "Summary target is Rp 12.400.000.000");
    check($summary['realisasi'] === 8804000000, "Summary realisasi is Rp 8.804.000.000");
    check($summary['sisaTagihan'] === 3596000000, "Summary sisaTagihan is Rp 3.596.000.000");
    check($summary['capaian'] === 71, "Summary capaian is 71%");
    check($summary['jumlahDesa'] === 11, "Summary jumlahDesa is 11");
    check(count($desaData) === 11, "Village array count is exactly 11");

    $expectedVillages = [
        "Ciwaringin",
        "Karangtanjung",
        "Karyamukti",
        "Kedawung",
        "Lemahabang",
        "Lemahmukti",
        "Pasirtanjung",
        "Pulojaya",
        "Pulokalapa",
        "Pulomulya",
        "Waringinkarya"
    ];

    $actualVillages = array_column($desaData, 'name');
    check($actualVillages === $expectedVillages, "All 11 expected villages match in order: " . implode(', ', $actualVillages));

    $sumT = 0;
    $sumR = 0;
    $sumS = 0;
    $sumO = 0;
    $sumL = 0;
    $sumB = 0;

    foreach ($desaData as $d) {
        $sumT += $d['target'];
        $sumR += $d['realisasi'];
        $sumS += $d['sisaTagihan'];
        $sumO += $d['obyekTerdaftar'];
        $sumL += $d['obyekLunas'];
        $sumB += $d['obyekBelumLunas'];

        check(!empty($d['path']), "Village {$d['name']} has SVG path");
        check(isset($d['cx']) && isset($d['cy']), "Village {$d['name']} has cx, cy coordinates");
        check($d['target'] - $d['realisasi'] === $d['sisaTagihan'], "Village {$d['name']} target - realisasi = sisaTagihan");
    }

    check($sumT === $summary['target'], "Sum of village targets ($sumT) matches summary target ({$summary['target']}) [Selisih: Rp 0]");
    check($sumR === $summary['realisasi'], "Sum of village realisasi ($sumR) matches summary realisasi ({$summary['realisasi']}) [Selisih: Rp 0]");
    check($sumS === $summary['sisaTagihan'], "Sum of village sisaTagihan ($sumS) matches summary sisaTagihan ({$summary['sisaTagihan']}) [Selisih: Rp 0]");
    check($sumO === $summary['obyekTerdaftar'], "Sum of village obyekTerdaftar ($sumO) matches summary obyekTerdaftar ({$summary['obyekTerdaftar']})");
    check($sumL === $summary['obyekLunas'], "Sum of village obyekLunas ($sumL) matches summary obyekLunas ({$summary['obyekLunas']})");
    check($sumB === $summary['obyekBelumLunas'], "Sum of village obyekBelumLunas ($sumB) matches summary obyekBelumLunas ({$summary['obyekBelumLunas']})");

} else {
    $errors[] = "[FAIL] Could not extract LEMAHABANG_SUMMARY or LEMAHABANG_DESA_DATA from assets/lemahabang_data.js";
}

// 5. Check app.js logic
$appJs = file_get_contents('js/app.js');
check(strpos($appJs, "activeKecamatanId = 'lemahabang';") !== false, "app.js has initKecamatanView branch for lemahabang");
check(strpos($appJs, "const inLemahabang = typeof LEMAHABANG_DESA_DATA !== 'undefined'") !== false, "app.js has hash routing for lemahabang");
check(strpos($appJs, "'lemahabang'") !== false, "app.js has lemahabang in validKecs");

echo "\n--- HASIL VALIDASI ---\n";
foreach ($successes as $s) {
    echo "$s\n";
}

if (!empty($errors)) {
    echo "\nTERDAPAT ERROR:\n";
    foreach ($errors as $e) {
        echo "$e\n";
    }
    exit(1);
} else {
    echo "\nSEMUA VALIDASI BERHASIL (100% PASS - TANPA ERROR / SELISIH)\n";
    exit(0);
}
