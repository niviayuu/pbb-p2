<?php
require_once __DIR__ . '/auth.php';

// If already logged in, redirect to dashboard
if (isLoggedIn()) {
    header('Location: index.php');
    exit;
}

$justRegistered = !empty($_GET['registered']);
?>
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login - Peta Capaian PBB-P2 BAPENDA Kabupaten Karawang</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/auth.css?v=20261109_1">
</head>
<body class="auth-page">

  <div class="auth-container">
    <!-- KOLOM KIRI: VISUAL BANNER BUPATI & WAKIL BUPATI -->
    <div class="auth-banner-col">
      <div class="auth-banner-header">
        <img src="assets/logo_karawang.png" alt="Logo Kabupaten Karawang" class="auth-banner-logo">
        <div class="auth-brand-text">
          <span class="auth-brand-name">BAPENDA</span>
          <span class="auth-brand-sub">KABUPATEN KARAWANG</span>
        </div>
      </div>

      <div class="auth-visual-wrapper">
        <img src="assets/auth_bupati_hd.jpg?v=20261109_hd" alt="Bupati Karawang H. Aep Syaepuloh, SE dan Wakil Bupati H. Maslani" class="auth-banner-image">
      </div>

      <div class="auth-banner-footer">
        <span>Badan Pendapatan Daerah Kabupaten Karawang</span>
      </div>
    </div>

    <!-- KOLOM KANAN: FORM LOGIN -->
    <div class="auth-form-col">
      <div class="auth-top-nav right">
        <span class="auth-nav-text-gray">Belum punya akun?</span>
        <a href="register.php" class="auth-nav-link">Daftar akun &rarr;</a>
      </div>

      <h1 class="auth-title">Login</h1>
      <p class="auth-subtitle">Masuk untuk melanjutkan ke dashboard Peta Capaian PBB-P2</p>

      <div id="loginAlert" class="auth-alert <?php echo $justRegistered ? 'success visible' : ''; ?>" style="<?php echo $justRegistered ? 'display:flex;' : ''; ?>">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <span class="alert-text"><?php echo $justRegistered ? 'Pendaftaran berhasil! Silakan masukkan email dan password Anda.' : ''; ?></span>
      </div>

      <form id="loginForm" method="POST" action="auth.php" novalidate>
        <div class="form-group">
          <label class="form-label" for="loginEmail">Email / Username <span class="required">*</span></label>
          <div class="input-wrapper">
            <svg class="input-icon-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <input type="text" id="loginEmail" name="email" class="form-input" placeholder="Masukkan email dan username" autocomplete="username" required>
          </div>
          <span class="field-error-msg"></span>
        </div>

        <div class="form-group">
          <label class="form-label" for="loginPassword">Password <span class="required">*</span></label>
          <div class="input-wrapper">
            <svg class="input-icon-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <input type="password" id="loginPassword" name="password" class="form-input" placeholder="Masukkan password" autocomplete="current-password" required>
            <button type="button" class="btn-toggle-pwd" data-target="loginPassword" aria-label="Tampilkan atau sembunyikan password">
              <svg class="eye-open" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <svg class="eye-closed" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: none;">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            </button>
          </div>
          <span class="field-error-msg"></span>
        </div>

        <div class="form-options-row">
          <label class="checkbox-label" for="loginRemember">
            <input type="checkbox" id="loginRemember" name="remember" class="checkbox-input" value="1">
            <span>Ingat saya</span>
          </label>
          <a href="#" class="forgot-pwd-link" id="linkForgotPassword">Lupa password?</a>
        </div>

        <button type="submit" id="btnLoginSubmit" class="btn-auth-primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
            <polyline points="10 17 15 12 10 7"></polyline>
            <line x1="15" y1="12" x2="3" y2="12"></line>
          </svg>
          <span class="btn-text">Login</span>
          <svg class="btn-spinner spinner-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="display: none;">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
            <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
          </svg>
        </button>

        <div class="auth-divider">
          <span>atau</span>
        </div>

        <button type="button" class="btn-google-auth" id="btnGoogleAuth">
          <svg class="google-icon" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>Login dengan Google</span>
        </button>
      </form>
    </div>
  </div>

  <script src="js/auth.js?v=20261109_1"></script>
</body>
</html>
