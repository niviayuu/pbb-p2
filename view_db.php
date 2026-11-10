<?php
require_once __DIR__ . '/auth.php';

$dbPath = __DIR__ . '/pbb-p2/database/database.sqlite';
$fileExists = file_exists($dbPath);
$fileSize = $fileExists ? round(filesize($dbPath) / 1024, 2) . ' KB' : 'Tidak Ditemukan';
$lastModified = $fileExists ? date('d-m-Y H:i:s', filemtime($dbPath)) : '-';

$tables = [];
$users = [];
$error = null;

if ($fileExists) {
    try {
        $pdo = getDatabaseConnection();
        $tables = $pdo->query("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")->fetchAll(PDO::FETCH_COLUMN);
        $users = $pdo->query("SELECT id, name, email, phone, instansi, password, created_at FROM users ORDER BY id ASC")->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        $error = $e->getMessage();
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Database Viewer - PBB-P2 BAPENDA Karawang</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: #f1f5f9;
      color: #1e293b;
      padding: 30px 20px;
    }
    .container {
      max-width: 1100px;
      margin: 0 auto;
    }
    .header-card {
      background: #ffffff;
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.05);
      border: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
    }
    .header-info h1 {
      font-size: 22px;
      font-weight: 800;
      color: #104c91;
      margin-bottom: 4px;
    }
    .header-info p {
      font-size: 13px;
      color: #64748b;
    }
    .header-badges {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    .badge {
      background: #e0f2fe;
      color: #0369a1;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }
    .badge.success {
      background: #dcfce7;
      color: #15803d;
    }
    .action-links {
      display: flex;
      gap: 10px;
      margin-bottom: 24px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 10px 18px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
    }
    .btn-primary { background: #104c91; color: #ffffff; }
    .btn-primary:hover { background: #0d3d6b; }
    .btn-outline { background: #ffffff; color: #334155; border: 1.5px solid #cbd5e1; }
    .btn-outline:hover { background: #f8fafc; }
    
    .card {
      background: #ffffff;
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.05);
      border: 1px solid #e2e8f0;
    }
    .card-title {
      font-size: 17px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .table-container {
      overflow-x: auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    th {
      background: #f8fafc;
      color: #475569;
      font-weight: 700;
      text-align: left;
      padding: 12px 14px;
      border-bottom: 2px solid #e2e8f0;
    }
    td {
      padding: 12px 14px;
      border-bottom: 1px solid #e2e8f0;
      color: #334155;
    }
    tr:hover td {
      background: #f8fafc;
    }
    .code-snippet {
      font-family: monospace;
      font-size: 11px;
      color: #64748b;
      word-break: break-all;
      background: #f1f5f9;
      padding: 3px 6px;
      border-radius: 4px;
    }
    .tables-pill-container {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .table-pill {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      padding: 6px 14px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      color: #334155;
    }
    .table-pill.active {
      background: #104c91;
      color: #ffffff;
      border-color: #104c91;
    }
  </style>
</head>
<body>

  <div class="container">
    <div class="header-card">
      <div class="header-info">
        <h1>Database Viewer & Manajer Akun</h1>
        <p>Peta Capaian PBB-P2 BAPENDA Kabupaten Karawang</p>
      </div>
      <div class="header-badges">
        <span class="badge success">● Database SQLite Aktif</span>
        <span class="badge">Ukuran: <?php echo $fileSize; ?></span>
        <span class="badge">Terakhir Diupdate: <?php echo $lastModified; ?></span>
      </div>
    </div>

    <div class="action-links">
      <a href="login.php" class="btn btn-primary">&larr; Halaman Login</a>
      <a href="register.php" class="btn btn-outline">+ Daftar Akun Baru</a>
      <a href="database.sql" target="_blank" class="btn btn-outline">&#128196; Lihat File database.sql Mentah</a>
    </div>

    <div class="card">
      <h2 class="card-title">
        Daftar Tabel di Database
        <span style="font-size: 13px; font-weight: 500; color: #64748b;">Total: <?php echo count($tables); ?> Tabel</span>
      </h2>
      <div class="tables-pill-container">
        <?php foreach ($tables as $t): ?>
          <span class="table-pill <?php echo $t === 'users' ? 'active' : ''; ?>">
            📁 <?php echo htmlspecialchars($t); ?>
          </span>
        <?php endforeach; ?>
      </div>
    </div>

    <div class="card">
      <h2 class="card-title">
        Isi Tabel <code>users</code> (Akun Terdaftar)
        <span style="font-size: 13px; font-weight: 500; color: #64748b;">Total Akun: <?php echo count($users); ?></span>
      </h2>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama Lengkap</th>
              <th>Email</th>
              <th>Nomor HP</th>
              <th>Instansi / Unit Kerja</th>
              <th>Password Hash (Bcrypt)</th>
              <th>Waktu Dibuat</th>
            </tr>
          </thead>
          <tbody>
            <?php if (empty($users)): ?>
              <tr><td colspan="7" style="text-align: center; color: #94a3b8; padding: 20px;">Belum ada akun di database.</td></tr>
            <?php else: ?>
              <?php foreach ($users as $u): ?>
                <tr>
                  <td><strong>#<?php echo htmlspecialchars($u['id']); ?></strong></td>
                  <td><strong><?php echo htmlspecialchars($u['name']); ?></strong></td>
                  <td><?php echo htmlspecialchars($u['email']); ?></td>
                  <td><?php echo htmlspecialchars($u['phone'] ?? '-'); ?></td>
                  <td><?php echo htmlspecialchars($u['instansi'] ?? '-'); ?></td>
                  <td><span class="code-snippet"><?php echo substr(htmlspecialchars($u['password']), 0, 20) . '...'; ?></span></td>
                  <td><?php echo htmlspecialchars($u['created_at']); ?></td>
                </tr>
              <?php endforeach; ?>
            <?php endif; ?>
          </tbody>
        </table>
      </div>
    </div>

  </div>

</body>
</html>

