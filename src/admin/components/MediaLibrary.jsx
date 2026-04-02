import React, { useEffect, useState } from 'react';
import { listMedia, uploadMedia, fsDelete } from '../adminApi';
import { Trash2, ExternalLink, FileIcon, ImageIcon, RefreshCw, UploadCloud, AlertCircle } from 'lucide-react';

export default function MediaLibrary() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await listMedia();
      if (res?.ok) setFiles(res.files || []);
    } catch (err) {
      setError(err.message || 'فشل تحميل الملفات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const res = await uploadMedia(file);
      if (res?.ok) {
        await load();
      }
    } catch (err) {
      setError(err.message || 'فشل الرفع');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (filename) => {
    if (!window.confirm(`هل أنت متأكد من حذف الملف "${filename}"؟`)) return;
    
    setDeleting(filename);
    setError('');
    try {
      const res = await fsDelete('uploads', filename);
      if (res?.ok) {
        setFiles(prev => prev.filter(f => f.filename !== filename));
      } else {
        setError(res?.error || 'فشل حذف الملف');
      }
    } catch (err) {
      setError(err.message || 'خطأ في الاتصال بالخادم');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="media-library-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0">مكتبة الوسائط</h2>
          <p className="text-muted small">إدارة الصور والملفات المرفوعة على الموقع.</p>
        </div>
        <div>
          <label className={`premium-btn ${uploading ? 'disabled' : ''}`}>
             <UploadCloud size={18} />
             <span>{uploading ? 'جاري الرفع...' : 'رفع ملف جديد'}</span>
             <input type="file" className="d-none" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>
      </div>

      {error && (
        <div className="status-toast error mb-4">
           <AlertCircle size={20} />
           <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
           <RefreshCw className="spinner mx-auto" size={32} />
           <p className="mt-3">جاري تحميل الوسائط...</p>
        </div>
      ) : (
        <div className="media-grid">
          {files.map((f) => (
            <div className="media-card-premium" key={f.filename}>
              <div className="media-preview-box">
                {['jpg','jpeg','png','gif','webp'].includes(f.ext) ? (
                  <img src={f.url} alt={f.filename} />
                ) : (
                  <div className="file-icon-placeholder">
                    <FileIcon size={40} strokeWidth={1} />
                    <span className="file-ext">{f.ext.toUpperCase()}</span>
                  </div>
                )}
                <div className="media-actions-overlay">
                   <a href={f.url} target="_blank" rel="noreferrer" className="action-circle eye" title="عرض الملف">
                      <ExternalLink size={16} />
                   </a>
                   <button 
                     className="action-circle trash" 
                     onClick={() => handleDelete(f.filename)}
                     disabled={deleting === f.filename}
                     title="حذف الملف"
                   >
                      {deleting === f.filename ? <RefreshCw className="spinner" size={16} /> : <Trash2 size={16} />}
                   </button>
                </div>
              </div>
              <div className="media-info-box">
                <div className="media-name" title={f.filename}>{f.filename}</div>
                <div className="media-meta">{(f.size/1024).toFixed(1)} KB</div>
              </div>
            </div>
          ))}
          
          {files.length === 0 && (
            <div className="col-12 text-center py-5 glass-card">
              <ImageIcon size={48} className="text-muted mb-3" strokeWidth={1} />
              <p className="text-muted">لا توجد ملفات مرفوعة حالياً.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}