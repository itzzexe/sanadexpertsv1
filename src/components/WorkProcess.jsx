import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MessageSquare, ClipboardCheck, Sparkles, Rocket } from 'lucide-react';
import './WorkProcess.css';

const WorkProcess = () => {
    const { t } = useTranslation();

    const steps = [
        { icon: <MessageSquare size={28} /> },
        { icon: <ClipboardCheck size={28} /> },
        { icon: <Sparkles size={28} /> },
        { icon: <Rocket size={28} /> }
    ];

    return (
        <section id="work-process" className="process-section">
            <div className="container">
                <div className="process-header">
                    <span className="premium-subtitle">{t('work_process.title')}</span>
                    <h2 className="section-title">{t('work_process.subtitle')}</h2>
                </div>

                <div className="process-grid">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15 }}
                            className="process-step"
                        >
                            <div className="process-icon-box">
                                {step.icon}
                                <div className="step-number">{index + 1}</div>
                            </div>
                            <div className="process-info">
                                <h4>{t(`work_process.steps.${index}.title`)}</h4>
                                <p>{t(`work_process.steps.${index}.text`)}</p>
                            </div>
                            {index < steps.length - 1 && <div className="process-connector"></div>}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WorkProcess;
