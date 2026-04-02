<?php
/**
 * مثال على إعدادات SMTP للإيميل
 * انسخ هذا الملف إلى smtp_config.php وحدث البيانات
 */

// إعدادات Gmail SMTP
define('SMTP_ENABLED', true);
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_SECURE', 'tls'); // 'tls' أو 'ssl'
define('SMTP_AUTH', true);

// بيانات الاعتماد - يجب تحديثها بالبيانات الصحيحة
define('SMTP_USERNAME', 'info@sanadxperts.com'); // ضع إيميلك هنا
define('SMTP_PASSWORD', 'abcd efgh ijkl mnop');  // ضع App Password هنا (16 حرف)

// إعدادات إضافية
define('SMTP_FROM_NAME', 'SanadXperts');
define('SMTP_CHARSET', 'UTF-8');

/**
 * تعليمات إعداد Gmail:
 * 
 * 1. تفعيل التحقق بخطوتين في حساب Gmail
 * 2. إنشاء App Password:
 *    - اذهب إلى: https://myaccount.google.com/security
 *    - اختر "App passwords"
 *    - اختر "Mail" و "Other (custom name)"
 *    - اكتب "SanadXperts Website"
 *    - انسخ كلمة المرور المُنشأة (16 حرف)
 * 
 * 3. استبدل البيانات أعلاه:
 *    - SMTP_USERNAME: إيميلك في Gmail
 *    - SMTP_PASSWORD: App Password (ليس كلمة مرور Gmail العادية)
 */
?>