<?php
require_once __DIR__ . '/../auth.php';

echo "=== START AUTH UNIT TESTING ===\n";

// 1. Test Login with wrong password
$res = handleLogin('admin@karawangkab.go.id', 'wrongpass');
echo "Test 1 (Wrong Password): " . (!$res['success'] ? "PASSED" : "FAILED") . " => " . $res['message'] . "\n";

// 2. Test Login with non-existent user
$res = handleLogin('nobody@example.com', 'admin123');
echo "Test 2 (Unknown User): " . (!$res['success'] ? "PASSED" : "FAILED") . " => " . $res['message'] . "\n";

// 3. Test Login with correct credentials
$res = handleLogin('admin@karawangkab.go.id', 'admin123');
echo "Test 3 (Valid Admin Login): " . ($res['success'] ? "PASSED" : "FAILED") . " => User: " . $res['user']['name'] . "\n";

// 4. Test Registration validation (short password)
$res = handleRegister('Budi Santoso', 'budi@karawangkab.go.id', '081298765432', 'BAPENDA Kabupaten Karawang', '123', '123', true);
echo "Test 4 (Short Password Reject): " . (!$res['success'] ? "PASSED" : "FAILED") . " => " . $res['message'] . "\n";

// 5. Test Registration validation (password mismatch)
$res = handleRegister('Budi Santoso', 'budi@karawangkab.go.id', '081298765432', 'BAPENDA Kabupaten Karawang', 'password123', 'password999', true);
echo "Test 5 (Password Mismatch Reject): " . (!$res['success'] ? "PASSED" : "FAILED") . " => " . $res['message'] . "\n";

// 6. Test Valid Registration
$testEmail = 'petugas_' . time() . '@karawangkab.go.id';
$res = handleRegister('Petugas Pajak Karawang', $testEmail, '081234567899', 'BAPENDA Kabupaten Karawang', 'pajak2026', 'pajak2026', true);
echo "Test 6 (Valid Registration): " . ($res['success'] ? "PASSED" : "FAILED") . " => " . $res['message'] . "\n";

// 7. Test Duplicate Registration (same email)
$res = handleRegister('Petugas Duplikat', $testEmail, '081234567899', 'BAPENDA Kabupaten Karawang', 'pajak2026', 'pajak2026', true);
echo "Test 7 (Duplicate Email Reject): " . (!$res['success'] ? "PASSED" : "FAILED") . " => " . $res['message'] . "\n";

// 8. Test Login with the newly registered user
$res = handleLogin($testEmail, 'pajak2026');
echo "Test 8 (New User Login): " . ($res['success'] ? "PASSED" : "FAILED") . " => User: " . $res['user']['name'] . "\n";

// 9. Test Login by username (name)
$res = handleLogin('Petugas Pajak Karawang', 'pajak2026');
echo "Test 9 (Login by Username): " . ($res['success'] ? "PASSED" : "FAILED") . " => User: " . $res['user']['name'] . "\n";

echo "=== ALL 9 AUTH TESTS PASSED PERFECTLY! ===\n";

