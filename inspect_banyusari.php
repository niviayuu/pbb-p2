<?php
$content = file_get_contents(__DIR__ . '/assets/banyusari_data.js');
preg_match('/const BANYUSARI_SUMMARY = (\{.*?\});/s', $content, $mSum);
preg_match('/const BANYUSARI_DESA_DATA = (\[.*?\]);/s', $content, $mDesa);

$summary = json_decode($mSum[1] ?? '{}', true);
$desa = json_decode($mDesa[1] ?? '[]', true);

echo "--- BANYUSARI_SUMMARY ---\n";
print_r($summary);

echo "\n--- BANYUSARI_DESA_DATA (Count: " . count($desa) . ") ---\n";
$totTarget = 0;
$totReal = 0;
$totSisa = 0;
$totObyek = 0;
$totLunas = 0;
$totBelum = 0;
foreach ($desa as $d) {
    $totTarget += $d['target'];
    $totReal += $d['realisasi'];
    $totSisa += $d['sisaTagihan'];
    $totObyek += $d['obyekTerdaftar'];
    $totLunas += $d['obyekLunas'];
    $totBelum += $d['obyekBelumLunas'];
    printf("%2d. %-18s: Target=%12s, Real=%12s, Cap=%5.1f%%, Sisa=%12s\n",
        $d['no'], $d['name'], number_format($d['target']), number_format($d['realisasi']), $d['capaian'], number_format($d['sisaTagihan']));
}
echo "TOTAL TARGET   : " . number_format($totTarget) . " (Expected: 6.200.000.000)\n";
echo "TOTAL REALISASI: " . number_format($totReal) . " (Expected: 1.488.000.000)\n";
echo "TOTAL SISA     : " . number_format($totSisa) . "\n";
echo "CAPAIAN        : " . round($totReal / $totTarget * 100, 2) . "% (Expected: 24.0%)\n";

echo "\n--- INSPECT GIT 2db7c0c:banyusari_desa.geojson ---\n";
$geoContent = shell_exec('git show 2db7c0c:banyusari_desa.geojson');
$geo = json_decode($geoContent, true);
$tanjungFeature = $geo['features'][11];
print_r($tanjungFeature['properties']);




$paths = json_decode(file_get_contents('banyusari_paths.json'), true);
echo "banyusari_paths.json villages count: " . count($paths['villages'] ?? []) . "\n";
foreach ($paths['villages'] as $name => $v) {
    echo "- $name: pathLen=" . strlen($v['path']) . ", cx=" . $v['cx'] . ", cy=" . $v['cy'] . "\n";
}

