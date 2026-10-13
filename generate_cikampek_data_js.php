<?php
$pathsData = json_decode(file_get_contents('cikampek_paths.json'), true);
$vPaths = $pathsData['villages'];

$viewBoxWidth = $pathsData['viewBoxWidth']; // 600
$viewBoxHeight = $pathsData['viewBoxHeight']; // 632

$villagesList = [
    [
        'no' => 1,
        'id' => 'cikampek-barat',
        'name' => 'Cikampek Barat',
        'pathKey' => 'Cikampek Barat',
        'target' => 3200000000,
        'realisasi' => 2560000000,
        'obyekTerdaftar' => 6200,
        'info' => 'Kawasan Cikampek Barat dengan aktivitas niaga dan permukiman mencatatkan capaian 80,0% (Mendekati Target). Pengawasan sisa tagihan berjalan aktif.'
    ],
    [
        'no' => 2,
        'id' => 'cikampek-kota',
        'name' => 'Cikampek Kota',
        'pathKey' => 'Cikampek Kota',
        'target' => 3800000000,
        'realisasi' => 3838000000,
        'obyekTerdaftar' => 6800,
        'info' => 'Sebagai pusat perdagangan dan stasiun utama, Cikampek Kota berhasil melampaui target dengan capaian 101,0% (Tercapai).'
    ],
    [
        'no' => 3,
        'id' => 'cikampek-pusaka',
        'name' => 'Cikampek Pusaka',
        'pathKey' => 'Cikampek Pusaka',
        'target' => 2200000000,
        'realisasi' => 1628000000,
        'obyekTerdaftar' => 4400,
        'info' => 'Capaian pembayaran di Cikampek Pusaka tercatat 74,0% (Mendekati Target). Sosialisasi intensif terus digencarkan aparat desa.'
    ],
    [
        'no' => 4,
        'id' => 'cikampek-selatan',
        'name' => 'Cikampek Selatan',
        'pathKey' => 'Cikampek Selatan',
        'target' => 2800000000,
        'realisasi' => 2128000000,
        'obyekTerdaftar' => 5500,
        'info' => 'Cikampek Selatan meraih capaian 76,0% (Mendekati Target). Optimalisasi penagihan SPPT terus dimaksimalkan.'
    ],
    [
        'no' => 5,
        'id' => 'cikampek-timur',
        'name' => 'Cikampek Timur',
        'pathKey' => 'Cikampek Timur',
        'target' => 2600000000,
        'realisasi' => 2015000000,
        'obyekTerdaftar' => 5100,
        'info' => 'Capaian pembayaran PBB-P2 di Cikampek Timur mencapai 77,5% (Mendekati Target) dengan tren pelunasan yang positif.'
    ],
    [
        'no' => 6,
        'id' => 'dawuan-barat',
        'name' => 'Dawuan Barat',
        'pathKey' => 'Dawuan Barat',
        'target' => 3100000000,
        'realisasi' => 2418000000,
        'obyekTerdaftar' => 5800,
        'info' => 'Kawasan permukiman Dawuan Barat membukukan realisasi 78,0% (Mendekati Target). Kolektor desa aktif menelusuri wajib pajak terdaftar.'
    ],
    [
        'no' => 7,
        'id' => 'dawuan-tengah',
        'name' => 'Dawuan Tengah',
        'pathKey' => 'Dawuan Tengah',
        'target' => 3400000000,
        'realisasi' => 2822000000,
        'obyekTerdaftar' => 6400,
        'info' => 'Dawuan Tengah sebagai salah satu desa terpadat mencapai realisasi 83,0% (Mendekati Target), sejalan dengan rata-rata kecamatan.'
    ],
    [
        'no' => 8,
        'id' => 'dawuan-timur',
        'name' => 'Dawuan Timur',
        'pathKey' => 'Dawuan Timur',
        'target' => 2700000000,
        'realisasi' => 2079000000,
        'obyekTerdaftar' => 5200,
        'info' => 'Capaian pembayaran di Dawuan Timur mencapai 77,0% (Mendekati Target). Kanal pembayaran digital terus disosialisasikan.'
    ],
    [
        'no' => 9,
        'id' => 'kalihurip',
        'name' => 'Kalihurip',
        'pathKey' => 'Kalihurip',
        'target' => 2500000000,
        'realisasi' => 2525000000,
        'obyekTerdaftar' => 4600,
        'info' => 'Didukung kawasan strategis dan kepatuhan wajib pajak yang tinggi, Kalihurip mencatatkan capaian gemilang 101,0% (Tercapai).'
    ],
    [
        'no' => 10,
        'id' => 'kamojing',
        'name' => 'Kamojing',
        'pathKey' => 'Kamojing',
        'target' => 2300000000,
        'realisasi' => 1725000000,
        'obyekTerdaftar' => 4500,
        'info' => 'Wilayah Kamojing dengan potensi wisata situ mencatatkan capaian 75,0% (Mendekati Target). Pendataan berkala terus berjalan.'
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
        die("Path not found for " . $v['pathKey']);
    }

    $desaData[] = [
        'no' => $v['no'],
        'id' => $v['id'],
        'name' => $v['name'],
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
        'targetFormatted' => 'Rp. ' . number_format($t, 0, ',', '.'),
        'realisasiFormatted' => 'Rp. ' . number_format($r, 0, ',', '.'),
        'sisaTagihan' => $sisa,
        'sisaTagihanFormatted' => 'Rp. ' . number_format($sisa, 0, ',', '.'),
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
    'targetFormatted' => 'Rp. ' . number_format($totalTarget, 0, ',', '.'),
    'realisasi' => $totalRealisasi,
    'realisasiFormatted' => 'Rp. ' . number_format($totalRealisasi, 0, ',', '.'),
    'sisaTagihan' => $kecSisa,
    'sisaTagihanFormatted' => 'Rp. ' . number_format($kecSisa, 0, ',', '.'),
    'capaian' => $kecCapaian,
    'capaianFormatted' => number_format($kecCapaian, 1, ',', '') . '%',
    'tier' => 'yellow',
    'statusText' => 'Mendekati Target',
    'jumlahDesa' => count($desaData),
    'obyekTerdaftar' => $totalObyek,
    'obyekLunas' => (int)$totalLunas,
    'obyekBelumLunas' => (int)$totalBelumLunas,
    'info' => 'Kecamatan Cikampek mencatatkan capaian realisasi PBB-P2 sebesar 83,0% (Mendekati Target) dengan total realisasi Rp 23,74 Miliar dari target Rp 28,60 Miliar.'
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

$jsContent = "// Generated Cikampek Desa Data\n";
$jsContent .= "const CIKAMPEK_VIEWBOX_WIDTH = $viewBoxWidth;\n";
$jsContent .= "const CIKAMPEK_VIEWBOX_HEIGHT = $viewBoxHeight;\n";
$jsContent .= "const CIKAMPEK_SUMMARY = " . json_encode($summary, JSON_PRETTY_PRINT) . ";\n";
$jsContent .= "const CIKAMPEK_DESA_DATA = " . json_encode($desaData, JSON_PRETTY_PRINT) . ";\n";

file_put_contents('assets/cikampek_data.js', $jsContent);
file_put_contents('pbb-p2/public/assets/cikampek_data.js', $jsContent);
echo "Successfully generated assets/cikampek_data.js and pbb-p2/public/assets/cikampek_data.js!\n";
