<?php
/**
 * SanadXperts - Advanced Configuration
 */

// Error reporting for development
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
ini_set('log_errors', 1);

// Database Settings
const DB_HOST = '127.0.0.1';
const DB_NAME = 'sanadxperts_db';
const DB_USER = 'root';
const DB_PASS = '';
const DB_CHARSET = 'utf8mb4';

// إعدادات البريد الإلكتروني
const TO_EMAIL = 'info@sanadxperts.com, zaid.alaloosy21@gmail.com';
const FROM_EMAIL = 'no-reply@sanadxperts.com';

// تحميل إعدادات SMTP من ملف منفصل
if (file_exists(__DIR__ . '/smtp_config.php')) {
    require_once __DIR__ . '/smtp_config.php';
} else {
    // إعدادات SMTP افتراضية (في حالة عدم وجود ملف الإعدادات)
    define('SMTP_ENABLED', false);
    define('SMTP_HOST', 'smtp.gmail.com');
    define('SMTP_PORT', 587);
    define('SMTP_SECURE', 'tls');
    define('SMTP_AUTH', false);
    define('SMTP_USERNAME', '');
    define('SMTP_PASSWORD', '');
    define('SMTP_FROM_NAME', 'SanadXperts');
    define('SMTP_CHARSET', 'UTF-8');
}

// إعدادات رفع الملفات
// اجعل مسار الرفع داخل مجلد المشروع لضمان عمله مع خادم التطوير
const UPLOAD_DIR = __DIR__ . '/uploads/';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'];

// إعدادات الأمان
const CSRF_TOKEN_NAME = 'csrf_token';
const SESSION_TIMEOUT = 3600; // ساعة واحدة

// CORS أثناء التطوير أو الإنتاج
// السماح فقط للأصول الموثوقة (مطلوب عند استخدام الكوكيز/الجلسات)
const ALLOWED_ORIGINS = [
    'http://localhost',
    'http://127.0.0.1',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5174',
    'http://localhost:5175',
    'http://127.0.0.1:5175',
    'http://localhost:5176',
    'http://127.0.0.1:5176',
    'http://localhost:5177',
    'http://127.0.0.1:5177',
    'http://localhost:5178',
    'http://127.0.0.1:5178',
    'http://localhost:5179',
    'http://127.0.0.1:5179',
    'http://localhost:5180',
    'http://127.0.0.1:5180',
    'https://www.metazestd.com',
    'https://metazestd.com'
];
// 'https://your-production-domain.com' // قم بتعيين نطاق الإنتاج الحقيقي هنا
const ALLOW_METHODS = 'POST, GET, OPTIONS';
const ALLOW_HEADERS = 'Content-Type, X-Requested-With, Authorization, X-CSRF-Token';

// بدء الجلسة
if (session_status() === PHP_SESSION_NONE) {
    $savePath = ini_get('session.save_path');
    if (!$savePath || !is_dir($savePath)) {
        $customPath = __DIR__ . '/sessions';
        if (!is_dir($customPath)) { @mkdir($customPath, 0755, true); }
        @ini_set('session.save_path', $customPath);
    }
    session_start();
}

// دالة الاتصال بقاعدة البيانات
function getDbConnection() {
    if (!class_exists('PDO')) {
        respondJson(['ok' => false, 'error' => 'PDO_EXTENSION_MISSING', 'details' => 'The PDO extension is not enabled in your PHP configuration.'], 500);
        exit;
    }
    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];
        return new PDO($dsn, DB_USER, DB_PASS, $options);
    } catch (PDOException $e) {
        logError("Database connection failed: " . $e->getMessage());
        respondJson(['ok' => false, 'error' => 'DATABASE_CONNECTION_ERROR', 'details' => $e->getMessage()], 500);
        exit;
    }
}

// دالة إنشاء CSRF Token
function generateCsrfToken() {
    if (!isset($_SESSION[CSRF_TOKEN_NAME])) {
        $_SESSION[CSRF_TOKEN_NAME] = bin2hex(random_bytes(32));
    }
    return $_SESSION[CSRF_TOKEN_NAME];
}

