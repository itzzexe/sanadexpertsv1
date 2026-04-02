-- SanadXperts Database Setup - Complete Installation
-- ملف إعداد قاعدة البيانات الكاملة لموقع سند إكسبرتس
-- يجب تشغيل هذا الملف في phpMyAdmin أو MySQL command line

-- إنشاء قاعدة البيانات (إذا لم تكن موجودة)
-- CREATE DATABASE IF NOT EXISTS sanadxperts_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE sanadxperts_db;

-- ===================================
-- جداول النظام الأساسية
-- ===================================

-- جدول المديرين
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `role` enum('admin','moderator') DEFAULT 'admin',
  `is_active` tinyint(1) DEFAULT 1,
  `last_login` timestamp NULL DEFAULT NULL,
  `failed_attempts` int(11) DEFAULT 0,
  `locked_until` timestamp NULL DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول جلسات المديرين
CREATE TABLE IF NOT EXISTS `admin_sessions` (
  `id` varchar(128) NOT NULL,
  `user_id` int(11) NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `expires_at` timestamp NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `expires_at` (`expires_at`),
  FOREIGN KEY (`user_id`) REFERENCES `admin_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول رسائل التواصل
CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `company` varchar(100) DEFAULT NULL,
  `service_type` varchar(50) DEFAULT NULL,
  `subject` varchar(200) NOT NULL,
  `message` text NOT NULL,
  `status` enum('new','read','replied','archived') DEFAULT 'new',
  `priority` enum('low','medium','high','urgent') DEFAULT 'medium',
  `admin_notes` text,
  `replied_at` timestamp NULL DEFAULT NULL,
  `replied_by` int(11) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `status` (`status`),
  KEY `priority` (`priority`),
  KEY `created_at` (`created_at`),
  KEY `replied_by` (`replied_by`),
  FOREIGN KEY (`replied_by`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول طلبات التوظيف
CREATE TABLE IF NOT EXISTS `recruitment_applications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `position` varchar(100) NOT NULL,
  `experience_years` int(11) DEFAULT NULL,
  `education` varchar(200) DEFAULT NULL,
  `skills` text,
  `cover_letter` text,
  `cv_filename` varchar(255) DEFAULT NULL,
  `cv_original_name` varchar(255) DEFAULT NULL,
  `cv_file_size` int(11) DEFAULT NULL,
  `status` enum('new','reviewing','shortlisted','interviewed','hired','rejected') DEFAULT 'new',
  `admin_notes` text,
  `reviewed_by` int(11) DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `status` (`status`),
  KEY `position` (`position`),
  KEY `created_at` (`created_at`),
  KEY `reviewed_by` (`reviewed_by`),
  FOREIGN KEY (`reviewed_by`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول إعدادات الموقع
CREATE TABLE IF NOT EXISTS `site_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` longtext,
  `setting_type` enum('text','number','boolean','json','html') DEFAULT 'text',
  `category` varchar(50) DEFAULT 'general',
  `description` text,
  `is_public` tinyint(1) DEFAULT 0,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`),
  KEY `category` (`category`),
  KEY `updated_by` (`updated_by`),
  FOREIGN KEY (`updated_by`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول سجل النشاطات
CREATE TABLE IF NOT EXISTS `activity_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `table_name` varchar(50) DEFAULT NULL,
  `record_id` int(11) DEFAULT NULL,
  `old_values` json DEFAULT NULL,
  `new_values` json DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `action` (`action`),
  KEY `table_name` (`table_name`),
  KEY `created_at` (`created_at`),
  FOREIGN KEY (`user_id`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- إدراج البيانات الأساسية
-- ===================================

-- إدراج المدير الافتراضي
INSERT INTO `admin_users` (`username`, `email`, `password_hash`, `full_name`, `role`, `is_active`) VALUES
('admin', 'admin@sanadxperts.com', '$2y$10$c8xgc4v6BiKyfK5jAJyszeZh7fI7Y5drTpQVXh7vZqk.nfsQiVZye', 'مدير النظام', 'admin', 1)
ON DUPLICATE KEY UPDATE 
`password_hash` = '$2y$10$c8xgc4v6BiKyfK5jAJyszeZh7fI7Y5drTpQVXh7vZqk.nfsQiVZye',
`updated_at` = CURRENT_TIMESTAMP;

-- إدراج الإعدادات الأساسية
INSERT INTO `site_settings` (`setting_key`, `setting_value`, `setting_type`, `category`, `description`, `is_public`) VALUES
('site_name', 'SanadXperts - خبراء السند', 'text', 'general', 'اسم الموقع', 1),
('site_description', 'شركة رائدة في مجال الاستشارات المالية، التكنولوجيا والابتكار، والاستشارات الإدارية', 'text', 'general', 'وصف الموقع', 1),
('contact_email', 'info@sanadxperts.com', 'text', 'contact', 'البريد الإلكتروني للتواصل', 1),
('contact_phone', '+966 XX XXX XXXX', 'text', 'contact', 'رقم الهاتف', 1),
('contact_address', 'المملكة العربية السعودية', 'text', 'contact', 'العنوان', 1),
('whatsapp_number', '+966XXXXXXXXX', 'text', 'contact', 'رقم الواتساب', 1),
('smtp_enabled', '1', 'boolean', 'email', 'تفعيل SMTP', 0),
('smtp_host', 'smtp.gmail.com', 'text', 'email', 'خادم SMTP', 0),
('smtp_port', '587', 'number', 'email', 'منفذ SMTP', 0),
('smtp_username', 'info@sanadxperts.com', 'text', 'email', 'اسم مستخدم SMTP', 0),
('maintenance_mode', '0', 'boolean', 'system', 'وضع الصيانة', 0),
('max_file_size', '10485760', 'number', 'system', 'الحد الأقصى لحجم الملف (بايت)', 0),
('allowed_file_types', 'pdf,doc,docx', 'text', 'system', 'أنواع الملفات المسموحة', 0)
ON DUPLICATE KEY UPDATE 
`setting_value` = VALUES(`setting_value`),
`updated_at` = CURRENT_TIMESTAMP;

-- ===================================
-- فهارس إضافية للأداء
-- ===================================

-- فهارس لجدول رسائل التواصل
CREATE INDEX IF NOT EXISTS `idx_contact_email` ON `contact_messages` (`email`);
CREATE INDEX IF NOT EXISTS `idx_contact_service` ON `contact_messages` (`service_type`);

-- فهارس لجدول طلبات التوظيف
CREATE INDEX IF NOT EXISTS `idx_recruitment_email` ON `recruitment_applications` (`email`);
CREATE INDEX IF NOT EXISTS `idx_recruitment_experience` ON `recruitment_applications` (`experience_years`);

-- فهارس لجدول سجل النشاطات
CREATE INDEX IF NOT EXISTS `idx_activity_date` ON `activity_logs` (`created_at` DESC);
CREATE INDEX IF NOT EXISTS `idx_activity_user_action` ON `activity_logs` (`user_id`, `action`);

-- ===================================
-- إعدادات قاعدة البيانات
-- ===================================

-- تحسين إعدادات MyISAM و InnoDB
SET GLOBAL innodb_buffer_pool_size = 268435456; -- 256MB
SET GLOBAL query_cache_size = 67108864; -- 64MB
SET GLOBAL query_cache_type = 1;

-- ===================================
-- إنشاء Views مفيدة
-- ===================================

-- عرض إحصائيات الرسائل
CREATE OR REPLACE VIEW `contact_stats` AS
SELECT 
    COUNT(*) as total_messages,
    SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as new_messages,
    SUM(CASE WHEN status = 'read' THEN 1 ELSE 0 END) as read_messages,
    SUM(CASE WHEN status = 'replied' THEN 1 ELSE 0 END) as replied_messages,
    SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as this_week,
    SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as this_month
FROM contact_messages;

-- عرض إحصائيات التوظيف
CREATE OR REPLACE VIEW `recruitment_stats` AS
SELECT 
    COUNT(*) as total_applications,
    SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as new_applications,
    SUM(CASE WHEN status = 'reviewing' THEN 1 ELSE 0 END) as under_review,
    SUM(CASE WHEN status = 'shortlisted' THEN 1 ELSE 0 END) as shortlisted,
    SUM(CASE WHEN status = 'hired' THEN 1 ELSE 0 END) as hired,
    SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as this_week,
    SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as this_month
FROM recruitment_applications;

-- ===================================
-- تنظيف البيانات القديمة (اختياري)
-- ===================================

-- حذف الجلسات المنتهية الصلاحية
DELETE FROM admin_sessions WHERE expires_at < NOW();

-- حذف سجل النشاطات الأقدم من 6 أشهر (اختياري)
-- DELETE FROM activity_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL 6 MONTH);

-- ===================================
-- رسالة النجاح
-- ===================================

SELECT 'تم إعداد قاعدة البيانات بنجاح!' as message,
       'Database setup completed successfully!' as message_en,
       NOW() as setup_time;

-- ملاحظات مهمة:
-- 1. كلمة مرور المدير الافتراضية: OMZ@2025
-- 2. يجب تحديث إعدادات SMTP في ملف smtp_config.php
-- 3. يجب تحديث إعدادات قاعدة البيانات في ملف config.php
-- 4. تأكد من صلاحيات الكتابة على مجلد uploads
-- 5. تأكد من تفعيل SSL على الخادم