-- قاعدة بيانات SanadXperts - نسخة متوافقة مع cPanel
-- تأكد من إنشاء قاعدة البيانات من لوحة التحكم أولاً

-- جدول رسائل التواصل
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    service VARCHAR(255) DEFAULT NULL,
    subject VARCHAR(500) DEFAULT NULL,
    attachment_path VARCHAR(500) DEFAULT NULL,
    status ENUM('new', 'read', 'replied', 'closed') DEFAULT 'new',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_created_at (created_at)
);

-- جدول طلبات التوظيف
CREATE TABLE IF NOT EXISTS recruitment_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    position VARCHAR(255) NOT NULL,
    experience INT NOT NULL DEFAULT 0,
    cover_letter TEXT,
    cv_path VARCHAR(500),
    status ENUM('pending', 'reviewing', 'interview', 'accepted', 'rejected') DEFAULT 'pending',
    notes TEXT,
    applied_date DATE DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_position (position),
    INDEX idx_status (status),
    INDEX idx_experience (experience),
    INDEX idx_applied_date (applied_date),
    INDEX idx_created_at (created_at)
);

-- جدول المستخدمين الإداريين
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role ENUM('admin', 'manager', 'hr', 'viewer') DEFAULT 'viewer',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    login_attempts INT DEFAULT 0,
    locked_until TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_is_active (is_active)
);

-- جدول جلسات المستخدمين
CREATE TABLE IF NOT EXISTS user_sessions (
    id VARCHAR(128) PRIMARY KEY,
    user_id INT NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_expires_at (expires_at),
    INDEX idx_is_active (is_active)
);

-- جدول سجل الأنشطة
CREATE TABLE IF NOT EXISTS activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_table_name (table_name),
    INDEX idx_created_at (created_at)
);

-- جدول إعدادات النظام
CREATE TABLE IF NOT EXISTS system_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_setting_key (setting_key),
    INDEX idx_is_public (is_public)
);

-- جدول الملفات المرفوعة
CREATE TABLE IF NOT EXISTS uploaded_files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    original_name VARCHAR(255) NOT NULL,
    stored_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT NOT NULL,
    mime_type VARCHAR(100),
    file_extension VARCHAR(10),
    related_table VARCHAR(100),
    related_id INT,
    uploaded_by INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES admin_users(id) ON DELETE SET NULL,
    INDEX idx_stored_name (stored_name),
    INDEX idx_related_table_id (related_table, related_id),
    INDEX idx_uploaded_by (uploaded_by),
    INDEX idx_is_active (is_active)
);

-- إدراج المستخدم الإداري الافتراضي
INSERT INTO admin_users (username, password_hash, email, full_name, role) 
VALUES ('admin', '$2y$10$c8xgc4v6BiKyfK5jAJyszeZh7fI7Y5drTpQVXh7vZqk.nfsQiVZye', 'admin@sanadxperts.com', 'مدير النظام', 'admin')
ON DUPLICATE KEY UPDATE username = username;

-- إدراج إعدادات النظام الافتراضية
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('site_name', 'SanadXperts', 'string', 'اسم الموقع', TRUE),
('site_email', 'info@sanadxperts.com', 'string', 'البريد الإلكتروني للموقع', TRUE),
('site_phone', '+966123456789', 'string', 'رقم هاتف الموقع', TRUE),
('max_file_size', '5242880', 'number', 'الحد الأقصى لحجم الملف بالبايت (5MB)', FALSE),
('allowed_file_types', '["pdf","doc","docx","jpg","jpeg","png"]', 'json', 'أنواع الملفات المسموحة', FALSE),
('email_notifications', 'true', 'boolean', 'تفعيل إشعارات البريد الإلكتروني', FALSE),
('maintenance_mode', 'false', 'boolean', 'وضع الصيانة', FALSE)
ON DUPLICATE KEY UPDATE setting_key = setting_key;

-- إنشاء فهارس إضافية لتحسين الأداء
CREATE INDEX idx_contact_messages_composite ON contact_messages(status, priority, created_at);
CREATE INDEX idx_recruitment_applications_composite ON recruitment_applications(status, position, created_at);
CREATE INDEX idx_activity_logs_composite ON activity_logs(user_id, action, created_at);

-- إنشاء views مفيدة
CREATE OR REPLACE VIEW v_recent_contacts AS
SELECT 
    id,
    name,
    email,
    phone,
    service,
    status,
    priority,
    created_at
FROM contact_messages 
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
ORDER BY created_at DESC;

CREATE OR REPLACE VIEW v_active_applications AS
SELECT 
    id,
    full_name,
    email,
    position,
    experience,
    status,
    applied_date,
    created_at
FROM recruitment_applications 
WHERE status IN ('pending', 'reviewing', 'interview')
ORDER BY created_at DESC;

CREATE OR REPLACE VIEW v_admin_dashboard_stats AS
SELECT 
    (SELECT COUNT(*) FROM contact_messages WHERE status = 'new') as new_messages,
    (SELECT COUNT(*) FROM recruitment_applications WHERE status = 'pending') as pending_applications,
    (SELECT COUNT(*) FROM contact_messages WHERE DATE(created_at) = CURDATE()) as today_messages,
    (SELECT COUNT(*) FROM recruitment_applications WHERE DATE(created_at) = CURDATE()) as today_applications;