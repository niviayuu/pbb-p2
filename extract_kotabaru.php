<?php
$url = 'https://raw.githubusercontent.com/nugrahahari649-prog/Jawabarat_geojson/main/Kabupaten%20Karawang-KEL_DESA.geojson';
$ctx = stream_context_create([
    'http' => ['timeout' => 30],
    'ssl' => ['verify_peer' => false, 'verify_peer_name' => false]
]);
$data = file_get_contents($url, false, $ctx);
if ($data) {
    $json = json_decode($data, true);
    echo "Total features in dataset: " . count($json['features']) . "\n";
    $kotabaruDesa = [];
    foreach ($json['features'] as $f) {
        $p = $f['properties'];
        $kec = strtolower($p['kecamatan'] ?? '');
        if (strpos($kec, 'kotabaru') !== false || strpos($kec, 'kota baru') !== false) {
            $kotabaruDesa[] = $f;
        }
    }
    echo "Found " . count($kotabaruDesa) . " desa in Kotabaru:\n";
    foreach ($kotabaruDesa as $d) {
        $p = $d['properties'];
        echo "- " . ($p['kel_desa'] ?? $p['nama']) . " (kecamatan=" . ($p['kecamatan'] ?? '') . ", kode_kd=" . ($p['kode_kd'] ?? '') . ")\n";
    }
    if (count($kotabaruDesa) > 0) {
        file_put_contents('kotabaru_desa.geojson', json_encode([
            'type' => 'FeatureCollection',
            'features' => $kotabaruDesa
        ], JSON_PRETTY_PRINT));
        echo "Saved kotabaru_desa.geojson successfully!\n";
    }
} else {
    echo "Failed to fetch.\n";
}
