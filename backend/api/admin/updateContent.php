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

$payload = getJsonInput();
$type = sanitize($payload['type'] ?? '');
$data = $payload['data'] ?? null; // يمكن أن يكون {ar:[], en:[]} أو جزء منه
$lang = sanitize($payload['lang'] ?? ''); // اختياري لتحديث لغة واحدة

if (!$type || $data === null) {
    respondJson(['ok' => false, 'error' => 'MISSING_TYPE_OR_DATA'], 400);
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
$current = [];
if (file_exists($path)) {
    $current = json_decode(file_get_contents($path), true);
}
if (!is_array($current)) {
    $current = [];
}

// إذا تم تحديد لغة، نحدث تلك اللغة فقط
if ($lang) {
    if (!is_array($current)) $current = [];
    if (!is_array($data)) {
        respondJson(['ok' => false, 'error' => 'INVALID_DATA_STRUCTURE_FOR_LANG'], 400);
        exit;
    }
    $current[$lang] = $data;
    $newContent = $current;
} else {
    // تحديث كامل المحتوى (يتوقع كائن متعدد اللغات)
    if (!is_array($data)) {
        respondJson(['ok' => false, 'error' => 'INVALID_DATA_STRUCTURE'], 400);
        exit;
    }
    $newContent = $data;
}

// كتابة الملف بأمان
if (!is_dir(dirname($path))) {
    mkdir(dirname($path), 0755, true);
}

$tempPath = $path . '.tmp';
$written = file_put_contents($tempPath, json_encode($newContent, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT), LOCK_EX);
if ($written === false) {
    respondJson(['ok' => false, 'error' => 'WRITE_FAILED'], 500);
    exit;
}

// استبدال الذري
if (!rename($tempPath, $path)) {
    respondJson(['ok' => false, 'error' => 'RENAME_FAILED'], 500);
    exit;
}

respondJson(['ok' => true]);