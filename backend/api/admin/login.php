<?php
require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../auth.php';


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respondJson(['ok' => false, 'error' => 'METHOD_NOT_ALLOWED'], 405);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$username = trim($input['username'] ?? '');
$password = $input['password'] ?? '';

if (empty($username) || empty($password)) {
    respondJson(['ok' => false, 'error' => 'MISSING_CREDENTIALS'], 400);
    exit;
}

// محاولة الاتصال بقاعدة البيانات
try {
    // Use the global AuthManager instance from auth.php
    global $authManager;
    $result = $authManager->login($username, $password);
    
    if ($result['success']) {
        $user = [
            'id' => $result['user']['id'],
            'username' => $result['user']['username'],
            'role' => $result['user']['role']
        ];
        
        respondJson([
            'ok' => true,
            'user' => $user,
            CSRF_TOKEN_NAME => generateCsrfToken()
        ]);
    } else {
        respondJson(['ok' => false, 'error' => $result['message']], 401);
    }
} catch (Exception $e) {
    logError('ADMIN_LOGIN_ERROR: ' . $e->getMessage());
    respondJson(['ok' => false, 'error' => 'SERVER_ERROR'], 500);
}