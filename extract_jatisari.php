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
    $jatisariDesa = [];
    foreach ($json['features'] as $f) {
        $p = $f['properties'];
        $kec = strtolower($p['kecamatan'] ?? '');
        if (strpos($kec, 'jatisari') !== false) {
            $jatisariDesa[] = $f;
        }
    }
    echo "Found " . count($jatisariDesa) . " desa in Jatisari:\n";
    foreach ($jatisariDesa as $d) {
        $p = $d['properties'];
        echo "- " . ($p['kel_desa'] ?? $p['nama']) . " (kode_kd=" . ($p['kode_kd'] ?? '') . ")\n";
    }
    if (count($jatisariDesa) > 0) {
        file_put_contents('jatisari_desa.geojson', json_encode([
            'type' => 'FeatureCollection',
            'features' => $jatisariDesa
        ], JSON_PRETTY_PRINT));
        echo "Saved jatisari_desa.geojson successfully!\n";
    }
} else {
    echo "Failed to fetch.\n";
}
