<?php
// Comprehensive Validation Script for Kecamatan Tirtajaya PBB-P2 Dashboard
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
echo "VALIDASI SISTEM: KECAMATAN TIRTAJAYA PBB-P2 DASHBOARD\n";
echo "BAPENDA KABUPATEN KARAWANG\n";
echo "==========================================================\n\n";

// 1. Files existence
$files = [
    'assets/data.js',
    'assets/tirtajaya_data.js',
    'pbb-p2/public/assets/tirtajaya_data.js',
    'tirtajaya_desa.geojson',
    'tirtajaya_paths.json',
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

check(strpos($indexHtml, 'src="assets/tirtajaya_data.js"') !== false, "index.html includes assets/tirtajaya_data.js");
check(strpos($blade, 'src="assets/tirtajaya_data.js"') !== false, "welcome.blade.php includes assets/tirtajaya_data.js");

// 3. Main map in assets/data.js intact
$dataJs = file_get_contents('assets/data.js');
preg_match_all('/"id":\s*"([^"]+)"/', $dataJs, $kecMatches);
$totalKec = count($kecMatches[1]);
check($totalKec === 30, "Main map has exactly 30 kecamatan in assets/data.js (Count: $totalKec)");
check(in_array('tirtajaya', $kecMatches[1]), "assets/data.js contains 'tirtajaya'");

// Check baseline numbers for tirtajaya in assets/data.js
preg_match('/\{\s*"id":\s*"tirtajaya",\s*"name":\s*"Tirtajaya",\s*"target":\s*(\d+),\s*"targetFormatted":\s*"([^"]+)",\s*"realisasi":\s*(\d+),\s*"realisasiFormatted":\s*"([^"]+)",\s*"capaian":\s*(\d+)/s', $dataJs, $baseMatch);
if ($baseMatch) {
    $baselineTarget = (int)$baseMatch[1];
    $baselineRealisasi = (int)$baseMatch[3];
    $baselineCapaian = (int)$baseMatch[5];
    check($baselineTarget === 7600000000, "assets/data.js Tirtajaya target is 7.600.000.000");
    check($baselineRealisasi === 5928000000, "assets/data.js Tirtajaya realisasi is 5.928.000.000");
    check($baselineCapaian === 78, "assets/data.js Tirtajaya capaian is 78%");
} else {
    $errors[] = "[FAIL] Tirtajaya data regex match in assets/data.js failed";
}

// 4. Tirtajaya data validation
$tirtaContent = file_get_contents('assets/tirtajaya_data.js');
preg_match('/const TIRTAJAYA_SUMMARY = (\{.*?\});/s', $tirtaContent, $sm);
preg_match('/const TIRTAJAYA_DESA_DATA = (\[.*?\]);/s', $tirtaContent, $dm);

if ($sm && $dm) {
    $summary = json_decode($sm[1], true);
    $desas = json_decode($dm[1], true);

    check($summary !== null, "TIRTAJAYA_SUMMARY is valid JSON");
    check($desas !== null && count($desas) === 11, "TIRTAJAYA_DESA_DATA contains exactly 11 villages (Found: " . ($desas ? count($desas) : 0) . ")");

    if ($summary && $desas) {
        check($summary['target'] === 7600000000, "TIRTAJAYA_SUMMARY target is 7.600.000.000");
        check($summary['realisasi'] === 5928000000, "TIRTAJAYA_SUMMARY realisasi is 5.928.000.000");
        check($summary['sisaTagihan'] === 1672000000, "TIRTAJAYA_SUMMARY sisaTagihan is 1.672.000.000");
        check($summary['capaian'] === 78, "TIRTAJAYA_SUMMARY capaian is 78%");
        check($summary['jumlahDesa'] === 11, "TIRTAJAYA_SUMMARY jumlahDesa is 11");

        // Sum calculations
        $calcTarget = 0;
        $calcRealisasi = 0;
        $calcSisa = 0;
        $calcObj = 0;
        $calcLunas = 0;
        $calcBelum = 0;

        $expectedDesas = [
            'medankarya' => 'Medankarya',
            'pisangsambo' => 'Pisangsambo',
            'sabajaya' => 'Sabajaya',
            'gempoljaya' => 'Gempoljaya',
            'sarijaya' => 'Sarijaya',
            'kutamakmur' => 'Kutamakmur',
            'bolang' => 'Bolang',
            'srikamulyan' => 'Srikamulyan',
            'sumurlaban' => 'Sumurlaban',
            'tambaksumur' => 'Tambaksumur',
            'tambaksari' => 'Tambaksari'
        ];

        $foundDesas = [];
        foreach ($desas as $d) {
            $calcTarget += $d['target'];
            $calcRealisasi += $d['realisasi'];
            $calcSisa += $d['sisaTagihan'];
            $calcObj += $d['obyekTerdaftar'];
            $calcLunas += $d['obyekLunas'];
            $calcBelum += $d['obyekBelumLunas'];

            $foundDesas[$d['id']] = $d['name'];

            // Individual checks
            check($d['sisaTagihan'] === ($d['target'] - $d['realisasi']), "Desa {$d['name']}: Sisa tagihan = Target - Realisasi");
            $pct = round(($d['realisasi'] / $d['target']) * 100);
            check($d['capaian'] === (int)$pct, "Desa {$d['name']}: Capaian {$d['capaian']}% matches calculated ($pct%)");
            check($d['obyekTerdaftar'] === ($d['obyekLunas'] + $d['obyekBelumLunas']), "Desa {$d['name']}: Objek pajak ({$d['obyekTerdaftar']}) = Lunas ({$d['obyekLunas']}) + Belum ({$d['obyekBelumLunas']})");
            check(!empty($d['path']), "Desa {$d['name']}: Path SVG GeoJSON exists");
            check(isset($d['cx']) && isset($d['cy']), "Desa {$d['name']}: Centroid exists ({$d['cx']}, {$d['cy']})");
        }

        check($calcTarget === 7600000000, "Sum of villages Target matches summary: Rp " . number_format($calcTarget, 0, ',', '.'));
        check($calcRealisasi === 5928000000, "Sum of villages Realisasi matches summary: Rp " . number_format($calcRealisasi, 0, ',', '.'));
        check($calcSisa === 1672000000, "Sum of villages Sisa Tagihan matches summary: Rp " . number_format($calcSisa, 0, ',', '.'));

        foreach ($expectedDesas as $kId => $kName) {
            check(isset($foundDesas[$kId]), "Desa $kName ($kId) exists in Tirtajaya dataset");
        }

        // Check Gempoljaya / Gempolkarya and Sarijaya / Srijaya aliases
        $gempol = null;
        $sari = null;
        foreach ($desas as $d) {
            if ($d['id'] === 'gempoljaya') $gempol = $d;
            if ($d['id'] === 'sarijaya') $sari = $d;
        }
        check($gempol !== null && in_array('gempolkarya', $gempol['aliases']), "Desa Gempoljaya has 'gempolkarya' alias");
        check($sari !== null && in_array('srijaya', $sari['aliases']), "Desa Sarijaya has 'srijaya' alias");
    }
} else {
    $errors[] = "[FAIL] Could not parse TIRTAJAYA_SUMMARY or TIRTAJAYA_DESA_DATA from assets/tirtajaya_data.js";
}

// 5. App.js integration check
$appJs = file_get_contents('js/app.js');
check(strpos($appJs, "'tirtajaya'") !== false, "js/app.js includes 'tirtajaya'");
check(strpos($appJs, "activeKecamatanId = 'tirtajaya'") !== false, "js/app.js sets activeKecamatanId to 'tirtajaya'");
check(strpos($appJs, "TIRTAJAYA_DESA_DATA") !== false, "js/app.js references TIRTAJAYA_DESA_DATA");
check(strpos($appJs, "TIRTAJAYA_SUMMARY") !== false, "js/app.js references TIRTAJAYA_SUMMARY");
check(strpos($appJs, "TIRTAJAYA_VIEWBOX_WIDTH") !== false, "js/app.js references TIRTAJAYA_VIEWBOX_WIDTH");
check(strpos($appJs, "TIRTAJAYA_VIEWBOX_HEIGHT") !== false, "js/app.js references TIRTAJAYA_VIEWBOX_HEIGHT");
check(strpos($appJs, "inTirtajaya ? 'tirtajaya'") !== false, "js/app.js includes hash router condition for Tirtajaya");
check(strpos($appJs, "tirtajayaTrigger") !== false, "js/app.js includes click delegator for Tirtajaya");

// 6. Web.php route check
$routes = file_get_contents('pbb-p2/routes/web.php');
check(strpos($routes, '|tirtajaya') !== false || strpos($routes, 'tirtajaya|') !== false, "pbb-p2/routes/web.php has route regex for 'tirtajaya'");

// Print summary
echo "\n==================== HASIL VALIDASI ====================\n";
echo "TOTAL CEK SUKSES : " . count($successes) . "\n";
echo "TOTAL CEK GAGAL  : " . count($errors) . "\n";
echo "========================================================\n\n";

if (!empty($errors)) {
    echo "DAFTAR KEGAGALAN:\n";
    foreach ($errors as $e) {
        echo "  $e\n";
    }
    exit(1);
} else {
    echo "SELURUH VALIDASI LULUS DENGAN SEMPURNA!\n";
    exit(0);
}
