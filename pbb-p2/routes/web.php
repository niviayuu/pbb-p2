<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/kecamatan/{kecId?}', function ($kecId = 'tirtamulya') {
    return view('welcome', ['initialKecamatan' => $kecId]);
});

Route::get('/{kecId}', function ($kecId) {
    return view('welcome', ['initialKecamatan' => $kecId]);
})->where('kecId', 'tirtamulya|lemahabang|talagasari|majalaya|karawang-timur|telukjambe-timur|telukjambe-barat|pangkalan|klari|ciampel|tegalwaru|purwasari|cikampek|kotabaru|jatisari|banyusari|cilamaya-wetan|cilamaya-kulon|tempuran|cilebar');

