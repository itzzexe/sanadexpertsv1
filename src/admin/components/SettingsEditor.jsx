import React, { useEffect, useState } from 'react';
import { listContent, updateContent } from '../adminApi';

function ArrayEditor({ title, items = [], schema, onChange }) {
  const [local, setLocal] = useState(items);
  useEffect(() => setLocal(items || []), [items]);

  const updateItemField = (idx, key, value) => {
    const next = [...local];
    next[idx] = { ...(next[idx] || {}), [key]: value };
    setLocal(next);
    onChange(next);
  };

  const addItem = () => {
    const next = [...local, schema.reduce((acc, k) => ({ ...acc, [k]: '' }), {})];
    setLocal(next);
    onChange(next);
  };

  const removeItem = (idx) => {
    const next = local.filter((_, i) => i !== idx);
    setLocal(next);
    onChange(next);
  };

  return (
    <div className="mt-3">
      <div className="d-flex justify-content-between align-items-center">
        <strong>{title}</strong>
        <button className="btn btn-sm btn-outline-secondary" onClick={addItem}>Add</button>
      </div>
      {(local || []).map((it, i) => (
        <div key={i} className="row g-2 align-items-center mb-2">
          {schema.map((key) => (
            <div key={key} className="col-md-5">
              <input className="form-control" placeholder={key} value={it[key] ?? ''} onChange={(e) => updateItemField(i, key, e.target.value)} />
            </div>
          ))}
          <div className="col-md-2 text-end">
            <button className="btn btn-outline-danger" onClick={() => removeItem(i)}>Remove</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ThemeEditor({ theme = {}, onChange }) {
  const local = {
    mode: theme.mode || 'light',
    primaryColor: theme.primaryColor || '#d4af37',
    accentColor: theme.accentColor || '#d4af37',
    textColor: theme.textColor || '#000000',
    backgroundColor: theme.backgroundColor || '#ffffff',
  };

  const setField = (key, value) => {
    onChange({ ...local, [key]: value });
  };

  return (
    <div className="card mt-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <strong>Theme & Colors</strong>
          <span className="text-muted">تحكم بالألوان ونمط الواجهة</span>
        </div>
        <div className="row g-3">
          <div className="col-md-3">
            <label className="form-label">Mode</label>
            <select className="form-select" value={local.mode} onChange={(e) => setField('mode', e.target.value)}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">Primary Color</label>
            <input type="color" className="form-control form-control-color" value={local.primaryColor} onChange={(e) => setField('primaryColor', e.target.value)} />
          </div>
          <div className="col-md-3">
            <label className="form-label">Accent Color</label>
            <input type="color" className="form-control form-control-color" value={local.accentColor} onChange={(e) => setField('accentColor', e.target.value)} />
          </div>
          <div className="col-md-3">
            <label className="form-label">Text Color</label>
            <input type="color" className="form-control form-control-color" value={local.textColor} onChange={(e) => setField('textColor', e.target.value)} />
          </div>
          <div className="col-md-3">
            <label className="form-label">Background Color</label>
            <input type="color" className="form-control form-control-color" value={local.backgroundColor} onChange={(e) => setField('backgroundColor', e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SettingsEditor() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState({ socialLinks: [], quickLinks: [], theme: { mode: 'light', primaryColor: '#d4af37', accentColor: '#d4af37', textColor: '#000000', backgroundColor: '#ffffff' } });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const init = async () => {
      setError('');
      setLoading(true);
      try {
        const res = await listContent('settings');
        if (res?.ok) {
          setData({
            socialLinks: res.data.socialLinks || [],
            quickLinks: res.data.quickLinks || [],
            theme: res.data.theme || { mode: 'light', primaryColor: '#d4af37', accentColor: '#d4af37', textColor: '#000000', backgroundColor: '#ffffff' },
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

  const updateField = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const saveAll = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await updateContent('settings', data);
      if (res?.ok) {
        alert('Saved successfully');
      }
    } catch (err) {
      setError(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4">Loading settings...</div>;
  if (error) return <div className="alert alert-danger m-4">{error}</div>;

  return (
    <div className="container py-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Settings Editor</h3>
        <button className="btn btn-success" disabled={saving} onClick={saveAll}>{saving ? 'Saving...' : 'Save Changes'}</button>
      </div>
      <ArrayEditor title="Social Links" items={data.socialLinks} schema={["name", "url"]} onChange={(next) => updateField('socialLinks', next)} />
      <ArrayEditor title="Quick Links" items={data.quickLinks} schema={["name", "href"]} onChange={(next) => updateField('quickLinks', next)} />
      <ThemeEditor theme={data.theme} onChange={(next) => updateField('theme', next)} />
      <div className="mt-4">
        <h6>Preview JSON</h6>
        <pre className="bg-light p-3 border rounded" style={{ maxHeight: 300, overflow: 'auto' }}>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
}