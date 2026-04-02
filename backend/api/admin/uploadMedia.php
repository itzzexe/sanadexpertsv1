<?php
require_once dirname(__DIR__, 2) . '/config.php';

corsHeaders();
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

requireAuthJson(['admin','editor']);
requireCsrfJson();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respondJson(['ok' => false, 'error' => 'METHOD_NOT_ALLOWED'], 405);
    exit;
}

if (!isset($_FILES['file'])) {
    respondJson(['ok' => false, 'error' => 'NO_FILE'], 400);
    exit;
}

$result = uploadFile($_FILES['file']);
if (empty($result['success'])) {
    respondJson(['ok' => false, 'error' => $result['error'] ?? 'UPLOAD_FAILED'], 400);
    exit;
}

$filename = $result['filename'];
$projectBase = '/' . rawurlencode(basename(dirname(__DIR__, 2)));
$url = $projectBase . '/uploads/' . rawurlencode($filename);

respondJson(['ok' => true, 'filename' => $filename, 'url' => $url]);