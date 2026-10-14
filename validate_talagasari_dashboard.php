<?php
// Comprehensive Validation Script for Kecamatan Talagasari PBB-P2 Dashboard
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
echo "VALIDASI SISTEM: KECAMATAN TALAGASARI PBB-P2 DASHBOARD\n";
echo "======================================================\n\n";

// 1. Files existence
$files = [
    'assets/data.js',
    'assets/talagasari_data.js',
    'pbb-p2/public/assets/talagasari_data.js',
    'talagasari_desa.geojson',
    'talagasari_paths.json',
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

check(strpos($indexHtml, 'src="assets/talagasari_data.js"') !== false, "index.html includes assets/talagasari_data.js");
check(strpos($blade, 'src="assets/talagasari_data.js"') !== false, "welcome.blade.php includes assets/talagasari_data.js");

// 3. Main map in assets/data.js intact
$dataJs = file_get_contents('assets/data.js');
preg_match_all('/"id":\s*"([^"]+)"/', $dataJs, $kecMatches);
$totalKec = count($kecMatches[1]);
check($totalKec === 30, "Main map has exactly 30 kecamatan in assets/data.js (Count: $totalKec)");
check(in_array('talagasari', $kecMatches[1]), "assets/data.js contains 'talagasari'");

// Check baseline numbers for talagasari in assets/data.js
preg_match('/\{\s*"id":\s*"talagasari",\s*"name":\s*"Talagasari",\s*"target":\s*(\d+),\s*"targetFormatted":\s*"([^"]+)",\s*"realisasi":\s*(\d+),\s*"realisasiFormatted":\s*"([^"]+)",\s*"capaian":\s*(\d+)/s', $dataJs, $baseMatch);
if ($baseMatch) {
    $baselineTarget = (int)$baseMatch[1];
    $baselineRealisasi = (int)$baseMatch[3];
    $baselineCapaian = (int)$baseMatch[5];
    check($baselineTarget === 11800000000, "assets/data.js Talagasari target is 11.800.000.000");
    check($baselineRealisasi === 7552000000, "assets/data.js Talagasari realisasi is 7.552.000.000");
    check($baselineCapaian === 64, "assets/data.js Talagasari capaian is 64%");
} else {
    $errors[] = "[FAIL] Talagasari data regex match in assets/data.js failed";
}

// 4. Talagasari data validation
$talagasariContent = file_get_contents('assets/talagasari_data.js');
preg_match('/const TALAGASARI_SUMMARY = (\{.*?\});/s', $talagasariContent, $sm);
preg_match('/const TALAGASARI_DESA_DATA = (\[.*?\]);/s', $talagasariContent, $dm);

if ($sm && $dm) {
    $summary = json_decode($sm[1], true);
    $desaData = json_decode($dm[1], true);

    check(is_array($summary), "TALAGASARI_SUMMARY is valid JSON");
    check(is_array($desaData), "TALAGASARI_DESA_DATA is valid JSON");

    check($summary['target'] === 11800000000, "Summary target is Rp 11.800.000.000");
    check($summary['realisasi'] === 7552000000, "Summary realisasi is Rp 7.552.000.000");
    check($summary['sisaTagihan'] === 4248000000, "Summary sisaTagihan is Rp 4.248.000.000");
    check($summary['capaian'] === 64, "Summary capaian is 64%");
    check($summary['jumlahDesa'] === 14, "Summary jumlahDesa is 14");
    check(count($desaData) === 14, "Village array count is exactly 14");

    $expectedVillages = [
        "Cadaskertajaya",
        "Cariumulya",
        "Cilewo",
        "Ciwulan",
        "Kalibuaya",
        "Kalijaya",
        "Kalisari",
        "Linggarsari",
        "Pasirkamuning",
        "Pasirmukti",
        "Pasirtalaga",
        "Pulosari",
        "Talagamulya",
        "Talagasari"
    ];

    $actualVillages = array_column($desaData, 'name');
    check($actualVillages === $expectedVillages, "All 14 expected villages match in order: " . implode(', ', $actualVillages));

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
    $errors[] = "[FAIL] Could not extract TALAGASARI_SUMMARY or TALAGASARI_DESA_DATA from assets/talagasari_data.js";
}

// 5. Check app.js logic
$appJs = file_get_contents('js/app.js');
check(strpos($appJs, "activeKecamatanId = 'talagasari';") !== false, "app.js has initKecamatanView branch for talagasari");
check(strpos($appJs, "const inTalagasari = typeof TALAGASARI_DESA_DATA !== 'undefined'") !== false, "app.js has hash routing for talagasari");
check(strpos($appJs, "'talagasari'") !== false, "app.js has talagasari in validKecs");

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
