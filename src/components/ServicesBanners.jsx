import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import './ServicesBanners.css';

const finVideo = '/assets/video/fin.mp4';
const itVideo = '/assets/video/it.mp4';
const hrVideo = '/assets/video/hr.mp4';

const ServicesBanners = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [hoveredBanner, setHoveredBanner] = useState(null);
  const videoRefs = useRef([]);

  const heroSlides = [
    {
      id: 1,
      title: t('services.consulting.title'),
      subtitle: t('services.consulting.subtitle'),
      description: t('services.consulting.description'),
      cta: t('services.consulting.cta'),
      video: hrVideo,
      path: '/management-consulting-hr'
    },
    {
      id: 2,
      title: t('services.technology.title'),
      subtitle: t('services.technology.subtitle'),
      description: t('services.technology.description'),
      cta: t('services.technology.cta'),
      video: itVideo,
      path: '/technology-innovation'
    },
    {
      id: 3,
      title: t('services.financial.title'),
      subtitle: t('services.financial.subtitle'),
      description: t('services.financial.description'),
      cta: t('services.financial.cta'),
      video: finVideo,
      path: '/financial-consulting'
    }
  ];

  const handleBannerHover = (index) => {
    if (hoveredBanner === index) return;
    setHoveredBanner(index);
    
    // Play current video
    const current = videoRefs.current[index];
    if (current) {
      current.muted = true;
      const playPromise = current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }

    // Pause others
    videoRefs.current.forEach((v, i) => {
      if (i !== index && v) {
        v.pause();
      }
    });
  };

  const handleBannerLeave = () => {
    if (hoveredBanner !== null && videoRefs.current[hoveredBanner]) {
      videoRefs.current[hoveredBanner].pause();
    }
    setHoveredBanner(null);
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <section id="home" className="hero-section">
      <div className="luxury-banners-container">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`luxury-banner ${hoveredBanner === index ? 'expanded' : ''} ${hoveredBanner !== null && hoveredBanner !== index ? 'compressed' : ''}`}
            onMouseEnter={() => handleBannerHover(index)}
            onMouseLeave={handleBannerLeave}
            onClick={() => handleNavigate(slide.path)}
          >
            <video
              className="luxury-banner-video"
              muted
              loop
              playsInline
              preload="auto"
              autoPlay={index === 0} 
              ref={(el) => (videoRefs.current[index] = el)}
            >
              <source src={slide.video} type="video/mp4" />
            </video>
            <div className="luxury-banner-overlay"></div>

            <div className="luxury-banner-content">
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="luxury-banner-text"
                >
                  <motion.span
                    className="luxury-subtitle"
                    initial={{ letterSpacing: '2px' }}
                    animate={{ letterSpacing: hoveredBanner === index ? '4px' : '2px' }}
                  >
                    {slide.subtitle}
                  </motion.span>
                  <h1 className="luxury-title">{slide.title}</h1>

                  <div className="expandable-content">
                    <p className="luxury-description">{slide.description}</p>
                    <button className="luxury-cta-btn" onClick={(e) => { e.stopPropagation(); handleNavigate(slide.path); }}>
                      <span>{slide.cta}</span>
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>

      <div className="scroll-indicator-v2">
        <div className="mouse">
          <div className="wheel"></div>
        </div>
        <div className="scroll-text">{t('common.discover_more')}</div>
      </div>
    </section>
  );
};

export default ServicesBanners;