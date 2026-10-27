<?php
$url = 'https://raw.githubusercontent.com/nugrahahari649-prog/Jawabarat_geojson/main/Kabupaten%20Karawang-KEL_DESA.geojson';
$ctx = stream_context_create([
    'http' => ['timeout' => 30],
    'ssl' => ['verify_peer' => false, 'verify_peer_name' => false]
]);
$data = file_get_contents($url, false, $ctx);
if ($data) {
    $json = json_decode($data, true);
    echo "Total features in master dataset: " . count($json['features']) . "\n";
    $rengasDesa = [];
    $allDesaInKarawang = [];
    foreach ($json['features'] as $f) {
        $p = $f['properties'];
        $kec = strtolower($p['kecamatan'] ?? '');
        $desa = $p['kel_desa'] ?? $p['nama'] ?? '';
        if (strpos($kec, 'dengklok') !== false || strpos($kec, 'rengas') !== false) {
            $rengasDesa[] = $f;
        }
        // Also check if any desa name matches the list given by user
        $dLower = strtolower($desa);
        if (in_array($dLower, ['karangsari', 'kalangsari', 'karangsuria', 'karyasari', 'dukuhkarya', 'amansari', 'rengasdengklok selatan', 'rengasdengklok utara', 'kertasari', 'dewisari'])) {
            $allDesaInKarawang[] = [
                'desa' => $desa,
                'kecamatan' => $p['kecamatan'] ?? '',
                'kode_kd' => $p['kode_kd'] ?? '',
                'kode_kec' => $p['kode_kec'] ?? '',
                'properties' => $p
            ];
        }
    }
    echo "Found " . count($rengasDesa) . " desa in Rengasdengklok feature collection:\n";
    foreach ($rengasDesa as $d) {
        $p = $d['properties'];
        echo "- " . ($p['kel_desa'] ?? $p['nama'] ?? 'unknown') . 
             " | kecamatan=" . ($p['kecamatan'] ?? '') . 
             " | kode_kd=" . ($p['kode_kd'] ?? '') . 
             " | kode_kec=" . ($p['kode_kec'] ?? '') . "\n";
    }

    echo "\nAll matching desa across Karawang dataset:\n";
    foreach ($allDesaInKarawang as $m) {
        echo "- {$m['desa']} (Kecamatan: {$m['kecamatan']}, Kode KD: {$m['kode_kd']}, Kode Kec: {$m['kode_kec']})\n";
    }

    if (count($rengasDesa) > 0) {
        file_put_contents('rengasdengklok_desa.geojson', json_encode([
            'type' => 'FeatureCollection',
            'features' => $rengasDesa
        ], JSON_PRETTY_PRINT));
        echo "\nSaved rengasdengklok_desa.geojson (" . filesize('rengasdengklok_desa.geojson') . " bytes)\n";
    }
} else {
    echo "Failed to fetch master geojson from GitHub.\n";
}
