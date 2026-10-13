<?php
// Desired targets:
$targets = [
    'cikampek-barat' => 3200000000,
    'cikampek-kota' => 3800000000,
    'cikampek-pusaka' => 2200000000,
    'cikampek-selatan' => 2800000000,
    'cikampek-timur' => 2600000000,
    'dawuan-barat' => 3100000000,
    'dawuan-tengah' => 3400000000,
    'dawuan-timur' => 2700000000,
    'kalihurip' => 2500000000,
    'kamojing' => 2300000000
];

$targetTotal = 28600000000;
$realisasiTotal = 23738000000;

// Let's test specific clean percentages:
// Total target = 28.6B, total realisasi = 23.738B, weighted avg = 83.0%.
// Some villages >= 100% (Tercapai), some 70-99% (Mendekati Target), some 60-69% (Capaian Sedang)

// Let's assign:
// 1. Cikampek Kota (commercial center): 102.0% -> 3.800.000.000 * 1.02 = 3.876.000.000
// 2. Kalihurip (industrial area): 104.0% -> 2.500.000.000 * 1.04 = 2.600.000.000
// 3. Dawuan Tengah (high density): 85.0% -> 3.400.000.000 * 0.85 = 2.890.000.000
// 4. Cikampek Barat: 82.0% -> 3.200.000.000 * 0.82 = 2.624.000.000
// 5. Dawuan Barat: 80.0% -> 3.100.000.000 * 0.80 = 2.480.000.000
// 6. Cikampek Selatan: 78.0% -> 2.800.000.000 * 0.78 = 2.184.000.000
// 7. Dawuan Timur: 76.0% -> 2.700.000.000 * 0.76 = 2.052.000.000
// 8. Cikampek Timur: 75.0% -> 2.600.000.000 * 0.75 = 1.950.000.000
// 9. Kamojing: 72.0% -> 2.300.000.000 * 0.72 = 1.656.000.000
// Sum of 9 = 3876 + 2600 + 2890 + 2624 + 2480 + 2184 + 2052 + 1950 + 1656 = 22.312.000.000
// Needed for Cikampek Pusaka (target 2.200.000.000):
// 23.738.000.000 - 22.312.000.000 = 1.426.000.000
// 1.426.000.000 / 2.200.000.000 = 64.818...%

// Let's adjust so all percentages are EXACT single-decimal percentages!
// For Cikampek Pusaka to have 1 decimal:
// 2.200.000.000 * 0.65 = 1.430.000.000 (diff = +4.000.000)
// To offset +4.000.000:
// If Cikampek Barat was 2.620.000.000 / 3.200.000.000 = 81.875% -> not clean.
// What if Cikampek Pusaka target is 2.200.000.000, 1% = 22.000.000, 0.1% = 2.200.000.
// Let's write an exhaustive search over clean 1-decimal steps!

$cleanSolutions = [];
$vKeys = array_keys($targets);

// Let's check step sizes for each village where rate * target gives exact integer:
// For target = 3.8B, 0.1% = 3.8M
// For target = 2.5B, 0.1% = 2.5M
// For target = 2.2B, 0.1% = 2.2M, etc.

