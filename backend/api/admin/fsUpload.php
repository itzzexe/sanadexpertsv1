<?php
require_once dirname(__DIR__, 2) . '/config.php';
require_once __DIR__ . '/fs_utils.php';

corsHeaders();
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

requireAuthJson(['admin']);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respondJson(['ok' => false, 'error' => 'METHOD_NOT_ALLOWED'], 405);
    exit;
}

$root = sanitize($_POST['root'] ?? '');
$relDir = $_POST['path'] ?? '';
$base = fs_base_dir($root);
if (!$base) { fs_json_error('UNKNOWN_ROOT'); exit; }

$destDir = fs_join($base, $relDir);
if (!$destDir || !fs_is_inside($destDir, $base)) { fs_json_error('INVALID_PATH'); exit; }

if (!is_dir($destDir)) {
    if (!mkdir($destDir, 0755, true)) { fs_json_error('MKDIR_FAILED', 500); exit; }
}

if (!isset($_FILES['file'])) { fs_json_error('NO_FILE'); exit; }
$upload = $_FILES['file'];
if ($upload['error'] !== UPLOAD_ERR_OK) { fs_json_error('UPLOAD_ERROR_' . $upload['error']); exit; }

$origName = basename($upload['name']);
$ext = fs_get_ext($origName);
if (!fs_is_upload_ext_allowed($ext, $root)) { fs_json_error('EXT_NOT_ALLOWED'); exit; }

$tmp = $upload['tmp_name'];
$dest = $destDir . DIRECTORY_SEPARATOR . $origName;

if (!move_uploaded_file($tmp, $dest)) { fs_json_error('MOVE_FAILED', 500); exit; }

respondJson(['ok' => true, 'name' => $origName]);