const PHP_API_BASE_URL = import.meta.env.VITE_PHP_API_BASE_URL || '/api';

let csrfToken = null;

export function setCsrf(token) {
  csrfToken = token;
}

async function jsonFetch(url, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const headers = {
    ...(method !== 'GET' ? { 'Content-Type': 'application/json' } : {}),
    ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
    ...(options.headers || {}),
  };
  const opts = {
    credentials: 'include',
    headers,
    ...options,
  };
  const res = await fetch(url, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.ok === false) {
    const msg = data.error || `HTTP_${res.status}`;
    throw new Error(msg);
  }
  return data;
}

export async function login(username, password) {
  const url = `${PHP_API_BASE_URL}/admin/login.php`;
  const data = await jsonFetch(url, {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  if (data?.csrf_token) setCsrf(data.csrf_token);
  return data;
}

export async function me() {
  const url = `${PHP_API_BASE_URL}/admin/me.php`;
  const data = await jsonFetch(url, { method: 'GET' });
  if (data?.csrf_token) setCsrf(data.csrf_token);
  return data;
}

export async function logout() {
  const url = `${PHP_API_BASE_URL}/admin/logout.php`;
  return jsonFetch(url, { method: 'POST' });
}

export async function listContent(type) {
  const url = `${PHP_API_BASE_URL}/admin/listContent.php?type=${encodeURIComponent(type)}`;
  return jsonFetch(url, { method: 'GET' });
}

export async function updateContent(type, payload, lang) {
  const url = `${PHP_API_BASE_URL}/admin/updateContent.php`;
  const body = { type, data: payload };
  if (lang) body.lang = lang;
  return jsonFetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function listMedia() {
  const url = `${PHP_API_BASE_URL}/admin/listMedia.php`;
  return jsonFetch(url, { method: 'GET' });
}

export async function fsList(root, path = '') {
  const url = `${PHP_API_BASE_URL}/admin/fsList.php?root=${encodeURIComponent(root)}&path=${encodeURIComponent(path || '')}`;
  return jsonFetch(url, { method: 'GET' });
}

export async function fsRead(root, path) {
  const url = `${PHP_API_BASE_URL}/admin/fsRead.php?root=${encodeURIComponent(root)}&path=${encodeURIComponent(path)}`;
  return jsonFetch(url, { method: 'GET' });
}

export async function fsWrite(root, path, content) {
  const url = `${PHP_API_BASE_URL}/admin/fsWrite.php`;
  return jsonFetch(url, {
    method: 'POST',
    body: JSON.stringify({ root, path, content }),
  });
}

export async function fsDelete(root, path) {
  const url = `${PHP_API_BASE_URL}/admin/fsDelete.php`;
  return jsonFetch(url, {
    method: 'POST',
    body: JSON.stringify({ root, path }),
  });
}

export async function fsUpload(root, path, file) {
  const url = `${PHP_API_BASE_URL}/admin/fsUpload.php`;
  const form = new FormData();
  form.append('root', root);
  form.append('path', path || '');
  form.append('file', file);
  const res = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: csrfToken ? { 'X-CSRF-Token': csrfToken } : {},
    body: form,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.ok === false) {
    throw new Error(data.error || `HTTP_${res.status}`);
  }
  return data;
}

export async function uploadMedia(file) {
  const url = `${PHP_API_BASE_URL}/admin/uploadMedia.php`;
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: csrfToken ? { 'X-CSRF-Token': csrfToken } : {},
    body: form,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.ok === false) {
    throw new Error(data.error || `HTTP_${res.status}`);
  }
  return data;
}