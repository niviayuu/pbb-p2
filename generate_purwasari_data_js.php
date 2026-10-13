<?php
$pathsData = json_decode(file_get_contents('purwasari_paths.json'), true);
$vPaths = $pathsData['villages'];

$viewBoxWidth = $pathsData['viewBoxWidth']; // 600
$viewBoxHeight = $pathsData['viewBoxHeight']; // 1006

// Order strictly following Section 2 of prompt:
// 1. Mekarjaya
// 2. Tamelang
// 3. Purwasari
// 4. Sukasari
// 5. Tegalsari
// 6. Karangsari
// 7. Darawolong
// 8. Cengkong

$villagesList = [
    [
        'no' => 1,
        'id' => 'mekarjaya',
        'name' => 'Mekarjaya',
        'pathKey' => 'Mekarjaya',
        'target' => 1900000000,
        'realisasi' => 1330000000,
        'obyekTerdaftar' => 3800,
        'info' => 'Desa Mekarjaya mencatatkan capaian realisasi 70,0% (Mendekati Target). Pendataan potensi wajib pajak terus ditingkatkan oleh kolektor desa.'
    ],
    [
        'no' => 2,
        'id' => 'tamelang',
        'name' => 'Tamelang',
        'pathKey' => 'Tamelang',
        'target' => 2100000000,
        'realisasi' => 1554000000,
        'obyekTerdaftar' => 4200,
        'info' => 'Kawasan strategis Tamelang di sepanjang koridor utama mencatatkan capaian 74,0% (Mendekati Target) dengan partisipasi wajib pajak yang baik.'
    ],
    [
        'no' => 3,
        'id' => 'purwasari',
        'name' => 'Purwasari',
        'pathKey' => 'Purwasari',
        'target' => 2400000000,
        'realisasi' => 1872000000,
        'obyekTerdaftar' => 4800,
        'info' => 'Sebagai pusat pemerintahan kecamatan, Desa Purwasari meraih capaian tertinggi 78,0% (Mendekati Target). Optimalisasi penagihan SPPT berjalan konsisten.'
    ],
    [
        'no' => 4,
        'id' => 'sukasari',
        'name' => 'Sukasari',
        'pathKey' => 'Sukasari',
        'target' => 1800000000,
        'realisasi' => 1188000000,
        'obyekTerdaftar' => 3600,
        'info' => 'Desa Sukasari membukukan capaian 66,0% (Capaian Sedang). Penelusuran sisa tagihan terus dipercepat menjelang batas jatuh tempo.'
    ],
    [
        'no' => 5,
        'id' => 'tegalsari',
        'name' => 'Tegalsari',
        'pathKey' => 'Tegalsari',
        'target' => 1700000000,
        'realisasi' => 1088000000,
        'obyekTerdaftar' => 3400,
        'info' => 'Capaian pembayaran di Tegalsari berada pada 64,0% (Capaian Sedang). Sosialisasi kemudahan kanal bayar perbankan dan digital terus dimasifkan.'
    ],
    [
        'no' => 6,
        'id' => 'karangsari',
        'name' => 'Karangsari',
        'pathKey' => 'Karangsari',
        'target' => 1800000000,
        'realisasi' => 1224000000,
        'obyekTerdaftar' => 3600,
        'info' => 'Desa Karangsari mencatatkan realisasi 68,0% (Capaian Sedang). Monitoring intensif terus dilakukan aparatur desa dan tim perpajakan.'
    ],
    [
        'no' => 7,
        'id' => 'darawolong',
        'name' => 'Darawolong',
        'pathKey' => 'Darawolong',
        'target' => 1700000000,
        'realisasi' => 1088000000,
        'obyekTerdaftar' => 3400,
        'info' => 'Realisasi PBB-P2 di Darawolong mencapai 64,0% (Capaian Sedang). Upaya jemput bola penagihan SPPT terus dimaksimalkan ke warga.'
    ],
    [
        'no' => 8,
        'id' => 'cengkong',
        'name' => 'Cengkong',
        'pathKey' => 'Cengkong',
        'target' => 1800000000,
        'realisasi' => 1296000000,
        'obyekTerdaftar' => 3600,
        'info' => 'Desa Cengkong mencatatkan capaian positif 72,0% (Mendekati Target). Pengawasan pelunasan berjalan tertib dan teratur.'
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
    'info' => 'Kecamatan Purwasari mencatatkan capaian realisasi PBB-P2 sebesar 70,0% (Mendekati Target) dengan total realisasi Rp 10,64 Miliar dari target Rp 15,20 Miliar.'
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

$jsContent = "// Generated Purwasari Desa Data\n";
$jsContent .= "const PURWASARI_VIEWBOX_WIDTH = $viewBoxWidth;\n";
$jsContent .= "const PURWASARI_VIEWBOX_HEIGHT = $viewBoxHeight;\n";
$jsContent .= "const PURWASARI_SUMMARY = " . json_encode($summary, JSON_PRETTY_PRINT) . ";\n";
$jsContent .= "const PURWASARI_DESA_DATA = " . json_encode($desaData, JSON_PRETTY_PRINT) . ";\n";

file_put_contents('assets/purwasari_data.js', $jsContent);
file_put_contents('pbb-p2/public/assets/purwasari_data.js', $jsContent);
echo "Successfully generated assets/purwasari_data.js and pbb-p2/public/assets/purwasari_data.js!\n";
