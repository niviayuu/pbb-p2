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
$pangkalanFeatures = [];
foreach ($json['features'] as $f) {
    $kec = strtolower($f['properties']['kecamatan'] ?? '');
    if (strpos($kec, 'pangkalan') !== false) {
        $pangkalanFeatures[] = $f;
    }
}

echo "Total Pangkalan features: " . count($pangkalanFeatures) . "\n";
file_put_contents('pangkalan_desa.geojson', json_encode([
    'type' => 'FeatureCollection',
    'features' => $pangkalanFeatures
], JSON_PRETTY_PRINT));
echo "Saved pangkalan_desa.geojson (" . filesize('pangkalan_desa.geojson') . " bytes)\n";
