<?php
$pathsData = json_decode(file_get_contents('pangkalan_paths.json'), true);
$vPaths = $pathsData['villages'];

$viewBoxWidth = $pathsData['viewBoxWidth']; // 600
$viewBoxHeight = $pathsData['viewBoxHeight']; // 694

// Order strictly following Section 3 of prompt:
// 1. Cintaasih
// 2. Ciptasari
// 3. Jatilaksana
// 4. Kertasari
// 5. Medalsari
// 6. Mulangsari
// 7. Tamanmekar
// 8. Tamansari

$villagesList = [
    [
        'no' => 1,
        'id' => 'cintaasih',
        'name' => 'Cintaasih',
        'pathKey' => 'Cintaasih',
        'target' => 850000000,
        'realisasi' => 595000000,
        'obyekTerdaftar' => 1700,
        'info' => 'Desa Cintaasih mencatatkan capaian realisasi 70,0% (Mendekati Target). Penguatan pendataan SPPT dan koordinasi kolektor desa berjalan efektif.'
    ],
    [
        'no' => 2,
        'id' => 'ciptasari',
        'name' => 'Ciptasari',
        'pathKey' => 'Ciptasari',
        'target' => 900000000,
        'realisasi' => 612000000,
        'obyekTerdaftar' => 1800,
        'info' => 'Sebagai salah satu sentra ekonomi di Pangkalan, Desa Ciptasari mencatatkan capaian 68,0% (Capaian Sedang). Penagihan piutang pajak terus diintensifkan.'
    ],
    [
        'no' => 3,
        'id' => 'jatilaksana',
        'name' => 'Jatilaksana',
        'pathKey' => 'Jatilaksana',
        'target' => 800000000,
        'realisasi' => 544000000,
        'obyekTerdaftar' => 1600,
        'info' => 'Desa Jatilaksana meraih capaian 68,0% (Capaian Sedang). Pelayanan jemput bola dan sosialisasi pembayaran digital konsisten digencarkan.'
    ],
    [
        'no' => 4,
        'id' => 'kertasari',
        'name' => 'Kertasari',
        'pathKey' => 'Kertasari',
        'target' => 750000000,
        'realisasi' => 495000000,
        'obyekTerdaftar' => 1500,
        'info' => 'Desa Kertasari membukukan capaian 66,0% (Capaian Sedang). Penelusuran sisa ketetapan pajak terus dimaksimalkan oleh aparatur desa.'
    ],
    [
        'no' => 5,
        'id' => 'medalsari',
        'name' => 'Medalsari',
        'pathKey' => 'Medalsari',
        'target' => 550000000,
        'realisasi' => 352000000,
        'obyekTerdaftar' => 1100,
        'info' => 'Wilayah selatan Desa Medalsari mencatatkan capaian 64,0% (Capaian Sedang). Aksesibilitas loket bayar dan pemutakhiran data terus diupayakan.'
    ],
    [
        'no' => 6,
        'id' => 'mulangsari',
        'name' => 'Mulangsari',
        'pathKey' => 'Mulangsari',
        'target' => 650000000,
        'realisasi' => 416000000,
        'obyekTerdaftar' => 1300,
        'info' => 'Desa Mulangsari mencapai realisasi 64,0% (Capaian Sedang). Upaya pendekatan persuasif kepada wajib pajak terus ditingkatkan.'
    ],
    [
        'no' => 7,
        'id' => 'tamanmekar',
        'name' => 'Tamanmekar',
        'pathKey' => 'Tamanmekar',
        'target' => 1200000000,
        'realisasi' => 840000000,
        'obyekTerdaftar' => 2400,
        'info' => 'Desa Tamanmekar dengan basis industri dan kawasan perniagaan meraih capaian 70,0% (Mendekati Target) dari target Rp 1,20 Miliar.'
    ],
    [
        'no' => 8,
        'id' => 'tamansari',
        'name' => 'Tamansari',
        'pathKey' => 'Tamansari',
        'target' => 1100000000,
        'realisasi' => 770000000,
        'obyekTerdaftar' => 2200,
        'info' => 'Sebagai pusat aktivitas Kecamatan Pangkalan, Desa Tamansari mencatatkan capaian 70,0% (Mendekati Target) dengan penerimaan Rp 770 Juta.'
    ]
];

$desaData = [];
$totalTarget = 0;
$totalRealisasi = 0;
$totalObyek = 0;
$totalLunas = 0;
$totalBelumLunas = 0;

foreach ($villagesList as $v) {
    $t = $v['target'];
    $r = $v['realisasi'];
    $capaian = round(($r / $t) * 100, 1);

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
    } elseif ($capaian >= 50) {
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
    'tier' => 'orange',
    'statusText' => 'Capaian Sedang',
    'jumlahDesa' => count($desaData),
    'obyekTerdaftar' => $totalObyek,
    'obyekLunas' => (int)$totalLunas,
    'obyekBelumLunas' => (int)$totalBelumLunas,
    'info' => 'Kecamatan Pangkalan mencatatkan capaian realisasi PBB-P2 sebesar 68,0% (Capaian Sedang) dengan total realisasi Rp 4,62 Miliar dari target Rp 6,80 Miliar.'
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

$jsContent = "// Generated Pangkalan Desa Data\n";
$jsContent .= "const PANGKALAN_VIEWBOX_WIDTH = $viewBoxWidth;\n";
$jsContent .= "const PANGKALAN_VIEWBOX_HEIGHT = $viewBoxHeight;\n";
$jsContent .= "const PANGKALAN_SUMMARY = " . json_encode($summary, JSON_PRETTY_PRINT) . ";\n";
$jsContent .= "const PANGKALAN_DESA_DATA = " . json_encode($desaData, JSON_PRETTY_PRINT) . ";\n";

file_put_contents('assets/pangkalan_data.js', $jsContent);
file_put_contents('pbb-p2/public/assets/pangkalan_data.js', $jsContent);
echo "Successfully generated assets/pangkalan_data.js and pbb-p2/public/assets/pangkalan_data.js!\n";
