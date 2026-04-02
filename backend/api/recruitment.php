<?php
require_once __DIR__ . '/../config.php';

corsHeaders();
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { 
    exit(0); 
}

// التحقق من طريقة الطلب
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respondJson(['ok' => false, 'error' => 'METHOD_NOT_ALLOWED'], 405);
    exit;
}

try {
    // التحقق من CSRF Token
    $csrfToken = $_POST[CSRF_TOKEN_NAME] ?? '';
    if (!verifyCsrfToken($csrfToken)) {
        respondJson(['ok' => false, 'error' => 'CSRF_FAILED'], 403);
        exit;
    }
    // الحصول على اتصال قاعدة البيانات
    $pdo = getDbConnection();
    
    // استلام البيانات وتنظيفها
    $fullName = sanitize($_POST['candidate_name'] ?? $_POST['full_name'] ?? '');
    $email = sanitize($_POST['candidate_email'] ?? $_POST['email'] ?? '');
    $phone = sanitize($_POST['candidate_phone'] ?? $_POST['phone'] ?? '');
    $experience = (int)($_POST['candidate_experience'] ?? $_POST['experience'] ?? 0);
    $position = sanitize($_POST['target_role'] ?? $_POST['position'] ?? '');
    $coverLetter = sanitize($_POST['cover_letter'] ?? '');
    $subject = sanitize($_POST['subject'] ?? 'طلب توظيف جديد من ' . $fullName);
    
    // التحقق من صحة البيانات المطلوبة
    $errors = [];
    
    if (empty($fullName)) {
        $errors[] = 'الاسم الكامل مطلوب';
    }
    
    if (empty($email) || !validateEmail($email)) {
        $errors[] = 'البريد الإلكتروني غير صحيح';
    }
    
    if (empty($phone) || !validatePhone($phone)) {
        $errors[] = 'رقم الهاتف غير صحيح';
    }
    
    if (empty($position)) {
        $errors[] = 'المنصب المطلوب مطلوب';
    }
    
    if ($experience < 0 || $experience > 50) {
        $errors[] = 'سنوات الخبرة غير صحيحة';
    }
    
    if (!empty($errors)) {
        respondJson(['ok' => false, 'errors' => $errors], 400);
        exit;
    }
    
    // معالجة رفع ملف السيرة الذاتية
    $cvPath = null;
    if (!empty($_FILES['cv_file']) && $_FILES['cv_file']['error'] === UPLOAD_ERR_OK) {
        $uploadResult = uploadFile($_FILES['cv_file'], ['pdf', 'doc', 'docx']);
        
        if ($uploadResult['success']) {
            $cvPath = $uploadResult['filename'];
        } else {
            $errors[] = 'خطأ في رفع ملف السيرة الذاتية: ' . $uploadResult['error'];
            respondJson(['ok' => false, 'errors' => $errors], 400);
            exit;
        }
    }
    
    // إدراج البيانات في قاعدة البيانات
    $stmt = $pdo->prepare("
        INSERT INTO recruitment_applications 
        (full_name, email, phone, position, experience, cover_letter, cv_path) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");
    
    $result = $stmt->execute([
        $fullName, 
        $email, 
        $phone, 
        $position, 
        $experience, 
        $coverLetter, 
        $cvPath
    ]);
    
    if (!$result) {
        logError('Failed to insert recruitment application', [
            'name' => $fullName,
            'email' => $email,
            'position' => $position,
            'error' => $stmt->errorInfo()
        ]);
        respondJson(['ok' => false, 'error' => 'DATABASE_INSERT_ERROR'], 500);
        exit;
    }
    
    $applicationId = $pdo->lastInsertId();
    
    // إرسال البريد الإلكتروني (اختياري)
    $emailSent = false;
    if (function_exists('mail')) {
        // تصميم HTML جميل للإيميل
        $html = '
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>طلب توظيف جديد</title>
    <style>
        body {
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 300;
        }
        .content {
            padding: 30px;
        }
        .info-row {
            display: flex;
            margin-bottom: 15px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
            border-right: 4px solid #667eea;
        }
        .info-label {
            font-weight: bold;
            color: #667eea;
            min-width: 150px;
            margin-left: 15px;
        }
        .info-value {
            flex: 1;
            color: #333;
        }
        .message-box {
            background: #e8f4fd;
            border: 1px solid #bee5eb;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .attachment-info {
            background: #d4edda;
            border: 1px solid #c3e6cb;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            text-align: center;
        }
        .attachment-icon {
            font-size: 24px;
            color: #28a745;
            margin-bottom: 10px;
        }
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #6c757d;
            font-size: 14px;
        }
        .badge {
            background: #667eea;
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 طلب توظيف جديد</h1>
            <div class="badge">#' . $applicationId . '</div>
        </div>
        
        <div class="content">
            <div class="info-row">
                <div class="info-label">👤 الاسم الكامل:</div>
                <div class="info-value">' . htmlspecialchars($fullName) . '</div>
            </div>
            
            <div class="info-row">
                <div class="info-label">📧 البريد الإلكتروني:</div>
                <div class="info-value">' . htmlspecialchars($email) . '</div>
            </div>
            
            <div class="info-row">
                <div class="info-label">📱 رقم الهاتف:</div>
                <div class="info-value">' . htmlspecialchars($phone) . '</div>
            </div>
            
            <div class="info-row">
                <div class="info-label">💼 المنصب المطلوب:</div>
                <div class="info-value">' . htmlspecialchars($position) . '</div>
            </div>
            
            <div class="info-row">
                <div class="info-label">⭐ سنوات الخبرة:</div>
                <div class="info-value">' . $experience . ' سنة</div>
            </div>
            
            <div class="message-box">
                <h3 style="color: #667eea; margin-top: 0;">💬 رسالة التغطية:</h3>
                <p>' . nl2br(htmlspecialchars($coverLetter)) . '</p>
            </div>';
        
        if ($cvPath) {
            $html .= '
            <div class="attachment-info">
                <div class="attachment-icon">📎</div>
                <strong>السيرة الذاتية مرفقة:</strong> ' . htmlspecialchars($cvPath) . '
            </div>';
        }
        
        $html .= '
            <div class="info-row">
                <div class="info-label">📅 تاريخ التقديم:</div>
                <div class="info-value">' . date('Y-m-d H:i:s') . '</div>
            </div>
        </div>
        
        <div class="footer">
            <p>تم إرسال هذا الإيميل تلقائياً من موقع SanadXperts</p>
            <p>للرد على هذا الطلب، يرجى الرد على هذا الإيميل مباشرة</p>
        </div>
    </div>
</body>
</html>';
        
        // إعداد البريد مع المرفق
        if ($cvPath && file_exists(UPLOAD_DIR . $cvPath)) {
            $boundary = '----=_Part_' . md5(uniqid());
            $headers = [
                'From: ' . FROM_EMAIL,
                'Reply-To: ' . $email,
                'MIME-Version: 1.0',
                'Content-Type: multipart/mixed; boundary=' . $boundary
            ];
            
            $body = "--$boundary\r\n" .
                    "Content-Type: text/html; charset=utf-8\r\n" .
                    "Content-Transfer-Encoding: 8bit\r\n\r\n" .
                    $html . "\r\n\r\n";
            
            // إضافة المرفق
            $fileContent = file_get_contents(UPLOAD_DIR . $cvPath);
            $fileBase64 = chunk_split(base64_encode($fileContent));
            $fileName = basename($cvPath);
            
            $body .= "--$boundary\r\n" .
                     "Content-Type: application/octet-stream; name=\"$fileName\"\r\n" .
                     "Content-Transfer-Encoding: base64\r\n" .
                     "Content-Disposition: attachment; filename=\"$fileName\"\r\n\r\n" .
                     $fileBase64 . "\r\n";
            
            $body .= "--$boundary--\r\n";
            
            $emailSent = sendMail($subject, $body, $email, TO_EMAIL, true, $headers);
        } else {
            // بريد بدون مرفق
            $headers = [
                'From: ' . FROM_EMAIL,
                'Reply-To: ' . $email,
                'MIME-Version: 1.0',
                'Content-Type: text/html; charset=utf-8'
            ];
            
            $emailSent = sendMail($subject, $html, $email, TO_EMAIL);
        }
    }
    
    // الاستجابة بالنجاح
    respondJson([
        'ok' => true,
        'application_id' => $applicationId,
        'cv_uploaded' => !empty($cvPath),
        'email_sent' => $emailSent,
        'message' => 'تم إرسال طلب التوظيف بنجاح. سنراجع طلبك ونتواصل معك قريباً.'
    ]);
    
} catch (PDOException $e) {
    logError('Database error in recruitment form', [
        'error' => $e->getMessage(),
        'code' => $e->getCode()
    ]);
    respondJson(['ok' => false, 'error' => 'DATABASE_ERROR'], 500);
    
} catch (Exception $e) {
    logError('General error in recruitment form', [
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
    ]);
    respondJson(['ok' => false, 'error' => 'INTERNAL_ERROR'], 500);
}