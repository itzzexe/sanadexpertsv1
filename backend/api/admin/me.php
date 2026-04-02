<?php
require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../auth.php';


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

requireAuthJson();

$user = [
    'id' => $_SESSION['user_id'] ?? null,
    'username' => $_SESSION['username'] ?? null,
    'role' => $_SESSION['user_role'] ?? null,
];

respondJson(['ok' => true, 'user' => $user, CSRF_TOKEN_NAME => generateCsrfToken()]);