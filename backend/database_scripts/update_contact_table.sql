-- تحديث جدول contact_messages لإضافة عمود المرفقات
-- تشغيل هذا الاستعلام إذا كان الجدول موجود بالفعل

ALTER TABLE contact_messages 
ADD COLUMN attachment_path VARCHAR(500) DEFAULT NULL 
AFTER subject;