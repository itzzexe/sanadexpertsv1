import React, { useState, useEffect } from 'react';
import { listContent, updateContent } from '../adminApi';
import { GripVertical, Eye, EyeOff, Save, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { motion, Reorder } from 'framer-motion';

const SECTION_LABELS = {
  hero: { ar: 'البطل (Hero)', en: 'Hero Section' },
  services_banners: { ar: 'بانرات الخدمات', en: 'Services Banners' },
  services: { ar: 'الأقسام والخدمات', en: 'Services List' },
  work_process: { ar: 'خطوات العمل', en: 'Work Process' },
  why_us: { ar: 'لماذا نحن؟', en: 'Why Choose Us' },
  about: { ar: 'من نحن', en: 'About Us' },
  contact: { ar: 'اتصل بنا', en: 'Contact Us' }
};

export default function LayoutEditor() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    loadLayout();
  }, []);

  async function loadLayout() {
    setLoading(true);
    try {
      const res = await listContent('layout');
      if (res?.ok && res.data?.homepage) {
        setSections(res.data.homepage);
      } else {
        // Default layout if fetch fails or empty
        setSections(['hero', 'services_banners', 'services', 'work_process', 'why_us', 'about', 'contact']);
      }
    } catch (err) {
      console.error('Failed to load layout:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setStatus({ type: '', message: '' });
    try {
      const res = await updateContent('layout', { homepage: sections });
      if (res?.ok) {
        setStatus({ type: 'success', message: 'تم حفظ ترتيب الأقسام بنجاح!' });
        setTimeout(() => setStatus({ type: '', message: '' }), 3000);
      } else {
        setStatus({ type: 'error', message: 'فشل في حفظ التغييرات. يرجى المحاولة لاحقاً.' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'خطأ في الاتصال بالخادم.' });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return (
    <div className="p-5 text-center">
      <RefreshCw className="spinner mx-auto mb-3" />
      <p>جاري تحميل هيكل الصفحة...</p>
    </div>
  );

  return (
    <div className="layout-editor-container">
      <div className="editor-header">
        <div className="header-info">
          <h3>ترتيب أقسام الصفحة الرئيسية</h3>
          <p>قم بسحب وإفلات الأقسام لتغيير ترتيب ظهورها في الموقع.</p>
        </div>
        <button 
          className="premium-btn save-layout-btn" 
          onClick={handleSave} 
          disabled={saving}
        >
          {saving ? <RefreshCw className="spinner" size={18} /> : <Save size={18} />}
          <span>حفظ الترتيب الحالي</span>
        </button>
      </div>

      {status.message && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className={`status-toast ${status.type}`}
        >
          {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span>{status.message}</span>
        </motion.div>
      )}

      <div className="layout-editor-grid">
        <div className="sections-list-wrapper">
          <Reorder.Group axis="y" values={sections} onReorder={setSections} className="sections-reorder-list">
            {sections.map((sectionId) => (
              <Reorder.Item 
                key={sectionId} 
                value={sectionId}
                className="section-reorder-item"
                whileDrag={{ scale: 1.02, boxShadow: "0 10px 25px rgba(0,0,0,0.15)" }}
              >
                <div className="drag-handle">
                  <GripVertical size={20} />
                </div>
                <div className="section-info">
                  <span className="section-name">{SECTION_LABELS[sectionId]?.ar || sectionId}</span>
                  <span className="section-id">{sectionId}</span>
                </div>
                <div className="section-actions">
                   {/* Can add eye/hide here later */}
                   <Eye size={18} title="مرئي في الموقع" className="text-secondary" />
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>

        <div className="layout-preview-sidebar">
          <div className="preview-card glass-card">
            <h5>معاينة الهيكل</h5>
            <div className="structure-preview">
              {sections.map((id, idx) => (
                <div key={id} className="structure-step">
                   <div className="step-num">{idx + 1}</div>
                   <div className="step-name">{SECTION_LABELS[id]?.ar || id}</div>
                </div>
              ))}
              <div className="structure-step footer-step">
                 <div className="step-num">F</div>
                 <div className="step-name">تذييل الصفحة (Footer)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
