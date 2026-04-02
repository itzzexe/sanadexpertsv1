<?php
require_once dirname(__DIR__, 2) . '/config.php';

corsHeaders();
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

requireAuthJson(['admin','editor']);

$type = sanitize($_GET['type'] ?? '');
if (!$type) {
    respondJson(['ok' => false, 'error' => 'MISSING_TYPE'], 400);
    exit;
}

$baseDir = dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . 'content' . DIRECTORY_SEPARATOR;
$map = [
    'services' => $baseDir . 'services.json',
    'about' => $baseDir . 'about.json',
    'projects' => $baseDir . 'projects.json',
    'static' => $baseDir . 'static.json',
    'settings' => $baseDir . 'settings.json',
    'jobs' => $baseDir . 'jobs.json',
    'layout' => $baseDir . 'layout.json',
];

if (!isset($map[$type])) {
    respondJson(['ok' => false, 'error' => 'UNKNOWN_TYPE'], 400);
    exit;
}

$path = $map[$type];
if (!file_exists($path)) {
    respondJson(['ok' => false, 'error' => 'CONTENT_NOT_FOUND', 'path' => $path], 404);
    exit;
}

$json = file_get_contents($path);
$data = json_decode($json, true);
if ($data === null) {
    respondJson(['ok' => false, 'error' => 'INVALID_JSON_FORMAT'], 500);
    exit;
}

respondJson(['ok' => true, 'data' => $data]);