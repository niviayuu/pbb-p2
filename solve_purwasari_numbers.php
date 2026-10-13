<?php
// 8 Villages in Purwasari:
// 1. Mekarjaya
// 2. Tamelang
// 3. Purwasari
// 4. Sukasari
// 5. Tegalsari
// 6. Karangsari
// 7. Darawolong
// 8. Cengkong

$targetTotal = 15200000000;
$realisasiTotal = 10640000000;

// Village targets candidate (sum = 15.200.000.000):
// Average per village ~ 1.9 B
$targets = [
    'mekarjaya' => 1900000000,
    'tamelang' => 2100000000,
    'purwasari' => 2400000000,
    'sukasari' => 1800000000,
    'tegalsari' => 1700000000,
    'karangsari' => 1800000000,
    'darawolong' => 1700000000,
    'cengkong' => 1800000000
];

echo "Sum target check: " . array_sum($targets) . " vs $targetTotal\n";

// Let's find realistic rates:
// Weighted average must be 70.0%
// e.g. Purwasari (pusat kec): 82.0% -> 2.400.000.000 * 0.82 = 1.968.000.000
// Tamelang (strategis jalan utama): 78.0% -> 2.100.000.000 * 0.78 = 1.638.000.000
// Mekarjaya: 72.0% -> 1.900.000.000 * 0.72 = 1.368.000.000
// Sukasari: 68.0% -> 1.800.000.000 * 0.68 = 1.224.000.000
// Tegalsari: 66.0% -> 1.700.000.000 * 0.66 = 1.122.000.000
// Karangsari: 65.0% -> 1.800.000.000 * 0.65 = 1.170.000.000
// Darawolong: 62.0% -> 1.700.000.000 * 0.62 = 1.054.000.000
// Cengkong: ?

function solve($targets, $realisasiTotal) {
    foreach (range(780, 850, 5) as $rPur) { // Purwasari 78.0 - 85.0
        $valPur = round(2400000000 * ($rPur / 1000));
        foreach (range(740, 800, 5) as $rTam) { // Tamelang 74.0 - 80.0
            $valTam = round(2100000000 * ($rTam / 1000));
            foreach (range(700, 750, 5) as $rMek) { // Mekarjaya 70.0 - 75.0
                $valMek = round(1900000000 * ($rMek / 1000));
                foreach (range(660, 720, 5) as $rSuk) { // Sukasari 66.0 - 72.0
                    $valSuk = round(1800000000 * ($rSuk / 1000));
                    foreach (range(640, 680, 5) as $rTeg) { // Tegalsari 64.0 - 68.0
                        $valTeg = round(1700000000 * ($rTeg / 1000));
                        foreach (range(620, 680, 5) as $rKar) { // Karangsari 62.0 - 68.0
                            $valKar = round(1800000000 * ($rKar / 1000));
                            foreach (range(600, 660, 5) as $rDar) { // Darawolong 60.0 - 66.0
                                $valDar = round(1700000000 * ($rDar / 1000));
                                
                                $cur = $valPur + $valTam + $valMek + $valSuk + $valTeg + $valKar + $valDar;
                                $rem = $realisasiTotal - $cur;
                                
                                // Cengkong target = 1.800.000.000
                                $rateCeng = ($rem / 1800000000) * 100;
                                $rateCengR = round($rateCeng, 1);
                                if (abs($rateCeng - $rateCengR) < 0.0001 && $rateCengR >= 60.0 && $rateCengR <= 72.0) {
                                    return [
                                        'mekarjaya' => [$rMek / 10, $valMek],
                                        'tamelang' => [$rTam / 10, $valTam],
                                        'purwasari' => [$rPur / 10, $valPur],
                                        'sukasari' => [$rSuk / 10, $valSuk],
                                        'tegalsari' => [$rTeg / 10, $valTeg],
                                        'karangsari' => [$rKar / 10, $valKar],
                                        'darawolong' => [$rDar / 10, $valDar],
                                        'cengkong' => [$rateCengR, $rem]
                                    ];
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

$sol = solve($targets, $realisasiTotal);
if ($sol) {
    echo "Found solution!\n";
    $totR = 0;
    foreach ($sol as $k => $v) {
        $t = $targets[$k];
        $r = $v[1];
        $totR += $r;
        $rate = $v[0];
        $calc = round(($r / $t) * 100, 1);
        echo sprintf("%-12s: Target=%14s, Real=%14s, Rate=%5.1f%% (calc=%5.1f%%)\n",
            $k, number_format($t, 0, ',', '.'), number_format($r, 0, ',', '.'), $rate, $calc);
    }
    echo "Total Target: " . number_format($targetTotal, 0, ',', '.') . "\n";
    echo "Total Real  : " . number_format($totR, 0, ',', '.') . "\n";
    echo "Weighted Capaian: " . round(($totR / $targetTotal) * 100, 1) . "%\n";
} else {
    echo "No solution found in loop range.\n";
}
