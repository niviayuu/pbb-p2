<?php
// Main Entry Point for Apache / Laragon
require_once __DIR__ . '/auth.php';

// Enforce authentication
if (!isLoggedIn()) {
    header('Location: login.php');
    exit;
}

$user = getCurrentUser();
$userName = htmlspecialchars($user['name'] ?? 'Admin', ENT_QUOTES, 'UTF-8');
$userEmail = htmlspecialchars($user['email'] ?? 'admin@karawangkab.go.id', ENT_QUOTES, 'UTF-8');

// Load existing dashboard HTML
$html = file_get_contents(__DIR__ . '/index.html');

// Inject dynamic user name and email into top bar & admin profile
$html = str_replace('<span class="admin-name">Admin</span>', '<span class="admin-name">' . $userName . '</span>', $html);
$html = str_replace('<strong>Administrator BAPENDA</strong>', '<strong>' . $userName . '</strong>', $html);
$html = str_replace('<span>admin@karawangkab.go.id</span>', '<span>' . $userEmail . '</span>', $html);

// Ensure Keluar button links to logout.php
$html = str_replace('<a href="#" class="dropdown-item text-danger">Keluar</a>', '<a href="logout.php" class="dropdown-item text-danger">Keluar</a>', $html);

echo $html;
