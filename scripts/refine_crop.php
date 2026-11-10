<?php
$src = 'C:/Users/Nivia Ayu Andini/.gemini/antigravity/brain/8fa87d16-1a05-475d-b94b-8a2e0e3ea68a/.user_uploaded/media_1794207947158_4ccfb940.jpg';
$im = imagecreatefromjpeg($src);

// Let's analyze the left card:
// Left card starts at x=44, y=56.
// In the left card, the artwork banner is on the left:
// The logo is at the top left.
// The banner illustration has:
// arches at the top (starts around y = 100), bottom waves around y = 320.
// Let's crop the exact illustration without white card borders:
// X from 48 to 258 (width 210)
// Y from 60 to 330 (height 270)
$banner1 = imagecrop($im, ['x' => 46, 'y' => 58, 'width' => 212, 'height' => 272]);

// Scale up nicely 4x using bicubic
$scale = 3;
$hi = imagecreatetruecolor(212 * $scale, 272 * $scale);
imagealphablending($hi, false);
imagesavealpha($hi, true);
imagecopyresampled($hi, $banner1, 0, 0, 0, 0, 212 * $scale, 272 * $scale, 212, 272);
imagepng($hi, 'assets/auth_banner_clean.png', 9);
imagepng($hi, 'pbb-p2/public/assets/auth_banner_clean.png', 9);

// Also let's extract just the illustration part (from under the logo down to the bottom wave)
// so the logo can either be rendered in HTML (crisp SVG/vector logo + text) or via the image:
$illus = imagecrop($im, ['x' => 50, 'y' => 95, 'width' => 205, 'height' => 235]);
$hiIllus = imagecreatetruecolor(205 * $scale, 235 * $scale);
imagealphablending($hiIllus, false);
imagesavealpha($hiIllus, true);
imagecopyresampled($hiIllus, $illus, 0, 0, 0, 0, 205 * $scale, 235 * $scale, 205, 235);
imagepng($hiIllus, 'assets/auth_illustration.png', 9);
imagepng($hiIllus, 'pbb-p2/public/assets/auth_illustration.png', 9);

echo "Created auth_banner_clean.png and auth_illustration.png\n";

