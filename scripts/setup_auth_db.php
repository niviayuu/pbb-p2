<?php
$dbPath = __DIR__ . '/../pbb-p2/database/database.sqlite';
$pdo = new PDO('sqlite:' . $dbPath);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Check columns in users
$cols = $pdo->query('PRAGMA table_info(users)')->fetchAll(PDO::FETCH_ASSOC);
$colNames = array_column($cols, 'name');

if (!in_array('phone', $colNames)) {
    $pdo->exec("ALTER TABLE users ADD COLUMN phone VARCHAR(50) DEFAULT NULL");
    echo "Added column phone.\n";
}
if (!in_array('instansi', $colNames)) {
    $pdo->exec("ALTER TABLE users ADD COLUMN instansi VARCHAR(150) DEFAULT NULL");
    echo "Added column instansi.\n";
}

// Check if admin user exists
$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute(['admin@karawangkab.go.id']);
$admin = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$admin) {
    // Password hash for admin123
    $hash = password_hash('admin123', PASSWORD_BCRYPT);
    $insert = $pdo->prepare("INSERT INTO users (name, email, password, phone, instansi, created_at, updated_at) VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))");
    $insert->execute([
        'Administrator BAPENDA',
        'admin@karawangkab.go.id',
        $hash,
        '081234567890',
        'BAPENDA Kabupaten Karawang'
    ]);
    echo "Inserted default admin user (admin@karawangkab.go.id / admin123).\n";
} else {
    echo "Admin user already exists.\n";
}

// Print all users
$all = $pdo->query("SELECT id, name, email, phone, instansi, created_at FROM users")->fetchAll(PDO::FETCH_ASSOC);
print_r($all);

