import React, { useEffect, useState } from 'react';
import { listContent, updateContent } from '../adminApi';

function ProjectItemEditor({ item, onChange, onRemove }) {
  const [local, setLocal] = useState(item);
  useEffect(() => setLocal(item), [item]);

  const updateField = (field, value) => {
    const next = { ...local, [field]: value };
    setLocal(next);
    onChange(next);
  };

  const updateImage = (idx, value) => {
    const images = [...(local.images || [])];
    images[idx] = value;
    updateField('images', images);
  };

  const addImage = () => {
    updateField('images', [...(local.images || []), '']);
  };

  const removeImage = (idx) => {
    const images = (local.images || []).filter((_, i) => i !== idx);
    updateField('images', images);
  };

  return (
    <div className="border rounded p-3 mb-3">
      <div className="row g-2">
        <div className="col-md-1">
          <input className="form-control" value={local.id ?? ''} onChange={(e) => updateField('id', Number(e.target.value))} placeholder="ID" />
        </div>
        <div className="col-md-3">
          <input className="form-control" value={local.title ?? ''} onChange={(e) => updateField('title', e.target.value)} placeholder="Title" />
        </div>
        <div className="col-md-2">
          <input className="form-control" value={local.category ?? ''} onChange={(e) => updateField('category', e.target.value)} placeholder="Category" />
        </div>
        <div className="col-md-6">
          <input className="form-control" value={local.description ?? ''} onChange={(e) => updateField('description', e.target.value)} placeholder="Description" />
        </div>
      </div>

      <div className="mt-2">
        <div className="d-flex justify-content-between align-items-center">
          <strong>Images</strong>
          <button className="btn btn-sm btn-outline-secondary" onClick={addImage}>Add Image</button>
        </div>
        {(local.images || []).map((img, i) => (
          <div className="input-group input-group-sm mb-1" key={i}>
            <input className="form-control" value={img} onChange={(e) => updateImage(i, e.target.value)} placeholder="/uploads/image.jpg" />
            <button className="btn btn-outline-danger" onClick={() => removeImage(i)}>Remove</button>
          </div>
        ))}
      </div>

      <div className="text-end">
        <button className="btn btn-sm btn-outline-danger" onClick={onRemove}>Delete</button>
      </div>
    </div>
  );
}

export default function ProjectsEditor() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState({ ar: [], en: [] });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const init = async () => {
      setError('');
      setLoading(true);
      try {
        const res = await listContent('projects');
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
    const next = { id: Date.now(), title: '', category: '', description: '', images: [] };
    setData((prev) => ({ ...prev, [lang]: [...prev[lang], next] }));
  };

  const saveAll = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await updateContent('projects', data);
      if (res?.ok) {
        alert('Saved successfully');
      }
    } catch (err) {
      setError(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4">Loading projects...</div>;
  if (error) return <div className="alert alert-danger m-4">{error}</div>;

  return (
    <div className="container py-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Projects Editor</h3>
        <button className="btn btn-success" disabled={saving} onClick={saveAll}>{saving ? 'Saving...' : 'Save Changes'}</button>
      </div>
      <div className="row">
        <div className="col-md-6">
          <div className="d-flex justify-content-between align-items-center">
            <h5>Arabic</h5>
            <button className="btn btn-sm btn-outline-primary" onClick={() => addItem('ar')}>Add Item</button>
          </div>
          {data.ar.map((item, idx) => (
            <ProjectItemEditor key={item.id || idx} item={item} onChange={(next) => updateItem('ar', idx, next)} onRemove={() => removeItem('ar', idx)} />
          ))}
        </div>
        <div className="col-md-6">
          <div className="d-flex justify-content-between align-items-center">
            <h5>English</h5>
            <button className="btn btn-sm btn-outline-primary" onClick={() => addItem('en')}>Add Item</button>
          </div>
          {data.en.map((item, idx) => (
            <ProjectItemEditor key={item.id || idx} item={item} onChange={(next) => updateItem('en', idx, next)} onRemove={() => removeItem('en', idx)} />
          ))}
        </div>
      </div>
      <div className="mt-4">
        <h6>Preview JSON</h6>
        <pre className="bg-light p-3 border rounded" style={{ maxHeight: 300, overflow: 'auto' }}>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
}