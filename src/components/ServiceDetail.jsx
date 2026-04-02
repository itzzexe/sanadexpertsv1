import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, ArrowRight } from 'lucide-react';
import './ServiceDetail.css';

const ServiceDetail = ({ service, onClose }) => {
  const { t } = useTranslation();

  const getServiceDetails = (serviceId) => {
    const mapping = {
      2: 'financial',
      3: 'technology',
      4: 'consulting'
    };
    const serviceKey = mapping[serviceId] || 'consulting';

    return {
      title: t(`services.${serviceKey}.title`),
      subtitle: t(`services.${serviceKey}.subtitle`),
      description: t(`services.${serviceKey}.description`),
      services: [
        {
          name: t(`services.${serviceKey}.services.0.name`),
          description: t(`services.${serviceKey}.services.0.description`),
          features: [
            t(`services.${serviceKey}.services.0.features.0`),
            t(`services.${serviceKey}.services.0.features.1`),
            t(`services.${serviceKey}.services.0.features.2`),
            t(`services.${serviceKey}.services.0.features.3`)
          ]
        },
        {
          name: t(`services.${serviceKey}.services.1.name`),
          description: t(`services.${serviceKey}.services.1.description`),
          features: [
            t(`services.${serviceKey}.services.1.features.0`),
            t(`services.${serviceKey}.services.1.features.1`),
            t(`services.${serviceKey}.services.1.features.2`),
            t(`services.${serviceKey}.services.1.features.3`)
          ]
        },
        {
          name: t(`services.${serviceKey}.services.2.name`),
          description: t(`services.${serviceKey}.services.2.description`),
          features: [
            t(`services.${serviceKey}.services.2.features.0`),
            t(`services.${serviceKey}.services.2.features.1`),
            t(`services.${serviceKey}.services.2.features.2`),
            t(`services.${serviceKey}.services.2.features.3`)
          ]
        },
        {
          name: t(`services.${serviceKey}.services.3.name`),
          description: t(`services.${serviceKey}.services.3.description`),
          features: [
            t(`services.${serviceKey}.services.3.features.0`),
            t(`services.${serviceKey}.services.3.features.1`),
            t(`services.${serviceKey}.services.3.features.2`),
            t(`services.${serviceKey}.services.3.features.3`)
          ]
        }
      ],
      benefits: [
        t(`services.${serviceKey}.benefits.0`),
        t(`services.${serviceKey}.benefits.1`),
        t(`services.${serviceKey}.benefits.2`),
        t(`services.${serviceKey}.benefits.3`)
      ]
    };
  };

  const currentService = getServiceDetails(service);
  if (!currentService) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="service-detail-overlay"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="service-detail-modal glass-card"
          onClick={(e) => e.stopPropagation()}
        >
          <button className="modal-close-icon" onClick={onClose}>
            <X size={24} />
          </button>

          <div className="modal-inner-scroll">
            <div className="modal-header-premium">
              <span className="premium-subtitle">{currentService.subtitle}</span>
              <h2 className="modal-main-title">{currentService.title}</h2>
              <p className="modal-intro-text">{currentService.description}</p>
            </div>

            <div className="modal-body-premium">
              <section className="specialized-services">
                <h3 className="section-small-title">{t('service_detail.specialized_services')}</h3>
                <div className="sub-services-grid">
                  {currentService.services.map((item, index) => (
                    <div key={index} className="sub-service-card">
                      <h4>{item.name}</h4>
                      <p>{item.description}</p>
                      <ul className="sub-service-features">
                        {item.features.map((feature, idx) => (
                          <li key={idx}><CheckCircle2 size={14} /> {feature}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              <div className="modal-footer-sections">
                <section className="benefits-premium">
                  <h3 className="section-small-title">{t('service_detail.expected_benefits')}</h3>
                  <ul className="benefits-modern-list">
                    {currentService.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </section>

                <section className="cta-premium-card">
                  <h3>{t('service_detail.ready_to_start')}</h3>
                  <p>{t('service_detail.contact_description')}</p>
                  <button className="premium-btn" onClick={() => {
                    onClose();
                    setTimeout(() => {
                      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    }, 300);
                  }}>
                    <span>{t('service_detail.contact_now')}</span>
                    <ArrowRight size={18} />
                  </button>
                </section>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ServiceDetail;