<?php
$dbPath = __DIR__ . '/../pbb-p2/database/database.sqlite';
$pdo = new PDO('sqlite:' . $dbPath);

$sqlDump = "-- ============================================================\n";
$sqlDump .= "-- Database Schema & Initial Data for PBB-P2 BAPENDA Karawang\n";
$sqlDump .= "-- Exported at: " . date('Y-m-d H:i:s') . "\n";
$sqlDump .= "-- ============================================================\n\n";

// Dump tables
$stmt = $pdo->query("SELECT type, name, sql FROM sqlite_master WHERE type IN ('table', 'index') AND name NOT LIKE 'sqlite_%' ORDER BY type DESC, name ASC");

while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    if (!empty($row['sql'])) {
        $sqlDump .= "-- " . strtoupper($row['type']) . ": " . $row['name'] . "\n";
        $sqlDump .= $row['sql'] . ";\n\n";
    }
}

// Dump users data
$sqlDump .= "-- ============================================================\n";
$sqlDump .= "-- DATA DUMP: Tabel users\n";
$sqlDump .= "-- ============================================================\n\n";

$users = $pdo->query("SELECT * FROM users")->fetchAll(PDO::FETCH_ASSOC);
foreach ($users as $u) {
    $cols = array_keys($u);
    $escapedVals = array_map(function($v) use ($pdo) {
        return $v === null ? 'NULL' : $pdo->quote($v);
    }, array_values($u));
    
    $sqlDump .= "INSERT INTO users (" . implode(', ', $cols) . ") VALUES (" . implode(', ', $escapedVals) . ");\n";
}

file_put_contents(__DIR__ . '/../database.sql', $sqlDump);
echo $sqlDump;

