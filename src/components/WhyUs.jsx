import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Globe, ShieldCheck } from 'lucide-react';
import './WhyUs.css';

const WhyUs = () => {
    const { t } = useTranslation();

    const iconMap = [TrendingUp, Users, Globe, ShieldCheck];

    return (
        <section id="why-us" className="why-us-section">
            <div className="container">
                <div className="why-us-header">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="premium-subtitle"
                    >
                        {t('why_us.subtitle')}
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="section-title"
                    >
                        {t('why_us.title')}
                    </motion.h2>
                </div>

                <div className="why-us-grid">
                    {[0, 1, 2, 3].map((index) => {
                        const Icon = iconMap[index];
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="glass-card why-us-card"
                            >
                                <div className="why-us-icon-wrapper">
                                    <Icon className="why-us-icon" size={32} />
                                </div>
                                <h3>{t(`why_us.items.${index}.title`)}</h3>
                                <p>{t(`why_us.items.${index}.text`)}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default WhyUs;
