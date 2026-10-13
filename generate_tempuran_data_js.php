<?php
$pathsData = json_decode(file_get_contents('tempuran_paths.json'), true);
$vPaths = $pathsData['villages'];

$viewBoxWidth = $pathsData['viewBoxWidth']; // 600
$viewBoxHeight = $pathsData['viewBoxHeight']; // 593

$villagesList = [
    [
        'no' => 1,
        'id' => 'tempuran',
        'name' => 'Tempuran',
        'pathKey' => 'Tempuran',
        'target' => 900000000,
        'realisasi' => 945000000,
        'obyekTerdaftar' => 2050,
        'obyekLunas' => 2005,
        'info' => 'Capaian pembayaran desa/kelurahan sudah mencapai 100% atau lebih dari target (105,0%). Terus pertahankan dan tingkatkan realisasi pembayarannya.'
    ],
    [
        'no' => 2,
        'id' => 'ciparagejaya',
        'name' => 'Ciparagejaya',
        'pathKey' => 'Ciparagejaya',
        'target' => 880000000,
        'realisasi' => 897600000,
        'obyekTerdaftar' => 1920,
        'obyekLunas' => 1860,
        'info' => 'Capaian pembayaran desa/kelurahan sudah melampaui target (102,0%). Pengelolaan potensi PBB sektor pesisir berjalan sangat baik.'
    ],
    [
        'no' => 3,
        'id' => 'purwajaya',
        'name' => 'Purwajaya',
        'pathKey' => 'Purwajaya',
        'target' => 750000000,
        'realisasi' => 645000000,
        'obyekTerdaftar' => 1650,
        'obyekLunas' => 1419,
        'info' => 'Capaian pembayaran desa/kelurahan mendekati target (86,0%). Terus lakukan pendekatan dan sosialisasi kepada wajib pajak untuk menyelesaikan sisa tagihan.'
    ],
    [
        'no' => 4,
        'id' => 'tanjungjaya',
        'name' => 'Tanjungjaya',
        'pathKey' => 'Tanjungjaya',
        'target' => 700000000,
        'realisasi' => 567000000,
        'obyekTerdaftar' => 1520,
        'obyekLunas' => 1231,
        'info' => 'Capaian pembayaran berada pada 81,0%. Koordinasi kolektor desa ditingkatkan untuk menjangkau sisa wajib pajak sebelum jatuh tempo.'
    ],
    [
        'no' => 5,
        'id' => 'lemahmakmur',
        'name' => 'Lemahmakmur',
        'pathKey' => 'Lemahmakmur',
        'target' => 680000000,
        'realisasi' => 510000000,
        'obyekTerdaftar' => 1480,
        'obyekLunas' => 1110,
        'info' => 'Capaian pembayaran telah mencapai 75,0%. Diperlukan pemantauan berkala agar target optimal dapat tercapai di akhir tahun anggaran.'
    ],
    [
        'no' => 6,
        'id' => 'sumberjaya',
        'name' => 'Sumberjaya',
        'pathKey' => 'Sumberjaya',
        'target' => 700000000,
        'realisasi' => 462000000,
        'obyekTerdaftar' => 1550,
        'obyekLunas' => 1023,
        'info' => 'Capaian masih dalam kategori sedang (66,0%). Perlu percepatan pendataan dan pemantauan objek pajak potensial.'
    ],
    [
        'no' => 7,
        'id' => 'pancakarya',
        'name' => 'Pancakarya',
        'pathKey' => 'Pancakarya',
        'target' => 650000000,
        'realisasi' => 403000000,
        'obyekTerdaftar' => 1420,
        'obyekLunas' => 880,
        'info' => 'Realisasi pembayaran mencapai 62,0%. Layanan pembayaran jemput bola dapat membantu mempercepat penyelesaian sisa tagihan.'
    ],
    [
        'no' => 8,
        'id' => 'cikuntul',
        'name' => 'Cikuntul',
        'pathKey' => 'Cikuntul',
        'target' => 650000000,
        'realisasi' => 377000000,
        'obyekTerdaftar' => 1390,
        'obyekLunas' => 806,
        'info' => 'Capaian berada di angka 58,0%. Perlu intensifikasi penagihan SPPT PBB buku 1 dan 2 kepada wajib pajak.'
    ],
    [
        'no' => 9,
        'id' => 'pagadungan',
        'name' => 'Pagadungan',
        'pathKey' => 'Pagadungan',
        'target' => 620000000,
        'realisasi' => 341000000,
        'obyekTerdaftar' => 1340,
        'obyekLunas' => 737,
        'info' => 'Capaian berada pada kategori sedang (55,0%). Diperlukan kerja sama intensif dengan aparatur desa dalam pendistribusian SPPT.'
    ],
    [
        'no' => 10,
        'id' => 'lemahkarya',
        'name' => 'Lemahkarya',
        'pathKey' => 'Lemahkarya',
        'target' => 600000000,
        'realisasi' => 306000000,
        'obyekTerdaftar' => 1280,
        'obyekLunas' => 653,
        'info' => 'Capaian mencapai 51,0%. Evaluasi berkala terhadap objek pajak yang menunggak perlu dilakukan secara berkala.'
    ],
    [
        'no' => 11,
        'id' => 'jayanagara',
        'name' => 'Jayanagara',
        'pathKey' => 'Jayanegara',
        'target' => 600000000,
        'realisasi' => 276000000,
        'obyekTerdaftar' => 1260,
        'obyekLunas' => 580,
        'info' => 'Capaian berada di bawah rata-rata kecamatan (46,0%). Prioritaskan sosialisasi kemudahan pembayaran digital dan kanal resmi bank mitra.'
    ],
    [
        'no' => 12,
        'id' => 'lemahsubur',
        'name' => 'Lemahsubur',
        'pathKey' => 'Lemahsubur',
        'target' => 590000000,
        'realisasi' => 224200000,
        'obyekTerdaftar' => 1230,
        'obyekLunas' => 467,
        'info' => 'Capaian berada di angka 38,0%. Diperlukan langkah koordinasi terpadu untuk menekan angka penunggakan pajak.'
    ],
    [
        'no' => 13,
        'id' => 'lemahduhur',
        'name' => 'Lemahduhur',
        'pathKey' => 'Lemahduhur',
        'target' => 550000000,
        'realisasi' => 148500000,
        'obyekTerdaftar' => 1150,
        'obyekLunas' => 311,
        'info' => 'Capaian masih rendah (27,0%). Diperlukan intervensi khusus dan pendataan ulang subjek serta objek pajak yang belum tertagih.'
    ],
    [
        'no' => 14,
        'id' => 'dayeuhluhur',
        'name' => 'Dayeuhluhur',
        'pathKey' => 'Dayeuhluhur',
        'target' => 530000000,
        'realisasi' => 141000000, // Note: let's adjust slightly if needed for exact sum
        'obyekTerdaftar' => 1110,
        'obyekLunas' => 295,
        'info' => 'Capaian berada pada kategori rendah (26,6%). Perlu optimalisasi tim satgas penagihan pajak tingkat kecamatan dan desa.'
    ],
];

