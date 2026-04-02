import React, { useState, useEffect, useRef } from 'react';
import { listContent, updateContent, uploadMedia } from '../adminApi';
import { 
  Monitor, 
  Smartphone, 
  Tablet, 
  Save, 
  RefreshCw, 
  ChevronRight, 
  ChevronLeft,
  Search,
  Type,
  Image as ImageIcon,
  Edit2,
  Layers,
  Settings,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Globe,
  Palette,
  Layout,
  ExternalLink,
  Undo
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SITE_PARTS = [
  { id: 'layout', label: 'بنية الصفحة وهيكلها', icon: <Layers size={18} />, file: 'layout' },
  { id: 'static', label: 'القسم الرئيسي (Hero)', icon: <Layout size={18} />, file: 'static' },
  { id: 'services', label: 'الخدمات والأقسام', icon: <Plus size={18} />, file: 'services' },
  { id: 'about', label: 'محتوى "من نحن"', icon: <Edit2 size={18} />, file: 'about' },
  { id: 'projects', label: 'معرض المشاريع', icon: <ImageIcon size={18} />, file: 'projects' },
  { id: 'settings', label: 'التذييل والمعلومات', icon: <Settings size={18} />, file: 'settings' }
];

export default function VisualEditor() {
  const [activePart, setActivePart] = useState('static');
  const [viewport, setViewport] = useState('desktop');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [lang, setLang] = useState('ar');
  const [iframeKey, setIframeKey] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState('');

  const iframeRef = useRef(null);

  useEffect(() => {
    loadPartContent();
  }, [activePart]);

  async function loadPartContent() {
    setLoading(true);
    try {
      const res = await listContent(activePart);
      if (res?.ok) {
        setData(res.data || {});
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handlePublish() {
    setLoading(true);
    setStatus('جاري الحفظ والتحميل...');
    try {
      const res = await updateContent(activePart, data);
      if (res?.ok) {
        setStatus('تم النشر بنجاح!');
        setIframeKey(k => k + 1); // Refresh preview
        setTimeout(() => setStatus(''), 3000);
      }
    } catch (err) {
      console.error(err);
      setStatus('خطأ في الحفظ!');
    } finally {
      setLoading(false);
    }
  }

  const handleFieldChange = (key, value, subIndex = null, subKey = null) => {
    const newData = JSON.parse(JSON.stringify(data)); // Deep clone
    
    // Content can be i18n or flat (like layout)
    const target = (newData[lang] || (activePart === 'layout' ? newData : null));
    
    if (!target) return;

    if (subIndex !== null && subKey !== null) {
      if (!Array.isArray(target[key])) target[key] = [];
      if (!target[key][subIndex]) target[key][subIndex] = {};
      target[key][subIndex][subKey] = value;
    } else if (subKey !== null) {
      if (!target[key]) target[key] = {};
      target[key][subKey] = value;
    } else {
      target[key] = value;
    }
    
    if (activePart === 'layout') {
        setData(newData);
    } else {
        newData[lang] = target;
        setData(newData);
    }
  };

  const renderSectionTools = () => {
    const content = (activePart === 'layout' ? data : data[lang]) || {};

    switch (activePart) {
      case 'static':
        return (
          <div className="builder-group">
            <h5>إعدادات الهيرو (Hero)</h5>
            <div className="field">
              <label>العنوان الرئيسي</label>
              <input value={content.hero_title || ''} onChange={e => handleFieldChange('hero_title', e.target.value)} />
            </div>
            <div className="field">
              <label>العنوان الفرعي</label>
              <textarea value={content.hero_subtitle || ''} onChange={e => handleFieldChange('hero_subtitle', e.target.value)} />
            </div>
            <div className="field">
              <label>نص زر الدعوة للإجراء (CTA)</label>
              <input value={content.hero_cta || ''} onChange={e => handleFieldChange('hero_cta', e.target.value)} />
            </div>
          </div>
        );
      case 'layout':
        return (
          <div className="builder-group">
            <h5>هيكل الصفحة الرئيسية</h5>
            <p className="small text-muted">قم بتغيير ترتيب الأقسام هنا.</p>
            <div className="layout-stack-small">
              {(content.homepage || []).map((id, idx) => (
                <div key={id} className="mini-section-card">
                  <span>{id}</span>
                  <div className="controls">
                    <button onClick={() => moveLayout(idx, -1)} disabled={idx===0}><ArrowUp size={14}/></button>
                    <button onClick={() => moveLayout(idx, 1)} disabled={idx===(content.homepage.length-1)}><ArrowDown size={14}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'about':
        return (
          <div className="builder-group">
            <h5>محتوى من نحن</h5>
            <div className="field">
              <label>العنوان</label>
              <input value={content.title || ''} onChange={e => handleFieldChange('title', e.target.value)} />
            </div>
            <div className="field">
              <label>المحتوى</label>
              <textarea rows="8" value={content.description || ''} onChange={e => handleFieldChange('description', e.target.value)} />
            </div>
            {content.mission && (
              <div className="field">
                <label>مهمتنا</label>
                <textarea value={content.mission?.content || ''} onChange={e => handleFieldChange('mission', e.target.value, null, 'content')} />
              </div>
            )}
          </div>
        );
      case 'settings':
         return (
           <div className="builder-group">
              <h5>معلومات الموقع</h5>
              <div className="field">
                 <label>رقم الهاتف</label>
                 <input value={content.contact?.phone || ''} onChange={e => handleFieldChange('contact', e.target.value, null, 'phone')} />
              </div>
              <div className="field">
                 <label>البريد الإلكتروني</label>
                 <input value={content.contact?.email || ''} onChange={e => handleFieldChange('contact', e.target.value, null, 'email')} />
              </div>
              <h5>روابط سريعة (Quick Links)</h5>
              {/* Simplified for demo, can map array here */}
           </div>
         );
      default:
        return <div className="text-center p-4">يرجى استخدام المحرر المتخصص لبيانات الجداول المعقدة.</div>;
    }
  };

  const moveLayout = (index, dir) => {
    const newH = [...data.homepage];
    const item = newH.splice(index, 1)[0];
    newH.splice(index + dir, 0, item);
    setData({ ...data, homepage: newH });
  };

  return (
    <div className={`site-builder ${collapsed ? 'collapsed' : ''}`}>
      {/* Top Admin Bar (WP Style) */}
      <div className="builder-top-bar">
         <div className="builder-brand">
           <Globe size={20} className="text-gold" />
           <span>SanadXperts Builder</span>
         </div>
         <div className="builder-top-center">
            <div className="viewport-switcher">
              <button className={viewport === 'desktop' ? 'active' : ''} onClick={() => setViewport('desktop')}><Monitor size={18} /></button>
              <button className={viewport === 'tablet' ? 'active' : ''} onClick={() => setViewport('tablet')}><Tablet size={18} /></button>
              <button className={viewport === 'mobile' ? 'active' : ''} onClick={() => setViewport('mobile')}><Smartphone size={18} /></button>
            </div>
         </div>
         <div className="builder-top-actions">
            <button className="preview-btn" onClick={() => window.open('/', '_blank')}>
               <ExternalLink size={16} />
               <span>معاينة الموقع</span>
            </button>
            <button className="publish-btn" onClick={handlePublish} disabled={loading}>
               {loading ? <RefreshCw className="spinner" size={16} /> : <Save size={16} />}
               <span>نشر التغييرات</span>
            </button>
         </div>
      </div>

      <div className="builder-canvas">
        {/* Left Toolbar (Elementor/WP Style) */}
        <div className="builder-sidebar">
          <div className="sidebar-sections-nav">
             {SITE_PARTS.map(part => (
               <button 
                 key={part.id} 
                 className={`nav-btn ${activePart === part.id ? 'active' : ''}`}
                 onClick={() => setActivePart(part.id)}
                 title={part.label}
               >
                 {part.icon}
               </button>
             ))}
          </div>

          <div className="sidebar-editing-panel">
            <div className="panel-header-v2">
              <div className="panel-info">
                 <h4>{SITE_PARTS.find(p => p.id === activePart)?.label}</h4>
                 <div className="lang-toggle-small">
                   <button className={lang === 'ar' ? 'active' : ''} onClick={() => setLang('ar')}>AR</button>
                   <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
                 </div>
              </div>
            </div>

            <div className="fields-stack">
              {status && <div className="builder-alert success">{status}</div>}
              {loading ? (
                <div className="loading-state">
                  <RefreshCw className="spinner" size={32} />
                  <p>جاري تحميل البيانات...</p>
                </div>
              ) : renderSectionTools()}
            </div>

            <div className="panel-footer-v2">
               <button className="undo-btn"><Undo size={16} /> تراجع</button>
               <button className="help-btn">تحتاج مساعدة؟</button>
            </div>
          </div>
        </div>

        {/* The Live Canvas */}
        <div className="builder-preview">
           <div className={`canvas-wrapper vp-${viewport}`}>
              <iframe 
                key={iframeKey}
                ref={iframeRef}
                src="/" 
                title="Visual Preview" 
                className="live-iframe" 
              />
           </div>
        </div>
      </div>
    </div>
  );
}
