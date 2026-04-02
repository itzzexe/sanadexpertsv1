import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import Login from './admin/components/Login.jsx';
import Dashboard from './admin/components/Dashboard.jsx';
import ServicesEditor from './admin/components/ServicesEditor.jsx';
import MediaLibrary from './admin/components/MediaLibrary.jsx';
import AboutEditor from './admin/components/AboutEditor.jsx';
import ProjectsEditor from './admin/components/ProjectsEditor.jsx';
import StaticEditor from './admin/components/StaticEditor.jsx';
import SettingsEditor from './admin/components/SettingsEditor.jsx';
import UnifiedEditor from './admin/components/UnifiedEditor.jsx';
import JobsEditor from './admin/components/JobsEditor.jsx';
import LayoutEditor from './admin/components/LayoutEditor.jsx';
import VisualEditor from './admin/components/VisualEditor.jsx';
import { me, logout } from './admin/adminApi.js';
import { 
  LayoutDashboard, 
  Settings, 
  Briefcase, 
  Image as ImageIcon, 
  FileText, 
  Layers, 
  Eye, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Monitor,
  Database,
  Info,
  Grid
} from 'lucide-react';
import './admin/Admin.css';

function AdminApp() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  async function init() {
    try {
      const res = await me();
      if (res?.ok) setUser(res.user);
    } catch {}
    setLoading(false);
  }

  useEffect(() => { init(); }, []);

  async function handleLogout() {
    try {
      await logout();
      setUser(null);
      setView('login');
    } catch {}
  }

  if (loading) return (
    <div className="admin-loading">
      <div className="spinner"></div>
      <p>جاري تحميل لوحة التحكم...</p>
    </div>
  );

  if (!user || view === 'login') return <Login onSuccess={(u) => { setUser(u); setView('dashboard'); }} />;

  const menuItems = [
    { id: 'dashboard', label: 'الرئيسية', icon: <LayoutDashboard size={20} />, category: 'main' },
    { id: 'visual', label: 'المحرر البصري', icon: <Monitor size={20} />, category: 'main', premium: true },
    { id: 'layout', label: 'ترتيب الأقسام', icon: <Layers size={20} />, category: 'content' },
    { id: 'services', label: 'الخدمات', icon: <Grid size={20} />, category: 'content' },
    { id: 'projects', label: 'المشاريع', icon: <Briefcase size={20} />, category: 'content' },
    { id: 'jobs', label: 'الوظائف', icon: <Briefcase size={20} />, category: 'content' },
    { id: 'about', label: 'نبذة عنا', icon: <Info size={20} />, category: 'content' },
    { id: 'static', label: 'نصوص الصفحة', icon: <FileText size={20} />, category: 'content' },
    { id: 'media', label: 'مكتبة الوسائط', icon: <ImageIcon size={20} />, category: 'system' },
    { id: 'settings', label: 'إعدادات الموقع', icon: <Settings size={20} />, category: 'system' },
    { id: 'raw', label: 'قاعدة البيانات JSON', icon: <Database size={20} />, category: 'system' },
  ];

  const renderContent = () => {
    switch (view) {
      case 'dashboard': return <Dashboard user={user} onNavigate={setView} onLogout={handleLogout} />;
      case 'visual': return <VisualEditor />;
      case 'layout': return <LayoutEditor />;
      case 'services': return <ServicesEditor />;
      case 'projects': return <ProjectsEditor />;
      case 'jobs': return <JobsEditor />;
      case 'about': return <AboutEditor />;
      case 'static': return <StaticEditor />;
      case 'media': return <MediaLibrary />;
      case 'settings': return <SettingsEditor />;
      case 'raw': return <UnifiedEditor section="raw" />;
      default: return <Dashboard user={user} onNavigate={setView} onLogout={handleLogout} />;
    }
  };

  return (
    <div className={`admin-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">S</div>
            <span className="logo-text">Sanad Admin</span>
          </div>
          <button className="collapse-toggle" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
            {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-group">
            {menuItems.filter(i => i.category === 'main').map(item => (
              <button 
                key={item.id} 
                className={`nav-item ${view === item.id ? 'active' : ''} ${item.premium ? 'premium' : ''}`}
                onClick={() => setView(item.id)}
              >
                {item.icon}
                <span className="nav-label">{item.label}</span>
                {item.premium && <span className="premium-badge">NEW</span>}
              </button>
            ))}
          </div>

          <div className="nav-separator">المحتوى</div>
          
          <div className="nav-group">
            {menuItems.filter(i => i.category === 'content').map(item => (
              <button 
                key={item.id} 
                className={`nav-item ${view === item.id ? 'active' : ''}`}
                onClick={() => setView(item.id)}
              >
                {item.icon}
                <span className="nav-label">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="nav-separator">النظام</div>

          <div className="nav-group">
            {menuItems.filter(i => i.category === 'system').map(item => (
              <button 
                key={item.id} 
                className={`nav-item ${view === item.id ? 'active' : ''}`}
                onClick={() => setView(item.id)}
              >
                {item.icon}
                <span className="nav-label">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="avatar">{user.username[0].toUpperCase()}</div>
            <div className="user-details">
              <div className="username">{user.username}</div>
              <div className="role">{user.role}</div>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="تسجيل الخروج">
            <LogOut size={20} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="main-header">
           <div className="header-title">
             {menuItems.find(i => i.id === view)?.label || 'Dashboard'}
           </div>
           <div className="header-actions">
             <a href="/" target="_blank" className="view-site-btn">
               <Eye size={18} />
               <span>معاينة الموقع</span>
             </a>
           </div>
        </header>
        <div className="content-viewport">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('admin-root')).render(
  <React.StrictMode>
    <AdminApp />
  </React.StrictMode>
);