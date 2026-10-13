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
    $purwasariDesa = [];
    foreach ($json['features'] as $f) {
        $p = $f['properties'];
        $kec = strtolower($p['kecamatan'] ?? '');
        if (strpos($kec, 'purwasari') !== false) {
            $purwasariDesa[] = $f;
        }
    }
    echo "Found " . count($purwasariDesa) . " desa in Purwasari:\n";
    foreach ($purwasariDesa as $d) {
        $p = $d['properties'];
        echo "- " . ($p['kel_desa'] ?? $p['nama'] ?? 'unknown') . " (kecamatan=" . ($p['kecamatan'] ?? '') . ", kode_kd=" . ($p['kode_kd'] ?? '') . ")\n";
    }
    if (count($purwasariDesa) > 0) {
        file_put_contents('purwasari_desa.geojson', json_encode([
            'type' => 'FeatureCollection',
            'features' => $purwasariDesa
        ], JSON_PRETTY_PRINT));
        echo "Saved purwasari_desa.geojson successfully!\n";
    }
} else {
    echo "Failed to fetch.\n";
}
