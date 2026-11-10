<?php
// Test auth logic
require_once __DIR__ . '/../auth.php';

$pdo = getDatabaseConnection();
echo "Connected to DB successfully.\n";

// Test login check
$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute(['admin@karawangkab.go.id']);
$user = $stmt->fetch(PDO::FETCH_ASSOC);
if ($user && password_verify('admin123', $user['password'])) {
    echo "Admin login verify test: PASSED\n";
} else {
    echo "Admin login verify test: FAILED\n";
}

if (!password_verify('wrongpass', $user['password'])) {
    echo "Wrong password rejection test: PASSED\n";
} else {
    echo "Wrong password rejection test: FAILED\n";
}

