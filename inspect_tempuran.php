<?php
$geo = json_decode(file_get_contents('tempuran_desa.geojson'), true);

$minX = 999; $maxX = -999; $minY = 999; $maxY = -999;

foreach ($geo['features'] as $f) {
    $geom = $f['geometry'];
    $polys = ($geom['type'] == 'Polygon') ? [$geom['coordinates']] : $geom['coordinates'];
    foreach ($polys as $poly) {
        foreach ($poly as $ring) {
            foreach ($ring as $pt) {
                if ($pt[0] < $minX) $minX = $pt[0];
                if ($pt[0] > $maxX) $maxX = $pt[0];
                if ($pt[1] < $minY) $minY = $pt[1];
                if ($pt[1] > $maxY) $maxY = $pt[1];
            }
        }
    }
}

echo "Bounds of Tempuran:\n";
echo "X: [$minX, $maxX]\n";
echo "Y: [$minY, $maxY]\n";

foreach ($geo['features'] as $f) {
    $name = $f['properties']['kel_desa'];
    $geom = $f['geometry'];
    $polys = ($geom['type'] == 'Polygon') ? [$geom['coordinates']] : $geom['coordinates'];
    $pts = [];
    foreach ($polys as $poly) {
        foreach ($poly as $ring) {
            foreach ($ring as $pt) {
                $pts[] = $pt;
            }
        }
    }
    $cx = array_sum(array_column($pts, 0)) / count($pts);
    $cy = array_sum(array_column($pts, 1)) / count($pts);
    echo "- $name: cx=" . round($cx, 4) . ", cy=" . round($cy, 4) . "\n";
}
