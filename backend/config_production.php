<?php
/**
 * إعدادات قاعدة البيانات للإنتاج - cPanel
 * يجب تحديث هذه الإعدادات بعد الرفع على cPanel
 */

// إعدادات قاعدة البيانات - يجب تحديثها
define('DB_HOST', 'localhost'); // عادة localhost في cPanel
define('DB_NAME', 'your_cpanel_username_sanadxperts'); // اسم قاعدة البيانات من cPanel
define('DB_USER', 'your_cpanel_username_dbuser'); // مستخدم قاعدة البيانات من cPanel
define('DB_PASS', 'your_database_password'); // كلمة مرور قاعدة البيانات
define('DB_CHARSET', 'utf8mb4');

// إعدادات الجلسات
define('SESSION_LIFETIME', 3600); // ساعة واحدة
define('SESSION_PATH', __DIR__ . '/sessions');
define('SESSION_SECURE', true); // true للـ HTTPS
define('SESSION_HTTPONLY', true);
define('SESSION_SAMESITE', 'Strict');

// إعدادات الأمان
define('CSRF_TOKEN_LIFETIME', 1800); // 30 دقيقة
define('MAX_LOGIN_ATTEMPTS', 5);
define('LOCKOUT_DURATION', 900); // 15 دقيقة

// إعدادات الملفات
define('UPLOAD_PATH', __DIR__ . '/uploads');
define('MAX_FILE_SIZE', 10 * 1024 * 1024); // 10 ميجابايت
define('ALLOWED_EXTENSIONS', ['pdf', 'doc', 'docx']);

// إعدادات البيئة
define('ENVIRONMENT', 'production');
define('DEBUG_MODE', false);
define('LOG_ERRORS', true);
define('ERROR_LOG_PATH', __DIR__ . '/logs/error.log');

// إعدادات الموقع
define('SITE_URL', 'https://yourdomain.com'); // يجب تحديث الدومين
define('ADMIN_URL', 'https://yourdomain.com/admin');
define('API_URL', 'https://yourdomain.com/api');

// إعدادات البريد الإلكتروني
define('MAIL_FROM_ADDRESS', 'info@yourdomain.com');
define('MAIL_FROM_NAME', 'SanadXperts - خبراء السند');

/**
 * دالة الاتصال بقاعدة البيانات
 */
function getDbConnection() {
    static $pdo = null;
    
    if ($pdo === null) {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES " . DB_CHARSET . " COLLATE utf8mb4_unicode_ci"
            ];
            
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
            
            // تحسين الأداء
            $pdo->exec("SET SESSION sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO'");
            
        } catch (PDOException $e) {
            if (DEBUG_MODE) {
                die("Database connection failed: " . $e->getMessage());
            } else {
                error_log("Database connection failed: " . $e->getMessage());
                die("خطأ في الاتصال بقاعدة البيانات");
            }
        }
    }
    
    return $pdo;
}

/**
 * دالة تسجيل الأخطاء
 */
function logError($message, $context = []) {
    if (LOG_ERRORS) {
        $logMessage = date('Y-m-d H:i:s') . " - " . $message;
        if (!empty($context)) {
            $logMessage .= " - Context: " . json_encode($context, JSON_UNESCAPED_UNICODE);
        }
        $logMessage .= PHP_EOL;
        
        // إنشاء مجلد logs إذا لم يكن موجوداً
        $logDir = dirname(ERROR_LOG_PATH);
        if (!is_dir($logDir)) {
            mkdir($logDir, 0755, true);
        }
        
        file_put_contents(ERROR_LOG_PATH, $logMessage, FILE_APPEND | LOCK_EX);
    }
}

/**
 * دالة التحقق من البيئة
 */
function isProduction() {
    return ENVIRONMENT === 'production';
}

/**
 * دالة إنشاء مجلدات النظام
 */
function createSystemDirectories() {
    $directories = [
        SESSION_PATH,
        UPLOAD_PATH,
        dirname(ERROR_LOG_PATH)
    ];
    
    foreach ($directories as $dir) {
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }
    }
    
    // إنشاء ملف .htaccess لحماية المجلدات الحساسة
    $htaccessContent = "Order deny,allow\nDeny from all";
    
    file_put_contents(SESSION_PATH . '/.htaccess', $htaccessContent);
    file_put_contents(dirname(ERROR_LOG_PATH) . '/.htaccess', $htaccessContent);
}

// إنشاء المجلدات المطلوبة
createSystemDirectories();

/**
 * تعليمات الإعداد على cPanel:
 * 
 * 1. إنشاء قاعدة البيانات:
 *    - اذهب إلى MySQL Databases في cPanel
 *    - أنشئ قاعدة بيانات جديدة
 *    - أنشئ مستخدم جديد وأعطه صلاحيات كاملة
 * 
 * 2. تحديث الإعدادات أعلاه:
 *    - DB_NAME: اسم قاعدة البيانات الكامل
 *    - DB_USER: اسم المستخدم الكامل
 *    - DB_PASS: كلمة مرور قاعدة البيانات
 *    - SITE_URL: الدومين الخاص بك
 * 
 * 3. رفع ملف database_setup_complete.sql:
 *    - اذهب إلى phpMyAdmin
 *    - اختر قاعدة البيانات
 *    - اذهب إلى تبويب Import
 *    - ارفع الملف وشغله
 * 
 * 4. تحديث ملف smtp_config.php:
 *    - ضع بيانات Gmail الصحيحة
 *    - تأكد من App Password
 * 
 * 5. نسخ هذا الملف إلى config.php:
 *    - cp config_production.php config.php
 */
?>