<?php
$pathsData = json_decode(file_get_contents('jatisari_paths.json'), true);
$vPaths = $pathsData['villages'];

$viewBoxWidth = $pathsData['viewBoxWidth']; // 600
$viewBoxHeight = $pathsData['viewBoxHeight']; // 840

$villagesList = [
    [
        'no' => 1,
        'id' => 'balonggandu',
        'name' => 'Balonggandu',
        'pathKey' => 'Balonggandu',
        'target' => 1100000000,
        'realisasi' => 847000000,
        'obyekTerdaftar' => 2200,
        'info' => 'Capaian pembayaran berada pada 77,0% (Mendekati Target). Terus lakukan pendekatan dan sosialisasi kepada wajib pajak untuk menyelesaikan sisa tagihan.'
    ],
    [
        'no' => 2,
        'id' => 'kalijati',
        'name' => 'Kalijati',
        'pathKey' => 'Kalijati',
        'target' => 900000000,
        'realisasi' => 576000000,
        'obyekTerdaftar' => 1800,
        'info' => 'Capaian pembayaran berada pada 64,0% (Capaian Sedang). Diperlukan langkah intensifikasi dan koordinasi lapangan untuk mendorong percepatan penerimaan.'
    ],
    [
        'no' => 3,
        'id' => 'mekarsari',
        'name' => 'Mekarsari',
        'pathKey' => 'Mekarsari',
        'target' => 950000000,
        'realisasi' => 684000000,
        'obyekTerdaftar' => 1900,
        'info' => 'Capaian pembayaran berada pada 72,0% (Mendekati Target). Potensi penerimaan sektor permukiman terus dioptimalkan menjelang akhir periode.'
    ],
    [
        'no' => 4,
        'id' => 'jatisari-desa',
        'name' => 'Jatisari',
        'pathKey' => 'Jatisari',
        'target' => 1300000000,
        'realisasi' => 1326000000,
        'obyekTerdaftar' => 2600,
        'info' => 'Sebagai pusat pemerintahan kecamatan, Desa Jatisari berhasil melampaui target dengan capaian 102,0% (Tercapai). Kinerja penagihan sangat optimal.'
    ],
    [
        'no' => 5,
        'id' => 'telarsari',
        'name' => 'Telarsari',
        'pathKey' => 'Telarsari',
        'target' => 950000000,
        'realisasi' => 570000000,
        'obyekTerdaftar' => 1900,
        'info' => 'Capaian pembayaran berada pada 60,0% (Capaian Sedang). Monitoring berkala terus dilakukan bersama aparatur desa dan kolektor pajak.'
    ],
    [
        'no' => 6,
        'id' => 'pacing',
        'name' => 'Pacing',
        'pathKey' => 'Pacing',
        'target' => 900000000,
        'realisasi' => 621000000,
        'obyekTerdaftar' => 1800,
        'info' => 'Capaian pembayaran berada pada 69,0% (Capaian Sedang). Tinggal sedikit lagi untuk menembus ambang batas kategori Mendekati Target.'
    ],
    [
        'no' => 7,
        'id' => 'sukamekar',
        'name' => 'Sukamekar',
        'pathKey' => 'Sukamekar',
        'target' => 850000000,
        'realisasi' => 476000000,
        'obyekTerdaftar' => 1700,
        'info' => 'Capaian pembayaran berada pada 56,0% (Capaian Sedang). Koordinasi kolektor desa ditingkatkan untuk menjangkau sisa wajib pajak.'
    ],
    [
        'no' => 8,
        'id' => 'jatibaru',
        'name' => 'Jatibaru',
        'pathKey' => 'Jatibaru',
        'target' => 950000000,
        'realisasi' => 646000000,
        'obyekTerdaftar' => 1900,
        'info' => 'Capaian pembayaran berada pada 68,0% (Capaian Sedang). Diperlukan sosialisasi berkelanjutan untuk memaksimalkan pelunasan sebelum jatuh tempo.'
    ],
    [
        'no' => 9,
        'id' => 'jatiwangi',
        'name' => 'Jatiwangi',
        'pathKey' => 'Jatiwangi',
        'target' => 900000000,
        'realisasi' => 522000000,
        'obyekTerdaftar' => 1800,
        'info' => 'Capaian pembayaran berada pada 58,0% (Capaian Sedang). Peningkatan penagihan door-to-door terus didorong oleh tim perpajakan desa.'
    ],
    [
        'no' => 10,
        'id' => 'jatiragas',
        'name' => 'Jatiragas',
        'pathKey' => 'Jatiragas',
        'target' => 1050000000,
        'realisasi' => 777000000,
        'obyekTerdaftar' => 2100,
        'info' => 'Capaian pembayaran berada pada 74,0% (Mendekati Target). Pengelolaan data wajib pajak berjalan baik dan terus ditingkatkan.'
    ],
    [
        'no' => 11,
        'id' => 'cikalongsari',
        'name' => 'Cikalongsari',
        'pathKey' => 'Cikalongsari',
        'target' => 1150000000,
        'realisasi' => 1196000000,
        'obyekTerdaftar' => 2300,
        'info' => 'Kawasan strategis jalur Pantura Cikalongsari mencapai 104,0% (Tercapai). Sektor perdagangan dan jasa berkontribusi signifikan pada pelunasan PBB.'
    ],
    [
        'no' => 12,
        'id' => 'cirejag',
        'name' => 'Cirejag',
        'pathKey' => 'Cirejag',
        'target' => 850000000,
        'realisasi' => 408000000,
        'obyekTerdaftar' => 1700,
        'info' => 'Capaian pembayaran berada pada 48,0% (Capaian Sedang). Perlu akselerasi penagihan bagi wajib pajak di sektor pertanian dan perdesaan.'
    ],
    [
        'no' => 13,
        'id' => 'situdam',
        'name' => 'Situdam',
        'pathKey' => 'Situdam',
        'target' => 800000000,
        'realisasi' => 360000000,
        'obyekTerdaftar' => 1600,
        'info' => 'Capaian pembayaran berada pada 45,0% (Capaian Sedang). Langkah-langkah persuasi dan kemudahan kanal pembayaran terus disosialisasikan.'
    ],
    [
        'no' => 14,
        'id' => 'barugbug',
        'name' => 'Barugbug',
        'pathKey' => 'Barugbug',
        'target' => 850000000,
        'realisasi' => 306000000,
        'obyekTerdaftar' => 1700,
        'info' => 'Capaian pembayaran berada pada 36,0% (Capaian Sedang). Penelusuran sisa SPPT terus dipercepat bersama pemerintah desa.'
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
    $objLunas = round($objTerdaftar * ($capaian / 100));
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
        'obyekLunas' => $objLunas,
        'obyekBelumLunas' => $objBelumLunas,
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
    'obyekLunas' => $totalLunas,
    'obyekBelumLunas' => $totalBelumLunas,
    'info' => 'Capaian pembayaran Kecamatan Jatisari berada pada 69,0% (Capaian Sedang). Diperlukan langkah percepatan dan monitoring intensif pada desa-desa berpotensi tinggi sebelum jatuh tempo.'
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

$jsContent = "// Generated Jatisari Desa Data\n";
$jsContent .= "const JATISARI_VIEWBOX_WIDTH = $viewBoxWidth;\n";
$jsContent .= "const JATISARI_VIEWBOX_HEIGHT = $viewBoxHeight;\n";
$jsContent .= "const JATISARI_SUMMARY = " . json_encode($summary, JSON_PRETTY_PRINT) . ";\n";
$jsContent .= "const JATISARI_DESA_DATA = " . json_encode($desaData, JSON_PRETTY_PRINT) . ";\n";

file_put_contents('assets/jatisari_data.js', $jsContent);
file_put_contents('pbb-p2/public/assets/jatisari_data.js', $jsContent);
echo "Successfully generated assets/jatisari_data.js and pbb-p2/public/assets/jatisari_data.js!\n";
