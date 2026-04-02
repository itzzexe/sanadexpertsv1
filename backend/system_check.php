<?php
header('Content-Type: text/plain');
echo "PHP Version: " . PHP_VERSION . "\n";
echo "PDO Loaded: " . (class_exists('PDO') ? 'Yes' : 'No') . "\n";
echo "PDO MySQL: " . (in_array('mysql', PDO::getAvailableDrivers()) ? 'Yes' : 'No') . "\n";
echo "Session Path: " . ini_get('session.save_path') . "\n";
echo "Current Directory: " . __DIR__ . "\n";
echo "Random Bytes: " . (function_exists('random_bytes') ? 'Yes' : 'No') . "\n";
?>