// Let's write an intelligent solver:
function findCombination($targets, $realisasiTotal) {
    // candidate rates for each
    $ranges = [
        'cikampek-barat' => [80.0, 85.0],
        'cikampek-kota' => [100.0, 105.0],
        'cikampek-pusaka' => [65.0, 75.0],
        'cikampek-selatan' => [75.0, 83.0],
        'cikampek-timur' => [74.0, 80.0],
        'dawuan-barat' => [78.0, 84.0],
        'dawuan-tengah' => [82.0, 88.0],
        'dawuan-timur' => [74.0, 80.0],
        'kalihurip' => [100.0, 106.0],
        'kamojing' => [70.0, 78.0]
    ];

    // Let's test a very elegant set of rates with 1 decimal:
    // Rate step: 0.1% or 0.5% or 1.0%
    foreach (range(1010, 1040, 5) as $rKota) { // 101.0 to 104.0 step 0.5
        $valKota = round(3800000000 * ($rKota / 1000));
        foreach (range(1010, 1050, 5) as $rKali) { // 101.0 to 105.0
            $valKali = round(2500000000 * ($rKali / 1000));
            foreach (range(830, 870, 5) as $rDtg) { // 83.0 to 87.0
                $valDtg = round(3400000000 * ($rDtg / 1000));
                foreach (range(800, 840, 5) as $rCbar) { // 80.0 to 84.0
                    $valCbar = round(3200000000 * ($rCbar / 1000));
                    foreach (range(780, 820, 5) as $rDbar) { // 78.0 to 82.0
                        $valDbar = round(3100000000 * ($rDbar / 1000));
                        foreach (range(760, 800, 5) as $rCsel) { // 76.0 to 80.0
                            $valCsel = round(2800000000 * ($rCsel / 1000));
                            foreach (range(750, 790, 5) as $rDtm) { // 75.0 to 79.0
                                $valDtm = round(2700000000 * ($rDtm / 1000));
                                foreach (range(740, 780, 5) as $rCtim) { // 74.0 to 78.0
                                    $valCtim = round(2600000000 * ($rCtim / 1000));
                                    foreach (range(700, 750, 5) as $rKam) { // 70.0 to 75.0
                                        $valKam = round(2300000000 * ($rKam / 1000));
                                        
                                        $currentSum = $valKota + $valKali + $valDtg + $valCbar + $valDbar + $valCsel + $valDtm + $valCtim + $valKam;
                                        $rem = $realisasiTotal - $currentSum;
                                        
                                        // rem must match 2200000000 * ratePusaka
                                        $ratePusaka = ($rem / 2200000000) * 100;
                                        $ratePusakaRounded = round($ratePusaka, 1);
                                        if (abs($ratePusaka - $ratePusakaRounded) < 0.0001 && $ratePusakaRounded >= 65.0 && $ratePusakaRounded <= 75.0) {
                                            return [
                                                'cikampek-barat' => [$rCbar / 10, $valCbar],
                                                'cikampek-kota' => [$rKota / 10, $valKota],
                                                'cikampek-pusaka' => [$ratePusakaRounded, $rem],
                                                'cikampek-selatan' => [$rCsel / 10, $valCsel],
                                                'cikampek-timur' => [$rCtim / 10, $valCtim],
                                                'dawuan-barat' => [$rDbar / 10, $valDbar],
                                                'dawuan-tengah' => [$rDtg / 10, $valDtg],
                                                'dawuan-timur' => [$rDtm / 10, $valDtm],
                                                'kalihurip' => [$rKali / 10, $valKali],
                                                'kamojing' => [$rKam / 10, $valKam],
                                            ];
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return null;
}

$solution = findCombination($targets, $realisasiTotal);
if ($solution) {
    echo "Found perfect solution!\n";
    $totR = 0;
    foreach ($solution as $k => $v) {
        $t = $targets[$k];
        $r = $v[1];
        $rate = $v[0];
        $totR += $r;
        $calcRate = round(($r / $t) * 100, 1);
        echo sprintf("%-18s: Target=%14s, Real=%14s, Rate=%5.1f%% (calc=%5.1f%%)\n", 
            $k, number_format($t, 0, ',', '.'), number_format($r, 0, ',', '.'), $rate, $calcRate);
    }
    echo "Total Target: " . number_format($targetTotal, 0, ',', '.') . "\n";
    echo "Total Real  : " . number_format($totR, 0, ',', '.') . " (Match: " . ($totR === $realisasiTotal ? 'YES' : 'NO') . ")\n";
    echo "Weighted Capaian: " . round(($totR / $targetTotal) * 100, 1) . "%\n";
} else {
    echo "No solution in current loop range. Adjusting...\n";
}
