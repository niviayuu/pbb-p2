<?php
$url = 'https://raw.githubusercontent.com/nugrahahari649-prog/Jawabarat_geojson/main/Kabupaten%20Karawang-KEL_DESA.geojson';
$data = file_get_contents($url);
if ($data) {
    $json = json_decode($data, true);
    echo "Total features in dataset: " . count($json['features']) . "\n";
    $tempuranDesa = [];
    foreach ($json['features'] as $f) {
        $p = $f['properties'];
        $kec = strtolower($p['kecamatan'] ?? '');
        if (strpos($kec, 'tempuran') !== false) {
            $tempuranDesa[] = $f;
        }
    }
    echo "Found " . count($tempuranDesa) . " desa in Tempuran:\n";
    foreach ($tempuranDesa as $d) {
        $p = $d['properties'];
        echo "- " . ($p['kel_desa'] ?? $p['nama']) . " (kode_kd=" . ($p['kode_kd'] ?? '') . ")\n";
    }
    if (count($tempuranDesa) > 0) {
        file_put_contents('tempuran_desa.geojson', json_encode([
            'type' => 'FeatureCollection',
            'features' => $tempuranDesa
        ], JSON_PRETTY_PRINT));
        echo "Saved tempuran_desa.geojson successfully!\n";
    }
} else {
    echo "Failed to fetch.\n";
}
