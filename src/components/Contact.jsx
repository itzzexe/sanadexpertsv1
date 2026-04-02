import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { sendContactForm, getCsrfToken } from '../services/emailService';
import './Contact.css';
import ContactModal from './ContactModal';


const Contact = () => {
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
    (async () => {
      const token = await getCsrfToken();
      setCsrfToken(token || '');
    })();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
        setStatus({
          loading: false,
          success: true,
          message: t('contact.form.success')
        });
        formRef.current.reset();
        setFormData({ from_name: '', from_email: '', phone: '', service: '', message: '' });
        setFileName('');
      } else {
        setStatus({
          loading: false,
          success: false,
          message: t('contact.form.error')
        });
      }
    } catch (error) {
      setStatus({ loading: false, success: false, message: t('contact.form.error') });
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: t('contact.address_title'),
      details: [t('contact.address_details.0')],
      link: t('contact.address_link')
    },
    {
      icon: Phone,
      title: t('contact.phone'),
      details: ['+9647800407407'],
      ltr: true
    },
    {
      icon: Mail,
      title: t('contact.email'),
      details: ['info@sanadxperts.com'],
      ltr: true
    },
    {
      icon: Clock,
      title: t('contact.working_hours'),
      details: [t('contact.working_hours_details.0')]
    }
  ];


  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <div className="contact-header">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="premium-subtitle"
          >
            {t('contact.get_in_touch')}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-title"
          >
            {t('contact.journey_title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="contact-description"
          >
            {t('contact.journey_description')}
          </motion.p>
        </div>

        <div className="contact-grid">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="contact-info-column"
          >
            <div className="info-cards-stack">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <div key={index} className="info-item-card glass-card">
                    <div className="info-icon-wrapper">
                      <Icon size={24} />
                    </div>
                    <div className="info-text">
                      <h4>{info.title}</h4>
                      {info.details.map((detail, idx) => {
                        if (info.title === t('contact.phone')) {
                          return (
                            <button 
                              key={idx} 
                              className="contact-info-btn" 
                              onClick={() => {
                                setSelectedPhone(detail);
                                setIsContactModalOpen(true);
                              }}
                              dir="ltr"
                            >
                              {detail}
                            </button>
                          );
                        }
                        if (info.title === t('contact.email')) {
                          return (
                            <a 
                              key={idx} 
                              href={`mailto:${detail}`} 
                              className="contact-info-btn"
                              dir="ltr"
                            >
                              {detail}
                            </a>
                          );
                        }
                        if (info.title === t('contact.address_title')) {
                          return (
                            <a 
                              key={idx} 
                              href={info.link} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="contact-info-btn"
                            >
                              {detail}
                            </a>
                          );
                        }
                        return <p key={idx} dir={info.ltr ? 'ltr' : undefined}>{detail}</p>;
                      })}

                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="contact-form-column"
          >
            <div className="glass-card contact-form-card">
              <h3 className="form-card-title">{t('contact.form_description')}</h3>



              <form ref={formRef} className="premium-form" onSubmit={handleSubmit}>
                <input type="hidden" name="to_email" value="sanadxperts@gmail.com" />
                <input type="hidden" name="csrf_token" value={csrfToken} />

                <div className="form-row">
                  <div className="form-group">
                    <label>{t('contact.form.name')}</label>
                    <div className="input-wrapper">
                      <input name="from_name" type="text" required placeholder={t('contact.form.name')} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>{t('contact.form.email')}</label>
                    <div className="input-wrapper">
                      <input name="from_email" type="email" required placeholder={t('contact.form.email')} />
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>{t('contact.form.phone')}</label>
                    <div className="input-wrapper">
                      <input name="phone" type="tel" required placeholder={t('contact.form.phone')} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>{t('contact.form.select_service')}</label>
                    <div className="input-wrapper">
                      <select name="service" required>
                        <option value="">{t('contact.form.select_service')}</option>
                        <option value="tech">{t('services.technology.title')}</option>
                        <option value="financial">{t('services.financial.title')}</option>
                        <option value="consulting">{t('services.consulting.title')}</option>
                        <option value="other">{t('contact.form.other')}</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>{t('contact.form.message')}</label>
                  <div className="input-wrapper">
                    <textarea name="message" rows="4" required placeholder={t('contact.form.message_placeholder')}></textarea>
                  </div>
                </div>

                <div className="form-group full-width">
                  <div className="file-input-wrapper">
                    <input
                      id="attachment"
                      name="attachment"
                      type="file"
                      onChange={handleFileChange}
                      style={{ position: 'absolute', width: '0.1px', height: '0.1px', opacity: 0, overflow: 'hidden', zIndex: -1 }}
                    />
                    <label htmlFor="attachment" className="file-label">
                      <Upload size={18} />
                      <span>{fileName || t('contact.form.choose_file')}</span>
                    </label>
                  </div>
                </div>


                <div className="form-footer">
                  <button className="premium-btn" type="submit" disabled={status.loading}>
                    {status.loading ? <span className="btn-loading"></span> : (
                      <>
                        <span>{t('contact.send_message')}</span>
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
            </div>
          </motion.div>
        </div>
      </div>
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
        phoneNumber={selectedPhone} 
      />

    </section>
  );
};

export default Contact;