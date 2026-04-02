import React from 'react';
import { 
  LayoutDashboard, 
  Monitor, 
  Layers, 
  Settings, 
  Briefcase, 
  ImageIcon, 
  FileText, 
  ArrowRight,
  TrendingUp,
  Users,
  Eye
} from 'lucide-react';

export default function Dashboard({ user, onNavigate, onLogout }) {
  const stats = [
    { label: 'الزيارات اليوم', value: '1,280', icon: <TrendingUp size={20} />, color: '#3498db' },
    { label: 'طلبات التوظيف', value: '12', icon: <Users size={20} />, color: '#27ae60' },
    { label: 'الخدمات النشطة', value: '8', icon: <Layers size={20} />, color: '#f1c40f' },
  ];

  return (
    <div className="admin-dashboard">
      <div className="welcome-banner glass-card mb-4">
        <div className="welcome-text">
          <h1>مرحباً بك، {user?.username} 👋</h1>
          <p>إليك نظرة سريعة على ما يحدث في موقع "سند إكسبرتس" اليوم.</p>
        </div>
        <div className="welcome-action">
          <button className="premium-btn" onClick={() => onNavigate('visual')}>
            <Monitor size={18} />
            <span>ابدأ التحرير البصري</span>
          </button>
        </div>
      </div>

      <div className="stats-grid mb-4">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card glass-card">
            <div className="stat-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <span className="stat-label">{stat.label}</span>
              <span className="stat-value">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      <h4 className="mb-3">إجراءات سريعة</h4>
      <div className="quick-actions-grid">
        <div className="action-card-modern" onClick={() => onNavigate('layout')}>
          <div className="action-icon"><Layers size={24} /></div>
          <h5>ترتيب الصفحة</h5>
          <p>إعادة ترتيب أقسام الصفحة الرئيسية بالسحب والإفلات.</p>
          <ArrowRight className="arrow" size={18} />
        </div>

        <div className="action-card-modern" onClick={() => onNavigate('projects')}>
          <div className="action-icon"><Briefcase size={24} /></div>
          <h5>إضافة مشاريع</h5>
          <p>قم بتحديث معرض أعمال الشركة وأحدث الإنجازات.</p>
          <ArrowRight className="arrow" size={18} />
        </div>

        <div className="action-card-modern" onClick={() => onNavigate('media')}>
          <div className="action-icon"><ImageIcon size={24} /></div>
          <h5>مكتبة الصور</h5>
          <p>إدارة ورفع الصور والملفات المستخدمة في الموقع.</p>
          <ArrowRight className="arrow" size={18} />
        </div>

        <div className="action-card-modern" onClick={() => onNavigate('settings')}>
          <div className="action-icon"><Settings size={24} /></div>
          <h5>إعدادات الموقع</h5>
          <p>تغيير روابط التواصل الاجتماعي والمعلومات العامة.</p>
          <ArrowRight className="arrow" size={18} />
        </div>
      </div>

      <div className="dashboard-footer mt-5 text-center text-muted">
        <p>© 2026 سناد إكسبرتس - نظام إدارة المحتوى المطور</p>
      </div>
    </div>
  );
}