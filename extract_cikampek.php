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
    $cikampekDesa = [];
    foreach ($json['features'] as $f) {
        $p = $f['properties'];
        $kec = strtolower($p['kecamatan'] ?? '');
        if (strpos($kec, 'cikampek') !== false) {
            $cikampekDesa[] = $f;
        }
    }
    echo "Found " . count($cikampekDesa) . " desa in Cikampek:\n";
    foreach ($cikampekDesa as $d) {
        $p = $d['properties'];
        echo "- " . ($p['kel_desa'] ?? $p['nama'] ?? 'unknown') . " (kecamatan=" . ($p['kecamatan'] ?? '') . ", kode_kd=" . ($p['kode_kd'] ?? '') . ")\n";
    }
    if (count($cikampekDesa) > 0) {
        file_put_contents('cikampek_desa.geojson', json_encode([
            'type' => 'FeatureCollection',
            'features' => $cikampekDesa
        ], JSON_PRETTY_PRINT));
        echo "Saved cikampek_desa.geojson successfully!\n";
    }
} else {
    echo "Failed to fetch.\n";
}
