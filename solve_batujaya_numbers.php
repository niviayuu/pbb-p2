<?php
// Village list
$targets = [850000000, 900000000, 1000000000, 750000000, 750000000, 700000000, 800000000, 700000000, 700000000, 750000000];
// Total target = 7,900,000,000
// We need total realisasi = 3,555,000,000

// Let's test combinations of clean percentages around 42% - 48%:
// e.g. 
// Segarjaya: target 850M, 44% = 374M
// Segaran: target 900M, 47% = 423M
// Batujaya: target 1000M, 46% = 460M
// Baturaden: target 750M, 44% = 330M
// Karyabakti: target 750M, 44% = 330M
// Telukambulu: target 700M, 43% = 301M
// Telukbango: target 800M, 47% = 376M
// Karyamulya: target 700M, 44% = 308M
// Karyamakmur: target 700M, 45% = 315M
// Kutaampel: target 750M, 45% = 337.5M -> wait, 337.5M has decimal, or let's use 44% or 46%: 750M * 0.44 = 330M, 750M * 0.46 = 345M

// Let's write an optimizer in PHP:
$vNames = [
    'Segarjaya',
    'Segaran',
    'Batujaya',
    'Baturaden',
    'Karyabakti',
    'Telukambulu',
    'Telukbango',
    'Karyamulya',
    'Karyamakmur',
    'Kutaampel'
];

$possiblePcts = [40, 42, 43, 44, 45, 46, 47, 48];

$best = null;
for ($iter = 0; $iter < 100000; $iter++) {
    $pcts = [];
    $sumR = 0;
    foreach ($targets as $i => $t) {
        $p = $possiblePcts[array_rand($possiblePcts)];
        $pcts[$i] = $p;
        $sumR += $t * ($p / 100);
    }
    if ($sumR == 3555000000) {
        $best = $pcts;
        break;
    }
}

if ($best) {
    echo "Found exact match!\n";
    $sumT = 0; $sumR = 0; $sumS = 0; $sumO = 0; $sumL = 0; $sumB = 0;
    foreach ($targets as $i => $t) {
        $p = $best[$i];
        $r = $t * ($p / 100);
        $s = $t - $r;
        $o = round($t / 500000);
        $l = round($o * ($p / 100));
        $b = $o - $l;
        $sumT += $t; $sumR += $r; $sumS += $s; $sumO += $o; $sumL += $l; $sumB += $b;
        echo sprintf("%2d. %-15s | Target: Rp%12s | Real: Rp%12s (%2d,0%%) | Sisa: Rp%12s | Obyek: %d (%d/%d)\n",
            $i + 1, $vNames[$i],
            number_format($t, 0, ',', '.'),
            number_format($r, 0, ',', '.'),
            $p,
            number_format($s, 0, ',', '.'),
            $o, $l, $b
        );
    }
    echo "Total Target: $sumT | Total Real: $sumR | Total Sisa: $sumS | Capaian: " . ($sumR / $sumT * 100) . "%\n";
    echo "Total Obyek: $sumO | Lunas: $sumL | Belum: $sumB\n";
} else {
    echo "Not found, trying broader range...\n";
}
