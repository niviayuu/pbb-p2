<?php
/**
 * Authentication Handler for Peta Capaian PBB-P2 BAPENDA Kabupaten Karawang
 */

if (session_status() === PHP_SESSION_NONE) {
    $sessDir = __DIR__ . '/sessions';
    if (is_dir($sessDir)) {
        session_save_path($sessDir);
    }
    ini_set('session.cookie_httponly', 1);
    session_start();
}

function getDatabaseConnection() {
    static $pdo = null;
    if ($pdo === null) {
        $dbPath = __DIR__ . '/pbb-p2/database/database.sqlite';
        if (!file_exists($dbPath)) {
            $fallback = __DIR__ . '/database/database.sqlite';
            if (file_exists($fallback)) {
                $dbPath = $fallback;
            }
        }
        $pdo = new PDO('sqlite:' . $dbPath);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        // Ensure columns phone and instansi exist
        $cols = $pdo->query('PRAGMA table_info(users)')->fetchAll(PDO::FETCH_ASSOC);
        $colNames = array_column($cols, 'name');
        if (!in_array('phone', $colNames)) {
            $pdo->exec("ALTER TABLE users ADD COLUMN phone VARCHAR(50) DEFAULT NULL");
        }
        if (!in_array('instansi', $colNames)) {
            $pdo->exec("ALTER TABLE users ADD COLUMN instansi VARCHAR(150) DEFAULT NULL");
        }
    }
    return $pdo;
}

