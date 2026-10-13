<?php
$pathsData = json_decode(file_get_contents('banyusari_paths.json'), true);
$vPaths = $pathsData['villages'];

$viewBoxWidth = $pathsData['viewBoxWidth']; // 600
$viewBoxHeight = $pathsData['viewBoxHeight']; // 458

$villagesList = [
    [
        'no' => 1,
        'id' => 'banyuasih',
        'name' => 'Banyuasih',
        'pathKey' => 'Banyuasih',
        'target' => 550000000,
        'realisasi' => 110000000,
        'obyekTerdaftar' => 1450,
        'obyekLunas' => 290,
        'info' => 'Capaian pembayaran berada pada 20,0% (Capaian Rendah). Diperlukan langkah intensifikasi dan koordinasi lapangan untuk mendorong percepatan penerimaan.'
    ],
    [
        'no' => 2,
        'id' => 'cicinde-selatan',
        'name' => 'Cicinde Selatan',
        'pathKey' => 'Cicinde Selatan',
        'target' => 650000000,
        'realisasi' => 195000000,
        'obyekTerdaftar' => 1700,
        'obyekLunas' => 510,
        'info' => 'Capaian pembayaran berada pada 30,0% (Capaian Sedang). Diperlukan sosialisasi berkelanjutan untuk memaksimalkan pelunasan sebelum jatuh tempo.'
    ],
    [
        'no' => 3,
        'id' => 'cicinde-utara',
        'name' => 'Cicinde Utara',
        'pathKey' => 'Cicinde Utara',
        'target' => 600000000,
        'realisasi' => 210000000,
        'obyekTerdaftar' => 1550,
        'obyekLunas' => 542,
        'info' => 'Capaian pembayaran berada pada 35,0% (Capaian Sedang). Potensi penerimaan di wilayah sentra pengolahan ikan perlu terus dioptimalkan.'
    ],
    [
        'no' => 4,
        'id' => 'gembongan',
        'name' => 'Gembongan',
        'pathKey' => 'Gembongan',
        'target' => 750000000,
        'realisasi' => 240000000,
        'obyekTerdaftar' => 1950,
        'obyekLunas' => 624,
        'info' => 'Sebagai pusat pemerintahan kecamatan, Gembongan mencatatkan capaian 32,0% (Capaian Sedang). Koordinasi kolektor terus ditingkatkan.'
    ],
    [
        'no' => 5,
        'id' => 'gempol',
        'name' => 'Gempol',
        'pathKey' => 'Gempol',
        'target' => 500000000,
        'realisasi' => 100000000,
        'obyekTerdaftar' => 1350,
        'obyekLunas' => 270,
        'info' => 'Capaian pembayaran berada pada 20,0% (Capaian Rendah). Diperlukan langkah intensifikasi dan koordinasi lapangan untuk mendorong percepatan penerimaan.'
    ],
    [
        'no' => 6,
        'id' => 'gempol-kolot',
        'name' => 'Gempol Kolot',
        'pathKey' => 'Gempol Kolot',
        'target' => 600000000,
        'realisasi' => 108000000,
        'obyekTerdaftar' => 1550,
        'obyekLunas' => 279,
        'info' => 'Capaian pembayaran berada pada 18,0% (Capaian Rendah). Diperlukan langkah intensifikasi dan koordinasi lapangan untuk mendorong percepatan penerimaan.'
    ],
    [
        'no' => 7,
        'id' => 'jayamukti',
        'name' => 'Jayamukti',
        'pathKey' => 'Jayamukti',
        'target' => 500000000,
        'realisasi' => 110000000,
        'obyekTerdaftar' => 1320,
        'obyekLunas' => 290,
        'info' => 'Capaian pembayaran berada pada 22,0% (Capaian Rendah). Diperlukan langkah intensifikasi dan koordinasi lapangan untuk mendorong percepatan penerimaan.'
    ],
    [
        'no' => 8,
        'id' => 'kutaraharja',
        'name' => 'Kutaraharja',
        'pathKey' => 'Kutaraharja',
        'target' => 550000000,
        'realisasi' => 99000000,
        'obyekTerdaftar' => 1420,
        'obyekLunas' => 256,
        'info' => 'Capaian pembayaran berada pada 18,0% (Capaian Rendah). Diperlukan langkah intensifikasi dan koordinasi lapangan untuk mendorong percepatan penerimaan.'
    ],
    [
        'no' => 9,
        'id' => 'mekarasih',
        'name' => 'Mekarasih',
        'pathKey' => 'Mekarasih',
        'target' => 450000000,
        'realisasi' => 81000000,
        'obyekTerdaftar' => 1200,
        'obyekLunas' => 216,
        'info' => 'Capaian pembayaran berada pada 18,0% (Capaian Rendah). Diperlukan langkah intensifikasi dan koordinasi lapangan untuk mendorong percepatan penerimaan.'
    ],
    [
        'no' => 10,
        'id' => 'pamekaran',
        'name' => 'Pamekaran',
        'pathKey' => 'Pamekaran',
        'target' => 550000000,
        'realisasi' => 110000000,
        'obyekTerdaftar' => 1400,
        'obyekLunas' => 280,
        'info' => 'Capaian pembayaran berada pada 20,0% (Capaian Rendah). Diperlukan langkah intensifikasi dan koordinasi lapangan untuk mendorong percepatan penerimaan.'
    ],
    [
        'no' => 11,
        'id' => 'talunjaya',
        'name' => 'Talunjaya',
        'pathKey' => 'Talunjaya',
        'target' => 500000000,
        'realisasi' => 125000000,
        'obyekTerdaftar' => 1350,
        'obyekLunas' => 338,
        'info' => 'Capaian pembayaran berada pada 25,0% (Capaian Rendah). Diperlukan langkah intensifikasi dan koordinasi lapangan untuk mendorong percepatan penerimaan.'
    ],
    [
        'no' => 12,
        'id' => 'tanjung',
        'name' => 'Tanjung',
        'pathKey' => 'Tanjung',
        'target' => 0,
        'realisasi' => 0,
        'obyekTerdaftar' => 0,
        'obyekLunas' => 0,
        'info' => 'Data target dan realisasi PBB-P2 untuk Desa Tanjung belum tersedia atau belum terverifikasi dalam basis data BAPENDA.'
    ]
];

