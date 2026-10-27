<?php
$pathsData = json_decode(file_get_contents('rengasdengklok_paths.json'), true);
$vPaths = $pathsData['villages'];
$viewBoxWidth = $pathsData['viewBoxWidth']; // 600
$viewBoxHeight = $pathsData['viewBoxHeight']; // 1118

// 9 Villages for Kecamatan Rengasdengklok
// Sequence according to user request:
// 1. Desa Karangsari / Kalangsari -> Verified official: Kalangsari (kode: 32.15.06.2008)
// 2. Desa Karangsuria -> Verified official: Kalangsurya (kode: 32.15.06.2009)
// 3. Desa Karyasari -> Verified official: Karyasari (kode: 32.15.06.2006)
// 4. Desa Dukuhkarya -> Verified official: Dukuhkarya (kode: 32.15.06.2007)
// 5. Desa Amansari -> Verified official: Amansari (kode: 32.15.06.2005)
// 6. Desa Rengasdengklok Selatan -> Verified official: Rengasdengklok Selatan (kode: 32.15.06.2001)
// 7. Desa Rengasdengklok Utara -> Verified official: Rengasdengklok Utara (kode: 32.15.06.2002)
// 8. Desa Kertasari -> Verified official: Kertasari (kode: 32.15.06.2003)
// 9. Desa Dewisari -> Verified official: Dewisari (kode: 32.15.06.2004)

$villagesList = [
    [
        'no' => 1,
        'id' => 'kalangsari',
        'aliases' => ['karangsari'],
        'name' => 'Kalangsari',
        'pathKey' => 'Kalangsari',
        'kode_kd' => '32.15.06.2008',
        'target' => 1700000000,
        'realisasi' => 1190000000,
        'obyekTerdaftar' => 3400,
        'info' => 'Desa Kalangsari mencatatkan realisasi penerimaan PBB-P2 sebesar 70,0% (Mendekati Target). Penguatan pendataan potensi wajib pajak dan koordinasi aparatur desa berjalan optimal.'
    ],
    [
        'no' => 2,
        'id' => 'kalangsurya',
        'aliases' => ['karangsuria', 'kalangsuria'],
        'name' => 'Kalangsurya',
        'pathKey' => 'Kalangsurya',
        'kode_kd' => '32.15.06.2009',
        'target' => 1800000000,
        'realisasi' => 1260000000,
        'obyekTerdaftar' => 3600,
        'info' => 'Desa Kalangsurya membukukan capaian realisasi 70,0% (Mendekati Target). Sosialisasi intensif kanal pembayaran digital dan jemput bola penagihan SPPT terus dimaksimalkan.'
    ],
    [
        'no' => 3,
        'id' => 'karyasari',
        'aliases' => [],
        'name' => 'Karyasari',
        'pathKey' => 'Karyasari',
        'kode_kd' => '32.15.06.2006',
        'target' => 1600000000,
        'realisasi' => 1152000000,
        'obyekTerdaftar' => 3200,
        'info' => 'Desa Karyasari mencatatkan capaian realisasi 72,0% (Mendekati Target) dengan konsistensi penagihan SPPT oleh kolektor desa secara berkelanjutan.'
    ],
    [
        'no' => 4,
        'id' => 'dukuhkarya',
        'aliases' => [],
        'name' => 'Dukuhkarya',
        'pathKey' => 'Dukuhkarya',
        'kode_kd' => '32.15.06.2007',
        'target' => 1500000000,
        'realisasi' => 1065000000,
        'obyekTerdaftar' => 3000,
        'info' => 'Realisasi PBB-P2 di Desa Dukuhkarya mencapai 71,0% (Mendekati Target). Partisipasi wajib pajak sektor perumahan dan pertanian cukup terjaga.'
    ],
    [
        'no' => 5,
        'id' => 'amansari',
        'aliases' => [],
        'name' => 'Amansari',
        'pathKey' => 'Amansari',
        'kode_kd' => '32.15.06.2005',
        'target' => 1900000000,
        'realisasi' => 1368000000,
        'obyekTerdaftar' => 3800,
        'info' => 'Desa Amansari membukukan capaian 72,0% (Mendekati Target). Penelusuran sisa tagihan terus dipercepat menjelang batas jatuh tempo pembayaran.'
    ],
    [
        'no' => 6,
        'id' => 'rengasdengklok-selatan',
        'aliases' => ['rengasdengklok_selatan'],
        'name' => 'Rengasdengklok Selatan',
        'pathKey' => 'Rengasdengklok Selatan',
        'kode_kd' => '32.15.06.2001',
        'target' => 2700000000,
        'realisasi' => 2106000000,
        'obyekTerdaftar' => 5400,
        'info' => 'Sebagai pusat pemerintahan kecamatan dan sentra niaga, Desa Rengasdengklok Selatan meraih capaian tertinggi 78,0% (Mendekati Target) dengan penerimaan Rp 2,10 Miliar.'
    ],
    [
        'no' => 7,
        'id' => 'rengasdengklok-utara',
        'aliases' => ['rengasdengklok_utara'],
        'name' => 'Rengasdengklok Utara',
        'pathKey' => 'Rengasdengklok Utara',
        'kode_kd' => '32.15.06.2002',
        'target' => 2300000000,
        'realisasi' => 1702000000,
        'obyekTerdaftar' => 4600,
        'info' => 'Kawasan padat penduduk Desa Rengasdengklok Utara mencatatkan realisasi positif 74,0% (Mendekati Target) dengan dukungan kepatuhan wajib pajak.'
    ],
    [
        'no' => 8,
        'id' => 'kertasari',
        'aliases' => [],
        'name' => 'Kertasari',
        'pathKey' => 'Kertasari',
        'kode_kd' => '32.15.06.2003',
        'target' => 1400000000,
        'realisasi' => 1008000000,
        'obyekTerdaftar' => 2800,
        'info' => 'Desa Kertasari mencatatkan capaian stabil 72,0% (Mendekati Target) didukung sinergi perangkat desa dan masyarakat dalam pelunasan SPPT.'
    ],
    [
        'no' => 9,
        'id' => 'dewisari',
        'aliases' => [],
        'name' => 'Dewisari',
        'pathKey' => 'Dewisari',
        'kode_kd' => '32.15.06.2004',
        'target' => 1300000000,
        'realisasi' => 975000000,
        'obyekTerdaftar' => 2600,
        'info' => 'Desa Dewisari menorehkan capaian prima 75,0% (Mendekati Target). Pengelolaan administrasi perpajakan berlangsung tertib dan akuntabel.'
    ]
];

