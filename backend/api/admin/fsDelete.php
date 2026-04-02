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
$base = fs_base_dir($root);
if (!$base) { fs_json_error('UNKNOWN_ROOT'); exit; }

$fullPath = fs_join($base, $rel);
if (!$fullPath || !fs_is_inside($fullPath, $base)) { fs_json_error('INVALID_PATH'); exit; }

if (!file_exists($fullPath)) { fs_json_error('NOT_FOUND', 404); exit; }

if (is_dir($fullPath)) { fs_json_error('DIR_DELETE_NOT_SUPPORTED'); exit; }

if (!unlink($fullPath)) { fs_json_error('DELETE_FAILED', 500); exit; }

respondJson(['ok' => true]);