<?php
// Comprehensive Validation Script for Kecamatan Rengasdengklok PBB-P2 Dashboard
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

echo "==========================================================\n";
echo "VALIDASI SISTEM: KECAMATAN RENGASDENGKLOK PBB-P2 DASHBOARD\n";
echo "BAPENDA KABUPATEN KARAWANG\n";
echo "==========================================================\n\n";

// 1. Files existence
$files = [
    'assets/data.js',
    'assets/rengasdengklok_data.js',
    'pbb-p2/public/assets/rengasdengklok_data.js',
    'rengasdengklok_desa.geojson',
    'rengasdengklok_paths.json',
    'js/app.js',
    'pbb-p2/public/js/app.js',
    'index.html',
    'pbb-p2/resources/views/welcome.blade.php',
    'pbb-p2/routes/web.php'
];

foreach ($files as $f) {
    check(file_exists($f), "File $f exists (" . (file_exists($f) ? number_format(filesize($f)) . " bytes" : "NOT FOUND") . ")");
}

// 2. Index.html & welcome.blade.php script tags
$indexHtml = file_get_contents('index.html');
$blade = file_get_contents('pbb-p2/resources/views/welcome.blade.php');

check(strpos($indexHtml, 'src="assets/rengasdengklok_data.js"') !== false, "index.html includes assets/rengasdengklok_data.js");
check(strpos($blade, 'src="assets/rengasdengklok_data.js"') !== false, "welcome.blade.php includes assets/rengasdengklok_data.js");

// 3. Main map in assets/data.js intact
$dataJs = file_get_contents('assets/data.js');
preg_match_all('/"id":\s*"([^"]+)"/', $dataJs, $kecMatches);
$totalKec = count($kecMatches[1]);
check($totalKec === 30, "Main map has exactly 30 kecamatan in assets/data.js (Count: $totalKec)");
check(in_array('rengasdengklok', $kecMatches[1]), "assets/data.js contains 'rengasdengklok'");

// Check baseline numbers for rengasdengklok in assets/data.js
preg_match('/\{\s*"id":\s*"rengasdengklok",\s*"name":\s*"Rengasdengklok",\s*"target":\s*(\d+),\s*"targetFormatted":\s*"([^"]+)",\s*"realisasi":\s*(\d+),\s*"realisasiFormatted":\s*"([^"]+)",\s*"capaian":\s*(\d+)/s', $dataJs, $baseMatch);
if ($baseMatch) {
    $baselineTarget = (int)$baseMatch[1];
    $baselineRealisasi = (int)$baseMatch[3];
    $baselineCapaian = (int)$baseMatch[5];
    check($baselineTarget === 16200000000, "assets/data.js Rengasdengklok target is 16.200.000.000");
    check($baselineRealisasi === 11826000000, "assets/data.js Rengasdengklok realisasi is 11.826.000.000");
    check($baselineCapaian === 73, "assets/data.js Rengasdengklok capaian is 73%");
} else {
    $errors[] = "[FAIL] Rengasdengklok data regex match in assets/data.js failed";
}

// 4. Rengasdengklok data validation
$rengasContent = file_get_contents('assets/rengasdengklok_data.js');
preg_match('/const RENGASDENGKLOK_SUMMARY = (\{.*?\});/s', $rengasContent, $sm);
preg_match('/const RENGASDENGKLOK_DESA_DATA = (\[.*?\]);/s', $rengasContent, $dm);

