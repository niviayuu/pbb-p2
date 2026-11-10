<?php
$src = 'C:/Users/Nivia Ayu Andini/.gemini/antigravity/brain/8fa87d16-1a05-475d-b94b-8a2e0e3ea68a/.user_uploaded/media_1794207947158_4ccfb940.jpg';
$im = imagecreatefromjpeg($src);

// Let's inspect coordinates for the banner in Card 1:
// Card 1 starts at x=44, y=56.
// Inside Card 1:
// The logo is around x=54..115, y=70..95
// The visual illustration of Bupati & Wakil Bupati:
// Starts around x=48..255, y=100..315
// Let's crop various areas to see exactly what they look like
$crops = [
    'banner_full_col1' => ['x' => 44, 'y' => 56, 'w' => 212, 'h' => 276],
    'bupati_visual_only' => ['x' => 58, 'y' => 102, 'w' => 190, 'h' => 185],
    'logo_top' => ['x' => 54, 'y' => 68, 'w' => 70, 'h' => 30],
    'card1_all' => ['x' => 44, 'y' => 56, 'w' => 410, 'h' => 276],
    'card2_all' => ['x' => 454, 'y' => 56, 'w' => 390, 'h' => 276],
];

foreach ($crops as $name => $c) {
    $sub = imagecrop($im, ['x' => $c['x'], 'y' => $c['y'], 'width' => $c['w'], 'height' => $c['h']]);
    imagepng($sub, "assets/{$name}.png");
}

echo "Saved crops successfully.\n";