$desaData = [];
$totTarget = 0;
$totReal = 0;
$totObyek = 0;
$totLunas = 0;

foreach ($villagesList as $v) {
    $target = $v['target'];
    $realisasi = $v['realisasi'];
    $totTarget += $target;
    $totReal += $realisasi;
    $totObyek += $v['obyekTerdaftar'];
    $totLunas += $v['obyekLunas'];

    $capaian = ($target > 0) ? round(($realisasi / $target) * 100, 1) : 0;
    $sisaTagihan = max(0, $target - $realisasi);

    if ($target == 0 && $realisasi == 0) {
        $tier = 'red';
        $statusText = 'Belum Terverifikasi';
        $statusDotClass = 'bg-red';
        $color = '#e54242';
        $targetFormatted = 'Rp. 0 (Belum Tersedia)';
        $realisasiFormatted = 'Rp. 0';
    } else {
        $tier = ($capaian >= 100) ? 'green' : (($capaian >= 70) ? 'yellow' : (($capaian >= 30) ? 'orange' : 'red'));
        $statusText = ($capaian >= 100) ? 'Tercapai' : (($capaian >= 70) ? 'Mendekati Target' : (($capaian >= 30) ? 'Capaian Sedang' : 'Capaian Rendah'));
        $statusDotClass = 'bg-' . $tier;
        $color = ($tier === 'green') ? '#2ea868' : (($tier === 'yellow') ? '#f5d547' : (($tier === 'orange') ? '#f59e42' : '#e54242'));
        $targetFormatted = 'Rp. ' . number_format($target, 0, ',', '.');
        $realisasiFormatted = 'Rp. ' . number_format($realisasi, 0, ',', '.');
    }

    $pathObj = $vPaths[$v['pathKey']] ?? [
        'path' => '',
        'cx' => 0,
        'cy' => 0
    ];

    $desaData[] = [
        'no' => $v['no'],
        'id' => $v['id'],
        'name' => $v['name'],
        'target' => $target,
        'realisasi' => $realisasi,
        'capaian' => $capaian,
        'tier' => $tier,
        'statusText' => $statusText,
        'statusDotClass' => $statusDotClass,
        'obyekTerdaftar' => $v['obyekTerdaftar'],
        'obyekLunas' => $v['obyekLunas'],
        'obyekBelumLunas' => $v['obyekTerdaftar'] - $v['obyekLunas'],
        'info' => $v['info'],
        'targetFormatted' => $targetFormatted,
        'realisasiFormatted' => $realisasiFormatted,
        'sisaTagihan' => $sisaTagihan,
        'sisaTagihanFormatted' => 'Rp. ' . number_format($sisaTagihan, 0, ',', '.'),
        'capaianFormatted' => number_format($capaian, 1, ',', '.') . '%',
        'color' => $color,
        'path' => $pathObj['path'],
        'cx' => $pathObj['cx'],
        'cy' => $pathObj['cy']
    ];
}