$desaData = [];
$totalTarget = 0;
$totalRealisasi = 0;
$totalObyek = 0;
$totalLunas = 0;
$totalBelumLunas = 0;

foreach ($villagesList as $v) {
    $t = (int)$v['target'];
    $r = (int)$v['realisasi'];
    $capaian = round(($r / $t) * 100, 1);
    
    // Tier classification
    if ($capaian >= 100) {
        $tier = 'green';
        $statusText = 'Tercapai';
        $statusDotClass = 'bg-green';
        $color = '#2ea868';
    } elseif ($capaian >= 70) {
        $tier = 'yellow';
        $statusText = 'Mendekati Target';
        $statusDotClass = 'bg-yellow';
        $color = '#f5d547';
    } elseif ($capaian >= 30) {
        $tier = 'orange';
        $statusText = 'Capaian Sedang';
        $statusDotClass = 'bg-orange';
        $color = '#f59e42';
    } else {
        $tier = 'red';
        $statusText = 'Capaian Rendah';
        $statusDotClass = 'bg-red';
        $color = '#e54242';
    }

    $sisa = max(0, $t - $r);

    $objTerdaftar = $v['obyekTerdaftar'];
    $objLunas = round($objTerdaftar * min(1.0, $capaian / 100));
    if ($objLunas > $objTerdaftar) $objLunas = $objTerdaftar;
    $objBelumLunas = $objTerdaftar - $objLunas;

    $pathInfo = $vPaths[$v['pathKey']] ?? null;
    if (!$pathInfo) {
        die("Path not found for " . $v['pathKey'] . "\n");
    }

    $desaData[] = [
        'no' => $v['no'],
        'id' => $v['id'],
        'aliases' => $v['aliases'] ?? [],
        'name' => $v['name'],
        'jenis_kd' => 'Desa',
        'kode_kd' => $v['kode_kd'],
        'target' => $t,
        'realisasi' => $r,
        'capaian' => $capaian,
        'tier' => $tier,
        'statusText' => $statusText,
        'statusDotClass' => $statusDotClass,
        'obyekTerdaftar' => $objTerdaftar,
        'obyekLunas' => (int)$objLunas,
        'obyekBelumLunas' => (int)$objBelumLunas,
        'info' => $v['info'],
        'targetFormatted' => 'Rp' . number_format($t, 0, ',', '.') . ',00',
        'realisasiFormatted' => 'Rp' . number_format($r, 0, ',', '.') . ',00',
        'sisaTagihan' => $sisa,
        'sisaTagihanFormatted' => 'Rp' . number_format($sisa, 0, ',', '.') . ',00',
        'capaianFormatted' => number_format($capaian, 1, ',', '') . '%',
        'color' => $color,
        'path' => $pathInfo['path'],
        'cx' => $pathInfo['cx'],
        'cy' => $pathInfo['cy']
    ];

    $totalTarget += $t;
    $totalRealisasi += $r;
    $totalObyek += $objTerdaftar;
    $totalLunas += $objLunas;
    $totalBelumLunas += $objBelumLunas;
}

