<?php
// نقطة API ملفية للمحتوى البسيط
// تدعم جلب بيانات مثل الخدمات وفق اللغة
require_once __DIR__ . '/../config.php';

corsHeaders();
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  exit(0);
}

// يسمح فقط بالطلبات GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
  respondJson(['ok' => false, 'error' => 'METHOD_NOT_ALLOWED'], 405);
  exit;
}

// أنواع المحتوى المسموح بها
$allowedTypes = ['services', 'about', 'projects', 'static', 'settings', 'jobs', 'layout'];

$type = isset($_GET['type']) ? preg_replace('/[^a-z_]/i', '', $_GET['type']) : '';
$lang = isset($_GET['lang']) ? strtolower(preg_replace('/[^a-z]/i', '', $_GET['lang'])) : 'ar';

if (!$type || !in_array($type, $allowedTypes, true)) {
  respondJson(['ok' => false, 'error' => 'TYPE_REQUIRED_OR_INVALID'], 400);
  exit;
}

$contentDir = __DIR__ . '/../content';
$filePath = $contentDir . '/' . $type . '.json';

if (!file_exists($filePath)) {
  respondJson(['ok' => false, 'error' => 'CONTENT_NOT_FOUND'], 404);
  exit;
}

$jsonText = file_get_contents($filePath);
$data = json_decode($jsonText, true);

if (!is_array($data)) {
  respondJson(['ok' => false, 'error' => 'INVALID_CONTENT_FORMAT'], 500);
  exit;
}

// إذا كان المحتوى ليس به مفاتيح لغات (مثل layout)
if (!isset($data['ar']) && !isset($data['en'])) {
  respondJson(['ok' => true, 'data' => $data]);
  exit;
}

// اللغات المدعومة
$supportedLangs = ['ar', 'en'];
if (!in_array($lang, $supportedLangs, true)) {
  $lang = 'ar';
}

$payload = $data[$lang] ?? ($data['ar'] ?? ($data['en'] ?? []));
respondJson(['ok' => true, 'data' => $payload]);
?>