<?php
$pdo = new PDO('sqlite:pbb-p2/database/database.sqlite');
$pdo->exec("DELETE FROM users WHERE email LIKE 'petugas_%'");
$users = $pdo->query('SELECT id, name, email, phone, instansi, created_at FROM users')->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($users, JSON_PRETTY_PRINT);

