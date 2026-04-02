<?php
require_once __DIR__ . '/../config.php';

corsHeaders();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Preflight response
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    respondJson(['ok' => false, 'error' => 'METHOD_NOT_ALLOWED'], 405);
    exit;
}

$token = generateCsrfToken();
respondJson(['ok' => true, 'token' => $token], 200);