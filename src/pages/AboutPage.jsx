import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, TrendingUp, Cpu, Users, Award, CheckCircle } from 'lucide-react';
import { getContentByType } from '../services/cmsService';
import DocumentSEO from '../components/DocumentSEO';
import './AboutPage.css';

const sanadLogo = '/assets/images/sanadxperts (2).svg';

const AboutPage = () => {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadContent = async () => {
      const cmsData = await getContentByType('about', i18n.language);
      if (cmsData) setData(cmsData);
      else setData(t('about', { returnObjects: true }));
    };
    loadContent();
  }, [i18n.language, t]);

  if (!data) return <div className="loading-spinner">Loading...</div>;

  const iconMap = {
    financial: <TrendingUp className="expertise-icon" />,
    technology: <Cpu className="expertise-icon" />,
    hr: <Users className="expertise-icon" />
  };

  const routeMap = {
    financial: '/financial-consulting',
    technology: '/technology-innovation',
    hr: '/management-consulting-hr'
  };

  return (
    <div className="about-page">
      <DocumentSEO 
        title={data.title}
        description={data.description}
      />

      <section className="about-hero">
        <div className="hero-content container">
          <motion.div 
             className="hero-logo-wrapper"
             initial={{ opacity: 0, scale: 0.8 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.8 }}
          >
            <img src={sanadLogo} alt="SanadXperts Logo" className="hero-logo" />
          </motion.div>
          <motion.h1 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, delay: 0.3 }}
          >
            {data.title}
          </motion.h1>
          <motion.p
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, delay: 0.5 }}
          >
            {data.description}
          </motion.p>
        </div>
      </section>

      <section className="expertise-section container">
        <h2 className="section-title text-center mb-5">{data.expertise?.title}</h2>
        <div className="expertise-grid">
          {Object.entries(data.expertise || {}).map(([key, value], idx) => {
             if (key === 'title') return null;
             return (
               <motion.div 
                 key={key} 
                 className="expertise-card-wrapper"
                 initial={{ opacity: 0, scale: 0.9 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 transition={{ delay: idx * 0.1 }}
               >
                 <Link to={routeMap[key] || '#'} className="expertise-card-link">
                    <div className="expertise-card glass-card">
                      <div className="icon-wrapper">
                          {iconMap[key] || <Award />}
                      </div>
                      <h3>{value.title}</h3>
                      <p>{value.content}</p>
                    </div>
                 </Link>
               </motion.div>
             );
          })}
        </div>
      </section>

      <section className="approach-section glass-bg py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 text-center">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="approach-text"
              >
                <h2 className="mb-4">{data.approach?.title}</h2>
                <p className="lead">{data.approach?.content}</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section className="why-us-section container py-5">
        <div className="text-center mb-5">
          <h2>{data.why_us?.title}</h2>
        </div>
        <div className="why-grid">
          {data.why_us?.items?.map((item, idx) => (
            <motion.div 
              key={idx} 
              className="why-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <CheckCircle className="text-primary me-3 flex-shrink-0" />
              <span>{item}</span>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="commitment-section text-center py-5 glass-bg mb-5">
         <div className="container">
           <h2 className="mb-4">{data.commitment?.title}</h2>
           <p className="commitment-text">{data.commitment?.content}</p>
         </div>
      </section>
    </div>
  );
};

export default AboutPage;
