<?php
$src = 'C:/Users/Nivia Ayu Andini/.gemini/antigravity/brain/8fa87d16-1a05-475d-b94b-8a2e0e3ea68a/.user_uploaded/media_1794209899561_db2db634.jpg';

// Save original HD jpeg
copy($src, 'assets/auth_bupati_hd.jpg');
copy($src, 'pbb-p2/public/assets/auth_bupati_hd.jpg');

// Also save as high quality PNG for assets/auth_visual_bupati.png so existing references automatically get the HD image!
$im = imagecreatefromjpeg($src);
imagepng($im, 'assets/auth_visual_bupati.png', 9);
imagepng($im, 'pbb-p2/public/assets/auth_visual_bupati.png', 9);

echo "HD Image successfully deployed to assets/auth_bupati_hd.jpg and assets/auth_visual_bupati.png!\n";

