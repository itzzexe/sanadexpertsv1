import React, { useEffect, useState } from 'react';
import ServicesEditor from './ServicesEditor.jsx';
import AboutEditor from './AboutEditor.jsx';
import ProjectsEditor from './ProjectsEditor.jsx';
import StaticEditor from './StaticEditor.jsx';
import SettingsEditor from './SettingsEditor.jsx';
import MediaLibrary from './MediaLibrary.jsx';
import FileManager from './FileManager.jsx';
import { listContent, updateContent } from '../adminApi.js';

function SectionNav({ active, onChange }) {
  const items = [
    { key: 'services', label: 'الخدمات' },
    { key: 'about', label: 'نبذة' },
    { key: 'projects', label: 'المشاريع' },
    { key: 'static', label: 'نصوص ثابتة' },
    { key: 'settings', label: 'الإعدادات' },
    { key: 'files', label: 'الملفات' },
    { key: 'media', label: 'الوسائط' },
    { key: 'preview', label: 'معاينة الموقع' },
    { key: 'raw', label: 'تحرير JSON' },
  ];
  return (
    <ul className="nav nav-pills flex-column flex-sm-row mb-3">
      {items.map((item) => (
        <li className="nav-item" key={item.key}>
          <button
            className={`nav-link ${active === item.key ? 'active' : ''}`}
            onClick={() => onChange(item.key)}
          >
            {item.label}
          </button>
        </li>
      ))}
    </ul>
  );
}

function RawJsonEditor() {
  const [type, setType] = useState('services');
  const [data, setData] = useState({ ar: null, en: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [arText, setArText] = useState('');
  const [enText, setEnText] = useState('');
  const [status, setStatus] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    setStatus('');
    try {
      const res = await listContent(type);
      if (res?.ok) {
        const d = res.data || {};
        setData({ ar: d.ar ?? {}, en: d.en ?? {} });
        setArText(JSON.stringify(d.ar ?? {}, null, 2));
        setEnText(JSON.stringify(d.en ?? {}, null, 2));
      } else {
        setError(res?.error || 'LOAD_FAILED');
      }
    } catch (e) {
      setError(e?.message || 'ERROR');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  function download(lang) {
    try {
      const text = lang === 'ar' ? arText : enText;
      const blob = new Blob([text], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}-${lang}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {}
  }

  async function save(lang) {
    setStatus('');
    setError('');
    try {
      if (lang === 'both') {
        const ar = JSON.parse(arText || '{}');
        const en = JSON.parse(enText || '{}');
        const res = await updateContent(type, { ar, en });
        if (res?.ok) setStatus('تم حفظ كلا اللغتين بنجاح');
        else setError(res?.error || 'SAVE_FAILED');
      } else if (lang === 'ar' || lang === 'en') {
        const payload = JSON.parse(lang === 'ar' ? arText || '{}' : enText || '{}');
        const res = await updateContent(type, payload, lang);
        if (res?.ok) setStatus(`تم حفظ لغة ${lang.toUpperCase()} بنجاح`);
        else setError(res?.error || 'SAVE_FAILED');
      }
    } catch (e) {
      setError(e?.message || 'JSON_PARSE_ERROR');
    }
  }

  function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (parsed && typeof parsed === 'object') {
          // توقع: { ar: {...}, en: {...} }
          if (parsed.ar) setArText(JSON.stringify(parsed.ar, null, 2));
          if (parsed.en) setEnText(JSON.stringify(parsed.en, null, 2));
          setStatus('تم تحميل الملف إلى المحرر');
        } else {
          setError('بنية الملف غير مدعومة');
        }
      } catch (err) {
        setError('فشل قراءة JSON من الملف');
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex align-items-center gap-3 mb-3">
          <div>
            <label className="form-label">نوع المحتوى</label>
            <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="services">services.json</option>
              <option value="about">about.json</option>
              <option value="projects">projects.json</option>
              <option value="static">static.json</option>
              <option value="settings">settings.json</option>
            </select>
          </div>
          <div>
            <label className="form-label">استيراد ملف JSON شامل</label>
            <input type="file" className="form-control" accept="application/json" onChange={handleFileUpload} />
          </div>
          <div className="ms-auto">
            {loading ? <span className="text-muted">جار التحميل...</span> : (
              <button className="btn btn-outline-secondary" onClick={load}>إعادة تحميل</button>
            )}
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {status && <div className="alert alert-success">{status}</div>}

        <div className="row g-3">
          <div className="col-md-6">
            <h6>العربية (ar)</h6>
            <textarea className="form-control" style={{ minHeight: 280, fontFamily: 'monospace' }} value={arText} onChange={(e) => setArText(e.target.value)} />
            <div className="d-flex gap-2 mt-2">
              <button className="btn btn-primary" onClick={() => save('ar')}>حفظ العربية</button>
              <button className="btn btn-outline-secondary" onClick={() => download('ar')}>تنزيل العربية</button>
            </div>
          </div>
          <div className="col-md-6">
            <h6>English (en)</h6>
            <textarea className="form-control" style={{ minHeight: 280, fontFamily: 'monospace' }} value={enText} onChange={(e) => setEnText(e.target.value)} />
            <div className="d-flex gap-2 mt-2">
              <button className="btn btn-primary" onClick={() => save('en')}>Save English</button>
              <button className="btn btn-outline-secondary" onClick={() => download('en')}>Download English</button>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <button className="btn btn-success" onClick={() => save('both')}>حفظ كلا اللغتين معاً</button>
        </div>
      </div>
    </div>
  );
}

function SitePreview() {
  const [url, setUrl] = useState('');
  const [key, setKey] = useState(0);

  useEffect(() => {
    const basePath = window.location.pathname.replace(/[^\\/]+$/, ''); // keeps trailing slash
    setUrl(basePath);
  }, []);

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex align-items-center gap-2 mb-3">
          <div className="flex-grow-1">
            <label className="form-label">مسار المعاينة</label>
            <input className="form-control" value={url} readOnly />
          </div>
          <button className="btn btn-outline-secondary" onClick={() => setKey((k) => k + 1)}>إعادة تحميل</button>
          <a className="btn btn-primary" href={url} target="_blank" rel="noreferrer">فتح في نافذة جديدة</a>
        </div>
        <div className="border rounded" style={{ overflow: 'hidden' }}>
          {url ? (
            <iframe key={key} src={url} title="Site Preview" style={{ width: '100%', height: '75vh', border: '0' }} />
          ) : (
            <div className="text-muted">جار تحضير رابط المعاينة...</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function UnifiedEditor() {
  const [section, setSection] = useState('services');

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>محرر موحّد – التحكم الكامل بالمحتوى</h2>
        <span className="text-muted">إدارة شاملة لكل الأقسام والوسائط</span>
      </div>

      <SectionNav active={section} onChange={setSection} />

      {section === 'services' && <ServicesEditor />}
      {section === 'about' && <AboutEditor />}
      {section === 'projects' && <ProjectsEditor />}
      {section === 'static' && <StaticEditor />}
      {section === 'settings' && <SettingsEditor />}
      {section === 'files' && <FileManager />}
      {section === 'media' && <MediaLibrary />}
      {section === 'preview' && <SitePreview />}
      {section === 'raw' && <RawJsonEditor />}
    </div>
  );
}