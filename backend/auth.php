<?php
/**
 * ملف المصادقة وإدارة الجلسات
 * Authentication and Session Management
 */

require_once __DIR__ . '/config.php';

class AuthManager {
    private $db;
    
    public function __construct() {
        $this->db = getDbConnection();
    }
    
    /**
     * تسجيل دخول المستخدم
     */
    public function login($username, $password) {
        try {
            // التحقق من محاولات تسجيل الدخول
            if ($this->isAccountLocked($username)) {
                return ['success' => false, 'message' => 'الحساب مقفل مؤقتاً بسبب محاولات دخول متعددة'];
            }
            
            $stmt = $this->db->prepare("
                SELECT id, username, password_hash, email, full_name, role, is_active, failed_attempts 
                FROM admin_users 
                WHERE username = ? AND is_active = 1
            ");
            $stmt->execute([$username]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($user && password_verify($password, $user['password_hash'])) {
                // تسجيل دخول ناجح
                $this->resetLoginAttempts($username);
                $this->updateLastLogin($user['id']);
                $this->createSession($user);
                $this->logActivity($user['id'], 'login', 'admin_users', $user['id']);
                
                return [
                    'success' => true, 
                    'user' => [
                        'id' => $user['id'],
                        'username' => $user['username'],
                        'email' => $user['email'],
                        'full_name' => $user['full_name'],
                        'role' => $user['role']
                    ]
                ];
            } else {
                // تسجيل دخول فاشل
                $this->incrementLoginAttempts($username);
                return ['success' => false, 'message' => 'اسم المستخدم أو كلمة المرور غير صحيحة'];
            }
        } catch (Exception $e) {
            logError("Login error: " . $e->getMessage());
            return ['success' => false, 'message' => 'خطأ في النظام'];
        }
    }
    
    /**
     * تسجيل خروج المستخدم
     */
    public function logout() {
        if (isset($_SESSION['user_id'])) {
            $this->logActivity($_SESSION['user_id'], 'logout', 'admin_users', $_SESSION['user_id']);
            $this->destroySession($_SESSION['session_id']);
        }
        
        session_destroy();
        return ['success' => true, 'message' => 'تم تسجيل الخروج بنجاح'];
    }
    
    /**
     * التحقق من صحة الجلسة
     */
    public function validateSession() {
        if (!isset($_SESSION['user_id']) || !isset($_SESSION['session_id'])) {
            return false;
        }
        
        try {
            $stmt = $this->db->prepare("
                SELECT us.*, au.username, au.role, au.is_active 
                FROM admin_sessions us 
                JOIN admin_users au ON us.user_id = au.id 
                WHERE us.id = ? AND us.is_active = 1 AND us.expires_at > NOW() AND au.is_active = 1
            ");
            $stmt->execute([$_SESSION['session_id']]);
            $session = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($session) {
                // تحديث وقت انتهاء الجلسة
                $this->extendSession($_SESSION['session_id']);
                return true;
            } else {
                $this->logout();
                return false;
            }
        } catch (Exception $e) {
            logError("Session validation error: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * التحقق من الصلاحيات
     */
    public function hasPermission($requiredRole) {
        if (!$this->validateSession()) {
            return false;
        }
        
        $roleHierarchy = ['viewer' => 1, 'hr' => 2, 'manager' => 3, 'admin' => 4];
        $userRole = $_SESSION['user_role'] ?? 'viewer';
        
        return ($roleHierarchy[$userRole] ?? 0) >= ($roleHierarchy[$requiredRole] ?? 0);
    }
    
    /**
     * إنشاء جلسة جديدة
     */
    private function createSession($user) {
        $sessionId = bin2hex(random_bytes(32));
        $expiresAt = date('Y-m-d H:i:s', time() + SESSION_TIMEOUT);
        
        $stmt = $this->db->prepare("
            INSERT INTO admin_sessions (id, user_id, ip_address, user_agent, expires_at) 
            VALUES (?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $sessionId,
            $user['id'],
            $_SERVER['REMOTE_ADDR'] ?? '',
            $_SERVER['HTTP_USER_AGENT'] ?? '',
            $expiresAt
        ]);
        
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['user_role'] = $user['role'];
        $_SESSION['session_id'] = $sessionId;
    }
    
    /**
     * تمديد الجلسة
     */
    private function extendSession($sessionId) {
        $expiresAt = date('Y-m-d H:i:s', time() + SESSION_TIMEOUT);
        
        $stmt = $this->db->prepare("UPDATE admin_sessions SET expires_at = ? WHERE id = ?");
        $stmt->execute([$expiresAt, $sessionId]);
    }
    
    /**
     * إنهاء الجلسة
     */
    private function destroySession($sessionId) {
        $stmt = $this->db->prepare("UPDATE admin_sessions SET is_active = 0 WHERE id = ?");
        $stmt->execute([$sessionId]);
    }
    
    /**
     * التحقق من قفل الحساب
     */
    private function isAccountLocked($username) {
        $stmt = $this->db->prepare("
            SELECT failed_attempts, locked_until 
            FROM admin_users 
            WHERE username = ?
        ");
        $stmt->execute([$username]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user) {
            if ($user['locked_until'] && strtotime($user['locked_until']) > time()) {
                return true;
            }
            
            if ($user['failed_attempts'] >= 5) {
                // قفل الحساب لمدة 30 دقيقة
                $lockUntil = date('Y-m-d H:i:s', time() + 1800);
                $stmt = $this->db->prepare("UPDATE admin_users SET locked_until = ? WHERE username = ?");
                $stmt->execute([$lockUntil, $username]);
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * زيادة محاولات تسجيل الدخول
     */
    private function incrementLoginAttempts($username) {
        $stmt = $this->db->prepare("
            UPDATE admin_users 
            SET failed_attempts = failed_attempts + 1 
            WHERE username = ?
        ");
        $stmt->execute([$username]);
    }
    
    /**
     * إعادة تعيين محاولات تسجيل الدخول
     */
    private function resetLoginAttempts($username) {
        $stmt = $this->db->prepare("
            UPDATE admin_users 
            SET failed_attempts = 0, locked_until = NULL 
            WHERE username = ?
        ");
        $stmt->execute([$username]);
    }
    
    /**
     * تحديث آخر تسجيل دخول
     */
    private function updateLastLogin($userId) {
        $stmt = $this->db->prepare("UPDATE admin_users SET last_login = NOW() WHERE id = ?");
        $stmt->execute([$userId]);
    }
    
    /**
     * تسجيل النشاط
     */
    private function logActivity($userId, $action, $tableName = null, $recordId = null, $oldValues = null, $newValues = null) {
        try {
            $stmt = $this->db->prepare("
                INSERT INTO activity_logs (user_id, action, table_name, record_id, old_values, new_values, ip_address, user_agent) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $userId,
                $action,
                $tableName,
                $recordId,
                $oldValues ? json_encode($oldValues) : null,
                $newValues ? json_encode($newValues) : null,
                $_SERVER['REMOTE_ADDR'] ?? '',
                $_SERVER['HTTP_USER_AGENT'] ?? ''
            ]);
        } catch (Exception $e) {
            logError("Activity logging error: " . $e->getMessage());
        }
    }
    
    /**
     * تنظيف الجلسات المنتهية الصلاحية
     */
    public function cleanupExpiredSessions() {
        try {
            $stmt = $this->db->prepare("DELETE FROM admin_sessions WHERE expires_at < NOW()");
            $stmt->execute();
        } catch (Exception $e) {
            logError("Session cleanup error: " . $e->getMessage());
        }
    }
}

// بدء الجلسة
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// إنشاء مثيل من مدير المصادقة
$authManager = new AuthManager();

// تنظيف الجلسات المنتهية الصلاحية (بشكل عشوائي)
if (rand(1, 100) <= 5) { // 5% احتمال
    $authManager->cleanupExpiredSessions();
}

/**
 * دالة للتحقق من تسجيل الدخول
 */
function requireLogin($redirectUrl = 'login.php') {
    global $authManager;
    if (!$authManager->validateSession()) {
        header("Location: $redirectUrl");
        exit;
    }
}

/**
 * دالة للتحقق من الصلاحيات
 */
function requirePermission($role, $redirectUrl = 'unauthorized.php') {
    global $authManager;
    if (!$authManager->hasPermission($role)) {
        header("Location: $redirectUrl");
        exit;
    }
}
?>