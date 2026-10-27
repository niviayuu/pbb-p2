<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/kecamatan', function () {
    return view('welcome');
});

Route::get('/kecamatan/{kecId}', function ($kecId) {
    return view('welcome', ['initialKecamatan' => $kecId]);
})->where('kecId', 'karawang-barat|kutawaluya|rawamerta|tirtamulya|lemahabang|talagasari|majalaya|karawang-timur|telukjambe-timur|telukjambe-barat|pangkalan|klari|ciampel|tegalwaru|purwasari|cikampek|kotabaru|jatisari|banyusari|cilamaya-wetan|cilamaya-kulon|tempuran|cilebar|rengasdengklok|pedes|jayakerta|cibuaya|tirtajaya|batujaya');

Route::get('/penggunaan-pajak', function () {
    return view('welcome', ['initialView' => 'penggunaan']);
});

Route::get('/pengguna-pajak', function () {
    return view('welcome', ['initialView' => 'penggunaan']);
});

Route::get('/penggunaan', function () {
    return view('welcome', ['initialView' => 'penggunaan']);
});

Route::get('/pengguna', function () {
    return view('welcome', ['initialView' => 'penggunaan']);
});

Route::get('/informasi', function () {
    return view('welcome', ['initialView' => 'informasi']);
});

Route::get('/info', function () {
    return view('welcome', ['initialView' => 'informasi']);
});

Route::get('/{kecId}', function ($kecId) {
    return view('welcome', ['initialKecamatan' => $kecId]);
})->where('kecId', 'karawang-barat|kutawaluya|rawamerta|tirtamulya|lemahabang|talagasari|majalaya|karawang-timur|telukjambe-timur|telukjambe-barat|pangkalan|klari|ciampel|tegalwaru|purwasari|cikampek|kotabaru|jatisari|banyusari|cilamaya-wetan|cilamaya-kulon|tempuran|cilebar|rengasdengklok|pedes|jayakerta|cibuaya|tirtajaya|batujaya');