// Let's ensure sum of realisasi is EXACTLY 6,270,000,000
$sumT = 0;
$sumR = 0;
for ($i = 0; $i < 13; $i++) {
    $sumT += $villagesList[$i]['target'];
    $sumR += $villagesList[$i]['realisasi'];
}
$villagesList[13]['target'] = 9500000000 - $sumT;
$villagesList[13]['realisasi'] = 6270000000 - $sumR;
$pct14 = round(($villagesList[13]['realisasi'] / $villagesList[13]['target']) * 100, 1);
$villagesList[13]['obyekLunas'] = round($villagesList[13]['obyekTerdaftar'] * ($pct14 / 100));

function formatRp($num) {
    return 'Rp. ' . number_format($num, 0, ',', '.');
}

function formatPct($num) {
    return number_format($num, 1, ',', '.') . '%';
}

$processedDesa = [];
$totalObyek = 0;
$totalLunas = 0;
$totalBelum = 0;

foreach ($villagesList as $v) {
    $pct = round(($v['realisasi'] / $v['target']) * 100, 1);
    $sisa = max(0, $v['target'] - $v['realisasi']);
    $belum = $v['obyekTerdaftar'] - $v['obyekLunas'];

    $tier = 'red';
    $statusText = 'Capaian Rendah';
    $statusDotClass = 'bg-red';
    $color = '#ea3838';

    if ($pct >= 100) {
        $tier = 'green';
        $statusText = 'Tercapai';
        $statusDotClass = 'bg-green';
        $color = '#2ea868';
    } elseif ($pct >= 70) {
        $tier = 'yellow';
        $statusText = 'Mendekati Target';
        $statusDotClass = 'bg-yellow';
        $color = '#f5d547';
    } elseif ($pct >= 30) {
        $tier = 'orange';
        $statusText = 'Capaian Sedang';
        $statusDotClass = 'bg-orange';
        $color = '#f59e42';
    }

    $pathObj = $vPaths[$v['pathKey']] ?? null;
    if (!$pathObj) {
        die("Error: pathKey {$v['pathKey']} not found!\n");
    }

    $totalObyek += $v['obyekTerdaftar'];
    $totalLunas += $v['obyekLunas'];
    $totalBelum += $belum;

    $processedDesa[] = [
        'no' => $v['no'],
        'id' => $v['id'],
        'name' => $v['name'],
        'target' => $v['target'],
        'realisasi' => $v['realisasi'],
        'capaian' => $pct,
        'tier' => $tier,
        'statusText' => $statusText,
        'statusDotClass' => $statusDotClass,
        'obyekTerdaftar' => $v['obyekTerdaftar'],
        'obyekLunas' => $v['obyekLunas'],
        'obyekBelumLunas' => $belum,
        'info' => $v['info'],
        'targetFormatted' => formatRp($v['target']),
        'realisasiFormatted' => formatRp($v['realisasi']),
        'sisaTagihan' => $sisa,
        'sisaTagihanFormatted' => formatRp($sisa),
        'capaianFormatted' => formatPct($pct),
        'color' => $color,
        'path' => $pathObj['path'],
        'cx' => $pathObj['cx'],
        'cy' => $pathObj['cy']
    ];
}

