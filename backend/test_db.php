<?php
require_once 'config.php';
try {
    $db = getDbConnection();
    echo json_encode(['ok' => true, 'message' => 'Connected successfully']);
} catch (Exception $e) {
    echo json_encode(['ok' => false, 'error' => $e->getMessage()]);
}