$totSisa = max(0, $totTarget - $totReal);
$totCapaian = round(($totReal / $totTarget) * 100, 1);
$totTier = ($totCapaian >= 100) ? 'green' : (($totCapaian >= 70) ? 'yellow' : (($totCapaian >= 30) ? 'orange' : 'red'));
$totStatusText = ($totCapaian >= 100) ? 'Tercapai' : (($totCapaian >= 70) ? 'Mendekati Target' : (($totCapaian >= 30) ? 'Capaian Sedang' : 'Capaian Rendah'));

$summary = [
    'target' => $totTarget,
    'targetFormatted' => 'Rp. ' . number_format($totTarget, 0, ',', '.'),
    'realisasi' => $totReal,
    'realisasiFormatted' => 'Rp. ' . number_format($totReal, 0, ',', '.'),
    'sisaTagihan' => $totSisa,
    'sisaTagihanFormatted' => 'Rp. ' . number_format($totSisa, 0, ',', '.'),
    'capaian' => $totCapaian,
    'capaianFormatted' => number_format($totCapaian, 1, ',', '.') . '%',
    'tier' => $totTier,
    'statusText' => $totStatusText,
    'jumlahDesa' => 12,
    'obyekTerdaftar' => $totObyek,
    'obyekLunas' => $totLunas,
    'obyekBelumLunas' => $totObyek - $totLunas,
    'info' => 'Capaian pembayaran Kecamatan Banyusari berada pada 24,0% (Capaian Rendah). Diperlukan langkah intensifikasi dan koordinasi lapangan untuk mendorong percepatan penerimaan.'
];

$jsContent = "// Generated Banyusari Desa Data\n";
$jsContent .= "const BANYUSARI_VIEWBOX_WIDTH = $viewBoxWidth;\n";
$jsContent .= "const BANYUSARI_VIEWBOX_HEIGHT = $viewBoxHeight;\n";
$jsContent .= "const BANYUSARI_SUMMARY = " . json_encode($summary, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . ";\n";
$jsContent .= "const BANYUSARI_DESA_DATA = " . json_encode($desaData, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . ";\n";

file_put_contents('assets/banyusari_data.js', $jsContent);
file_put_contents('pbb-p2/public/assets/banyusari_data.js', $jsContent);

echo "Successfully generated assets/banyusari_data.js and pbb-p2/public/assets/banyusari_data.js!\n";
echo "Total Villages: " . count($desaData) . "\n";
echo "Target: " . number_format($totTarget) . " (Expected: 6.200.000.000)\n";
echo "Realisasi: " . number_format($totReal) . " (Expected: 1.488.000.000)\n";
echo "Sisa Tagihan: " . number_format($totSisa) . " (Expected: 4.712.000.000)\n";
echo "Capaian: " . $totCapaian . "% (Expected: 24.0%)\n";
