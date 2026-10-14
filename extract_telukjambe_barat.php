<?php
$url = 'https://raw.githubusercontent.com/nugrahahari649-prog/Jawabarat_geojson/main/Kabupaten%20Karawang-KEL_DESA.geojson';
$ctx = stream_context_create([
    'http' => ['timeout' => 20],
    'ssl' => ['verify_peer' => false, 'verify_peer_name' => false]
]);
$data = file_get_contents($url, false, $ctx);
if (!$data) {
    die("Failed to fetch\n");
}
$json = json_decode($data, true);
$features = [];
foreach ($json['features'] as $f) {
    $kec = strtolower($f['properties']['kecamatan'] ?? '');
    if (strpos($kec, 'telukjambe barat') !== false || strpos($kec, 'teluk jambe barat') !== false) {
        $features[] = $f;
    }
}

echo "Total Telukjambe Barat features found: " . count($features) . "\n";
foreach ($features as $f) {
    $props = $f['properties'];
    echo "- " . ($props['kel_desa'] ?? $props['nama']) . " (Kecamatan: " . ($props['kecamatan'] ?? '') . ", kode_kd: " . ($props['kode_kd'] ?? '') . ")\n";
}

file_put_contents('telukjambe_barat_desa.geojson', json_encode([
    'type' => 'FeatureCollection',
    'features' => $features
], JSON_PRETTY_PRINT));
echo "Saved telukjambe_barat_desa.geojson (" . filesize('telukjambe_barat_desa.geojson') . " bytes)\n";