function getCurrentUser() {
    if (isset($_SESSION['user'])) {
        return $_SESSION['user'];
    }
    
    // Check remember token cookie
    if (isset($_COOKIE['pbb_remember_token'])) {
        try {
            $pdo = getDatabaseConnection();
            $stmt = $pdo->prepare("SELECT id, name, email, phone, instansi FROM users WHERE remember_token = ? LIMIT 1");
            $stmt->execute([$_COOKIE['pbb_remember_token']]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($user) {
                $_SESSION['user'] = $user;
                return $user;
            }
        } catch (Exception $e) {
            // Ignore cookie error
        }
    }
    
    return null;
}

function isLoggedIn() {
    return getCurrentUser() !== null;
}

/**
 * Handle Login Logic
 */
function handleLogin($loginInput, $password, $remember = false) {
    $loginInput = trim($loginInput ?? '');
    $password = $password ?? '';
    
    if (empty($loginInput) || empty($password)) {
        return [
            'success' => false,
            'message' => 'Email/Username dan Password wajib diisi.'
        ];
    }
    
    try {
        $pdo = getDatabaseConnection();
        // Support searching by email or name (username)
        $stmt = $pdo->prepare("SELECT * FROM users WHERE LOWER(email) = LOWER(?) OR LOWER(name) = LOWER(?) LIMIT 1");
        $stmt->execute([$loginInput, $loginInput]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$user || !password_verify($password, $user['password'])) {
            return [
                'success' => false,
                'message' => 'Email/Username atau Password yang Anda masukkan tidak sesuai.'
            ];
        }
        
        $userData = [
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'phone' => $user['phone'] ?? '',
            'instansi' => $user['instansi'] ?? ''
        ];
        
        $_SESSION['user'] = $userData;
        
        if ($remember) {
            $token = bin2hex(random_bytes(32));
            $update = $pdo->prepare("UPDATE users SET remember_token = ? WHERE id = ?");
            $update->execute([$token, $user['id']]);
            if (!headers_sent()) {
                setcookie('pbb_remember_token', $token, time() + (86400 * 30), '/', '', false, true);
            }
        }
        
        return [
            'success' => true,
            'message' => 'Login berhasil! Mengalihkan ke dashboard...',
            'redirect' => 'index.php',
            'user' => $userData
        ];
    } catch (Exception $e) {
        return [
            'success' => false,
            'message' => 'Terjadi kesalahan sistem: ' . $e->getMessage()
        ];
    }
}

/**
 * Handle Register Logic
 */
function handleRegister($name, $email, $phone, $instansi, $password, $password_confirm, $terms) {
    $name = trim($name ?? '');
    $email = trim($email ?? '');
    $phone = trim($phone ?? '');
    $instansi = trim($instansi ?? '');
    $password = $password ?? '';
    $password_confirm = $password_confirm ?? '';
    
    if (empty($name) || strlen($name) < 3) {
        return ['success' => false, 'message' => 'Nama lengkap wajib diisi (minimal 3 karakter).'];
    }
    
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return ['success' => false, 'message' => 'Format alamat email tidak valid.'];
    }
    
    if (empty($phone) || strlen($phone) < 8) {
        return ['success' => false, 'message' => 'Nomor HP aktif wajib diisi (minimal 8 digit).'];
    }
    
    if (empty($instansi)) {
        return ['success' => false, 'message' => 'Instansi / Unit Kerja wajib dipilih.'];
    }
    
    if (empty($password) || strlen($password) < 8) {
        return ['success' => false, 'message' => 'Password minimal harus 8 karakter.'];
    }
    
    if ($password !== $password_confirm) {
        return ['success' => false, 'message' => 'Konfirmasi password tidak cocok dengan password.'];
    }
    
    if (!$terms) {
        return ['success' => false, 'message' => 'Anda harus menyetujui Syarat & Ketentuan serta Kebijakan Privasi.'];
    }
    
    try {
        $pdo = getDatabaseConnection();
        
        // Check duplicate email
        $stmt = $pdo->prepare("SELECT id FROM users WHERE LOWER(email) = LOWER(?) LIMIT 1");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            return [
                'success' => false,
                'message' => 'Alamat email sudah terdaftar. Silakan gunakan email lain atau langsung login.'
            ];
        }
        
        $hash = password_hash($password, PASSWORD_BCRYPT);
        $insert = $pdo->prepare("
            INSERT INTO users (name, email, phone, instansi, password, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        ");
        $insert->execute([$name, $email, $phone, $instansi, $hash]);
        
        return [
            'success' => true,
            'message' => 'Pendaftaran akun berhasil! Silakan masuk dengan email dan password Anda.',
            'redirect' => 'login.php'
        ];
    } catch (Exception $e) {
        return [
            'success' => false,
            'message' => 'Terjadi kesalahan sistem saat mendaftar: ' . $e->getMessage()
        ];
    }
}

/**
 * Handle Logout Logic
 */
function handleLogout() {
    $_SESSION = [];
    if (ini_get("session.use_cookies") && !headers_sent()) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
    if (!headers_sent()) {
        setcookie('pbb_remember_token', '', time() - 3600, '/');
    }
    session_destroy();
}

// Direct Web Request Dispatcher
$action = $_REQUEST['action'] ?? '';

if ($action === 'login' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json; charset=utf-8');
    $input = $_POST['email'] ?? $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    $remember = !empty($_POST['remember']);
    $result = handleLogin($input, $password, $remember);
    echo json_encode($result);
    exit;
}

if ($action === 'register' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json; charset=utf-8');
    $name = $_POST['name'] ?? '';
    $email = $_POST['email'] ?? '';
    $phone = $_POST['phone'] ?? '';
    $instansi = $_POST['instansi'] ?? '';
    $password = $_POST['password'] ?? '';
    $confirm = $_POST['password_confirmation'] ?? $_POST['confirm_password'] ?? '';
    $terms = !empty($_POST['terms']);
    $result = handleRegister($name, $email, $phone, $instansi, $password, $confirm, $terms);
    echo json_encode($result);
    exit;
}

if ($action === 'logout') {
    handleLogout();
    if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['success' => true, 'redirect' => 'login.php']);
        exit;
    }
    header('Location: login.php');
    exit;
}

if ($action === 'check') {
    header('Content-Type: application/json; charset=utf-8');
    $user = getCurrentUser();
    echo json_encode([
        'authenticated' => $user !== null,
        'user' => $user
    ]);
    exit;
}
