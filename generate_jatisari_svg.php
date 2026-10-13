<?php
$geo = json_decode(file_get_contents('jatisari_desa.geojson'), true);

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

echo "Jatisari bounds:\n";
echo "X: [$minX, $maxX] (span: " . ($maxX - $minX) . ")\n";
echo "Y: [$minY, $maxY] (span: " . ($maxY - $minY) . ")\n";

$avgLat = ($minY + $maxY) / 2;
$cosLat = cos(deg2rad($avgLat));

// Target width = 600
$targetWidth = 600;
$padding = 25;
$usableWidth = $targetWidth - 2 * $padding; // 550

$scaleX = $usableWidth / ($maxX - $minX);
// To preserve geographical aspect ratio:
$scaleY = $scaleX / $cosLat;

$usableHeight = ($maxY - $minY) * $scaleY;
$targetHeight = round($usableHeight + 2 * $padding);

echo "ViewBox: 0 0 $targetWidth $targetHeight\n";
echo "ScaleX: $scaleX, ScaleY: $scaleY\n";

function project($lon, $lat, $minX, $maxY, $scaleX, $scaleY, $padding) {
    $x = round($padding + ($lon - $minX) * $scaleX, 1);
    $y = round($padding + ($maxY - $lat) * $scaleY, 1);
    return [$x, $y];
}

$results = [];

foreach ($geo['features'] as $f) {
    $props = $f['properties'];
    $rawName = $props['kel_desa'] ?? $props['nama'];
    $name = ucwords(strtolower(trim($rawName)));

    $geom = $f['geometry'];
    $polys = ($geom['type'] == 'Polygon') ? [$geom['coordinates']] : $geom['coordinates'];
    
    $dParts = [];
    $allPtsX = [];
    $allPtsY = [];

    foreach ($polys as $poly) {
        foreach ($poly as $ringIdx => $ring) {
            $cmd = 'M';
            $ringD = '';
            foreach ($ring as $pt) {
                list($px, $py) = project($pt[0], $pt[1], $minX, $maxY, $scaleX, $scaleY, $padding);
                $ringD .= $cmd . $px . ',' . $py . ' ';
                $cmd = 'L';
                if ($ringIdx === 0) {
                    $allPtsX[] = $px;
                    $allPtsY[] = $py;
                }
            }
            $ringD .= 'Z';
            $dParts[] = $ringD;
        }
    }

    $cx = round(array_sum($allPtsX) / count($allPtsX), 1);
    $cy = round(array_sum($allPtsY) / count($allPtsY), 1);

    $results[$name] = [
        'name' => $name,
        'path' => implode(' ', $dParts),
        'cx' => $cx,
        'cy' => $cy,
        'kode_kd' => $props['kode_kd'] ?? ''
    ];
}

echo "Total villages processed: " . count($results) . "\n";
foreach ($results as $k => $v) {
    echo "- $k (cx={$v['cx']}, cy={$v['cy']})\n";
}

file_put_contents('jatisari_paths.json', json_encode([
    'viewBoxWidth' => $targetWidth,
    'viewBoxHeight' => $targetHeight,
    'villages' => $results
], JSON_PRETTY_PRINT));
echo "Successfully generated jatisari_paths.json!\n";
