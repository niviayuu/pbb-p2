<?php
$dbPath = 'pbb-p2/database/database.sqlite';
if (file_exists($dbPath)) {
    $db = new PDO('sqlite:' . $dbPath);
    $res = $db->query("SELECT name FROM sqlite_master WHERE type='table'");
    echo "Tables in sqlite:\n";
    while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
        echo "- " . $row['name'] . "\n";
    }
} else {
    echo "database.sqlite not found.\n";
}
