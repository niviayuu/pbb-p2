<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

// Authentication Routes
Route::get('/login', function () {
    if (Auth::check()) {
        return redirect('/');
    }
    return view('login');
})->name('login');

Route::post('/login', function (Request $request) {
    $loginInput = trim($request->input('email') ?? $request->input('username') ?? '');
    $password = $request->input('password', '');
    $remember = $request->boolean('remember');

    if (empty($loginInput) || empty($password)) {
        if ($request->ajax() || $request->wantsJson()) {
            return response()->json(['success' => false, 'message' => 'Email/Username dan password wajib diisi.']);
        }
        return back()->with('error', 'Email/Username dan password wajib diisi.');
    }

    // Try finding by email or name (username)
    $user = User::whereRaw('LOWER(email) = ?', [strtolower($loginInput)])
        ->orWhereRaw('LOWER(name) = ?', [strtolower($loginInput)])
        ->first();

    if ($user && Hash::check($password, $user->password)) {
        Auth::login($user, $remember);
        $request->session()->regenerate();

        if ($request->ajax() || $request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Login berhasil! Mengalihkan ke dashboard...',
                'redirect' => url('/')
            ]);
        }
        return redirect()->intended('/');
    }

    if ($request->ajax() || $request->wantsJson()) {
        return response()->json(['success' => false, 'message' => 'Email/Username atau password salah.']);
    }
    return back()->with('error', 'Email/Username atau password salah.');
});

Route::get('/register', function () {
    if (Auth::check()) {
        return redirect('/');
    }
    return view('register');
})->name('register');

Route::post('/register', function (Request $request) {
    $name = trim($request->input('name', ''));
    $email = trim($request->input('email', ''));
    $phone = trim($request->input('phone', ''));
    $instansi = trim($request->input('instansi', ''));
    $password = $request->input('password', '');
    $confirm = $request->input('password_confirmation', '');
    $terms = $request->boolean('terms');

    if (strlen($name) < 3) {
        $msg = 'Nama lengkap wajib diisi minimal 3 karakter.';
        return ($request->ajax() || $request->wantsJson()) ? response()->json(['success' => false, 'message' => $msg]) : back()->withInput()->with('error', $msg);
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $msg = 'Format alamat email tidak valid.';
        return ($request->ajax() || $request->wantsJson()) ? response()->json(['success' => false, 'message' => $msg]) : back()->withInput()->with('error', $msg);
    }

    if (empty($phone) || strlen($phone) < 8) {
        $msg = 'Nomor HP aktif wajib diisi minimal 8 digit.';
        return ($request->ajax() || $request->wantsJson()) ? response()->json(['success' => false, 'message' => $msg]) : back()->withInput()->with('error', $msg);
    }

    if (empty($instansi)) {
        $msg = 'Instansi / unit kerja wajib dipilih.';
        return ($request->ajax() || $request->wantsJson()) ? response()->json(['success' => false, 'message' => $msg]) : back()->withInput()->with('error', $msg);
    }

    if (strlen($password) < 8) {
        $msg = 'Password minimal 8 karakter.';
        return ($request->ajax() || $request->wantsJson()) ? response()->json(['success' => false, 'message' => $msg]) : back()->withInput()->with('error', $msg);
    }

    if ($password !== $confirm) {
        $msg = 'Konfirmasi password tidak cocok.';
        return ($request->ajax() || $request->wantsJson()) ? response()->json(['success' => false, 'message' => $msg]) : back()->withInput()->with('error', $msg);
    }

    if (!$terms) {
        $msg = 'Anda harus menyetujui Syarat dan Ketentuan serta Kebijakan Privasi.';
        return ($request->ajax() || $request->wantsJson()) ? response()->json(['success' => false, 'message' => $msg]) : back()->withInput()->with('error', $msg);
    }

    // Check duplicate
    if (User::whereRaw('LOWER(email) = ?', [strtolower($email)])->exists()) {
        $msg = 'Email sudah terdaftar. Silakan gunakan email lain atau login.';
        return ($request->ajax() || $request->wantsJson()) ? response()->json(['success' => false, 'message' => $msg]) : back()->withInput()->with('error', $msg);
    }

    $newUser = User::create([
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'instansi' => $instansi,
        'password' => $password, // auto hashed by User model casts
    ]);

    if ($request->ajax() || $request->wantsJson()) {
        return response()->json([
            'success' => true,
            'message' => 'Pendaftaran akun berhasil! Silakan masuk dengan akun Anda.',
            'redirect' => url('/login?registered=1')
        ]);
    }

    return redirect('/login')->with('success', 'Pendaftaran akun berhasil! Silakan masuk.');
});

Route::match(['get', 'post'], '/logout', function (Request $request) {
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();

    if ($request->ajax() || $request->wantsJson()) {
        return response()->json(['success' => true, 'redirect' => url('/login')]);
    }
    return redirect('/login');
})->name('logout');

// Dashboard Routes (Requires Auth)
Route::group(['middleware' => ['web']], function () {
    Route::get('/', function () {
        if (!Auth::check()) {
            return redirect('/login');
        }
        return view('welcome');
    });

    Route::get('/kecamatan', function () {
        if (!Auth::check()) {
            return redirect('/login');
        }
        return view('welcome');
    });

    Route::get('/kecamatan/{kecId}', function ($kecId) {
        if (!Auth::check()) {
            return redirect('/login');
        }
        return view('welcome', ['initialKecamatan' => $kecId]);
    })->where('kecId', 'karawang-barat|kutawaluya|rawamerta|tirtamulya|lemahabang|talagasari|majalaya|karawang-timur|telukjambe-timur|telukjambe-barat|pangkalan|klari|ciampel|tegalwaru|purwasari|cikampek|kotabaru|jatisari|banyusari|cilamaya-wetan|cilamaya-kulon|tempuran|cilebar|rengasdengklok|pedes|jayakerta|cibuaya|tirtajaya|batujaya');

    Route::get('/penggunaan-pajak', function () {
        if (!Auth::check()) {
            return redirect('/login');
        }
        return view('welcome', ['initialView' => 'penggunaan']);
    });

    Route::get('/pengguna-pajak', function () {
        if (!Auth::check()) {
            return redirect('/login');
        }
        return view('welcome', ['initialView' => 'penggunaan']);
    });

    Route::get('/penggunaan', function () {
        if (!Auth::check()) {
            return redirect('/login');
        }
        return view('welcome', ['initialView' => 'penggunaan']);
    });

    Route::get('/pengguna', function () {
        if (!Auth::check()) {
            return redirect('/login');
        }
        return view('welcome', ['initialView' => 'penggunaan']);
    });

    Route::get('/informasi', function () {
        if (!Auth::check()) {
            return redirect('/login');
        }
        return view('welcome', ['initialView' => 'informasi']);
    });

    Route::get('/info', function () {
        if (!Auth::check()) {
            return redirect('/login');
        }
        return view('welcome', ['initialView' => 'informasi']);
    });

    Route::get('/{kecId}', function ($kecId) {
        if (!Auth::check()) {
            return redirect('/login');
        }
        return view('welcome', ['initialKecamatan' => $kecId]);
    })->where('kecId', 'karawang-barat|kutawaluya|rawamerta|tirtamulya|lemahabang|talagasari|majalaya|karawang-timur|telukjambe-timur|telukjambe-barat|pangkalan|klari|ciampel|tegalwaru|purwasari|cikampek|kotabaru|jatisari|banyusari|cilamaya-wetan|cilamaya-kulon|tempuran|cilebar|rengasdengklok|pedes|jayakerta|cibuaya|tirtajaya|batujaya');
});
