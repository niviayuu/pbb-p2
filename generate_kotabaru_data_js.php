<?php
$pathsData = json_decode(file_get_contents('kotabaru_paths.json'), true);
$vPaths = $pathsData['villages'];

$viewBoxWidth = $pathsData['viewBoxWidth']; // 600
$viewBoxHeight = $pathsData['viewBoxHeight']; // 604

$villagesList = [
    [
        'no' => 1,
        'id' => 'cikampek-utara',
        'name' => 'Cikampek Utara',
        'pathKey' => 'Cikampek Utara',
        'target' => 2400000000,
        'realisasi' => 1728000000,
        'obyekTerdaftar' => 4800,
        'info' => 'Kawasan strategis dan sentra perniagaan Cikampek Utara mencatatkan capaian 72,0% (Mendekati Target). Potensi penerimaan terus dioptimalkan.'
    ],
    [
        'no' => 2,
        'id' => 'jomin-barat',
        'name' => 'Jomin Barat',
        'pathKey' => 'Jomin Barat',
        'target' => 2100000000,
        'realisasi' => 1344000000,
        'obyekTerdaftar' => 4200,
        'info' => 'Capaian pembayaran berada pada 64,0% (Capaian Sedang). Diperlukan langkah intensifikasi dan koordinasi lapangan untuk mendorong percepatan penerimaan.'
    ],
    [
        'no' => 3,
        'id' => 'jomin-timur',
        'name' => 'Jomin Timur',
        'pathKey' => 'Jomin Timur',
        'target' => 1900000000,
        'realisasi' => 1064000000,
        'obyekTerdaftar' => 3800,
        'info' => 'Capaian pembayaran berada pada 56,0% (Capaian Sedang). Koordinasi kolektor desa ditingkatkan untuk menjangkau sisa wajib pajak.'
    ],
    [
        'no' => 4,
        'id' => 'pangulah-baru',
        'name' => 'Pangulah Baru',
        'pathKey' => 'Pangulah Baru',
        'target' => 1800000000,
        'realisasi' => 936000000,
        'obyekTerdaftar' => 3600,
        'info' => 'Capaian pembayaran berada pada 52,0% (Capaian Sedang). Sosialisasi kemudahan kanal pembayaran digital terus dimasifkan ke warga.'
    ],
    [
        'no' => 5,
        'id' => 'pangulah-selatan',
        'name' => 'Pangulah Selatan',
        'pathKey' => 'Pangulah Selatan',
        'target' => 2000000000,
        'realisasi' => 1180000000,
        'obyekTerdaftar' => 4000,
        'info' => 'Capaian pembayaran berada pada 59,0% (Capaian Sedang). Monitoring berkala terus dilakukan bersama aparatur desa dan kolektor pajak.'
    ],
    [
        'no' => 6,
        'id' => 'pangulah-utara',
        'name' => 'Pangulah Utara',
        'pathKey' => 'Pangulah Utara',
        'target' => 1900000000,
        'realisasi' => 950000000,
        'obyekTerdaftar' => 3800,
        'info' => 'Capaian pembayaran mencapai 50,0% (Capaian Sedang). Penelusuran sisa SPPT terus dipercepat bersama pemerintah desa.'
    ],
    [
        'no' => 7,
        'id' => 'pucung',
        'name' => 'Pucung',
        'pathKey' => 'Pucung',
        'target' => 2300000000,
        'realisasi' => 1564000000,
        'obyekTerdaftar' => 4600,
        'info' => 'Pusat permukiman padat Desa Pucung mencatatkan capaian 68,0% (Capaian Sedang). Tinggal sedikit lagi untuk menembus kategori Mendekati Target.'
    ],
    [
        'no' => 8,
        'id' => 'sarimulya',
        'name' => 'Sarimulya',
        'pathKey' => 'Sarimulya',
        'target' => 1800000000,
        'realisasi' => 828000000,
        'obyekTerdaftar' => 3600,
        'info' => 'Capaian pembayaran berada pada 46,0% (Capaian Sedang). Diperlukan sosialisasi berkelanjutan untuk memaksimalkan pelunasan sebelum jatuh tempo.'
    ],
    [
        'no' => 9,
        'id' => 'wancimekar',
        'name' => 'Wancimekar',
        'pathKey' => 'Wancimekar',
        'target' => 2200000000,
        'realisasi' => 1078000000,
        'obyekTerdaftar' => 4400,
        'info' => 'Kawasan Wancimekar mencatatkan capaian 49,0% (Capaian Sedang). Peningkatan penagihan door-to-door terus didorong oleh tim perpajakan desa.'
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
    'info' => 'Capaian pembayaran Kecamatan Kotabaru berada pada 58,0% (Capaian Sedang). Diperlukan langkah percepatan dan monitoring intensif pada desa-desa berpotensi tinggi sebelum jatuh tempo.'
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

$jsContent = "// Generated Kotabaru Desa Data\n";
$jsContent .= "const KOTABARU_VIEWBOX_WIDTH = $viewBoxWidth;\n";
$jsContent .= "const KOTABARU_VIEWBOX_HEIGHT = $viewBoxHeight;\n";
$jsContent .= "const KOTABARU_SUMMARY = " . json_encode($summary, JSON_PRETTY_PRINT) . ";\n";
$jsContent .= "const KOTABARU_DESA_DATA = " . json_encode($desaData, JSON_PRETTY_PRINT) . ";\n";

file_put_contents('assets/kotabaru_data.js', $jsContent);
file_put_contents('pbb-p2/public/assets/kotabaru_data.js', $jsContent);
echo "Successfully generated assets/kotabaru_data.js and pbb-p2/public/assets/kotabaru_data.js!\n";
