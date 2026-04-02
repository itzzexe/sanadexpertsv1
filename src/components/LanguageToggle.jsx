import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageToggle.css';

const LanguageToggle = () => {
  const { i18n, t } = useTranslation();

  const toggleLanguage = () => {
    const currentLang = i18n.language || 'ar';
    const newLang = currentLang.startsWith('ar') ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    // Direction is handled by App.jsx useEffect now, but we can set it here for immediate feedback
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <button 
      className="language-toggle" 
      onClick={toggleLanguage}
      aria-label={i18n.language.startsWith('ar') ? 'Switch to English' : 'التبديل إلى العربية'}
    >
      <span className="lang-text">
        {i18n.language.startsWith('ar') ? 'EN' : t('language_toggle.arabic')}
      </span>
    </button>
  );
};

export default LanguageToggle;