<?php
require_once dirname(__DIR__, 2) . '/config.php';

corsHeaders();
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

requireAuthJson(['admin','editor']);

$dir = UPLOAD_DIR;
if (!is_dir($dir)) {
    respondJson(['ok' => true, 'files' => []]);
    exit;
}

$files = [];
$handle = opendir($dir);
while ($handle && ($entry = readdir($handle)) !== false) {
    if ($entry === '.' || $entry === '..') continue;
    $path = $dir . $entry;
    if (!is_file($path)) continue;
    $projectBase = '/' . rawurlencode(basename(dirname(__DIR__, 2)));
$files[] = [
        'filename' => $entry,
        'size' => filesize($path),
        'url' => $projectBase . '/uploads/' . rawurlencode($entry),
        'ext' => strtolower(pathinfo($entry, PATHINFO_EXTENSION)),
    ];
}
if ($handle) closedir($handle);

respondJson(['ok' => true, 'files' => $files]);