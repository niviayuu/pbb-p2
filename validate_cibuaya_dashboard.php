<?php
// Comprehensive Validation Script for Kecamatan Cibuaya PBB-P2 Dashboard
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
echo "VALIDASI SISTEM: KECAMATAN CIBUAYA PBB-P2 DASHBOARD\n";
echo "BAPENDA KABUPATEN KARAWANG\n";
echo "==========================================================\n\n";

// 1. Files existence
$files = [
    'assets/data.js',
    'assets/cibuaya_data.js',
    'pbb-p2/public/assets/cibuaya_data.js',
    'cibuaya_desa.geojson',
    'cibuaya_paths.json',
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

check(strpos($indexHtml, 'src="assets/cibuaya_data.js"') !== false, "index.html includes assets/cibuaya_data.js");
check(strpos($blade, 'src="assets/cibuaya_data.js"') !== false, "welcome.blade.php includes assets/cibuaya_data.js");

// 3. Main map in assets/data.js intact
$dataJs = file_get_contents('assets/data.js');
preg_match_all('/"id":\s*"([^"]+)"/', $dataJs, $kecMatches);
$totalKec = count($kecMatches[1]);
check($totalKec === 30, "Main map has exactly 30 kecamatan in assets/data.js (Count: $totalKec)");
check(in_array('cibuaya', $kecMatches[1]), "assets/data.js contains 'cibuaya'");

// Check baseline numbers for cibuaya in assets/data.js
preg_match('/\{\s*"id":\s*"cibuaya",\s*"name":\s*"Cibuaya",\s*"target":\s*(\d+),\s*"targetFormatted":\s*"([^"]+)",\s*"realisasi":\s*(\d+),\s*"realisasiFormatted":\s*"([^"]+)",\s*"capaian":\s*(\d+)/s', $dataJs, $baseMatch);
if ($baseMatch) {
    $baselineTarget = (int)$baseMatch[1];
    $baselineRealisasi = (int)$baseMatch[3];
    $baselineCapaian = (int)$baseMatch[5];
    check($baselineTarget === 7200000000, "assets/data.js Cibuaya target is 7.200.000.000");
    check($baselineRealisasi === 4464000000, "assets/data.js Cibuaya realisasi is 4.464.000.000");
    check($baselineCapaian === 62, "assets/data.js Cibuaya capaian is 62%");
} else {
    $errors[] = "[FAIL] Cibuaya data regex match in assets/data.js failed";
}

// 4. Cibuaya data validation
$cibuayaContent = file_get_contents('assets/cibuaya_data.js');
preg_match('/const CIBUAYA_SUMMARY = (\{.*?\});/s', $cibuayaContent, $sm);
preg_match('/const CIBUAYA_DESA_DATA = (\[.*?\]);/s', $cibuayaContent, $dm);

if ($sm && $dm) {
    $summary = json_decode($sm[1], true);
    $desas = json_decode($dm[1], true);

    check($summary !== null, "CIBUAYA_SUMMARY is valid JSON");
    check($desas !== null && count($desas) === 11, "CIBUAYA_DESA_DATA contains exactly 11 villages (Found: " . ($desas ? count($desas) : 0) . ")");

    if ($summary && $desas) {
        check($summary['target'] === 7200000000, "CIBUAYA_SUMMARY target is 7.200.000.000");
        check($summary['realisasi'] === 4464000000, "CIBUAYA_SUMMARY realisasi is 4.464.000.000");
        check($summary['sisaTagihan'] === 2736000000, "CIBUAYA_SUMMARY sisaTagihan is 2.736.000.000");
        check($summary['capaian'] === 62, "CIBUAYA_SUMMARY capaian is 62%");
        check($summary['jumlahDesa'] === 11, "CIBUAYA_SUMMARY jumlahDesa is 11");

        // Sum calculations
        $calcTarget = 0;
        $calcRealisasi = 0;
        $calcSisa = 0;
        $calcObj = 0;
        $calcLunas = 0;
        $calcBelum = 0;

        $expectedDesas = [
            'sukasari' => 'Sukasari',
            'kertarahayu' => 'Kertarahayu',
            'cibuaya' => 'Cibuaya',
            'pejaten' => 'Pejaten',
            'kedungjeruk' => 'Kedungjeruk',
            'kalidungjaya' => 'Kalidungjaya',
            'kedungjaya' => 'Kedungjaya',
            'jayamulya' => 'Jayamulya',
            'gebangjaya' => 'Gebangjaya',
            'cemarajaya' => 'Cemarajaya',
            'sedari' => 'Sedari'
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

        check($calcTarget === 7200000000, "Sum of villages Target matches summary: Rp " . number_format($calcTarget, 0, ',', '.'));
        check($calcRealisasi === 4464000000, "Sum of villages Realisasi matches summary: Rp " . number_format($calcRealisasi, 0, ',', '.'));
        check($calcSisa === 2736000000, "Sum of villages Sisa Tagihan matches summary: Rp " . number_format($calcSisa, 0, ',', '.'));

        foreach ($expectedDesas as $kId => $kName) {
            check(isset($foundDesas[$kId]), "Desa $kName ($kId) exists in Cibuaya dataset");
        }

        // Check Pejaten / Pajaten alias
        $peja = null;
        foreach ($desas as $d) {
            if ($d['id'] === 'pejaten') {
                $peja = $d;
                break;
            }
        }
        check($peja !== null && in_array('pajaten', $peja['aliases']), "Desa Pejaten has 'pajaten' alias");
    }
} else {
    $errors[] = "[FAIL] Could not parse CIBUAYA_SUMMARY or CIBUAYA_DESA_DATA from assets/cibuaya_data.js";
}

// 5. App.js integration check
$appJs = file_get_contents('js/app.js');
check(strpos($appJs, "'cibuaya'") !== false, "js/app.js includes 'cibuaya'");
check(strpos($appJs, "activeKecamatanId = 'cibuaya'") !== false, "js/app.js sets activeKecamatanId to 'cibuaya'");
check(strpos($appJs, "CIBUAYA_DESA_DATA") !== false, "js/app.js references CIBUAYA_DESA_DATA");
check(strpos($appJs, "CIBUAYA_SUMMARY") !== false, "js/app.js references CIBUAYA_SUMMARY");
check(strpos($appJs, "CIBUAYA_VIEWBOX_WIDTH") !== false, "js/app.js references CIBUAYA_VIEWBOX_WIDTH");
check(strpos($appJs, "CIBUAYA_VIEWBOX_HEIGHT") !== false, "js/app.js references CIBUAYA_VIEWBOX_HEIGHT");
check(strpos($appJs, "inCibuaya ? 'cibuaya'") !== false, "js/app.js includes hash router condition for Cibuaya");
check(strpos($appJs, "cibuayaTrigger") !== false, "js/app.js includes click delegator for Cibuaya");

// 6. Web.php route check
$routes = file_get_contents('pbb-p2/routes/web.php');
check(strpos($routes, '|cibuaya') !== false || strpos($routes, 'cibuaya|') !== false, "pbb-p2/routes/web.php has route regex for 'cibuaya'");

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
