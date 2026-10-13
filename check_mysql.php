<?php
try {
    $pdo = new PDO('mysql:host=127.0.0.1;port=3306', 'root', '');
    echo "MySQL is running!\nDatabases:\n";
    $dbs = $pdo->query('SHOW DATABASES');
    while ($db = $dbs->fetchColumn()) {
        echo "- $db\n";
    }
} catch (Exception $e) {
    echo "MySQL connection failed: " . $e->getMessage() . "\n";
}
