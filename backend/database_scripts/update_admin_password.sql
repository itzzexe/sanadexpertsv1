-- تحديث كلمة مرور المدير إلى OMZ@2025
-- يجب تشغيل هذا الاستعلام في قاعدة البيانات إذا كان المدير موجود بالفعل

UPDATE admin_users 
SET password_hash = '$2y$10$c8xgc4v6BiKyfK5jAJyszeZh7fI7Y5drTpQVXh7vZqk.nfsQiVZye',
    updated_at = CURRENT_TIMESTAMP
WHERE username = 'admin';

-- للتحقق من نجاح التحديث
SELECT username, email, full_name, role, updated_at 
FROM admin_users 
WHERE username = 'admin';