// دالة التحقق من CSRF Token
function verifyCsrfToken($token) {
    return isset($_SESSION[CSRF_TOKEN_NAME]) && hash_equals($_SESSION[CSRF_TOKEN_NAME], $token);
}

// دالة CORS Headers
function corsHeaders() {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin && in_array($origin, ALLOWED_ORIGINS, true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
    } else {
        // يُستخدم localhost:5176 كافتراضي للتطوير مع Vite
        header('Access-Control-Allow-Origin: http://localhost:5176');
    }
    header('Vary: Origin');
    header('Access-Control-Allow-Methods: ' . ALLOW_METHODS);
    header('Access-Control-Allow-Headers: ' . ALLOW_HEADERS);
    header('Access-Control-Allow-Credentials: true');
}

// Call CORS headers immediately to ensure all responses (including errors) are visible
corsHeaders();

// دالة الاستجابة بـ JSON
function respondJson($data, $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}

// دالة تنظيف البيانات
function sanitize($str) {
    return htmlspecialchars(trim($str ?? ''), ENT_QUOTES | ENT_HTML5, 'UTF-8');
}

// دالة التحقق من صحة البريد الإلكتروني
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

// دالة التحقق من رقم الهاتف
function validatePhone($phone) {
    return preg_match('/^[\+]?[0-9\s\-\(\)]{10,20}$/', $phone);
}

// دالة رفع الملفات بأمان
function uploadFile($file, $allowedTypes = ALLOWED_EXTENSIONS) {
    if (!isset($file['tmp_name']) || !is_uploaded_file($file['tmp_name'])) {
        return ['success' => false, 'error' => 'NO_FILE_UPLOADED'];
    }
    
    if ($file['size'] > MAX_FILE_SIZE) {
        return ['success' => false, 'error' => 'FILE_TOO_LARGE'];
    }
    
    $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($extension, $allowedTypes)) {
        return ['success' => false, 'error' => 'INVALID_FILE_TYPE'];
    }
    
    $filename = uniqid() . '_' . time() . '.' . $extension;
    $uploadPath = UPLOAD_DIR . $filename;
    
    if (!is_dir(UPLOAD_DIR)) {
        mkdir(UPLOAD_DIR, 0755, true);
    }
    
    if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
        return ['success' => true, 'filename' => $filename, 'path' => $uploadPath];
    }
    
    return ['success' => false, 'error' => 'UPLOAD_FAILED'];
}

// دالة تسجيل الأخطاء
function logError($message, $context = []) {
    try {
        $logMessage = date('Y-m-d H:i:s') . " - " . $message;
        if (!empty($context)) {
            $logMessage .= " - Context: " . json_encode($context);
        }
        error_log($logMessage);
        @file_put_contents(__DIR__ . '/debug.log', $logMessage . PHP_EOL, FILE_APPEND);
    } catch (Exception $e) {
        // Fallback if logging fails
    }
}

// دالة قراءة JSON من الطلب
function getJsonInput() {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    return is_array($data) ? $data : [];
}

// دالة التحقق من CSRF للطلبات JSON
function requireCsrfJson() {
    $token = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    if (!$token) {
        $body = getJsonInput();
        $token = $body[CSRF_TOKEN_NAME] ?? '';
    }
    if (!verifyCsrfToken($token)) {
        corsHeaders();
        respondJson(['ok' => false, 'error' => 'INVALID_CSRF_TOKEN'], 403);
        exit;
    }
}

// دالة التحقق من تسجيل الدخول للأغراض API (ترجع JSON بدلاً من إعادة التوجيه)
function requireAuthJson($roles = []) {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    $userId = $_SESSION['user_id'] ?? null;
    $userRole = $_SESSION['user_role'] ?? null;
    if (!$userId) {
        corsHeaders();
        respondJson(['ok' => false, 'error' => 'UNAUTHORIZED'], 401);
        exit;
    }
    if (!empty($roles) && !in_array($userRole, $roles, true)) {
        corsHeaders();
        respondJson(['ok' => false, 'error' => 'FORBIDDEN', 'role' => $userRole], 403);
        exit;
    }
}

// Duplicate ALLOWED_ORIGINS removed; use definition near top.

