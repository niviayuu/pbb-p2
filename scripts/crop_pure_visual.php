<?php
$im = imagecreatefrompng('assets/auth_banner_clean.png');
$w = imagesx($im);
$h = imagesy($im);

// Let's inspect rows 0 to 120 (which corresponds to y=58 to y=98 in original image)
// Let's create two crops:
// 1. auth_banner_full.png: the entire banner card from reference image
// 2. auth_visual_bupati.png: JUST the building arches + Bupati + Wakil Bupati + Badges + curves, WITHOUT the top logo
// so that when HTML renders the crisp SVG/PNG logo at the top, it fits like a glove!

$src = 'C:/Users/Nivia Ayu Andini/.gemini/antigravity/brain/8fa87d16-1a05-475d-b94b-8a2e0e3ea68a/.user_uploaded/media_1794207947158_4ccfb940.jpg';
$raw = imagecreatefromjpeg($src);

// Bupati visual starts below the logo:
// Logo in original was around y=65 to 90.
// Arches start around y=100.
// Bupati and Wabup are y=110 to 280.
// Badges are y=260 to 290.
// Curves are y=285 to 330.
// Width: x=46 to 258 (w=212)
// Height: y=98 to 332 (h=234)

$cropBupati = imagecrop($raw, ['x' => 46, 'y' => 98, 'width' => 212, 'height' => 234]);
$scale = 3;
$hiBupati = imagecreatetruecolor(212 * $scale, 234 * $scale);
imagealphablending($hiBupati, false);
imagesavealpha($hiBupati, true);
imagecopyresampled($hiBupati, $cropBupati, 0, 0, 0, 0, 212 * $scale, 234 * $scale, 212, 234);

imagepng($hiBupati, 'assets/auth_visual_bupati.png', 9);
imagepng($hiBupati, 'pbb-p2/public/assets/auth_visual_bupati.png', 9);

echo "Created assets/auth_visual_bupati.png: " . (212 * $scale) . "x" . (234 * $scale) . "\n";

