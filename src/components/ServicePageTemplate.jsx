import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, ChevronRight } from 'lucide-react';
import DocumentSEO from './DocumentSEO';
import './ServicePageTemplate.css';

const ServicePageTemplate = ({ serviceKey, seoKey, children }) => {
  const { t } = useTranslation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const service = t(`services.${serviceKey}`, { returnObjects: true });

  return (
    <div className="service-page">
      <DocumentSEO pageKey={seoKey || serviceKey} />
      
      {/* Hero Section */}
      <section className="service-hero">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-content"
          >
            <span className="premium-subtitle">{service.subtitle}</span>
            <h1 className="section-title">{service.title}</h1>
            <p className="hero-description">{service.description}</p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container">
        <div className="service-main-grid">
          {/* Detailed Services */}
          <div className="services-details-section">
            <h2 className="detail-title">{t('service_detail.specialized_services')}</h2>
            <div className="details-grid">
              {service.services && service.services.map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-card detail-card"
                >
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <ul className="detail-features">
                    {item.features && item.features.map((feat, fidx) => (
                      <li key={fidx}>
                        <ChevronRight size={14} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar / Benefits */}
          <aside className="service-sidebar">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="glass-card side-info-card"
            >
              <h4>{t('service_detail.expected_benefits')}</h4>
              <ul className="benefits-list">
                {service.benefits && service.benefits.map((benefit, idx) => (
                  <li key={idx}>
                    <CheckCircle size={18} className="benefit-icon" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <div className="cta-sidebar-card">
              <h3>{t('service_detail.ready_to_start')}</h3>
              <p>{t('service_detail.contact_description')}</p>
              <button 
                className="premium-btn w-full"
                onClick={() => {
                  const contactSection = document.getElementById('contact');
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    window.location.href = '/#contact';
                  }
                }}
              >
                <span>{t('service_detail.contact_now')}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* Additional Content (like Recruitment) */}
      {children && (
        <div className="additional-service-content">
          {children}
        </div>
      )}
    </div>
  );
};

export default ServicePageTemplate;
