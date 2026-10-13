<?php
$content = file_get_contents(__DIR__ . '/assets/cilamaya_wetan_data.js');
preg_match('/const CILAMAYA_WETAN_SUMMARY = (\{.*?\});/s', $content, $mSum);
preg_match('/const CILAMAYA_WETAN_DESA_DATA = (\[.*?\]);/s', $content, $mDesa);

$summary = json_decode($mSum[1] ?? '{}', true);
$desa = json_decode($mDesa[1] ?? '[]', true);

echo "Jumlah Desa: " . count($desa) . "\n";
$totalTarget = 0;
$totalRealisasi = 0;
$totalSisa = 0;
$totalObyek = 0;
$totalLunas = 0;
$totalBelum = 0;

foreach ($desa as $d) {
    $totalTarget += $d['target'];
    $totalRealisasi += $d['realisasi'];
    $totalSisa += $d['sisaTagihan'];
    $totalObyek += $d['obyekTerdaftar'];
    $totalLunas += $d['obyekLunas'];
    $totalBelum += $d['obyekBelumLunas'];
    printf("%-2d. %-18s: Target=%14s, Real=%14s, Cap=%5.1f%%, Sisa=%14s, Status=%s\n", 
        $d['no'], $d['name'], number_format($d['target']), number_format($d['realisasi']), $d['capaian'], number_format($d['sisaTagihan']), $d['statusText']);
}

echo "\n";
echo "TOTAL TARGET   : " . number_format($totalTarget) . " (Expected: 11.500.000.000)\n";
echo "TOTAL REALISASI: " . number_format($totalRealisasi) . " (Expected: 10.005.000.000)\n";
echo "TOTAL SISA     : " . number_format($totalSisa) . " (Expected: 1.495.000.000)\n";
$cap = round($totalRealisasi / $totalTarget * 100, 2);
echo "CAPAIAN        : {$cap}% (Expected: 87.0%)\n";
echo "OBYEK BALANCE  : " . ($totalObyek === ($totalLunas + $totalBelum) ? "OK ($totalObyek = $totalLunas + $totalBelum)" : "MISMATCH") . "\n";
