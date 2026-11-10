<?php
$im = imagecreatefrompng('assets/auth_banner_clean.png');
$w = imagesx($im);
$h = imagesy($im);

// Check corners and edges:
// Top-left pixel:
$tl = imagecolorat($im, 0, 0);
$tr = imagecolorat($im, $w - 1, 0);
$bl = imagecolorat($im, 0, $h - 1);
$br = imagecolorat($im, $w - 1, $h - 1);

function rgbStr($val) {
    return sprintf("R:%d G:%d B:%d", ($val >> 16) & 0xFF, ($val >> 8) & 0xFF, $val & 0xFF);
}

echo "TL: " . rgbStr($tl) . "\n";
echo "TR: " . rgbStr($tr) . "\n";
echo "BL: " . rgbStr($bl) . "\n";
echo "BR: " . rgbStr($br) . "\n";

