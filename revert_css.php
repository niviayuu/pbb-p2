<?php
$files = ['css/style.css', 'pbb-p2/public/css/style.css'];

$origCss = <<<CSS
/* Metric Summary Bar */
.desa-metric-summary-bar {
  display: flex;
  gap: 12px;
  align-items: stretch;
  margin-bottom: 20px;
}

.desa-name-pill-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 14px;
  min-width: 140px;
}

.desa-indicator-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #2ea868;
}

.desa-pill-title {
  font-size: 13.5px;
  font-weight: 700;
  color: var(--text-main);
}

.desa-pill-status-tag {
  font-size: 9.5px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 10px;
  margin-left: auto;
}

.tag-green {
  background-color: #dcfce7;
  color: #166534;
}

.tag-yellow {
  background-color: #fef9c3;
  color: #854d0e;
}

.tag-orange {
  background-color: #ffedd5;
  color: #9a3412;
}

.tag-red {
  background-color: #fee2e2;
  color: #991b1b;
}

.mini-stat-card {
  flex: 1;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.mini-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.mini-icon svg {
  width: 15px;
  height: 15px;
}

.mini-text {
  display: flex;
  flex-direction: column;
}

.m-label {
  font-size: 10px;
  color: var(--text-muted);
  font-weight: 500;
  white-space: nowrap;
}

.m-sub-label {
  font-size: 10px;
  color: var(--text-muted);
  font-weight: 600;
  line-height: 1;
}

.m-val {
  font-size: 12.5px;
  font-weight: 800;
  color: var(--text-main);
  margin-top: 1px;
  white-space: nowrap;
}

.mini-donut-card {
  flex: 1.1;
}

/* Advisory Box */
.desa-info-advisory-box {
  flex: 1.8;
  background-color: #f0f7ff;
  border: 1px solid #dbeafe;
  border-radius: 8px;
  padding: 8px 14px;
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.info-bubble-icon {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: #2563eb;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
}

.info-bubble-icon svg {
  width: 12px;
  height: 12px;
}

.info-content-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.info-content-text strong {
  font-size: 11px;
  color: #1e3a8a;
}

.info-content-text p {
  font-size: 10.5px;
  color: #3b82f6;
  line-height: 1.35;
}
CSS;

foreach ($files as $f) {
  $c = file_get_contents($f);
  $cNorm = str_replace("\r\n", "\n", $c);
  // Replace the summary bar block with original
  $cNorm = preg_replace('/\/\* Metric Summary Bar \*\/.*?\/\* Section Sub-heading \*\//s', $origCss . "\n\n/* Section Sub-heading */", $cNorm);
  file_put_contents($f, $cNorm);
  echo "Reverted to Lemahabang layout in $f\n";
}
