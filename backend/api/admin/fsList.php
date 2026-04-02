<?php
require_once dirname(__DIR__, 2) . '/config.php';
require_once __DIR__ . '/fs_utils.php';

corsHeaders();
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

requireAuthJson(['admin']);

$root = sanitize($_GET['root'] ?? '');
$pathRel = sanitize($_GET['path'] ?? '');
$base = fs_base_dir($root);
if (!$base) { fs_json_error('UNKNOWN_ROOT'); exit; }

$fullPath = fs_join($base, $pathRel);
if (!$fullPath || !fs_is_inside($fullPath, $base)) { fs_json_error('INVALID_PATH'); exit; }

if (!file_exists($fullPath)) {
    respondJson(['ok' => true, 'items' => []]);
    exit;
}

if (!is_dir($fullPath)) {
    fs_json_error('NOT_A_DIRECTORY');
    exit;
}

$entries = scandir($fullPath);
$items = [];
foreach ($entries as $entry) {
    if ($entry === '.' || $entry === '..') continue;
    $entryPath = $fullPath . DIRECTORY_SEPARATOR . $entry;
    $isDir = is_dir($entryPath);
    $items[] = [
        'name' => $entry,
        'type' => $isDir ? 'dir' : 'file',
        'size' => $isDir ? null : @filesize($entryPath),
        'mtime' => @filemtime($entryPath),
        'ext' => $isDir ? null : fs_get_ext($entry)
    ];
}

respondJson(['ok' => true, 'items' => $items]);