import React, { useEffect, useMemo, useState } from 'react';
import { fsList, fsRead, fsWrite, fsDelete, fsUpload } from '../adminApi.js';

const ROOTS = [
  { key: 'content', label: 'content/' },
  { key: 'locales', label: 'locales/' },
  { key: 'docs', label: 'docs/' },
  { key: 'components', label: 'components/' },
  { key: 'assets_images', label: 'assets/images/' },
  { key: 'assets_video', label: 'assets/video/' },
  { key: 'dist', label: 'dist/' },
];

const BINARY_PREVIEWABLE = ['png','jpg','jpeg','gif','svg','mp4','webm'];
const WEB_BASE = 'http://localhost/sanad%20123/';
const ROOT_WEB_PATH = {
  content: 'content',
  locales: 'locales',
  docs: 'docs',
  components: 'components',
  assets_images: 'assets/images',
  assets_video: 'assets/video',
  dist: 'dist',
};

function Breadcrumb({ path, onNav }) {
  const parts = useMemo(() => (path ? path.split('/').filter(Boolean) : []), [path]);
  const crumbs = [{ name: 'الصفحة الرئيسية', path: '' }];
  let acc = '';
  for (const p of parts) {
    acc = acc ? `${acc}/${p}` : p;
    crumbs.push({ name: p, path: acc });
  }
  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        {crumbs.map((c, i) => (
          <li key={c.path} className={`breadcrumb-item ${i === crumbs.length - 1 ? 'active' : ''}`} aria-current={i === crumbs.length - 1 ? 'page' : undefined}>
            {i === crumbs.length - 1 ? c.name : (
              <button className="btn btn-link p-0" onClick={() => onNav(c.path)}>{c.name}</button>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function FileRow({ item, onOpen, onDelete }) {
  const isDir = item.type === 'dir';
  return (
    <tr>
      <td style={{ width: 32 }}>
        {isDir ? '📁' : '📄'}
      </td>
      <td>
        <button className="btn btn-link p-0" onClick={() => onOpen(item)}>{item.name}</button>
      </td>
      <td>{isDir ? '-' : (item.ext || '').toUpperCase()}</td>
      <td>{isDir ? '-' : (item.size ?? 0)}</td>
      <td>{item.mtime ? new Date(item.mtime * 1000).toLocaleString() : '-'}</td>
      <td className="text-end">
        {!isDir && (
          <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(item)}>
            حذف
          </button>
        )}
      </td>
    </tr>
  );
}

export default function FileManager() {
  const [root, setRoot] = useState('content');
  const [path, setPath] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [text, setText] = useState('');
  const [status, setStatus] = useState('');

  async function refresh() {
    setLoading(true); setError(''); setStatus(''); setSelected(null); setText('');
    try {
      const res = await fsList(root, path);
      if (res?.ok) setItems(res.items || []);
      else setError(res?.error || 'LOAD_FAILED');
    } catch (e) {
      setError(e?.message || 'ERROR');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); /* eslint-disable-next-line */ }, [root, path]);

  async function openItem(item) {
    if (item.type === 'dir') {
      setPath(path ? `${path}/${item.name}` : item.name);
      return;
    }
    setStatus(''); setError(''); setSelected(item); setText('');
    try {
      const res = await fsRead(root, path ? `${path}/${item.name}` : item.name);
      if (res?.ok) {
        if (res.binary) {
          setText('');
        } else {
          setText(res.content || '');
        }
      } else {
        setError(res?.error || 'READ_FAILED');
      }
    } catch (e) {
      setError(e?.message || 'ERROR');
    }
  }

  async function save() {
    if (!selected || !text) return;
    setStatus(''); setError('');
    try {
      const rel = path ? `${path}/${selected.name}` : selected.name;
      const res = await fsWrite(root, rel, text);
      if (res?.ok) setStatus('تم الحفظ بنجاح'); else setError(res?.error || 'SAVE_FAILED');
    } catch (e) { setError(e?.message || 'ERROR'); }
  }

  async function deleteItem(item) {
    if (!confirm(`تأكيد حذف ${item.name}?`)) return;
    setStatus(''); setError('');
    try {
      const rel = path ? `${path}/${item.name}` : item.name;
      const res = await fsDelete(root, rel);
      if (res?.ok) { setStatus('تم الحذف'); refresh(); if (selected?.name === item.name) setSelected(null); }
      else setError(res?.error || 'DELETE_FAILED');
    } catch (e) { setError(e?.message || 'ERROR'); }
  }

  function goUp() {
    if (!path) return;
    const parts = path.split('/').filter(Boolean);
    parts.pop();
    setPath(parts.join('/'));
  }

  function canUpload() {
    return root !== 'dist';
  }

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus(''); setError('');
    try {
      const res = await fsUpload(root, path, file);
      if (res?.ok) { setStatus(`تم رفع ${res.name}`); refresh(); }
      else setError(res?.error || 'UPLOAD_FAILED');
    } catch (e) { setError(e?.message || 'ERROR'); }
    e.target.value = '';
  }

  function newFile() {
    const name = prompt('اسم الملف (مثال: data.json أو note.md)');
    if (!name) return;
    setStatus(''); setError('');
    const rel = path ? `${path}/${name}` : name;
    fsWrite(root, rel, '')
      .then((res) => { if (res?.ok) { setStatus('تم إنشاء الملف'); refresh(); } else setError(res?.error || 'CREATE_FAILED'); })
      .catch((e) => setError(e?.message || 'ERROR'));
  }

  const webPreviewUrl = useMemo(() => {
    if (!selected || selected.type === 'dir') return '';
    const ext = (selected.ext || '').toLowerCase();
    if (!BINARY_PREVIEWABLE.includes(ext)) return '';
    const base = ROOT_WEB_PATH[root];
    if (!base) return '';
    const rel = path ? `${path}/${selected.name}` : selected.name;
    return `${WEB_BASE}${base}/${rel}`;
  }, [selected, root, path]);

  return (
    <div className="row g-3">
      <div className="col-lg-6">
        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-center gap-3 mb-3">
              <div>
                <label className="form-label">الجذر</label>
                <select className="form-select" value={root} onChange={(e) => { setPath(''); setRoot(e.target.value); }}>
                  {ROOTS.map((r) => (<option key={r.key} value={r.key}>{r.label}</option>))}
                </select>
              </div>
              <div className="ms-auto d-flex gap-2">
                <button className="btn btn-outline-secondary" onClick={goUp} disabled={!path}>للأعلى</button>
                <button className="btn btn-outline-secondary" onClick={refresh} disabled={loading}>{loading ? 'جار التحميل...' : 'تحديث'}</button>
                <button className="btn btn-outline-primary" onClick={newFile}>ملف جديد</button>
                {canUpload() && (
                  <label className="btn btn-primary mb-0">
                    رفع ملف
                    <input type="file" hidden onChange={handleUpload} />
                  </label>
                )}
              </div>
            </div>

            <Breadcrumb path={path} onNav={setPath} />

            {error && <div className="alert alert-danger">{error}</div>}
            {status && <div className="alert alert-success">{status}</div>}

            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th></th>
                    <th>الاسم</th>
                    <th>الامتداد</th>
                    <th>الحجم</th>
                    <th>آخر تعديل</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <FileRow key={item.name} item={item} onOpen={openItem} onDelete={deleteItem} />
                  ))}
                  {items.length === 0 && (
                    <tr><td colSpan={6} className="text-center text-muted">لا توجد عناصر هنا</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-6">
        <div className="card">
          <div className="card-body">
            {!selected && <div className="text-muted">اختر ملفاً لعرضه أو تحريره</div>}
            {selected && selected.type === 'dir' && <div className="text-muted">هذا مجلد – استخدم القائمة على اليسار للتنقل.</div>}
            {selected && selected.type === 'file' && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="mb-0">{selected.name}</h6>
                  <div className="text-muted small">{(selected.ext || '').toUpperCase()}</div>
                </div>
                {webPreviewUrl ? (
                  <div className="mb-3">
                    {selected.ext === 'svg' ? (
                      <img src={webPreviewUrl} alt={selected.name} style={{ maxWidth: '100%', height: 'auto' }} />
                    ) : selected.ext === 'mp4' || selected.ext === 'webm' ? (
                      <video src={webPreviewUrl} controls style={{ maxWidth: '100%' }} />
                    ) : (
                      <img src={webPreviewUrl} alt={selected.name} style={{ maxWidth: '100%', height: 'auto' }} />
                    )}
                  </div>
                ) : null}

                {text !== '' ? (
                  <textarea className="form-control" style={{ minHeight: 280, fontFamily: 'monospace' }} value={text} onChange={(e) => setText(e.target.value)} />
                ) : (
                  <div className="alert alert-info">هذا الملف ثنائي أو غير قابل للتحرير كنص هنا.</div>
                )}

                <div className="d-flex gap-2 mt-2">
                  {text !== '' && <button className="btn btn-primary" onClick={save}>حفظ</button>}
                  <button className="btn btn-outline-danger" onClick={() => deleteItem(selected)}>حذف</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}