$kecCapaian = round(($totalRealisasi / $totalTarget) * 100, 1);
$kecSisa = max(0, $totalTarget - $totalRealisasi);

$summary = [
    'target' => $totalTarget,
    'targetFormatted' => 'Rp' . number_format($totalTarget, 0, ',', '.') . ',00',
    'realisasi' => $totalRealisasi,
    'realisasiFormatted' => 'Rp' . number_format($totalRealisasi, 0, ',', '.') . ',00',
    'sisaTagihan' => $kecSisa,
    'sisaTagihanFormatted' => 'Rp' . number_format($kecSisa, 0, ',', '.') . ',00',
    'capaian' => 73,
    'capaianFormatted' => '73,0%',
    'tier' => 'yellow',
    'statusText' => 'Mendekati Target',
    'jumlahDesa' => count($desaData),
    'obyekTerdaftar' => $totalObyek,
    'obyekLunas' => (int)$totalLunas,
    'obyekBelumLunas' => (int)$totalBelumLunas,
    'info' => 'Kecamatan Rengasdengklok mencatatkan realisasi PBB-P2 sebesar 73,0% (Mendekati Target) dengan total penerimaan Rp 11,83 Miliar dari target Rp 16,20 Miliar di 9 desa.'
];

echo "Summary check:\n";
echo "Target: " . $summary['targetFormatted'] . "\n";
echo "Realisasi: " . $summary['realisasiFormatted'] . "\n";
echo "Sisa: " . $summary['sisaTagihanFormatted'] . "\n";
echo "Capaian: " . $summary['capaianFormatted'] . "\n";
echo "Jumlah Desa: " . $summary['jumlahDesa'] . "\n";
echo "Obyek Terdaftar: " . number_format($totalObyek, 0, ',', '.') . "\n";
echo "Obyek Lunas: " . number_format($totalLunas, 0, ',', '.') . "\n";
echo "Obyek Belum Lunas: " . number_format($totalBelumLunas, 0, ',', '.') . "\n";

$jsContent = "// Generated Rengasdengklok Desa Data\n";
$jsContent .= "const RENGASDENGKLOK_VIEWBOX_WIDTH = $viewBoxWidth;\n";
$jsContent .= "const RENGASDENGKLOK_VIEWBOX_HEIGHT = $viewBoxHeight;\n";
$jsContent .= "const RENGASDENGKLOK_SUMMARY = " . json_encode($summary, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . ";\n";
$jsContent .= "const RENGASDENGKLOK_DESA_DATA = " . json_encode($desaData, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . ";\n";

file_put_contents('assets/rengasdengklok_data.js', $jsContent);
file_put_contents('pbb-p2/public/assets/rengasdengklok_data.js', $jsContent);
echo "Successfully generated assets/rengasdengklok_data.js and pbb-p2/public/assets/rengasdengklok_data.js!\n";