$summary = [
    'target' => 9500000000,
    'targetFormatted' => 'Rp. 9.500.000.000',
    'realisasi' => 6270000000,
    'realisasiFormatted' => 'Rp. 6.270.000.000',
    'sisaTagihan' => 3230000000,
    'sisaTagihanFormatted' => 'Rp. 3.230.000.000',
    'capaian' => 66.0,
    'capaianFormatted' => '66,0%',
    'tier' => 'orange',
    'statusText' => 'Capaian Sedang',
    'jumlahDesa' => 14,
    'obyekTerdaftar' => $totalObyek,
    'obyekLunas' => $totalLunas,
    'obyekBelumLunas' => $totalBelum,
    'info' => 'Capaian pembayaran Kecamatan Tempuran berada pada 66,0% (Capaian Sedang). Tingkatkan intensifikasi penagihan pada desa dengan capaian di bawah target.'
];

$jsContent = "// Generated Tempuran Desa Data\n";
$jsContent .= "const TEMPURAN_VIEWBOX_WIDTH = $viewBoxWidth;\n";
$jsContent .= "const TEMPURAN_VIEWBOX_HEIGHT = $viewBoxHeight;\n";
$jsContent .= "const TEMPURAN_SUMMARY = " . json_encode($summary, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . ";\n";
$jsContent .= "const TEMPURAN_DESA_DATA = " . json_encode($processedDesa, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . ";\n";

file_put_contents('assets/tempuran_data.js', $jsContent);
echo "Successfully written assets/tempuran_data.js\n";
echo "Total Villages: " . count($processedDesa) . "\n";
echo "Sum Target: " . array_sum(array_column($processedDesa, 'target')) . "\n";
echo "Sum Realisasi: " . array_sum(array_column($processedDesa, 'realisasi')) . "\n";
echo "Total Obyek: $totalObyek (Lunas: $totalLunas, Belum: $totalBelum)\n";
