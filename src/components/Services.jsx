import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Services.css';
import { getServices } from '../services/cmsService';

const Services = () => {
  const { t, i18n } = useTranslation();
  const [contentServices, setContentServices] = useState([]);

  const servicePaths = {
    4: '/management-consulting-hr',
    3: '/technology-innovation',
    2: '/financial-consulting'
  };

  const fallbackServices = [
    {
      id: 4,
      icon: '🏛️',
      title: t('services.consulting.title'),
      description: t('services.consulting.description'),
      path: '/management-consulting-hr',
      features: [
        t('services.consulting.services.0.name'),
        t('services.consulting.services.1.name'),
        t('services.consulting.services.2.name')
      ]
    },
    {
      id: 3,
      icon: '💻',
      title: t('services.technology.title'),
      description: t('services.technology.description'),
      path: '/technology-innovation',
      features: [
        t('services.technology.features.0'),
        t('services.technology.features.1'),
        t('services.technology.features.2')
      ]
    },
    {
      id: 2,
      icon: '💰',
      title: t('services.financial.title'),
      description: t('services.financial.description'),
      path: '/financial-consulting',
      features: [
        t('services.financial.features.0'),
        t('services.financial.features.1'),
        t('services.financial.features.2')
      ]
    }

  ];

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const lang = i18n.language || 'ar';
      const data = await getServices(lang);
      if (isMounted) {
        setContentServices(Array.isArray(data) && data.length ? data.map(s => ({...s, path: servicePaths[s.id] || '#'})) : []);
      }
    })();
    return () => { isMounted = false; };
  }, [i18n.language]);

  const displayServices = contentServices.length ? contentServices : fallbackServices;

  return (
    <section id="services" className="services-section">
      <div className="container">
        <div className="services-header">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="premium-subtitle"
          >
            {t('services.subtitle')}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-title"
          >
            {t('services.title')}
          </motion.h2>
        </div>

        <div className="services-grid">
          {displayServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link to={service.path || '#'} className="glass-card service-card">
                <div className="service-header-row">
                  <div className="service-icon-box">
                    <span className="emoji-icon">{service.icon}</span>
                  </div>
                  <div className="service-number">0{index + 1}</div>
                </div>

                <div className="service-body">
                  <h3 className="service-card-title">{service.title}</h3>
                  <p className="service-card-description">{service.description}</p>

                  <ul className="service-features-list">
                    {service.features.slice(0, 3).map((feature, fIdx) => (
                      <li key={fIdx}>
                        <ChevronRight size={14} className="feature-icon" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="service-footer">
                  <div className="learn-more-btn">
                    <span>{t('common.learn_more')}</span>
                    <ArrowRight size={18} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;