if ($sm && $dm) {
    $summary = json_decode($sm[1], true);
    $desaData = json_decode($dm[1], true);

    check(is_array($summary), "RENGASDENGKLOK_SUMMARY is valid JSON");
    check(is_array($desaData), "RENGASDENGKLOK_DESA_DATA is valid JSON");

    check($summary['target'] === 16200000000, "Summary target is Rp 16.200.000.000");
    check($summary['realisasi'] === 11826000000, "Summary realisasi is Rp 11.826.000.000");
    check($summary['sisaTagihan'] === 4374000000, "Summary sisaTagihan is Rp 4.374.000.000");
    check($summary['capaian'] === 73, "Summary capaian is 73%");
    check($summary['jumlahDesa'] === 9, "Summary jumlahDesa is 9");
    check(count($desaData) === 9, "Village array count is exactly 9");

    $expectedVillages = [
        "Kalangsari",
        "Kalangsurya",
        "Karyasari",
        "Dukuhkarya",
        "Amansari",
        "Rengasdengklok Selatan",
        "Rengasdengklok Utara",
        "Kertasari",
        "Dewisari"
    ];

    $actualVillages = array_column($desaData, 'name');
    check($actualVillages === $expectedVillages, "All 9 expected villages match in order: " . implode(', ', $actualVillages));

    $expectedKodes = [
        "Kalangsari" => "32.15.06.2008",
        "Kalangsurya" => "32.15.06.2009",
        "Karyasari" => "32.15.06.2006",
        "Dukuhkarya" => "32.15.06.2007",
        "Amansari" => "32.15.06.2005",
        "Rengasdengklok Selatan" => "32.15.06.2001",
        "Rengasdengklok Utara" => "32.15.06.2002",
        "Kertasari" => "32.15.06.2003",
        "Dewisari" => "32.15.06.2004"
    ];

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
        check(isset($d['cx']) && isset($d['cy']), "Village {$d['name']} has cx, cy coordinates ({$d['cx']}, {$d['cy']})");
        check($d['target'] - $d['realisasi'] === $d['sisaTagihan'], "Village {$d['name']} target - realisasi = sisaTagihan [{$d['target']} - {$d['realisasi']} = {$d['sisaTagihan']}]");
        check($d['obyekLunas'] + $d['obyekBelumLunas'] === $d['obyekTerdaftar'], "Village {$d['name']} obyekLunas + obyekBelumLunas = obyekTerdaftar");
        check(isset($expectedKodes[$d['name']]) && $d['kode_kd'] === $expectedKodes[$d['name']], "Village {$d['name']} official kode_kd is {$expectedKodes[$d['name']]}");
    }

    check($sumT === $summary['target'], "Sum of village targets ($sumT) matches summary target ({$summary['target']}) [Selisih: Rp 0]");
    check($sumR === $summary['realisasi'], "Sum of village realisasi ($sumR) matches summary realisasi ({$summary['realisasi']}) [Selisih: Rp 0]");
    check($sumS === $summary['sisaTagihan'], "Sum of village sisaTagihan ($sumS) matches summary sisaTagihan ({$summary['sisaTagihan']}) [Selisih: Rp 0]");
    check($sumO === $summary['obyekTerdaftar'], "Sum of village obyekTerdaftar ($sumO) matches summary obyekTerdaftar ({$summary['obyekTerdaftar']})");
    check($sumL === $summary['obyekLunas'], "Sum of village obyekLunas ($sumL) matches summary obyekLunas ({$summary['obyekLunas']})");
    check($sumB === $summary['obyekBelumLunas'], "Sum of village obyekBelumLunas ($sumB) matches summary obyekBelumLunas ({$summary['obyekBelumLunas']})");

} else {
    $errors[] = "[FAIL] Could not extract RENGASDENGKLOK_SUMMARY or RENGASDENGKLOK_DESA_DATA from assets/rengasdengklok_data.js";
}

// 5. Check app.js logic
$appJs = file_get_contents('js/app.js');
check(strpos($appJs, "activeKecamatanId = 'rengasdengklok';") !== false, "app.js has initKecamatanView branch for rengasdengklok");
check(strpos($appJs, "const inRengasdengklok = typeof RENGASDENGKLOK_DESA_DATA !== 'undefined'") !== false, "app.js has hash routing for rengasdengklok");
check(strpos($appJs, "'rengasdengklok'") !== false, "app.js has rengasdengklok in validKecs");

// 6. Check web.php routing
$webPhp = file_get_contents('pbb-p2/routes/web.php');
check(strpos($webPhp, 'rengasdengklok') !== false, "routes/web.php contains rengasdengklok route pattern");

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
