/**
 * JavaScript Interactions for Login and Daftar Akun
 * BAPENDA Kabupaten Karawang
 */

document.addEventListener('DOMContentLoaded', function () {
  // Password Visibility Toggle
  document.querySelectorAll('.btn-toggle-pwd').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var targetId = this.getAttribute('data-target');
      var input = document.getElementById(targetId);
      if (!input) return;

      var eyeOpen = this.querySelector('.eye-open');
      var eyeClosed = this.querySelector('.eye-closed');

      if (input.type === 'password') {
        input.type = 'text';
        if (eyeOpen) eyeOpen.style.display = 'none';
        if (eyeClosed) eyeClosed.style.display = 'block';
      } else {
        input.type = 'password';
        if (eyeOpen) eyeOpen.style.display = 'block';
        if (eyeClosed) eyeClosed.style.display = 'none';
      }
    });
  });

  // Google Login Notification
  var googleBtn = document.getElementById('btnGoogleAuth');
  if (googleBtn) {
    googleBtn.addEventListener('click', function (e) {
      e.preventDefault();
      alert('Fitur Single Sign-On (SSO) Google BAPENDA Karawang sedang dalam proses integrasi dengan akun kedinasan.');
    });
  }

  // Forgot Password Notification
  var forgotLink = document.getElementById('linkForgotPassword');
  if (forgotLink) {
    forgotLink.addEventListener('click', function (e) {
      e.preventDefault();
      alert('Untuk reset password akun kedinasan BAPENDA, silakan hubungi Tim IT Administrator di Bidang Pengelolaan Pendapatan Daerah Kabupaten Karawang.');
    });
  }

  // LOGIN FORM HANDLING
  var loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      clearErrors(loginForm);

      var emailInput = document.getElementById('loginEmail');
      var passwordInput = document.getElementById('loginPassword');
      var rememberInput = document.getElementById('loginRemember');
      var submitBtn = document.getElementById('btnLoginSubmit');
      var alertBox = document.getElementById('loginAlert');

      var emailVal = emailInput ? emailInput.value.trim() : '';
      var passVal = passwordInput ? passwordInput.value : '';
      var rememberVal = rememberInput && rememberInput.checked ? 1 : 0;

      // Validation
      var hasError = false;
      if (!emailVal) {
        showFieldError(emailInput, 'Email atau Username wajib diisi.');
        hasError = true;
      }
      if (!passVal) {
        showFieldError(passwordInput, 'Password wajib diisi.');
        hasError = true;
      }

      if (hasError) return;

      // Disable button & show spinner
      setButtonLoading(submitBtn, true, 'Memproses Login...');

      var formData = new FormData();
      formData.append('action', 'login');
      formData.append('email', emailVal);
      formData.append('password', passVal);
      formData.append('remember', rememberVal);

      fetch('auth.php', {
        method: 'POST',
        body: formData,
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.success) {
          showAlert(alertBox, 'success', data.message || 'Login berhasil! Mengalihkan ke dashboard...');
          setTimeout(function () {
            window.location.href = data.redirect || 'index.php';
          }, 800);
        } else {
          setButtonLoading(submitBtn, false, 'Masuk');
          showAlert(alertBox, 'danger', data.message || 'Email/Username atau Password tidak sesuai.');
        }
      })
      .catch(function (err) {
        setButtonLoading(submitBtn, false, 'Masuk');
        showAlert(alertBox, 'danger', 'Gagal menghubungi server. Pastikan koneksi server aktif.');
      });
    });
  }

  // REGISTER FORM HANDLING
  var registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      clearErrors(registerForm);

      var nameInput = document.getElementById('regName');
      var emailInput = document.getElementById('regEmail');
      var phoneInput = document.getElementById('regPhone');
      var instansiInput = document.getElementById('regInstansi');
      var passInput = document.getElementById('regPassword');
      var confirmInput = document.getElementById('regConfirmPassword');
      var termsInput = document.getElementById('regTerms');
      var submitBtn = document.getElementById('btnRegisterSubmit');
      var alertBox = document.getElementById('registerAlert');

      var nameVal = nameInput ? nameInput.value.trim() : '';
      var emailVal = emailInput ? emailInput.value.trim() : '';
      var phoneVal = phoneInput ? phoneInput.value.trim() : '';
      var instansiVal = instansiInput ? instansiInput.value.trim() : '';
      var passVal = passInput ? passInput.value : '';
      var confirmVal = confirmInput ? confirmInput.value : '';
      var termsVal = termsInput && termsInput.checked;

      var hasError = false;

      if (!nameVal || nameVal.length < 3) {
        showFieldError(nameInput, 'Nama lengkap wajib diisi (minimal 3 karakter).');
        hasError = true;
      }

      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailVal || !emailRegex.test(emailVal)) {
        showFieldError(emailInput, 'Format email tidak valid.');
        hasError = true;
      }

      if (!phoneVal || phoneVal.length < 8) {
        showFieldError(phoneInput, 'Nomor HP aktif wajib diisi (minimal 8 digit).');
        hasError = true;
      }

      if (!instansiVal) {
        showFieldError(instansiInput, 'Silakan pilih Instansi / Unit Kerja.');
        hasError = true;
      }

      if (!passVal || passVal.length < 8) {
        showFieldError(passInput, 'Password minimal harus 8 karakter.');
        hasError = true;
      }

      if (passVal !== confirmVal) {
        showFieldError(confirmInput, 'Konfirmasi password tidak cocok dengan password.');
        hasError = true;
      }

      if (!termsVal) {
        showAlert(alertBox, 'danger', 'Anda harus menyetujui Syarat dan Ketentuan serta Kebijakan Privasi.');
        hasError = true;
      }

      if (hasError) return;

      setButtonLoading(submitBtn, true, 'Mendaftarkan Akun...');

      var formData = new FormData();
      formData.append('action', 'register');
      formData.append('name', nameVal);
      formData.append('email', emailVal);
      formData.append('phone', phoneVal);
      formData.append('instansi', instansiVal);
      formData.append('password', passVal);
      formData.append('password_confirmation', confirmVal);
      formData.append('terms', '1');

      fetch('auth.php', {
        method: 'POST',
        body: formData,
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.success) {
          showAlert(alertBox, 'success', data.message || 'Pendaftaran berhasil! Mengalihkan ke halaman login...');
          registerForm.reset();
          setTimeout(function () {
            window.location.href = data.redirect || 'login.php?registered=1';
          }, 1500);
        } else {
          setButtonLoading(submitBtn, false, 'Daftar');
          showAlert(alertBox, 'danger', data.message || 'Terjadi kesalahan saat pendaftaran.');
        }
      })
      .catch(function (err) {
        setButtonLoading(submitBtn, false, 'Daftar');
        showAlert(alertBox, 'danger', 'Gagal menghubungi server. Silakan coba beberapa saat lagi.');
      });
    });
  }

  // Helpers
  function showFieldError(inputElem, msg) {
    if (!inputElem) return;
    var group = inputElem.closest('.form-group');
    if (!group) return;
    group.classList.add('has-error');
    var errorSpan = group.querySelector('.field-error-msg');
    if (errorSpan) {
      errorSpan.textContent = msg;
    }
  }

  function clearErrors(form) {
    if (!form) return;
    form.querySelectorAll('.form-group').forEach(function (group) {
      group.classList.remove('has-error');
      var errorSpan = group.querySelector('.field-error-msg');
      if (errorSpan) errorSpan.textContent = '';
    });
    var alert = form.querySelector('.auth-alert');
    if (alert) {
      alert.classList.remove('visible', 'danger', 'success');
      alert.style.display = 'none';
      alert.querySelector('.alert-text').textContent = '';
    }
  }

  function showAlert(alertElem, type, msg) {
    if (!alertElem) return;
    alertElem.classList.remove('danger', 'success');
    alertElem.classList.add(type, 'visible');
    alertElem.style.display = 'flex';
    var textElem = alertElem.querySelector('.alert-text');
    if (textElem) {
      textElem.textContent = msg;
    }
  }

  function setButtonLoading(btn, isLoading, text) {
    if (!btn) return;
    btn.disabled = isLoading;
    var textSpan = btn.querySelector('.btn-text');
    var spinner = btn.querySelector('.btn-spinner');
    if (textSpan) textSpan.textContent = text;
    if (spinner) spinner.style.display = isLoading ? 'inline-block' : 'none';
  }
});
