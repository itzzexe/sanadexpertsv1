import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, MapPin, Clock, Building, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchJobs } from '../services/emailService';
import DocumentSEO from './DocumentSEO';
import './AvailableJobs.css';

const AvailableJobs = () => {
  const { t, i18n } = useTranslation();
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [expandedJob, setExpandedJob] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    (async () => {
      const jobsData = await fetchJobs(i18n.language);
      setJobs(jobsData || []);
      setLoadingJobs(false);
    })();
  }, [i18n.language]);

  return (
    <div className="available-jobs-page page-padding">
      <DocumentSEO pageKey="available_jobs" />
      <div className="recruitment-hero">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container"
        >
          <div className="badge"><Briefcase size={16} /> {t('recruitment.available_jobs')}</div>
          <h1 className="section-title">{t('recruitment.available_jobs')}</h1>
          <p className="hero-subtitle">{t('recruitment.subtitle')}</p>
        </motion.div>
      </div>

      <div className="container">
        <section className="available-jobs-section mb-5">
           {loadingJobs ? (
             <div className="jobs-loading text-center p-5">
               <div className="spinner-border text-primary" role="status"></div>
             </div>
           ) : jobs.length > 0 ? (
             <div className="jobs-grid">
               {jobs.map((job, index) => (
                 <motion.div 
                   key={job.id || index}
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   transition={{ delay: index * 0.1 }}
                   viewport={{ once: true }}
                   className={`job-card glass-card ${expandedJob === job.id ? 'expanded' : ''}`}
                 >
                   <div className="job-card-header" onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}>
                     <div className="job-main-info">
                        <h3>{job.title}</h3>
                        <div className="job-meta">
                          <span><Building size={14} /> {job.department}</span>
                          <span><MapPin size={14} /> {job.location}</span>
                          <span><Clock size={14} /> {job.type}</span>
                        </div>
                     </div>
                     <button className="expand-btn">
                       {expandedJob === job.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                     </button>
                   </div>
                   
                   <AnimatePresence>
                     {expandedJob === job.id && (
                       <motion.div 
                         initial={{ height: 0, opacity: 0 }}
                         animate={{ height: 'auto', opacity: 1 }}
                         exit={{ height: 0, opacity: 0 }}
                         transition={{ duration: 0.3 }}
                         className="job-details-content"
                       >
                         <div className="job-description">
                           <h4>{t('recruitment.job_details')}</h4>
                           <p>{job.description}</p>
                         </div>
                         <Link to={`/recruitment?job=${encodeURIComponent(job.title)}`} className="premium-btn apply-btn-link">
                           {t('recruitment.apply_now')}
                           <ArrowRight size={18} className="rtl-mirror" />
                         </Link>
                       </motion.div>
                     )}
                   </AnimatePresence>
                 </motion.div>
               ))}
             </div>
           ) : (
             <div className="no-jobs-alert glass-card text-center p-5">
               <Briefcase size={48} className="mb-3 opacity-50" />
               <p>{t('recruitment.no_jobs')}</p>
               <Link to="/recruitment" className="premium-btn mt-3" style={{display: 'inline-flex'}}>
                 {t('recruitment.title')}
               </Link>
             </div>
           )}
        </section>
      </div>
    </div>
  );
};

export default AvailableJobs;
