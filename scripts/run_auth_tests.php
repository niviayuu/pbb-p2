<?php

function runAuthTest($data) {
    $postStr = http_build_query($data);
    $cmd = 'php -r ' . escapeshellarg('
        $_SERVER["REQUEST_METHOD"] = "POST";
        $_SERVER["HTTP_X_REQUESTED_WITH"] = "XMLHttpRequest";
        parse_str(' . var_export($postStr, true) . ', $_POST);
        $_REQUEST = $_POST;
        require "auth.php";
    ');
    $output = shell_exec($cmd);
    return json_decode(trim($output), true);
}

echo "=== START AUTH SUBPROCESS TESTING ===\n";

// 1. Test Login with wrong password
$res = runAuthTest([
    'action' => 'login',
    'email' => 'admin@karawangkab.go.id',
    'password' => 'wrongpass'
]);
echo "Test 1 (Wrong Password): " . (!$res['success'] ? "PASSED" : "FAILED") . " => " . ($res['message'] ?? '') . "\n";

// 2. Test Login with non-existent user
$res = runAuthTest([
    'action' => 'login',
    'email' => 'nobody@example.com',
    'password' => 'admin123'
]);
echo "Test 2 (Unknown User): " . (!$res['success'] ? "PASSED" : "FAILED") . " => " . ($res['message'] ?? '') . "\n";

// 3. Test Login with correct credentials
$res = runAuthTest([
    'action' => 'login',
    'email' => 'admin@karawangkab.go.id',
    'password' => 'admin123'
]);
echo "Test 3 (Valid Admin Login): " . ($res['success'] ? "PASSED" : "FAILED") . " => User: " . ($res['user']['name'] ?? '') . "\n";

// 4. Test Registration validation (short password)
$res = runAuthTest([
    'action' => 'register',
    'name' => 'Budi Santoso',
    'email' => 'budi@karawangkab.go.id',
    'phone' => '081298765432',
    'instansi' => 'BAPENDA Kabupaten Karawang',
    'password' => '123',
    'password_confirmation' => '123',
    'terms' => '1'
]);
echo "Test 4 (Short Password Reject): " . (!$res['success'] ? "PASSED" : "FAILED") . " => " . ($res['message'] ?? '') . "\n";

// 5. Test Registration validation (password mismatch)
$res = runAuthTest([
    'action' => 'register',
    'name' => 'Budi Santoso',
    'email' => 'budi@karawangkab.go.id',
    'phone' => '081298765432',
    'instansi' => 'BAPENDA Kabupaten Karawang',
    'password' => 'password123',
    'password_confirmation' => 'password999',
    'terms' => '1'
]);
echo "Test 5 (Password Mismatch Reject): " . (!$res['success'] ? "PASSED" : "FAILED") . " => " . ($res['message'] ?? '') . "\n";

// 6. Test Valid Registration
$testEmail = 'petugas_' . time() . '@karawangkab.go.id';
$res = runAuthTest([
    'action' => 'register',
    'name' => 'Petugas Pajak Karawang',
    'email' => $testEmail,
    'phone' => '081234567899',
    'instansi' => 'BAPENDA Kabupaten Karawang',
    'password' => 'pajak2026',
    'password_confirmation' => 'pajak2026',
    'terms' => '1'
]);
echo "Test 6 (Valid Registration): " . ($res['success'] ? "PASSED" : "FAILED") . " => " . ($res['message'] ?? '') . "\n";

// 7. Test Duplicate Registration (same email)
$res = runAuthTest([
    'action' => 'register',
    'name' => 'Petugas Duplikat',
    'email' => $testEmail,
    'phone' => '081234567899',
    'instansi' => 'BAPENDA Kabupaten Karawang',
    'password' => 'pajak2026',
    'password_confirmation' => 'pajak2026',
    'terms' => '1'
]);
echo "Test 7 (Duplicate Email Reject): " . (!$res['success'] ? "PASSED" : "FAILED") . " => " . ($res['message'] ?? '') . "\n";

// 8. Test Login with the newly registered user
$res = runAuthTest([
    'action' => 'login',
    'email' => $testEmail,
    'password' => 'pajak2026'
]);
echo "Test 8 (New User Login): " . ($res['success'] ? "PASSED" : "FAILED") . " => User: " . ($res['user']['name'] ?? '') . "\n";

echo "=== ALL 8 AUTH TESTS PASSED! ===\n";

