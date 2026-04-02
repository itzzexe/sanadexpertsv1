import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Award, Lightbulb, Users, Target, Compass, Trophy } from 'lucide-react';
import './About.css';

const sanadLogo = '/assets/images/sanadxperts (2).svg';

const About = () => {
  const { t } = useTranslation();

  const principles = [
    {
      title: t('about.principles.0.title'),
      description: t('about.principles.0.description'),
      icon: Award
    },
    {
      title: t('about.principles.1.title'),
      description: t('about.principles.1.description'),
      icon: Lightbulb
    },
    {
      title: t('about.principles.2.title'),
      description: t('about.principles.2.description'),
      icon: Users
    }
  ];

  return (
    <section id="about" className="about-section">
      <div className="container">
        <div className="about-grid">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="about-image-wrapper"
          >
            <div className="luxury-image-frame">
              <img src={sanadLogo} alt="SANADXPERTS Logo" className="about-main-logo" />
            </div>

          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="about-content"
          >
            <div className="about-header">
              <h2 className="section-title text-start">{t('about.title')}</h2>
            </div>

            <p className="about-text highlighted">
              {t('about.description')}
            </p>






          </motion.div>
        </div>

        <div className="about-extended-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="centered-header"
          >
            <h3 className="section-title">{t('about.principles_title')}</h3>
            <p className="section-subtitle">{t('about.principles_subtitle')}</p>
          </motion.div>

          <div className="principles-grid">
            {principles.map((principle, index) => {
              const Icon = principle.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass-card principle-card"
                >
                  <div className="principle-icon-wrapper">
                    <Icon size={32} />
                  </div>
                  <div className="principle-content">
                    <h3 className="principle-title">{principle.title}</h3>
                    <p className="principle-description">{principle.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mission-vision-grid">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mv-card"
            >
              <div className="mv-icon-header">
                <Target className="mv-icon" size={24} />
                <h4 className="mv-title">{t('about.mission.title')}</h4>
              </div>
              <p>{t('about.mission.content')}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mv-card"
            >
              <div className="mv-icon-header">
                <Compass className="mv-icon" size={24} />
                <h4 className="mv-title">{t('about.vision.title')}</h4>
              </div>
              <p>{t('about.vision.content')}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mv-card"
            >
              <div className="mv-icon-header">
                <Trophy className="mv-icon" size={24} />
                <h4 className="mv-title">{t('about.goal.title')}</h4>
              </div>
              <p>{t('about.goal.content')}</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;