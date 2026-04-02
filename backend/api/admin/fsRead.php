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

if (!file_exists($fullPath)) { fs_json_error('FILE_NOT_FOUND', 404); exit; }
if (is_dir($fullPath)) { fs_json_error('IS_DIRECTORY'); exit; }

$ext = fs_get_ext($fullPath);
if (!fs_is_text_ext($ext)) {
    // للملفات غير النصية نوفر معلومات عامة فقط
    $size = @filesize($fullPath);
    $mtime = @filemtime($fullPath);
    respondJson(['ok' => true, 'binary' => true, 'size' => $size, 'mtime' => $mtime]);
    exit;
}

$content = file_get_contents($fullPath);
respondJson(['ok' => true, 'binary' => false, 'content' => $content]);