<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Daftar Akun - Peta Capaian PBB-P2 BAPENDA Kabupaten Karawang</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="{{ asset('css/auth.css') }}?v=20261109_1">
</head>
<body class="auth-page">

  <div class="auth-container">
    <!-- KOLOM KIRI: VISUAL BANNER BUPATI & WAKIL BUPATI -->
    <div class="auth-banner-col">
      <div class="auth-banner-header">
        <img src="{{ asset('assets/logo_karawang.png') }}" alt="Logo Kabupaten Karawang" class="auth-banner-logo">
        <div class="auth-brand-text">
          <span class="auth-brand-name">BAPENDA</span>
          <span class="auth-brand-sub">KABUPATEN KARAWANG</span>
        </div>
      </div>

      <div class="auth-visual-wrapper">
        <img src="{{ asset('assets/auth_bupati_hd.jpg') }}?v=20261109_hd" alt="Bupati Karawang H. Aep Syaepuloh, SE dan Wakil Bupati H. Maslani" class="auth-banner-image">
      </div>

      <div class="auth-banner-footer">
        <span>Badan Pendapatan Daerah Kabupaten Karawang</span>
      </div>
    </div>

    <!-- KOLOM KANAN: FORM DAFTAR AKUN -->
    <div class="auth-form-col">
      <div class="auth-top-nav left">
        <a href="{{ url('/login') }}" class="auth-nav-link back">&larr; Kembali ke Login</a>
      </div>

      <h1 class="auth-title">Daftar Akun</h1>
      <p class="auth-subtitle">Lengkapi data diri Anda untuk membuat akun.</p>

      @if(session('error'))
      <div class="auth-alert danger visible" style="display: flex;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span class="alert-text">{{ session('error') }}</span>
      </div>
      @endif

      <div id="registerAlert" class="auth-alert">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span class="alert-text"></span>
      </div>

      <form id="registerForm" method="POST" action="{{ url('/register') }}" novalidate>
        @csrf
        <div class="form-group compact">
          <label class="form-label" for="regName">Nama Lengkap <span class="required">*</span></label>
          <div class="input-wrapper">
            <svg class="input-icon-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <input type="text" id="regName" name="name" class="form-input" placeholder="Masukkan nama lengkap" value="{{ old('name') }}" required>
          </div>
          <span class="field-error-msg"></span>
        </div>

        <div class="form-group compact">
          <label class="form-label" for="regEmail">Email <span class="required">*</span></label>
          <div class="input-wrapper">
            <svg class="input-icon-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <input type="email" id="regEmail" name="email" class="form-input" placeholder="Masukkan email aktif" value="{{ old('email') }}" required>
          </div>
          <span class="field-error-msg"></span>
        </div>

        <div class="form-group compact">
          <label class="form-label" for="regPhone">Nomor HP <span class="required">*</span></label>
          <div class="input-wrapper">
            <svg class="input-icon-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            <input type="tel" id="regPhone" name="phone" class="form-input" placeholder="Masukkan nomor HP aktif" value="{{ old('phone') }}" required>
          </div>
          <span class="field-error-msg"></span>
        </div>

        <div class="form-group compact">
          <label class="form-label" for="regInstansi">Instansi / Unit Kerja <span class="required">*</span></label>
          <div class="input-wrapper">
            <svg class="input-icon-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
            <select id="regInstansi" name="instansi" class="form-select" required>
              <option value="" disabled selected>Pilih instansi / unit kerja</option>
              <option value="BAPENDA Kabupaten Karawang">BAPENDA Kabupaten Karawang</option>
              <option value="Kecamatan / Desa se-Kabupaten Karawang">Kecamatan / Desa se-Kabupaten Karawang</option>
              <option value="BKPSDM Kabupaten Karawang">BKPSDM Kabupaten Karawang</option>
              <option value="BPKAD Kabupaten Karawang">BPKAD Kabupaten Karawang</option>
              <option value="Dinas Komunikasi dan Informatika">Dinas Komunikasi dan Informatika</option>
              <option value="Inspektorat Daerah">Inspektorat Daerah</option>
              <option value="Sekretariat Daerah Kabupaten Karawang">Sekretariat Daerah Kabupaten Karawang</option>
              <option value="Instansi / Kantor Lainnya">Instansi / Kantor Lainnya</option>
            </select>
          </div>
          <span class="field-error-msg"></span>
        </div>

        <div class="form-group compact">
          <label class="form-label" for="regPassword">Password <span class="required">*</span></label>
          <div class="input-wrapper">
            <svg class="input-icon-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <input type="password" id="regPassword" name="password" class="form-input" placeholder="Minimal 8 karakter" required>
            <button type="button" class="btn-toggle-pwd" data-target="regPassword" aria-label="Tampilkan atau sembunyikan password">
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

        <div class="form-group compact">
          <label class="form-label" for="regConfirmPassword">Konfirmasi Password <span class="required">*</span></label>
          <div class="input-wrapper">
            <svg class="input-icon-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <input type="password" id="regConfirmPassword" name="password_confirmation" class="form-input" placeholder="Minimal 8 karakter" required>
            <button type="button" class="btn-toggle-pwd" data-target="regConfirmPassword" aria-label="Tampilkan atau sembunyikan konfirmasi password">
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

        <div class="terms-agreement-row">
          <label class="checkbox-label" for="regTerms">
            <input type="checkbox" id="regTerms" name="terms" class="checkbox-input" value="1" required>
            <span>Saya menyetujui <a href="#" onclick="alert('Syarat & Ketentuan Penggunaan Sistem Peta Capaian PBB-P2 BAPENDA Karawang untuk aparatur dan dinas terkait.'); return false;">Syarat dan Ketentuan</a> serta <a href="#" onclick="alert('Kebijakan Privasi data pengguna sistem BAPENDA Kabupaten Karawang.'); return false;">Kebijakan Privasi</a> yang berlaku.</span>
          </label>
        </div>

        <button type="submit" id="btnRegisterSubmit" class="btn-auth-primary">
          <span class="btn-text">Daftar</span>
          <svg class="btn-spinner spinner-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="display: none;">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
            <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
          </svg>
        </button>
      </form>
    </div>
  </div>

  <script src="{{ asset('js/auth.js') }}?v=20261109_1"></script>
</body>
</html>