// إرسال بريد موحد عبر mail() مع دعم عدة مستلمين
function sendMail($subject, $bodyOrHtml, $replyToEmail = '', $toEmails = TO_EMAIL, $isMultipart = false, $customHeaders = null) {
    // إذا كان SMTP مُفعل، استخدم PHPMailer أو SMTP مباشر
    if (defined('SMTP_ENABLED') && SMTP_ENABLED && !empty(SMTP_USERNAME) && !empty(SMTP_PASSWORD)) {
        return sendMailSMTP($subject, $bodyOrHtml, $replyToEmail, $toEmails, $isMultipart, $customHeaders);
    }
    
    // استخدام mail() العادية كبديل
    return sendMailBasic($subject, $bodyOrHtml, $replyToEmail, $toEmails, $isMultipart, $customHeaders);
}

// دالة إرسال عبر SMTP
function sendMailSMTP($subject, $bodyOrHtml, $replyToEmail = '', $toEmails = TO_EMAIL, $isMultipart = false, $customHeaders = null) {
    // إرسال إيميل عبر Gmail SMTP باستخدام socket
    try {
        // إعداد البيانات
        $to = implode(',', array_map('trim', explode(',', $toEmails)));
        $from = SMTP_USERNAME;
        $fromName = SMTP_FROM_NAME;
        
        // دالة مساعدة لقراءة الردود متعددة الأسطر
        function readSMTPResponse($smtp) {
            $response = '';
            do {
                $line = fgets($smtp, 515);
                $response .= $line;
                // إذا كان السطر الرابع هو مسافة، فهذا آخر سطر
            } while ($line && isset($line[3]) && $line[3] == '-');
            return $response;
        }
        
        // إنشاء اتصال SMTP (TLS على المنفذ 587)
        $smtp = fsockopen(SMTP_HOST, 587, $errno, $errstr, 30);
        if (!$smtp) {
            error_log("SMTP Connection failed: $errstr ($errno)");
            return false;
        }
        
        // قراءة الرد الأولي
        $response = readSMTPResponse($smtp);
        if (substr($response, 0, 3) != '220') {
            error_log("SMTP Initial response error: $response");
            fclose($smtp);
            return false;
        }
        
        // EHLO
        fputs($smtp, "EHLO localhost\r\n");
        $response = readSMTPResponse($smtp);
        
        // تفعيل TLS
        fputs($smtp, "STARTTLS\r\n");
        $response = readSMTPResponse($smtp);
        if (substr($response, 0, 3) != '220') {
            error_log("SMTP STARTTLS failed: $response");
            fclose($smtp);
            return false;
        }
        
        // تفعيل التشفير
        if (!stream_socket_enable_crypto($smtp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
            error_log("SMTP TLS encryption failed");
            fclose($smtp);
            return false;
        }
        
        // EHLO مرة أخرى بعد TLS
        fputs($smtp, "EHLO localhost\r\n");
        $response = readSMTPResponse($smtp);
        
        // AUTH LOGIN
        fputs($smtp, "AUTH LOGIN\r\n");
        $response = readSMTPResponse($smtp);
        if (substr($response, 0, 3) != '334') {
            error_log("SMTP AUTH failed: $response");
            fclose($smtp);
            return false;
        }
        
        // إرسال اسم المستخدم
        fputs($smtp, base64_encode(SMTP_USERNAME) . "\r\n");
        $response = readSMTPResponse($smtp);
        if (substr($response, 0, 3) != '334') {
            error_log("SMTP Username failed: $response");
            fclose($smtp);
            return false;
        }
        
        // إرسال كلمة المرور
        fputs($smtp, base64_encode(SMTP_PASSWORD) . "\r\n");
        $response = readSMTPResponse($smtp);
        if (substr($response, 0, 3) != '235') {
            error_log("SMTP Password failed: $response");
            fclose($smtp);
            return false;
        }
        
        // MAIL FROM
        fputs($smtp, "MAIL FROM: <$from>\r\n");
        $response = readSMTPResponse($smtp);
        if (substr($response, 0, 3) != '250') {
            error_log("SMTP MAIL FROM failed: $response");
            fclose($smtp);
            return false;
        }
        
        // RCPT TO لكل مستلم
        $recipients = array_map('trim', explode(',', $toEmails));
        foreach ($recipients as $recipient) {
            fputs($smtp, "RCPT TO: <$recipient>\r\n");
            $response = readSMTPResponse($smtp);
            if (substr($response, 0, 3) != '250') {
                error_log("SMTP RCPT TO failed for $recipient: $response");
            }
        }
        
        // DATA
        fputs($smtp, "DATA\r\n");
        $response = readSMTPResponse($smtp);
        if (substr($response, 0, 3) != '354') {
            error_log("SMTP DATA failed: $response");
            fclose($smtp);
            return false;
        }
        
        // بناء رسالة الإيميل
        $message = "From: $fromName <$from>\r\n";
        $message .= "To: $to\r\n";
        if ($replyToEmail) {
            $message .= "Reply-To: $replyToEmail\r\n";
        }
        $message .= "Subject: $subject\r\n";
        $message .= "MIME-Version: 1.0\r\n";
        
        // إذا كانت الرسالة multipart (مع مرفقات)
        if ($isMultipart && $customHeaders) {
            // استخدام الترويسات المخصصة للـ multipart
            foreach ($customHeaders as $header) {
                if (strpos($header, 'Content-Type:') !== false) {
                    $message .= $header . "\r\n";
                    break;
                }
            }
            $message .= "\r\n";
            $message .= $bodyOrHtml;
        } else {
            // رسالة HTML عادية
            $message .= "Content-Type: text/html; charset=UTF-8\r\n";
            $message .= "Content-Transfer-Encoding: 8bit\r\n";
            $message .= "\r\n";
            $message .= $bodyOrHtml;
        }
        
        $message .= "\r\n.\r\n";
        
        // إرسال الرسالة
        fputs($smtp, $message);
        $response = readSMTPResponse($smtp);
        if (substr($response, 0, 3) != '250') {
            error_log("SMTP Message send failed: $response");
            fclose($smtp);
            return false;
        }
        
        // QUIT
        fputs($smtp, "QUIT\r\n");
        fclose($smtp);
        
        return true;
        
    } catch (Exception $e) {
        error_log("SMTP Exception: " . $e->getMessage());
        return false;
    }
}

// دالة الإرسال الأساسية (النسخة الأصلية)
function sendMailBasic($subject, $bodyOrHtml, $replyToEmail = '', $toEmails = TO_EMAIL, $isMultipart = false, $customHeaders = null) {
    // بناء الترويسات
    if ($customHeaders && is_array($customHeaders)) {
        $headers = $customHeaders;
    } else {
        $headers = [
            'From: ' . FROM_EMAIL,
            $replyToEmail ? ('Reply-To: ' . $replyToEmail) : '',
            'MIME-Version: 1.0',
            'Content-Type: text/html; charset=utf-8',
            'Content-Transfer-Encoding: 8bit'
        ];
        // إزالة العناصر الفارغة
        $headers = array_values(array_filter($headers));
    }

    // إعدادات mail() حسب نظام التشغيل
    $extraParams = '';
    if (defined('PHP_OS_FAMILY') && PHP_OS_FAMILY === 'Windows') {
        // Windows: استخدم إعدادات SMTP من ini
        if (defined('SMTP_HOST') && !empty(SMTP_HOST)) {
            @ini_set('SMTP', SMTP_HOST);
        }
        if (defined('SMTP_PORT') && !empty(SMTP_PORT)) {
            @ini_set('smtp_port', (string) SMTP_PORT);
        }
        @ini_set('sendmail_from', FROM_EMAIL);
    } else {
        // Linux/Unix: ضبط Envelope Sender لتحسين التسليم وملاءمة SPF/DMARC
        $extraParams = '-f ' . FROM_EMAIL;
    }

    // دعم عدة مستلمين مفصولين بفواصل
    $to = implode(',', array_map('trim', explode(',', $toEmails)));

    // إرسال البريد
    return @mail($to, $subject, $bodyOrHtml, implode("\r\n", $headers), $extraParams);
}