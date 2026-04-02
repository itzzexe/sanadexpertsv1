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
    $name = sanitize($_POST['from_name'] ?? $_POST['name'] ?? '');
    $email = sanitize($_POST['from_email'] ?? $_POST['email'] ?? '');
    $phone = sanitize($_POST['phone'] ?? '');
    $service = sanitize($_POST['service'] ?? '');
    $message = sanitize($_POST['message'] ?? '');
    $subject = sanitize($_POST['subject'] ?? 'طلب استشارة مجانية من ' . $name);
    
    // التحقق من صحة البيانات المطلوبة
    $errors = [];
    
    if (empty($name)) {
        $errors[] = 'الاسم مطلوب';
    }
    
    if (empty($email) || !validateEmail($email)) {
        $errors[] = 'البريد الإلكتروني غير صحيح';
    }
    
    if (empty($phone) || !validatePhone($phone)) {
        $errors[] = 'رقم الهاتف غير صحيح';
    }
    
    if (empty($message)) {
        $errors[] = 'الرسالة مطلوبة';
    }
    
    if (!empty($errors)) {
        respondJson(['ok' => false, 'errors' => $errors], 400);
        exit;
    }
    
    // معالجة المرفق (اختياري)
    $attachmentPath = null;
    if (isset($_FILES['attachment']) && $_FILES['attachment']['error'] === UPLOAD_ERR_OK) {
        $uploadResult = uploadFile($_FILES['attachment']);
        if ($uploadResult['success']) {
            $attachmentPath = $uploadResult['filename'];
        } else {
            // إذا فشل رفع الملف، نسجل الخطأ لكن لا نوقف العملية
            logError('Failed to upload attachment', [
                'error' => $uploadResult['error'],
                'file' => $_FILES['attachment']['name']
            ]);
        }
    }
    
    // إدراج البيانات في قاعدة البيانات
    $stmt = $pdo->prepare("
        INSERT INTO contact_messages (name, email, phone, message, service, subject, attachment_path) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");
    
    $result = $stmt->execute([$name, $email, $phone, $message, $service, $subject, $attachmentPath]);
    
    if (!$result) {
        logError('Failed to insert contact message', [
            'name' => $name,
            'email' => $email,
            'error' => $stmt->errorInfo()
        ]);
        respondJson(['ok' => false, 'error' => 'DATABASE_INSERT_ERROR'], 500);
        exit;
    }
    
    $messageId = $pdo->lastInsertId();
    
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
    <title>طلب استشارة مجانية جديد</title>
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
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
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
            border-right: 4px solid #28a745;
        }
        .info-label {
            font-weight: bold;
            color: #28a745;
            min-width: 150px;
            margin-left: 15px;
        }
        .info-value {
            flex: 1;
            color: #333;
        }
        .message-box {
            background: #d1ecf1;
            border: 1px solid #bee5eb;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #6c757d;
            font-size: 14px;
        }
        .badge {
            background: #28a745;
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
            <h1>💬 طلب استشارة مجانية جديد</h1>
            <div class="badge">#' . $messageId . '</div>
        </div>
        
        <div class="content">
            <div class="info-row">
                <div class="info-label">👤 الاسم:</div>
                <div class="info-value">' . htmlspecialchars($name) . '</div>
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
                <div class="info-label">🔧 الخدمة المطلوبة:</div>
                <div class="info-value">' . htmlspecialchars($service) . '</div>
            </div>
            
            <div class="message-box">
                <h3 style="color: #28a745; margin-top: 0;">💭 الرسالة:</h3>
                <p>' . nl2br(htmlspecialchars($message)) . '</p>
            </div>
            
            <div class="info-row">
                <div class="info-label">📅 تاريخ الإرسال:</div>
                <div class="info-value">' . date('Y-m-d H:i:s') . '</div>
            </div>';
            
        // إضافة معلومات المرفق إذا كان موجوداً
        if ($attachmentPath) {
            $html .= '
            <div class="attachment-info" style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin: 20px 0; text-align: center;">
                <h4 style="color: #856404; margin-top: 0;">📎 مرفق:</h4>
                <p><strong>' . htmlspecialchars(basename($attachmentPath)) . '</strong></p>
                <p><small>تم إرفاق الملف مع هذا الإيميل</small></p>
            </div>';
        }
        
        $html .= '
        </div>
        
        <div class="footer">
            <p>تم إرسال هذا الإيميل تلقائياً من موقع SanadXperts</p>
            <p>للرد على هذا الطلب، يرجى الرد على هذا الإيميل مباشرة</p>
        </div>
    </div>
</body>
</html>';
        
        // إرسال الإيميل مع أو بدون مرفق
        if ($attachmentPath && file_exists(UPLOAD_DIR . $attachmentPath)) {
            // إرسال مع مرفق
            $boundary = '----=_Part_' . md5(uniqid());
            $customHeaders = [
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
            $fileContent = file_get_contents(UPLOAD_DIR . $attachmentPath);
            $fileBase64 = chunk_split(base64_encode($fileContent));
            $fileName = basename($attachmentPath);
            
            $body .= "--$boundary\r\n" .
                     "Content-Type: application/octet-stream; name=\"$fileName\"\r\n" .
                     "Content-Transfer-Encoding: base64\r\n" .
                     "Content-Disposition: attachment; filename=\"$fileName\"\r\n\r\n" .
                     $fileBase64 . "\r\n";
            
            $body .= "--$boundary--\r\n";
            
            $emailSent = sendMail($subject, $body, $email, TO_EMAIL, true, $customHeaders);
        } else {
            // إرسال بدون مرفق
            $headers = [
                'From: ' . FROM_EMAIL,
                'Reply-To: ' . $email,
                'MIME-Version: 1.0',
                'Content-Type: text/html; charset=utf-8'
            ];
            
            $emailSent = sendMail($subject, $html, $email, TO_EMAIL, false, $headers);
        }
    }
    
    // الاستجابة بالنجاح
    respondJson([
        'ok' => true,
        'message_id' => $messageId,
        'email_sent' => $emailSent,
        'message' => 'تم إرسال رسالتك بنجاح. سنتواصل معك قريباً.'
    ]);
    
} catch (PDOException $e) {
    logError('Database error in contact form', [
        'error' => $e->getMessage(),
        'code' => $e->getCode()
    ]);
    respondJson(['ok' => false, 'error' => 'DATABASE_ERROR'], 500);
    
} catch (Exception $e) {
    logError('General error in contact form', [
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
    ]);
    respondJson(['ok' => false, 'error' => 'INTERNAL_ERROR'], 500);
}