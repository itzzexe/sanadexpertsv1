<?php
require_once dirname(__DIR__, 2) . '/config.php';

corsHeaders();
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once dirname(__DIR__, 2) . '/auth.php';

try {
    global $authManager;
    $authManager->logout();
    respondJson(['ok' => true]);
} catch (Exception $e) {
    logError('ADMIN_LOGOUT_ERROR: ' . $e->getMessage());
    respondJson(['ok' => false, 'error' => 'SERVER_ERROR'], 500);
}