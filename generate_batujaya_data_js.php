<?php
$pathsData = json_decode(file_get_contents('batujaya_paths.json'), true);
$viewBoxWidth = $pathsData['viewBoxWidth'];
$viewBoxHeight = $pathsData['viewBoxHeight'];
$paths = $pathsData['paths'];

$villagesConfig = [
    [
        'no' => 1,
        'id' => 'segarjaya',
        'aliases' => [],
        'name' => 'Segarjaya',
        'pathKey' => 'Segarjaya',
        'jenis_kd' => 'Desa',
        'kode_kd' => '32.15.08.2007',
        'target' => 850000000,
        'realisasi' => 382500000,
        'capaian' => 45,
        'tier' => 'orange',
        'statusText' => 'Capaian Sedang',
        'statusDotClass' => 'bg-orange',
        'color' => '#f59e42',
        'obyekTerdaftar' => 1700,
        'obyekLunas' => 765,
        'obyekBelumLunas' => 935,
        'info' => 'Desa Segarjaya mencatatkan capaian realisasi 45,0% (Capaian Sedang) dengan optimalisasi sosialisasi pembayaran pajak daerah.'
    ],
    [
        'no' => 2,
        'id' => 'segaran',
        'aliases' => [],
        'name' => 'Segaran',
        'pathKey' => 'Segaran',
        'jenis_kd' => 'Desa',
        'kode_kd' => '32.15.08.2006',
        'target' => 900000000,
        'realisasi' => 414000000,
        'capaian' => 46,
        'tier' => 'orange',
        'statusText' => 'Capaian Sedang',
        'statusDotClass' => 'bg-orange',
        'color' => '#f59e42',
        'obyekTerdaftar' => 1800,
        'obyekLunas' => 828,
        'obyekBelumLunas' => 972,
        'info' => 'Desa Segaran mencatatkan capaian realisasi 46,0% (Capaian Sedang). Peningkatan penerimaan didorong oleh sektor permukiman dan kawasan cagar budaya Candi Jiwa.'
    ],
    [
        'no' => 3,
        'id' => 'batujaya',
        'aliases' => [],
        'name' => 'Batujaya',
        'pathKey' => 'Batujaya',
        'jenis_kd' => 'Desa',
        'kode_kd' => '32.15.08.2001',
        'target' => 1000000000,
        'realisasi' => 400000000,
        'capaian' => 40,
        'tier' => 'orange',
        'statusText' => 'Capaian Sedang',
        'statusDotClass' => 'bg-orange',
        'color' => '#f59e42',
        'obyekTerdaftar' => 2000,
        'obyekLunas' => 800,
        'obyekBelumLunas' => 1200,
        'info' => 'Desa Batujaya sebagai pusat ibukota kecamatan mencatatkan capaian 40,0% (Capaian Sedang) dengan potensi wajib pajak dan obyek niaga yang terus berkembang.'
    ],
    [
        'no' => 4,
        'id' => 'baturaden',
        'aliases' => [],
        'name' => 'Baturaden',
        'pathKey' => 'Baturaden',
        'jenis_kd' => 'Desa',
        'kode_kd' => '32.15.08.2005',
        'target' => 750000000,
        'realisasi' => 360000000,
        'capaian' => 48,
        'tier' => 'orange',
        'statusText' => 'Capaian Sedang',
        'statusDotClass' => 'bg-orange',
        'color' => '#f59e42',
        'obyekTerdaftar' => 1500,
        'obyekLunas' => 720,
        'obyekBelumLunas' => 780,
        'info' => 'Desa Baturaden mencatatkan capaian realisasi 48,0% (Capaian Sedang) melalui koordinasi aktif aparatur desa dan kolektor pajak.'
    ],
    [
        'no' => 5,
        'id' => 'karyabakti',
        'aliases' => ['karyabhakti'],
        'name' => 'Karyabakti',
        'pathKey' => 'Karyabhakti',
        'jenis_kd' => 'Desa',
        'kode_kd' => '32.15.08.2004',
        'target' => 750000000,
        'realisasi' => 300000000,
        'capaian' => 40,
        'tier' => 'orange',
        'statusText' => 'Capaian Sedang',
        'statusDotClass' => 'bg-orange',
        'color' => '#f59e42',
        'obyekTerdaftar' => 1500,
        'obyekLunas' => 600,
        'obyekBelumLunas' => 900,
        'info' => 'Desa Karyabakti mencatatkan capaian realisasi 40,0% (Capaian Sedang) dengan intensifikasi penagihan SPPT kepada wajib pajak sektor pertanian.'
    ],
    [
        'no' => 6,
        'id' => 'telukambulu',
        'aliases' => [],
        'name' => 'Telukambulu',
        'pathKey' => 'Telukambulu',
        'jenis_kd' => 'Desa',
        'kode_kd' => '32.15.08.2002',
        'target' => 700000000,
        'realisasi' => 336000000,
        'capaian' => 48,
        'tier' => 'orange',
        'statusText' => 'Capaian Sedang',
        'statusDotClass' => 'bg-orange',
        'color' => '#f59e42',
        'obyekTerdaftar' => 1400,
        'obyekLunas' => 672,
        'obyekBelumLunas' => 728,
        'info' => 'Desa Telukambulu mencatatkan capaian realisasi 48,0% (Capaian Sedang) dengan percepatan penyampaian SPPT langsung kepada warga.'
    ],
    [
        'no' => 7,
        'id' => 'telukbango',
        'aliases' => [],
        'name' => 'Telukbango',
        'pathKey' => 'Telukbango',
        'jenis_kd' => 'Desa',
        'kode_kd' => '32.15.08.2003',
        'target' => 800000000,
        'realisasi' => 352000000,
        'capaian' => 44,
        'tier' => 'orange',
        'statusText' => 'Capaian Sedang',
        'statusDotClass' => 'bg-orange',
        'color' => '#f59e42',
        'obyekTerdaftar' => 1600,
        'obyekLunas' => 704,
        'obyekBelumLunas' => 896,
        'info' => 'Desa Telukbango mencatatkan capaian realisasi 44,0% (Capaian Sedang). Pemantauan berkala dilakukan untuk mendorong kepatuhan pelunasan.'
    ],
    [
        'no' => 8,
        'id' => 'karyamulya',
        'aliases' => [],
        'name' => 'Karyamulya',
        'pathKey' => 'Karyamulya',
        'jenis_kd' => 'Desa',
        'kode_kd' => '32.15.08.2009',
        'target' => 700000000,
        'realisasi' => 336000000,
        'capaian' => 48,
        'tier' => 'orange',
        'statusText' => 'Capaian Sedang',
        'statusDotClass' => 'bg-orange',
        'color' => '#f59e42',
        'obyekTerdaftar' => 1400,
        'obyekLunas' => 672,
        'obyekBelumLunas' => 728,
        'info' => 'Desa Karyamulya mencatatkan capaian realisasi 48,0% (Capaian Sedang) dengan respon positif dari wajib pajak sektor persawahan dan perumahan.'
    ],
    [
        'no' => 9,
        'id' => 'karyamakmur',
        'aliases' => [],
        'name' => 'Karyamakmur',
        'pathKey' => 'Karyamakmur',
        'jenis_kd' => 'Desa',
        'kode_kd' => '32.15.08.2010',
        'target' => 700000000,
        'realisasi' => 322000000,
        'capaian' => 46,
        'tier' => 'orange',
        'statusText' => 'Capaian Sedang',
        'statusDotClass' => 'bg-orange',
        'color' => '#f59e42',
        'obyekTerdaftar' => 1400,
        'obyekLunas' => 644,
        'obyekBelumLunas' => 756,
        'info' => 'Desa Karyamakmur mencatatkan capaian realisasi 46,0% (Capaian Sedang) didukung oleh sinergi aparatur desa dan tokoh masyarakat.'
    ],
    [
        'no' => 10,
        'id' => 'kutaampel',
        'aliases' => [],
        'name' => 'Kutaampel',
        'pathKey' => 'Kutaampel',
        'jenis_kd' => 'Desa',
        'kode_kd' => '32.15.08.2008',
        'target' => 750000000,
        'realisasi' => 352500000,
        'capaian' => 47,
        'tier' => 'orange',
        'statusText' => 'Capaian Sedang',
        'statusDotClass' => 'bg-orange',
        'color' => '#f59e42',
        'obyekTerdaftar' => 1500,
        'obyekLunas' => 705,
        'obyekBelumLunas' => 795,
        'info' => 'Desa Kutaampel mencatatkan capaian realisasi 47,0% (Capaian Sedang) dengan penagihan bertahap pada obyek pajak potensial.'
    ],
];

