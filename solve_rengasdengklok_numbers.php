<?php
$targetTotal = 16200000000;
$realisasiTotal = 11826000000;

$targets = [
    'Rengasdengklok Selatan' => 2700000000,
    'Rengasdengklok Utara' => 2300000000,
    'Amansari' => 1900000000,
    'Kalangsurya' => 1800000000,
    'Kalangsari' => 1700000000,
    'Karyasari' => 1600000000,
    'Dukuhkarya' => 1500000000,
    'Kertasari' => 1400000000,
    'Dewisari' => 1300000000
];

echo "Target sum check: " . array_sum($targets) . " vs $targetTotal\n";

// Target realisasi total: 11.826.000.000
// Capaian rata-rata kecamatan = 73.0%
// Let's search for combinations where each village has capaian between 65% and 82%
// e.g.:
// Rengasdengklok Selatan: 78.0% - 82.0%
// Rengasdengklok Utara: 74.0% - 78.0%
// Amansari: 72.0% - 76.0%
// Kalangsurya: 70.0% - 75.0%
// Kalangsari: 70.0% - 74.0%
// Karyasari: 68.0% - 74.0%
// Dukuhkarya: 66.0% - 72.0%
// Kertasari: 66.0% - 72.0%
// Dewisari: 64.0% - 72.0%

$solutions = [];

foreach (range(78, 82) as $pRdS) { // Rengasdengklok Selatan
    $rRdS = round($targets['Rengasdengklok Selatan'] * $pRdS / 100);
    foreach (range(74, 78) as $pRdU) { // Rengasdengklok Utara
        $rRdU = round($targets['Rengasdengklok Utara'] * $pRdU / 100);
        foreach (range(72, 76) as $pAman) { // Amansari
            $rAman = round($targets['Amansari'] * $pAman / 100);
            foreach (range(70, 75) as $pKsur) { // Kalangsurya
                $rKsur = round($targets['Kalangsurya'] * $pKsur / 100);
                foreach (range(70, 74) as $pKsari) { // Kalangsari
                    $rKsari = round($targets['Kalangsari'] * $pKsari / 100);
                    foreach (range(68, 74) as $pKarya) { // Karyasari
                        $rKarya = round($targets['Karyasari'] * $pKarya / 100);
                        foreach (range(66, 72) as $pDukuh) { // Dukuhkarya
                            $rDukuh = round($targets['Dukuhkarya'] * $pDukuh / 100);
                            foreach (range(66, 72) as $pKerta) { // Kertasari
                                $rKerta = round($targets['Kertasari'] * $pKerta / 100);
                                
                                $cur = $rRdS + $rRdU + $rAman + $rKsur + $rKsari + $rKarya + $rDukuh + $rKerta;
                                $rem = $realisasiTotal - $cur;
                                
                                // Dewisari target = 1.300.000.000
                                $pDewi = ($rem / $targets['Dewisari']) * 100;
                                $pDewiRound = round($pDewi, 1);
                                if (abs($pDewi - $pDewiRound) < 0.0001 && $pDewiRound >= 64.0 && $pDewiRound <= 75.0) {
                                    $solutions[] = [
                                        'Rengasdengklok Selatan' => [$pRdS, $rRdS],
                                        'Rengasdengklok Utara' => [$pRdU, $rRdU],
                                        'Amansari' => [$pAman, $rAman],
                                        'Kalangsurya' => [$pKsur, $rKsur],
                                        'Kalangsari' => [$pKsari, $rKsari],
                                        'Karyasari' => [$pKarya, $rKarya],
                                        'Dukuhkarya' => [$pDukuh, $rDukuh],
                                        'Kertasari' => [$pKerta, $rKerta],
                                        'Dewisari' => [$pDewiRound, $rem]
                                    ];
                                    if (count($solutions) >= 5) break 8;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

echo "Found " . count($solutions) . " solutions.\n";
if (!empty($solutions)) {
    $sol = $solutions[0];
    $totR = 0;
    foreach ($sol as $name => $data) {
        $t = $targets[$name];
        $r = $data[1];
        $pct = $data[0];
        $totR += $r;
        printf("%-24s: Target=%14s | Real=%14s | Capaian=%5.1f%%\n",
            $name, number_format($t, 0, ',', '.'), number_format($r, 0, ',', '.'), $pct);
    }
    echo "Total Target   : " . number_format($targetTotal, 0, ',', '.') . "\n";
    echo "Total Realisasi: " . number_format($totR, 0, ',', '.') . "\n";
    echo "Diff Target    : " . ($targetTotal - array_sum($targets)) . "\n";
    echo "Diff Realisasi : " . ($realisasiTotal - $totR) . "\n";
    echo "Overall Capaian: " . round(($totR / $targetTotal) * 100, 1) . "%\n";
}
