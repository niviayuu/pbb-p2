<?php
$pathsData = json_decode(file_get_contents('telukjambe_barat_paths.json'), true);
$vPaths = $pathsData['villages'];

$viewBoxWidth = $pathsData['viewBoxWidth']; // 600
$viewBoxHeight = $pathsData['viewBoxHeight']; // 1037

// Order strictly following Section 3 of prompt:
// 1. Karangligar
// 2. Karangmulya
// 3. Margakaya
// 4. Margamulya
// 5. Mekarmulya
// 6. Mulyajaya
// 7. Parungsari
// 8. Wanajaya
// 9. Wanakerta
// 10. Wanasari

$villagesList = [
    [
        'no' => 1,
        'id' => 'karangligar',
        'name' => 'Karangligar',
        'pathKey' => 'Karangligar',
        'target' => 1600000000,
        'realisasi' => 1152000000,
        'obyekTerdaftar' => 3200,
        'info' => 'Desa Karangligar membukukan capaian realisasi 72,0% (Mendekati Target). Penguatan verifikasi obyek pajak dan intensifikasi penagihan SPPT berjalan tertib.'
    ],
    [
        'no' => 2,
        'id' => 'karangmulya',
        'name' => 'Karangmulya',
        'pathKey' => 'Karangmulya',
        'target' => 1400000000,
        'realisasi' => 1008000000,
        'obyekTerdaftar' => 2800,
        'info' => 'Desa Karangmulya mencatatkan capaian 72,0% (Mendekati Target). Sinergi petugas pemungut pajak dan aparat desa terus dimaksimalkan.'
    ],
    [
        'no' => 3,
        'id' => 'margakaya',
        'name' => 'Margakaya',
        'pathKey' => 'Margakaya',
        'target' => 2000000000,
        'realisasi' => 1440000000,
        'obyekTerdaftar' => 4000,
        'info' => 'Sebagai salah satu koridor ekonomi utama, Desa Margakaya meraih capaian 72,0% (Mendekati Target) dengan penerimaan Rp 1,44 Miliar.'
    ],
    [
        'no' => 4,
        'id' => 'margamulya',
        'name' => 'Margamulya',
        'pathKey' => 'Margamulya',
        'target' => 1800000000,
        'realisasi' => 1260000000,
        'obyekTerdaftar' => 3600,
        'info' => 'Desa Margamulya mencatatkan capaian 70,0% (Mendekati Target). Upaya penagihan aktif pada kawasan berkembang terus ditingkatkan.'
    ],
    [
        'no' => 5,
        'id' => 'mekarmulya',
        'name' => 'Mekarmulya',
        'pathKey' => 'Mekarmulya',
        'target' => 1200000000,
        'realisasi' => 840000000,
        'obyekTerdaftar' => 2400,
        'info' => 'Desa Mekarmulya mencapai realisasi 70,0% (Mendekati Target). Sosialisasi kemudahan pembayaran pajak daerah terus dimasifkan kepada warga.'
    ],
    [
        'no' => 6,
        'id' => 'mulyajaya',
        'name' => 'Mulyajaya',
        'pathKey' => 'Mulyajaya',
        'target' => 1000000000,
        'realisasi' => 700000000,
        'obyekTerdaftar' => 2000,
        'info' => 'Desa Mulyajaya meraih capaian 70,0% (Mendekati Target) dari target Rp 1,00 Miliar dengan kepatuhan wajib pajak yang terjaga baik.'
    ],
    [
        'no' => 7,
        'id' => 'parungsari',
        'name' => 'Parungsari',
        'pathKey' => 'Parungsari',
        'target' => 1500000000,
        'realisasi' => 1110000000,
        'obyekTerdaftar' => 3000,
        'info' => 'Desa Parungsari mencatatkan capaian impresif 74,0% (Mendekati Target) dengan total realisasi mencapai Rp 1,11 Miliar.'
    ],
    [
        'no' => 8,
        'id' => 'wanajaya',
        'name' => 'Wanajaya',
        'pathKey' => 'Wanajaya',
        'target' => 1300000000,
        'realisasi' => 936000000,
        'obyekTerdaftar' => 2600,
        'info' => 'Wilayah Desa Wanajaya meraih capaian 72,0% (Mendekati Target). Layanan jemput bola penagihan SPPT konsisten dilaksanakan.'
    ],
    [
        'no' => 9,
        'id' => 'wanakerta',
        'name' => 'Wanakerta',
        'pathKey' => 'Wanakerta',
        'target' => 2500000000,
        'realisasi' => 1850000000,
        'obyekTerdaftar' => 5000,
        'info' => 'Sebagai sentra industri dan perumahan terbesar di Telukjambe Barat, Desa Wanakerta membukukan realisasi Rp 1,85 Miliar (74,0% - Mendekati Target).'
    ],
    [
        'no' => 10,
        'id' => 'wanasari',
        'name' => 'Wanasari',
        'pathKey' => 'Wanasari',
        'target' => 2200000000,
        'realisasi' => 1584000000,
        'obyekTerdaftar' => 4400,
        'info' => 'Kawasan strategis Desa Wanasari mencatatkan capaian 72,0% (Mendekati Target) dengan realisasi penerimaan PBB-P2 sebesar Rp 1,58 Miliar.'
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
    'tier' => 'yellow',
    'statusText' => 'Mendekati Target',
    'jumlahDesa' => count($desaData),
    'obyekTerdaftar' => $totalObyek,
    'obyekLunas' => (int)$totalLunas,
    'obyekBelumLunas' => (int)$totalBelumLunas,
    'info' => 'Kecamatan Telukjambe Barat membukukan capaian realisasi PBB-P2 sebesar 72,0% (Mendekati Target) dengan total realisasi Rp 11,88 Miliar dari target Rp 16,50 Miliar.'
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

$jsContent = "// Generated Telukjambe Barat Desa Data\n";
$jsContent .= "const TELUKJAMBE_BARAT_VIEWBOX_WIDTH = $viewBoxWidth;\n";
$jsContent .= "const TELUKJAMBE_BARAT_VIEWBOX_HEIGHT = $viewBoxHeight;\n";
$jsContent .= "const TELUKJAMBE_BARAT_SUMMARY = " . json_encode($summary, JSON_PRETTY_PRINT) . ";\n";
$jsContent .= "const TELUKJAMBE_BARAT_DESA_DATA = " . json_encode($desaData, JSON_PRETTY_PRINT) . ";\n";

file_put_contents('assets/telukjambe_barat_data.js', $jsContent);
file_put_contents('pbb-p2/public/assets/telukjambe_barat_data.js', $jsContent);
echo "Successfully generated assets/telukjambe_barat_data.js and pbb-p2/public/assets/telukjambe_barat_data.js!\n";
