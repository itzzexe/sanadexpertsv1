import React, { useState } from 'react';
import { login } from '../adminApi';

export default function Login({ onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await login(username, password);
      if (res?.ok) {
        onSuccess(res.user);
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="mb-3">تسجيل دخول الأدمن</h3>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">اسم المستخدم</label>
                  <input 
                    className="form-control" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">كلمة المرور</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button className="btn btn-primary w-100" disabled={loading}>
                  {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}