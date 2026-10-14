<?php
$targetTotal = 6800000000;
$realisasiTotal = 4624000000;

// 8 Villages:
// 1. Cintaasih
// 2. Ciptasari
// 3. Jatilaksana
// 4. Kertasari
// 5. Medalsari
// 6. Mulangsari
// 7. Tamanmekar
// 8. Tamansari

// Proportional targets based on geographical area / strategic position:
// Tamanmekar (bordering north/west industrial & commercial): 1.200.000.000
// Tamansari (pusat kec & transit): 1.100.000.000
// Ciptasari (sentra ekonomi): 900.000.000
// Cintaasih: 850.000.000
// Jatilaksana: 800.000.000
// Kertasari: 750.000.000
// Mulangsari: 650.000.000
// Medalsari (selatan): 550.000.000
// Total target = 1200 + 1100 + 900 + 850 + 800 + 750 + 650 + 550 = 6800 M! Perfect!

$targets = [
    'Cintaasih' => 850000000,
    'Ciptasari' => 900000000,
    'Jatilaksana' => 800000000,
    'Kertasari' => 750000000,
    'Medalsari' => 550000000,
    'Mulangsari' => 650000000,
    'Tamanmekar' => 1200000000,
    'Tamansari' => 1100000000
];

echo "Target sum: " . array_sum($targets) . " (Expected: $targetTotal)\n";

// Let's find realisasi with clean rounded percentages:
// Total realisasi must equal 4.624.000.000
// Average percentage = 4624 / 6800 = 68.0%
// Realistic distribution:
// Tamanmekar: 75.0% -> 1.200.000.000 * 0.75 = 900.000.000 (Mendekati Target, yellow)
// Tamansari: 72.0% -> 1.100.000.000 * 0.72 = 792.000.000 (Mendekati Target, yellow)
// Ciptasari: 70.0% -> 900.000.000 * 0.70 = 630.000.000 (Mendekati Target, yellow)
// Jatilaksana: 68.0% -> 800.000.000 * 0.68 = 544.000.000 (Capaian Sedang, orange)
// Cintaasih: 66.0% -> 850.000.000 * 0.66 = 561.000.000 (Capaian Sedang, orange)
// Mulangsari: 64.0% -> 650.000.000 * 0.64 = 416.000.000 (Capaian Sedang, orange)
// Kertasari: 62.0% -> 750.000.000 * 0.62 = 465.000.000 (Capaian Sedang, orange)
// Medalsari: ?
// Current sum of 7: 900 + 792 + 630 + 544 + 561 + 416 + 465 = 4.308.000.000
// Remainder for Medalsari = 4.624.000.000 - 4.308.000.000 = 316.000.000
// Medalsari capaian = 316 / 550 = 57.45% -> let's make all percentages clean integers or 1 decimal point!

$candidates = [];
for ($pTam = 70; $pTam <= 76; $pTam++) {
    for ($pTs = 70; $pTs <= 75; $pTs++) {
        for ($pCip = 68; $pCip <= 74; $pCip++) {
            for ($pJat = 65; $pJat <= 70; $pJat++) {
                for ($pCin = 64; $pCin <= 70; $pCin++) {
                    for ($pMul = 60; $pMul <= 66; $pMul++) {
                        for ($pKer = 60; $pKer <= 66; $pKer++) {
                            $rTam = round($targets['Tamanmekar'] * $pTam / 100);
                            $rTs = round($targets['Tamansari'] * $pTs / 100);
                            $rCip = round($targets['Ciptasari'] * $pCip / 100);
                            $rJat = round($targets['Jatilaksana'] * $pJat / 100);
                            $rCin = round($targets['Cintaasih'] * $pCin / 100);
                            $rMul = round($targets['Mulangsari'] * $pMul / 100);
                            $rKer = round($targets['Kertasari'] * $pKer / 100);
                            
                            $rem = $realisasiTotal - ($rTam + $rTs + $rCip + $rJat + $rCin + $rMul + $rKer);
                            if ($rem > 0 && $rem % 1000000 === 0) {
                                $pMed = $rem / $targets['Medalsari'] * 100;
                                if ($pMed >= 54 && $pMed <= 65 && fmod($pMed * 10, 10) == 0) {
                                    $candidates[] = [
                                        'Tamanmekar' => [$pTam, $rTam],
                                        'Tamansari' => [$pTs, $rTs],
                                        'Ciptasari' => [$pCip, $rCip],
                                        'Jatilaksana' => [$pJat, $rJat],
                                        'Cintaasih' => [$pCin, $rCin],
                                        'Mulangsari' => [$pMul, $rMul],
                                        'Kertasari' => [$pKer, $rKer],
                                        'Medalsari' => [$pMed, $rem]
                                    ];
                                    if (count($candidates) >= 5) break 7;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

echo "Found " . count($candidates) . " clean candidate sets.\n";
foreach ($candidates as $idx => $c) {
    echo "--- Candidate $idx ---\n";
    $sumR = 0;
    foreach ($c as $desa => $vals) {
        $sumR += $vals[1];
        echo "  $desa: Target=" . number_format($targets[$desa]) . " Realisasi=" . number_format($vals[1]) . " Capaian={$vals[0]}%\n";
    }
    echo "  Total Realisasi: " . number_format($sumR) . " vs " . number_format($realisasiTotal) . "\n";
}
