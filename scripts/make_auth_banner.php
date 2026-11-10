<?php
// Let's create a script to extract the exact banner from the reference image with clean edges.
$src = 'C:/Users/Nivia Ayu Andini/.gemini/antigravity/brain/8fa87d16-1a05-475d-b94b-8a2e0e3ea68a/.user_uploaded/media_1794207947158_4ccfb940.jpg';
$im = imagecreatefromjpeg($src);

// Let's look at the dimensions: Card 1 starts at x=44, y=56.
// Let's crop the exact banner region from Card 1:
// In Card 1, the banner column is on the left.
// Let's check width: the card width is ~410. The form starts around x = 250.
// So the banner is x = 44 to 255.
// Let's check top and bottom: y = 56 to 332.
$banner = imagecrop($im, ['x' => 44, 'y' => 56, 'width' => 212, 'height' => 276]);
// Let's save standard and a 2x/3x bicubic smoothed version for high DPI screens
imagepng($banner, 'assets/auth_banner.png');

// Also let's extract just the illustration (without the card border/margin if needed):
// In the banner:
// The logo is at the top left.
// The rounded panels with Bupati and Wakil Bupati are in the center.
// The name badges are at the bottom.
// The blue swooshes/waves are at the bottom.
$visualOnly = imagecrop($im, ['x' => 56, 'y' => 95, 'width' => 195, 'height' => 205]);
imagepng($visualOnly, 'assets/auth_visual_illustration.png');

echo "Saved auth_banner.png and auth_visual_illustration.png\n";

