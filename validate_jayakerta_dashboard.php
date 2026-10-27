<?php
// Comprehensive Validation Script for Kecamatan Jayakerta PBB-P2 Dashboard
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
echo "VALIDASI SISTEM: KECAMATAN JAYAKERTA PBB-P2 DASHBOARD\n";
echo "BAPENDA KABUPATEN KARAWANG\n";
echo "==========================================================\n\n";

// 1. Files existence
$files = [
    'assets/data.js',
    'assets/jayakerta_data.js',
    'pbb-p2/public/assets/jayakerta_data.js',
    'jayakerta_desa.geojson',
    'jayakerta_paths.json',
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

check(strpos($indexHtml, 'src="assets/jayakerta_data.js"') !== false, "index.html includes assets/jayakerta_data.js");
check(strpos($blade, 'src="assets/jayakerta_data.js"') !== false, "welcome.blade.php includes assets/jayakerta_data.js");

// 3. Main map in assets/data.js intact
$dataJs = file_get_contents('assets/data.js');
preg_match_all('/"id":\s*"([^"]+)"/', $dataJs, $kecMatches);
$totalKec = count($kecMatches[1]);
check($totalKec === 30, "Main map has exactly 30 kecamatan in assets/data.js (Count: $totalKec)");
check(in_array('jayakerta', $kecMatches[1]), "assets/data.js contains 'jayakerta'");

// Check baseline numbers for jayakerta in assets/data.js
preg_match('/\{\s*"id":\s*"jayakerta",\s*"name":\s*"Jayakerta",\s*"target":\s*(\d+),\s*"targetFormatted":\s*"([^"]+)",\s*"realisasi":\s*(\d+),\s*"realisasiFormatted":\s*"([^"]+)",\s*"capaian":\s*(\d+)/s', $dataJs, $baseMatch);
if ($baseMatch) {
    $baselineTarget = (int)$baseMatch[1];
    $baselineRealisasi = (int)$baseMatch[3];
    $baselineCapaian = (int)$baseMatch[5];
    check($baselineTarget === 8200000000, "assets/data.js Jayakerta target is 8.200.000.000");
    check($baselineRealisasi === 5576000000, "assets/data.js Jayakerta realisasi is 5.576.000.000");
    check($baselineCapaian === 68, "assets/data.js Jayakerta capaian is 68%");
} else {
    $errors[] = "[FAIL] Jayakerta data regex match in assets/data.js failed";
}

// 4. Jayakerta data validation
$jayaContent = file_get_contents('assets/jayakerta_data.js');
preg_match('/const JAYAKERTA_SUMMARY = (\{.*?\});/s', $jayaContent, $sm);
preg_match('/const JAYAKERTA_DESA_DATA = (\[.*?\]);/s', $jayaContent, $dm);

if ($sm && $dm) {
    $summary = json_decode($sm[1], true);
    $desas = json_decode($dm[1], true);

    check($summary !== null, "JAYAKERTA_SUMMARY is valid JSON");
    check($desas !== null && count($desas) === 8, "JAYAKERTA_DESA_DATA contains exactly 8 villages (Found: " . ($desas ? count($desas) : 0) . ")");

    if ($summary && $desas) {
        check($summary['target'] === 8200000000, "JAYAKERTA_SUMMARY target is 8.200.000.000");
        check($summary['realisasi'] === 5576000000, "JAYAKERTA_SUMMARY realisasi is 5.576.000.000");
        check($summary['sisaTagihan'] === 2624000000, "JAYAKERTA_SUMMARY sisaTagihan is 2.624.000.000");
        check($summary['capaian'] === 68, "JAYAKERTA_SUMMARY capaian is 68%");
        check($summary['jumlahDesa'] === 8, "JAYAKERTA_SUMMARY jumlahDesa is 8");

        // Sum calculations
        $calcTarget = 0;
        $calcRealisasi = 0;
        $calcSisa = 0;
        $calcObj = 0;
        $calcLunas = 0;
        $calcBelum = 0;

        $expectedDesas = [
            'medangasem' => 'Medangasem',
            'kemiri' => 'Kemiri',
            'makmurjaya' => 'Makmurjaya',
            'jayamakmur' => 'Jayamakmur',
            'jayakerta' => 'Jayakerta',
            'ciptamarga' => 'Ciptamarga',
            'kertajaya' => 'Kertajaya',
            'kampungsawah' => 'Kampungsawah'
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

        check($calcTarget === 8200000000, "Sum of villages Target matches summary: Rp " . number_format($calcTarget, 0, ',', '.'));
        check($calcRealisasi === 5576000000, "Sum of villages Realisasi matches summary: Rp " . number_format($calcRealisasi, 0, ',', '.'));
        check($calcSisa === 2624000000, "Sum of villages Sisa Tagihan matches summary: Rp " . number_format($calcSisa, 0, ',', '.'));

        foreach ($expectedDesas as $kId => $kName) {
            check(isset($foundDesas[$kId]), "Desa $kName ($kId) exists in Jayakerta dataset");
        }
    }
} else {
    $errors[] = "[FAIL] Could not parse JAYAKERTA_SUMMARY or JAYAKERTA_DESA_DATA from assets/jayakerta_data.js";
}

// 5. App.js integration check
$appJs = file_get_contents('js/app.js');
check(strpos($appJs, "'jayakerta'") !== false, "js/app.js includes 'jayakerta'");
check(strpos($appJs, "activeKecamatanId = 'jayakerta'") !== false, "js/app.js sets activeKecamatanId to 'jayakerta'");
check(strpos($appJs, "JAYAKERTA_DESA_DATA") !== false, "js/app.js references JAYAKERTA_DESA_DATA");
check(strpos($appJs, "JAYAKERTA_SUMMARY") !== false, "js/app.js references JAYAKERTA_SUMMARY");
check(strpos($appJs, "JAYAKERTA_VIEWBOX_WIDTH") !== false, "js/app.js references JAYAKERTA_VIEWBOX_WIDTH");
check(strpos($appJs, "JAYAKERTA_VIEWBOX_HEIGHT") !== false, "js/app.js references JAYAKERTA_VIEWBOX_HEIGHT");
check(strpos($appJs, "inJayakerta ? 'jayakerta'") !== false, "js/app.js includes hash router condition for Jayakerta");
check(strpos($appJs, "jayakertaTrigger") !== false, "js/app.js includes click delegator for Jayakerta");

// 6. Web.php route check
$routes = file_get_contents('pbb-p2/routes/web.php');
check(strpos($routes, '|jayakerta') !== false || strpos($routes, 'jayakerta|') !== false, "pbb-p2/routes/web.php has route regex for 'jayakerta'");

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
