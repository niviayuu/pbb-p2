<?php
$src = 'C:/Users/Nivia Ayu Andini/.gemini/antigravity/brain/8fa87d16-1a05-475d-b94b-8a2e0e3ea68a/.user_uploaded/media_1794207947158_4ccfb940.jpg';
$im = imagecreatefromjpeg($src);
$w = imagesx($im);
$h = imagesy($im);

$whitePixelsLeft = [];
$whitePixelsRight = [];
for ($y = 0; $y < $h; $y++) {
    for ($x = 0; $x < $w; $x++) {
        $rgb = imagecolorat($im, $x, $y);
        $r = ($rgb >> 16) & 0xFF;
        $g = ($rgb >> 8) & 0xFF;
        $b = $rgb & 0xFF;
        if ($r > 240 && $g > 240 && $b > 240) {
            if ($x < $w / 2) {
                $whitePixelsLeft[] = ['x' => $x, 'y' => $y];
            } else {
                $whitePixelsRight[] = ['x' => $x, 'y' => $y];
            }
        }
    }
}

$minX1 = min(array_column($whitePixelsLeft, 'x'));
$maxX1 = max(array_column($whitePixelsLeft, 'x'));
$minY1 = min(array_column($whitePixelsLeft, 'y'));
$maxY1 = max(array_column($whitePixelsLeft, 'y'));

$minX2 = min(array_column($whitePixelsRight, 'x'));
$maxX2 = max(array_column($whitePixelsRight, 'x'));
$minY2 = min(array_column($whitePixelsRight, 'y'));
$maxY2 = max(array_column($whitePixelsRight, 'y'));

echo "Card 1: X=[$minX1, $maxX1], Y=[$minY1, $maxY1], W=" . ($maxX1 - $minX1 + 1) . ", H=" . ($maxY1 - $minY1 + 1) . "\n";
echo "Card 2: X=[$minX2, $maxX2], Y=[$minY2, $maxY2], W=" . ($maxX2 - $minX2 + 1) . ", H=" . ($maxY2 - $minY2 + 1) . "\n";

