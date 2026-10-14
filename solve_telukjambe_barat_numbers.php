<?php
$targetTotal = 16500000000;
$realisasiTotal = 11880000000;

// 10 Villages in Telukjambe Barat (order matching Section 3):
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

$targets = [
    'Karangligar' => 1600000000,
    'Karangmulya' => 1400000000,
    'Margakaya'   => 2000000000,
    'Margamulya'  => 1800000000,
    'Mekarmulya'  => 1200000000,
    'Mulyajaya'   => 1000000000,
    'Parungsari'  => 1500000000,
    'Wanajaya'    => 1300000000,
    'Wanakerta'   => 2500000000,
    'Wanasari'    => 2200000000
];

echo "Target sum: " . array_sum($targets) . " (Expected: $targetTotal)\n";

// Target average capaian is 72.0%
// Let's find realistic rates:
// Wanakerta: 76% (kawasan industri)
// Wanasari: 75% (kawasan industri)
// Margakaya: 74%
// Margamulya: 72%
// Parungsari: 72%
// Karangligar: 70%
// Karangmulya: 70%
// Wanajaya: 68%
// Mekarmulya: 68%
// Mulyajaya: ?

$candidates = [];
for ($pWan = 74; $pWan <= 78; $pWan++) {
    for ($pWs = 72; $pWs <= 76; $pWs++) {
        for ($pMgk = 72; $pMgk <= 76; $pMgk++) {
            for ($pMgm = 70; $pMgm <= 75; $pMgm++) {
                for ($pPar = 70; $pPar <= 74; $pPar++) {
                    for ($pKrl = 68; $pKrl <= 72; $pKrl++) {
                        for ($pKrm = 68; $pKrm <= 72; $pKrm++) {
                            for ($pWnj = 66; $pWnj <= 72; $pWnj++) {
                                for ($pMek = 66; $pMek <= 70; $pMek++) {
                                    $rWan = round($targets['Wanakerta'] * $pWan / 100);
                                    $rWs = round($targets['Wanasari'] * $pWs / 100);
                                    $rMgk = round($targets['Margakaya'] * $pMgk / 100);
                                    $rMgm = round($targets['Margamulya'] * $pMgm / 100);
                                    $rPar = round($targets['Parungsari'] * $pPar / 100);
                                    $rKrl = round($targets['Karangligar'] * $pKrl / 100);
                                    $rKrm = round($targets['Karangmulya'] * $pKrm / 100);
                                    $rWnj = round($targets['Wanajaya'] * $pWnj / 100);
                                    $rMek = round($targets['Mekarmulya'] * $pMek / 100);

                                    $cur = $rWan + $rWs + $rMgk + $rMgm + $rPar + $rKrl + $rKrm + $rWnj + $rMek;
                                    $rem = $realisasiTotal - $cur;

                                    if ($rem > 0 && $rem % 1000000 === 0) {
                                        $pMul = $rem / $targets['Mulyajaya'] * 100;
                                        if ($pMul >= 65 && $pMul <= 72 && fmod($pMul * 10, 10) == 0) {
                                            $candidates[] = [
                                                'Karangligar' => [$pKrl, $rKrl],
                                                'Karangmulya' => [$pKrm, $rKrm],
                                                'Margakaya'   => [$pMgk, $rMgk],
                                                'Margamulya'  => [$pMgm, $rMgm],
                                                'Mekarmulya'  => [$pMek, $rMek],
                                                'Mulyajaya'   => [$pMul, $rem],
                                                'Parungsari'  => [$pPar, $rPar],
                                                'Wanajaya'    => [$pWnj, $rWnj],
                                                'Wanakerta'   => [$pWan, $rWan],
                                                'Wanasari'    => [$pWs, $rWs]
                                            ];
                                            if (count($candidates) >= 5) break 9;
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
}

echo "Found " . count($candidates) . " candidate sets.\n";
foreach ($candidates as $idx => $c) {
    echo "--- Candidate $idx ---\n";
    $sumR = 0;
    foreach ($c as $desa => $vals) {
        $sumR += $vals[1];
        echo "  $desa: Target=" . number_format($targets[$desa]) . " Realisasi=" . number_format($vals[1]) . " Capaian={$vals[0]}%\n";
    }
    echo "  Total Realisasi: " . number_format($sumR) . " vs " . number_format($realisasiTotal) . "\n";
}
