import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, Upload, Send, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import './Recruitment.css';
import { sendRecruitmentForm, getCsrfToken } from '../services/emailService';
import DocumentSEO from './DocumentSEO';

const Recruitment = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const formRef = useRef(null);
  const [status, setStatus] = useState({ loading: false, success: null, message: '' });
  const [csrfToken, setCsrfToken] = useState('');
  const [fileName, setFileName] = useState('');
  const [selectedJobTitle, setSelectedJobTitle] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Get job title from query param if available
    const searchParams = new URLSearchParams(location.search);
    const jobParam = searchParams.get('job');
    if (jobParam) {
      setSelectedJobTitle(jobParam);
      // Scroll to form if job is selected
      const formElement = document.getElementById('application-form');
      if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
    }

    (async () => {
      const token = await getCsrfToken();
      setCsrfToken(token || '');
    })();
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formRef.current) return;
    setStatus({ loading: true, success: null, message: '' });
    const result = await sendRecruitmentForm(formRef.current);
    if (result.success) {
      setStatus({ loading: false, success: true, message: t('recruitment.success') });
      formRef.current.reset();
      setFileName('');
      setSelectedJobTitle('');
    } else {
      setStatus({ loading: false, success: false, message: t('recruitment.error') });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileName(file ? file.name : '');
  };

  return (
    <div className="recruitment-page page-padding">
      <DocumentSEO pageKey="recruitment" />
      <div className="recruitment-hero">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container"
        >
          <div className="badge"><Briefcase size={16} /> {t('nav.careers')}</div>
          <h1 className="section-title">{t('recruitment.title')}</h1>
          <p className="hero-subtitle mb-4">{t('recruitment.subtitle')}</p>
          
          <Link to="/available-jobs" className="premium-btn jobs-nav-btn mx-auto">
            <Briefcase size={20} />
            <span>{t('recruitment.available_jobs')}</span>
            <ExternalLink size={18} />
          </Link>
        </motion.div>
      </div>

      <div className="container">
        <motion.div
          id="application-form"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass-card recruitment-card"
        >
          <div className="card-header">
            <h3>{t('recruitment.description')}</h3>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="premium-form">
            <input type="hidden" name="to_email" value="sanadxperts@gmail.com" />
            <input type="hidden" name="csrf_token" value={csrfToken} />

            <div className="form-grid">
              <div className="form-group">
                <label>{t('recruitment.fields.name')}</label>
                <div className="input-wrapper">
                  <input name="candidate_name" type="text" required placeholder={t('recruitment.placeholders.name')} />
                </div>
              </div>

              <div className="form-group">
                <label>{t('recruitment.fields.email')}</label>
                <div className="input-wrapper">
                  <input name="candidate_email" type="email" required placeholder={t('recruitment.placeholders.email')} />
                </div>
              </div>

              <div className="form-group">
                <label>{t('recruitment.fields.phone')}</label>
                <div className="input-wrapper">
                  <input
                    name="candidate_phone"
                    type="tel"
                    required
                    placeholder={t('recruitment.placeholders.phone')}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>{t('recruitment.fields.role')}</label>
                <div className="input-wrapper">
                  <input 
                    name="target_role" 
                    type="text" 
                    required 
                    value={selectedJobTitle || ''}
                    onChange={(e) => setSelectedJobTitle(e.target.value)}
                    placeholder={t('recruitment.placeholders.role')} 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>{t('recruitment.fields.experience')}</label>
                <div className="input-wrapper">
                  <input name="candidate_experience" type="number" min="0" required placeholder={t('recruitment.placeholders.experience')} />
                </div>
              </div>

              <div className="form-group">
                <label>{t('recruitment.fields.cv')}</label>
                <div className="file-input-wrapper">
                  <input
                    id="cv_file"
                    name="cv_file"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    required
                    onChange={handleFileChange}
                  />
                  <label htmlFor="cv_file" className="file-label">
                    <Upload size={20} />
                    <span>{fileName || t('contact.form.choose_file')}</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="form-group full-width">
              <label>{t('recruitment.fields.cover_letter')}</label>
              <div className="input-wrapper">
                <textarea name="cover_letter" rows="5" placeholder={t('recruitment.placeholders.cover_letter')}></textarea>
              </div>
            </div>

            <div className="form-footer">
              <button className="premium-btn" type="submit" disabled={status.loading}>
                {status.loading ? (
                  <span className="btn-loading"></span>
                ) : (
                  <>
                    <span>{t('recruitment.submit')}</span>
                    <Send size={18} />
                  </>
                )}
              </button>

              {status.success !== null && (
                <div className={`form-feedback ${status.success ? 'success' : 'error'}`}>
                  {status.success ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                  <span>{status.message}</span>
                </div>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Recruitment;