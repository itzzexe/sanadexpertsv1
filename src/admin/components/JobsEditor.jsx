import React, { useEffect, useState } from 'react';
import { listContent, updateContent } from '../adminApi';

function JobItemEditor({ item, onChange, onRemove, dragProps }) {
  const [local, setLocal] = useState(item);
  useEffect(() => setLocal(item), [item]);

  const updateField = (field, value) => {
    const next = { ...local, [field]: value };
    setLocal(next);
    onChange(next);
  };

  return (
    <div className="border rounded p-3 mb-3" {...(dragProps || {})}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <span className="badge bg-secondary" style={{ cursor: 'grab' }}>⠿ Drag</span>
        <button className="btn btn-sm btn-outline-danger" onClick={onRemove}>Delete</button>
      </div>
      <div className="row g-2">
        <div className="col-md-2">
          <input className="form-control" value={local.id ?? ''} onChange={(e) => updateField('id', e.target.value)} placeholder="ID / Job Code" />
        </div>
        <div className="col-md-4">
          <input className="form-control" value={local.title ?? ''} onChange={(e) => updateField('title', e.target.value)} placeholder="Job Title" />
        </div>
        <div className="col-md-3">
          <input className="form-control" value={local.department ?? ''} onChange={(e) => updateField('department', e.target.value)} placeholder="Department" />
        </div>
        <div className="col-md-3">
          <input className="form-control" value={local.type ?? ''} onChange={(e) => updateField('type', e.target.value)} placeholder="Type (e.g. Full-time)" />
        </div>
        <div className="col-md-4">
          <input className="form-control" value={local.location ?? ''} onChange={(e) => updateField('location', e.target.value)} placeholder="Location" />
        </div>
        <div className="col-md-8">
          <textarea className="form-control" value={local.description ?? ''} onChange={(e) => updateField('description', e.target.value)} placeholder="Job Description (Can be multi-line)" rows="3" />
        </div>
      </div>
    </div>
  );
}

export default function JobsEditor() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState({ ar: [], en: [] });
  const [saving, setSaving] = useState(false);
  const [dragInfo, setDragInfo] = useState({ lang: null, fromIdx: null });

  useEffect(() => {
    const init = async () => {
      setError('');
      setLoading(true);
      try {
        const res = await listContent('jobs');
        if (res?.ok) {
          setData({ ar: res.data.ar || [], en: res.data.en || [] });
        }
      } catch (err) {
        setError(err.message || 'Failed to load content');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const updateItem = (lang, idx, next) => {
    setData((prev) => ({ ...prev, [lang]: prev[lang].map((it, i) => (i === idx ? next : it)) }));
  };

  const removeItem = (lang, idx) => {
    setData((prev) => ({ ...prev, [lang]: prev[lang].filter((_, i) => i !== idx) }));
  };

  const addItem = (lang) => {
    const next = { id: `JOB-${Date.now()}`, title: '', department: '', type: '', location: '', description: '' };
    setData((prev) => ({ ...prev, [lang]: [...prev[lang], next] }));
  };

  const onDragStart = (lang, idx) => {
    setDragInfo({ lang, fromIdx: idx });
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (lang, toIdx) => {
    setData((prev) => {
      if (dragInfo.lang !== lang || dragInfo.fromIdx === null) return prev;
      const arr = [...prev[lang]];
      const [moved] = arr.splice(dragInfo.fromIdx, 1);
      arr.splice(toIdx, 0, moved);
      return { ...prev, [lang]: arr };
    });
    setDragInfo({ lang: null, fromIdx: null });
  };

  const saveAll = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await updateContent('jobs', data);
      if (res?.ok) {
        alert('Saved successfully');
      }
    } catch (err) {
      setError(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4">Loading jobs...</div>;
  if (error) return <div className="alert alert-danger m-4">{error}</div>;

  return (
    <div className="container py-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Jobs Editor</h3>
        <button className="btn btn-success" disabled={saving} onClick={saveAll}>{saving ? 'Saving...' : 'Save Changes'}</button>
      </div>
      <div className="row">
        <div className="col-md-6">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5>Arabic</h5>
            <button className="btn btn-sm btn-outline-primary" onClick={() => addItem('ar')}>Add Job</button>
          </div>
          {data.ar.map((item, idx) => (
            <JobItemEditor
              key={item.id || idx}
              item={item}
              onChange={(next) => updateItem('ar', idx, next)}
              onRemove={() => removeItem('ar', idx)}
              dragProps={{
                draggable: true,
                onDragStart: () => onDragStart('ar', idx),
                onDragOver,
                onDrop: () => onDrop('ar', idx),
              }}
            />
          ))}
        </div>
        <div className="col-md-6">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5>English</h5>
            <button className="btn btn-sm btn-outline-primary" onClick={() => addItem('en')}>Add Job</button>
          </div>
          {data.en.map((item, idx) => (
            <JobItemEditor
              key={item.id || idx}
              item={item}
              onChange={(next) => updateItem('en', idx, next)}
              onRemove={() => removeItem('en', idx)}
              dragProps={{
                draggable: true,
                onDragStart: () => onDragStart('en', idx),
                onDragOver,
                onDrop: () => onDrop('en', idx),
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
