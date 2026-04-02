// خدمة إدارة المحتوى
// تتعامل مع جلب وتحديث المحتوى من الخادم أو الملفات المحلية
// في الإنتاج، نستخدم المسار النسبي /backend/api. في التطوير، نستخدم localhost.
const PHP_API_BASE_URL = import.meta.env.VITE_PHP_API_BASE_URL || '/api';

export async function getServices(lang = 'ar') {
  try {
    const res = await fetch(`${PHP_API_BASE_URL}/content.php?type=services&lang=${lang}`);
    const data = await res.json();
    return data?.ok ? data.data : [];
  } catch (err) {
    console.error("Error fetching services:", err);
    return [];
  }
}

export async function getAbout(lang = 'ar') {
  try {
    const res = await fetch(`${PHP_API_BASE_URL}/content.php?type=about&lang=${lang}`);
    const data = await res.json();
    return data?.ok ? data.data : null;
  } catch (err) {
    console.error("Error fetching about:", err);
    return null;
  }
}

export async function getProjects(lang = 'ar') {
  try {
    const res = await fetch(`${PHP_API_BASE_URL}/content.php?type=projects&lang=${lang}`);
    const data = await res.json();
    return data?.ok ? data.data : [];
  } catch (err) {
    console.error("Error fetching projects:", err);
    return [];
  }
}

export async function getStaticContent(lang = 'ar') {
  try {
    const res = await fetch(`${PHP_API_BASE_URL}/content.php?type=static&lang=${lang}`);
    const data = await res.json();
    return data?.ok ? data.data : {};
  } catch (err) {
    console.error("Error fetching static content:", err);
    return {};
  }
}

export async function getSettings(lang = 'ar') {
  try {
    const res = await fetch(`${PHP_API_BASE_URL}/content.php?type=settings&lang=${lang}`);
    const data = await res.json();
    return data?.ok ? data.data : {};
  } catch (err) {
    console.error("Error fetching settings:", err);
    return {};
  }
}

export default {
  getServices,
  getAbout,
  getProjects,
  getStaticContent,
  getSettings
};