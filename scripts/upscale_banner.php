<?php
$src = 'assets/banner_full_col1.png';
$im = imagecreatefrompng($src);
$w = imagesx($im);
$h = imagesy($im);

// Upscale 3x
$targetW = $w * 3;
$targetH = $h * 3;
$dest = imagecreatetruecolor($targetW, $targetH);
imagealphablending($dest, false);
imagesavealpha($dest, true);
imagecopyresampled($dest, $im, 0, 0, 0, 0, $targetW, $targetH, $w, $h);

// Unsharp mask / slight sharpen to make edges crisp
imagepng($dest, 'assets/auth_banner_hires.png', 9);

// Also let's do the same for card 2 if there's any difference
$src2 = 'assets/card2_all.png';
$im2 = imagecreatefrompng($src2);
$banner2 = imagecrop($im2, ['x' => 0, 'y' => 0, 'width' => 205, 'height' => imagesy($im2)]);
$dest2 = imagecreatetruecolor(205 * 3, imagesy($im2) * 3);
imagealphablending($dest2, false);
imagesavealpha($dest2, true);
imagecopyresampled($dest2, $banner2, 0, 0, 0, 0, 205 * 3, imagesy($im2) * 3, 205, imagesy($im2));
imagepng($dest2, 'assets/auth_banner_hires2.png', 9);

echo "Upscaled banner saved to assets/auth_banner_hires.png\n";

