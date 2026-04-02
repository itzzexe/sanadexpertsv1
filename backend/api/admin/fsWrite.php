<?php
require_once dirname(__DIR__, 2) . '/config.php';
require_once __DIR__ . '/fs_utils.php';

corsHeaders();
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

requireAuthJson(['admin']);
requireCsrfJson();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { fs_json_error('METHOD_NOT_ALLOWED', 405); exit; }

$payload = getJsonInput();
$root = sanitize($payload['root'] ?? '');
$rel = $payload['path'] ?? '';
$content = $payload['content'] ?? '';

$base = fs_base_dir($root);
if (!$base) { fs_json_error('UNKNOWN_ROOT'); exit; }

$fullPath = fs_join($base, $rel);
if (!$fullPath || !fs_is_inside($fullPath, $base)) { fs_json_error('INVALID_PATH'); exit; }

$ext = fs_get_ext($fullPath);
if (!fs_is_text_ext($ext)) { fs_json_error('EXT_NOT_ALLOWED'); exit; }

// تأكد من وجود المجلد الأب
$dir = dirname($fullPath);
if (!is_dir($dir)) {
    if (!mkdir($dir, 0755, true)) { fs_json_error('MKDIR_FAILED', 500); exit; }
}

if (file_put_contents($fullPath, $content) === false) {
    fs_json_error('WRITE_FAILED', 500);
    exit;
}

respondJson(['ok' => true]);