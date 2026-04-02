// خدمة إرسال فورمات تعتمد على خادم PHP الخاص بنا
const PHP_API_BASE_URL = import.meta.env.VITE_PHP_API_BASE_URL || '/api';

// إرسال فورمة الاتصال
export const sendContactForm = async (formElement) => {
  try {
    const formData = new FormData(formElement);

    const res = await fetch(`${PHP_API_BASE_URL}/contact.php`, {
      method: 'POST',
      body: formData
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`CONNECTION_ERROR: ${text}`);
    }

    const json = await res.json();
    console.log('تم إرسال النموذج بنجاح:', json);

    if (!json.ok) {
      throw new Error(json.error || 'Failed to send email');
    }

    return { success: true, result: json };
  } catch (error) {
    console.error('خطأ في إرسال النموذج:', error);
    return { success: false, error };
  }
};

// إرسال فورمة التوظيف
export const sendRecruitmentForm = async (formElement) => {
  try {
    const formData = new FormData(formElement);

    const res = await fetch(`${PHP_API_BASE_URL}/recruitment.php`, {
      method: 'POST',
      body: formData
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`CONNECTION_ERROR: ${text}`);
    }

    const json = await res.json();
    console.log('تم إرسال طلب التوظيف بنجاح:', json);

    if (!json.ok) {
      throw new Error(json.error || 'Failed to send application');
    }

    return { success: true, result: json };
  } catch (error) {
    console.error('خطأ في إرسال طلب التوظيف:', error);
    return { success: false, error };
  }
};

// جلب الوظائف المتاحة
export const fetchJobs = async (lang = 'ar') => {
  try {
    const res = await fetch(`${PHP_API_BASE_URL}/content.php?type=jobs&lang=${lang}`);
    const json = await res.json();
    return json.ok ? json.data : [];
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
};

// طلب CSRF Token من الخادم
export const getCsrfToken = async () => {
  try {
    const res = await fetch(`${PHP_API_BASE_URL}/csrf.php`, { method: 'GET' });
    const data = await res.json();
    return data?.csrf_token || '';
  } catch (err) {
    console.error('Failed to get CSRF token', err);
    return '';
  }
};

export default {
  sendContactForm,
  sendRecruitmentForm,
  fetchJobs,
  getCsrfToken,
};
