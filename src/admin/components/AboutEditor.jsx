import React, { useEffect, useState } from 'react';
import { listContent, updateContent } from '../adminApi';

function PrinciplesEditor({ values = [], onChange }) {
  const [items, setItems] = useState(values);
  useEffect(() => setItems(values || []), [values]);

  const updateItem = (idx, value) => {
    const next = [...items];
    next[idx] = value;
    setItems(next);
    onChange(next);
  };
  const addItem = () => {
    const next = [...items, ''];
    setItems(next);
    onChange(next);
  };
  const removeItem = (idx) => {
    const next = items.filter((_, i) => i !== idx);
    setItems(next);
    onChange(next);
  };

  return (
    <div className="mt-2">
      <div className="d-flex justify-content-between align-items-center">
        <strong>Principles</strong>
        <button className="btn btn-sm btn-outline-secondary" onClick={addItem}>Add</button>
      </div>
      {(items || []).map((val, i) => (
        <div key={i} className="input-group input-group-sm mb-1">
          <input className="form-control" value={val} onChange={(e) => updateItem(i, e.target.value)} />
          <button className="btn btn-outline-danger" onClick={() => removeItem(i)}>Remove</button>
        </div>
      ))}
    </div>
  );
}

function AchievementsEditor({ values = {}, onChange }) {
  const [local, setLocal] = useState(values);
  useEffect(() => setLocal(values || {}), [values]);

  const updateField = (key, value) => {
    const next = { ...local, [key]: value };
    setLocal(next);
    onChange(next);
  };

  const fields = [
    { key: 'projects', label: 'Projects' },
    { key: 'experience', label: 'Experience' },
    { key: 'clients', label: 'Clients' },
    { key: 'satisfaction', label: 'Satisfaction' },
  ];

  return (
    <div className="mt-2">
      <strong>Achievements</strong>
      <div className="row g-2 mt-1">
        {fields.map(({ key, label }) => (
          <div key={key} className="col-md-6">
            <div className="input-group input-group-sm">
              <span className="input-group-text" style={{ minWidth: 120 }}>{label}</span>
              <input className="form-control" value={local[key] ?? ''} onChange={(e) => updateField(key, e.target.value)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AboutEditor() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState({
    ar: { description: '', goal: '', principles: [], achievements: {} },
    en: { description: '', goal: '', principles: [], achievements: {} },
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const init = async () => {
      setError('');
      setLoading(true);
      try {
        const res = await listContent('about');
        if (res?.ok) {
          setData({
            ar: res.data.ar || { description: '', goal: '', principles: [], achievements: {} },
            en: res.data.en || { description: '', goal: '', principles: [], achievements: {} },
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

  const updateLangField = (lang, key, value) => {
    setData((prev) => ({ ...prev, [lang]: { ...prev[lang], [key]: value } }));
  };

  const saveAll = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await updateContent('about', data);
      if (res?.ok) {
        alert('Saved successfully');
      }
    } catch (err) {
      setError(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4">Loading about...</div>;
  if (error) return <div className="alert alert-danger m-4">{error}</div>;

  const LangEditor = ({ lang, title }) => (
    <div className="border p-3 rounded mb-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="mb-0">{title}</h5>
      </div>
      <div className="mb-2">
        <label className="form-label">Description</label>
        <textarea className="form-control" rows={3} value={data[lang]?.description ?? ''} onChange={(e) => updateLangField(lang, 'description', e.target.value)} />
      </div>
      <div className="mb-2">
        <label className="form-label">Goal</label>
        <textarea className="form-control" rows={2} value={data[lang]?.goal ?? ''} onChange={(e) => updateLangField(lang, 'goal', e.target.value)} />
      </div>
      <PrinciplesEditor values={data[lang]?.principles || []} onChange={(next) => updateLangField(lang, 'principles', next)} />
      <AchievementsEditor values={data[lang]?.achievements || {}} onChange={(next) => updateLangField(lang, 'achievements', next)} />
    </div>
  );

  return (
    <div className="container py-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>About Editor</h3>
        <button className="btn btn-success" disabled={saving} onClick={saveAll}>{saving ? 'Saving...' : 'Save Changes'}</button>
      </div>
      <div className="row">
        <div className="col-md-6">
          <LangEditor lang="ar" title="Arabic" />
        </div>
        <div className="col-md-6">
          <LangEditor lang="en" title="English" />
        </div>
      </div>
      <div className="mt-4">
        <h6>Preview JSON</h6>
        <pre className="bg-light p-3 border rounded" style={{ maxHeight: 300, overflow: 'auto' }}>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
}