function formatRupiah($val) {
    return 'Rp' . number_format($val, 2, ',', '.');
}

$desaData = [];
$totalTarget = 0;
$totalRealisasi = 0;
$totalSisa = 0;
$totalObyek = 0;
$totalLunas = 0;
$totalBelum = 0;

foreach ($villagesConfig as $v) {
    $sisa = $v['target'] - $v['realisasi'];
    $pathObj = $paths[$v['pathKey']] ?? null;
    if (!$pathObj) {
        die("ERROR: Path not found for key: " . $v['pathKey'] . "\n");
    }

    $capaianVal = round($v['realisasi'] / $v['target'] * 100, 1);

    $row = [
        'no' => $v['no'],
        'id' => $v['id'],
        'aliases' => $v['aliases'],
        'name' => $v['name'],
        'jenis_kd' => $v['jenis_kd'],
        'kode_kd' => $v['kode_kd'],
        'target' => $v['target'],
        'realisasi' => $v['realisasi'],
        'capaian' => $v['capaian'],
        'tier' => $v['tier'],
        'statusText' => $v['statusText'],
        'statusDotClass' => $v['statusDotClass'],
        'obyekTerdaftar' => $v['obyekTerdaftar'],
        'obyekLunas' => $v['obyekLunas'],
        'obyekBelumLunas' => $v['obyekBelumLunas'],
        'info' => $v['info'],
        'targetFormatted' => formatRupiah($v['target']),
        'realisasiFormatted' => formatRupiah($v['realisasi']),
        'sisaTagihan' => $sisa,
        'sisaTagihanFormatted' => formatRupiah($sisa),
        'capaianFormatted' => number_format($capaianVal, 1, ',', '') . '%',
        'color' => $v['color'],
        'path' => $pathObj['path'],
        'cx' => $pathObj['cx'],
        'cy' => $pathObj['cy'],
    ];

    $desaData[] = $row;
    $totalTarget += $v['target'];
    $totalRealisasi += $v['realisasi'];
    $totalSisa += $sisa;
    $totalObyek += $v['obyekTerdaftar'];
    $totalLunas += $v['obyekLunas'];
    $totalBelum += $v['obyekBelumLunas'];
}

