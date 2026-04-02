import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { sendContactForm, getCsrfToken } from '../services/emailService';
import ContactModal from '../components/ContactModal';
import DocumentSEO from '../components/DocumentSEO';
import './ContactPage.css';

const ContactPage = () => {
  const { t, i18n } = useTranslation();
  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    from_name: '',
    from_email: '',
    phone: '',
    service: '',
    message: ''
  });

  const [status, setStatus] = useState({ loading: false, success: null, message: '' });
  const [csrfToken, setCsrfToken] = useState('');
  const [fileName, setFileName] = useState('');
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedPhone, setSelectedPhone] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    (async () => {
      const token = await getCsrfToken();
      setCsrfToken(token || '');
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      // Regular expression to allow only numbers and + 
      const filteredValue = value.replace(/[^\d+]/g, '');
      // Restrict to max 16 characters in logic
      if (filteredValue.length <= 16) {
        setFormData({ ...formData, [name]: filteredValue });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileName(file ? file.name : '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formRef.current) return;
    setStatus({ loading: true, success: null, message: '' });

    try {
      const result = await sendContactForm(formRef.current);
      if (result.success) {
        setStatus({ loading: false, success: true, message: t('contact.form.success') });
        formRef.current.reset();
        setFormData({ from_name: '', from_email: '', phone: '', service: '', message: '' });
        setFileName('');
      } else {
        setStatus({ loading: false, success: false, message: t('contact.form.error') });
      }
    } catch (error) {
      setStatus({ loading: false, success: false, message: t('contact.form.error') });
    }
  };

  const contactInfo = [
    { 
      icon: MapPin, 
      title: t('contact.address_title'), 
      details: ['العراق - بغداد - الاعظمية - ساحة الدلال - مقابل الف ليلة و ليلى - الطابق الرابع'], 
      link: 'https://www.google.com/maps/search/?api=1&query=33.363653,44.358895' 
    },
    { 
      icon: Phone, 
      title: t('contact.phone'), 
      details: ['+9647800407407'], 
      isPhone: true 
    },
    { 
      icon: Mail, 
      title: t('contact.email'), 
      details: ['info@sanadxperts.com'], 
      link: 'mailto:info@sanadxperts.com' 
    },
    { 
      icon: Clock, 
      title: t('contact.working_hours'), 
      details: ['السبت - الخميس: 9:00 صباحاً - 5:00 مساءً'] 
    }
  ];

  return (
    <div className="contact-page">
      <DocumentSEO title={t('contact.title')} description={t('contact.description')} />
      
      <section className="contact-hero">
        <div className="container">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hero-title"
          >
            {t('contact.title')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="hero-subtitle"
          >
            {t('contact.journey_description')}
          </motion.p>
        </div>
      </section>

      <div className="container contact-content">
        <div className="row g-5">
          <div className="col-lg-5">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="info-section"
            >
              <h2 className="mb-4">{t('contact.get_in_touch')}</h2>
              <div className="info-cards">
                {contactInfo.map((info, idx) => (
                  <div key={idx} className="info-card glass-card">
                    <div className="info-icon"><info.icon /></div>
                    <div className="info-body">
                      <h3>{info.title}</h3>
                      {info.details.map((d, i) => {
                        if (info.isPhone) {
                          return (
                            <button 
                              key={i} 
                              className="info-link-btn" 
                              onClick={() => {
                                setSelectedPhone(d);
                                setIsContactModalOpen(true);
                              }}
                              dir="ltr"
                            >
                              {d}
                            </button>
                          );
                        }
                        if (info.link) {
                          return (
                            <a 
                              key={i} 
                              href={info.link} 
                              className="info-link-btn" 
                              target={info.link.startsWith('http') ? '_blank' : undefined}
                              rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                              dir={info.title === t('contact.email') ? 'ltr' : 'auto'}
                            >
                              {d}
                            </a>
                          );
                        }
                        return <p key={i}>{d}</p>;
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="col-lg-7">
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="form-section glass-card"
            >
              <h2 className="mb-4">{t('contact.send_message')}</h2>
              <form ref={formRef} className="contact-form" onSubmit={handleSubmit}>
                <input type="hidden" name="to_email" value="sanadxperts@gmail.com" />
                <input type="hidden" name="csrf_token" value={csrfToken} />
                
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label>{t('contact.form.name')}</label>
                    <input 
                      name="from_name" 
                      type="text" 
                      value={formData.from_name}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>{t('contact.form.email')}</label>
                    <input 
                      name="from_email" 
                      type="email" 
                      value={formData.from_email}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label>{t('contact.form.phone')}</label>
                    <input 
                      name="phone" 
                      type="tel" 
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+964..."
                      minLength="10"
                      maxLength="16"
                      required 
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>{t('contact.form.select_service')}</label>
                    <select 
                      name="service" 
                      value={formData.service}
                      onChange={handleChange}
                      required
                    >
                      <option value="">{t('contact.form.select_service')}</option>
                      <option value="tech">{t('services.technology.title')}</option>
                      <option value="financial">{t('services.financial.title')}</option>
                      <option value="consulting">{t('services.consulting.title')}</option>
                      <option value="other">{t('contact.form.other')}</option>
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label>{t('contact.form.message')}</label>
                  <textarea 
                    name="message" 
                    rows="5" 
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <div className="mb-4">
                  <input
                    id="attachment"
                    name="attachment"
                    type="file"
                    onChange={handleFileChange}
                    style={{ position: 'absolute', width: '0.1px', height: '0.1px', opacity: 0, overflow: 'hidden', zIndex: -1 }}
                  />
                  <label htmlFor="attachment" className="file-upload-btn">
                    <Upload size={18} />
                    <span>{fileName || t('contact.form.choose_file')}</span>
                  </label>
                </div>

                <button className="submit-btn" type="submit" disabled={status.loading}>
                  {status.loading ? <span className="spinner"></span> : (
                    <>
                      <span>{t('contact.send_message')}</span>
                      <Send size={18} className="ms-2" />
                    </>
                  )}
                </button>

                {status.success !== null && (
                  <div className={`mt-3 status-msg ${status.success ? 'success' : 'error'}`}>
                    {status.success ? <CheckCircle className="me-2" /> : <AlertCircle className="me-2" />}
                    {status.message}
                  </div>
                )}
              </form>
            </motion.div>
          </div>
        </div>
      </div>

      <section className="map-section mt-5">
        <iframe 
          title="SanadXperts Location"
          src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3334.208343717646!2d44.356320075485974!3d33.36365745431697!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzPCsDIxJzQ5LjIiTiA0NMKwMjEnMzIuMCJF!5e0!3m2!1sen!2siq!4v1711974542000!5m2!1sen!2siq"
          width="100%" 
          height="450" 
          style={{ border: 0 }} 
          allowFullScreen="" 
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>

      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
        phoneNumber={selectedPhone} 
      />
    </div>
  );
};

export default ContactPage;
