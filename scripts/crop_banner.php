<?php
$src = 'C:/Users/Nivia Ayu Andini/.gemini/antigravity/brain/8fa87d16-1a05-475d-b94b-8a2e0e3ea68a/.user_uploaded/media_1794207947158_4ccfb940.jpg';
$im = imagecreatefromjpeg($src);

// Let's crop Card 1: X=44, Y=56, W=400, H=276
$card1 = imagecrop($im, ['x' => 44, 'y' => 56, 'width' => 400, 'height' => 276]);
imagepng($card1, 'assets/ref_card_login.png');

// In card 1, the banner on the left is roughly half the width: from x=44 to around x=240, y=56 to 332
// Let's find exactly where the banner is in card 1
$banner = imagecrop($im, ['x' => 50, 'y' => 60, 'width' => 210, 'height' => 266]);
imagepng($banner, 'assets/bupati_banner_raw.png');

// Let's crop just the bupati & wakil bupati portion with the background arches
// Let's also check if Card 2 banner is identical
$banner2 = imagecrop($im, ['x' => 450, 'y' => 60, 'width' => 215, 'height' => 266]);
imagepng($banner2, 'assets/bupati_banner2_raw.png');

echo "Saved reference crops.\n";