$totalCapaian = round($totalRealisasi / $totalTarget * 100, 1);

$summary = [
    'target' => $totalTarget,
    'targetFormatted' => formatRupiah($totalTarget),
    'realisasi' => $totalRealisasi,
    'realisasiFormatted' => formatRupiah($totalRealisasi),
    'sisaTagihan' => $totalSisa,
    'sisaTagihanFormatted' => formatRupiah($totalSisa),
    'capaian' => 45,
    'capaianFormatted' => number_format($totalCapaian, 1, ',', '') . '%',
    'tier' => 'orange',
    'statusText' => 'Capaian Sedang',
    'jumlahDesa' => count($desaData),
    'obyekTerdaftar' => $totalObyek,
    'obyekLunas' => $totalLunas,
    'obyekBelumLunas' => $totalBelum,
    'info' => 'Kecamatan Batujaya mencatatkan realisasi PBB-P2 sebesar 45,0% (Capaian Sedang) dengan total penerimaan Rp 3,56 Miliar dari target Rp 7,90 Miliar di 10 desa.'
];

$jsContent = "// Generated Batujaya Desa Data\n";
$jsContent .= "const BATUJAYA_VIEWBOX_WIDTH = $viewBoxWidth;\n";
$jsContent .= "const BATUJAYA_VIEWBOX_HEIGHT = $viewBoxHeight;\n";
$jsContent .= "const BATUJAYA_SUMMARY = " . json_encode($summary, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . ";\n";
$jsContent .= "const BATUJAYA_DESA_DATA = " . json_encode($desaData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . ";\n";

file_put_contents('assets/batujaya_data.js', $jsContent);
file_put_contents('pbb-p2/public/assets/batujaya_data.js', $jsContent);

echo "Successfully written assets/batujaya_data.js and pbb-p2/public/assets/batujaya_data.js\n";
echo "Summary target: {$summary['targetFormatted']}, realisasi: {$summary['realisasiFormatted']}, capaian: {$summary['capaianFormatted']}\n";
echo "Total villages: " . count($desaData) . "\n";
