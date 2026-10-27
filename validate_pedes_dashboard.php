<?php
// Comprehensive Validation Script for Kecamatan Pedes PBB-P2 Dashboard
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
echo "VALIDASI SISTEM: KECAMATAN PEDES PBB-P2 DASHBOARD\n";
echo "BAPENDA KABUPATEN KARAWANG\n";
echo "==========================================================\n\n";

// 1. Files existence
$files = [
    'assets/data.js',
    'assets/pedes_data.js',
    'pbb-p2/public/assets/pedes_data.js',
    'pedes_desa.geojson',
    'pedes_paths.json',
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

check(strpos($indexHtml, 'src="assets/pedes_data.js"') !== false, "index.html includes assets/pedes_data.js");
check(strpos($blade, 'src="assets/pedes_data.js"') !== false, "welcome.blade.php includes assets/pedes_data.js");

// 3. Main map in assets/data.js intact
$dataJs = file_get_contents('assets/data.js');
preg_match_all('/"id":\s*"([^"]+)"/', $dataJs, $kecMatches);
$totalKec = count($kecMatches[1]);
check($totalKec === 30, "Main map has exactly 30 kecamatan in assets/data.js (Count: $totalKec)");
check(in_array('pedes', $kecMatches[1]), "assets/data.js contains 'pedes'");

// Check baseline numbers for pedes in assets/data.js
preg_match('/\{\s*"id":\s*"pedes",\s*"name":\s*"Pedes",\s*"target":\s*(\d+),\s*"targetFormatted":\s*"([^"]+)",\s*"realisasi":\s*(\d+),\s*"realisasiFormatted":\s*"([^"]+)",\s*"capaian":\s*(\d+)/s', $dataJs, $baseMatch);
if ($baseMatch) {
    $baselineTarget = (int)$baseMatch[1];
    $baselineRealisasi = (int)$baseMatch[3];
    $baselineCapaian = (int)$baseMatch[5];
    check($baselineTarget === 9800000000, "assets/data.js Pedes target is 9.800.000.000");
    check($baselineRealisasi === 8036000000, "assets/data.js Pedes realisasi is 8.036.000.000");
    check($baselineCapaian === 82, "assets/data.js Pedes capaian is 82%");
} else {
    $errors[] = "[FAIL] Pedes data regex match in assets/data.js failed";
}

// 4. Pedes data validation
$pedesContent = file_get_contents('assets/pedes_data.js');
preg_match('/const PEDES_SUMMARY = (\{.*?\});/s', $pedesContent, $sm);
preg_match('/const PEDES_DESA_DATA = (\[.*?\]);/s', $pedesContent, $dm);

if ($sm && $dm) {
    $summary = json_decode($sm[1], true);
    $desas = json_decode($dm[1], true);

    check($summary !== null, "PEDES_SUMMARY is valid JSON");
    check($desas !== null && count($desas) === 12, "PEDES_DESA_DATA contains exactly 12 villages (Found: " . ($desas ? count($desas) : 0) . ")");

    if ($summary && $desas) {
        check($summary['target'] === 9800000000, "PEDES_SUMMARY target is 9.800.000.000");
        check($summary['realisasi'] === 8036000000, "PEDES_SUMMARY realisasi is 8.036.000.000");
        check($summary['sisaTagihan'] === 1764000000, "PEDES_SUMMARY sisaTagihan is 1.764.000.000");
        check($summary['capaian'] === 82, "PEDES_SUMMARY capaian is 82%");
        check($summary['jumlahDesa'] === 12, "PEDES_SUMMARY jumlahDesa is 12");

        // Sum calculations
        $calcTarget = 0;
        $calcRealisasi = 0;
        $calcSisa = 0;
        $calcObj = 0;
        $calcLunas = 0;
        $calcBelum = 0;

        $expectedDesas = [
            'jatimulya' => 'Jatimulya',
            'kertaraharja' => 'Kertaraharja',
            'karangjaya' => 'Karangjaya',
            'malangsari' => 'Malangsari',
            'kertamulya' => 'Kertamulya',
            'payungsari' => 'Payungsari',
            'randumulya' => 'Randumulya',
            'labanjaya' => 'Labanjaya',
            'sungaibuntu' => 'Sungaibuntu',
            'kendaljaya' => 'Kendaljaya',
            'dongkal' => 'Dongkal',
            'puspasari' => 'Puspasari'
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

        check($calcTarget === 9800000000, "Sum of villages Target matches summary: Rp " . number_format($calcTarget, 0, ',', '.'));
        check($calcRealisasi === 8036000000, "Sum of villages Realisasi matches summary: Rp " . number_format($calcRealisasi, 0, ',', '.'));
        check($calcSisa === 1764000000, "Sum of villages Sisa Tagihan matches summary: Rp " . number_format($calcSisa, 0, ',', '.'));

        foreach ($expectedDesas as $kId => $kName) {
            check(isset($foundDesas[$kId]), "Desa $kName ($kId) exists in Pedes dataset");
        }

        // Check Randumulya / Rangdumulya alias
        $randu = null;
        foreach ($desas as $d) {
            if ($d['id'] === 'randumulya') {
                $randu = $d;
                break;
            }
        }
        check($randu !== null && in_array('rangdumulya', $randu['aliases']), "Desa Randumulya has 'rangdumulya' alias");
    }
} else {
    $errors[] = "[FAIL] Could not parse PEDES_SUMMARY or PEDES_DESA_DATA from assets/pedes_data.js";
}

// 5. App.js integration check
$appJs = file_get_contents('js/app.js');
check(strpos($appJs, "'pedes'") !== false, "js/app.js includes 'pedes'");
check(strpos($appJs, "activeKecamatanId = 'pedes'") !== false, "js/app.js sets activeKecamatanId to 'pedes'");
check(strpos($appJs, "PEDES_DESA_DATA") !== false, "js/app.js references PEDES_DESA_DATA");
check(strpos($appJs, "PEDES_SUMMARY") !== false, "js/app.js references PEDES_SUMMARY");
check(strpos($appJs, "PEDES_VIEWBOX_WIDTH") !== false, "js/app.js references PEDES_VIEWBOX_WIDTH");
check(strpos($appJs, "PEDES_VIEWBOX_HEIGHT") !== false, "js/app.js references PEDES_VIEWBOX_HEIGHT");
check(strpos($appJs, "inPedes ? 'pedes'") !== false, "js/app.js includes hash router condition for Pedes");
check(strpos($appJs, "pedesTrigger") !== false, "js/app.js includes click delegator for Pedes");

// 6. Web.php route check
$routes = file_get_contents('pbb-p2/routes/web.php');
check(strpos($routes, '|pedes') !== false || strpos($routes, 'pedes|') !== false, "pbb-p2/routes/web.php has route regex for 'pedes'");

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
