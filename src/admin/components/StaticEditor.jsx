import React, { useEffect, useState } from 'react';
import { listContent, updateContent } from '../adminApi';

function LangStaticEditor({ lang, data, onChange, title }) {
  const [local, setLocal] = useState(data);
  useEffect(() => setLocal(data || { hero_title: '', hero_subtitle: '', cta_text: '', contact: {} }), [data]);

  const updateField = (key, value) => {
    const next = { ...local, [key]: value };
    setLocal(next);
    onChange(next);
  };

  const updateContact = (key, value) => {
    const next = { ...(local.contact || {}), [key]: value };
    updateField('contact', next);
  };

  return (
    <div className="border p-3 rounded mb-3">
      <h5 className="mb-2">{title}</h5>
      <div className="mb-2">
        <label className="form-label">Hero Title</label>
        <input className="form-control" value={local.hero_title ?? ''} onChange={(e) => updateField('hero_title', e.target.value)} />
      </div>
      <div className="mb-2">
        <label className="form-label">Hero Subtitle</label>
        <input className="form-control" value={local.hero_subtitle ?? ''} onChange={(e) => updateField('hero_subtitle', e.target.value)} />
      </div>
      <div className="mb-2">
        <label className="form-label">CTA Text</label>
        <input className="form-control" value={local.cta_text ?? ''} onChange={(e) => updateField('cta_text', e.target.value)} />
      </div>

      <div className="mt-2">
        <strong>Contact</strong>
        <div className="row g-2 mt-1">
          <div className="col-md-6">
            <div className="input-group input-group-sm">
              <span className="input-group-text" style={{ minWidth: 100 }}>Address</span>
              <input className="form-control" value={(local.contact || {}).address ?? ''} onChange={(e) => updateContact('address', e.target.value)} />
            </div>
          </div>
          <div className="col-md-6">
            <div className="input-group input-group-sm">
              <span className="input-group-text" style={{ minWidth: 100 }}>Phone</span>
              <input className="form-control" value={(local.contact || {}).phone ?? ''} onChange={(e) => updateContact('phone', e.target.value)} />
            </div>
          </div>
          <div className="col-md-6">
            <div className="input-group input-group-sm mt-1">
              <span className="input-group-text" style={{ minWidth: 100 }}>Email</span>
              <input className="form-control" value={(local.contact || {}).email ?? ''} onChange={(e) => updateContact('email', e.target.value)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StaticEditor() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState({
    ar: { hero_title: '', hero_subtitle: '', cta_text: '', contact: {} },
    en: { hero_title: '', hero_subtitle: '', cta_text: '', contact: {} },
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const init = async () => {
      setError('');
      setLoading(true);
      try {
        const res = await listContent('static');
        if (res?.ok) {
          setData({
            ar: res.data.ar || { hero_title: '', hero_subtitle: '', cta_text: '', contact: {} },
            en: res.data.en || { hero_title: '', hero_subtitle: '', cta_text: '', contact: {} },
          });
        }
      } catch (err) {
        setError(err.message || 'Failed to load content');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const updateLang = (lang, next) => {
    setData((prev) => ({ ...prev, [lang]: next }));
  };

  const saveAll = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await updateContent('static', data);
      if (res?.ok) {
        alert('Saved successfully');
      }
    } catch (err) {
      setError(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4">Loading static content...</div>;
  if (error) return <div className="alert alert-danger m-4">{error}</div>;

  return (
    <div className="container py-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Static Content Editor</h3>
        <button className="btn btn-success" disabled={saving} onClick={saveAll}>{saving ? 'Saving...' : 'Save Changes'}</button>
      </div>
      <div className="row">
        <div className="col-md-6">
          <LangStaticEditor lang="ar" title="Arabic" data={data.ar} onChange={(next) => updateLang('ar', next)} />
        </div>
        <div className="col-md-6">
          <LangStaticEditor lang="en" title="English" data={data.en} onChange={(next) => updateLang('en', next)} />
        </div>
      </div>
      <div className="mt-4">
        <h6>Preview JSON</h6>
        <pre className="bg-light p-3 border rounded" style={{ maxHeight: 300, overflow: 'auto' }}>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
}