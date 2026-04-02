import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, MapPin, Linkedin, Instagram, Twitter } from 'lucide-react';
import './Footer.css';
import ContactModal from './ContactModal';


const sanadLogo = '/assets/images/sanadxperts (2).svg';

const Footer = () => {
  const { t, i18n } = useTranslation();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: 'LinkedIn', icon: Linkedin, url: 'https://www.linkedin.com/company/sanadxperts' },
    { name: 'Twitter', icon: Twitter, url: 'https://x.com/sanadxpert' },
    { name: 'Instagram', icon: Instagram, url: 'https://www.instagram.com/' }
  ];

  const quickLinks = [
    { name: t('nav.home'), href: 'home' },
    { name: t('nav.about'), href: 'about' },
    { name: t('nav.contact'), href: 'contact' }
  ];

  const services = [
    { name: t('services.technology.title'), href: 'services' },
    { name: t('services.financial.title'), href: 'services' },
    { name: t('services.consulting.title'), href: 'services' }
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const [openModal, setOpenModal] = useState(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedPhone, setSelectedPhone] = useState('');

  const closeModal = () => setOpenModal(null);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <footer className="footer-premium">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand-column">
            <img src={sanadLogo} alt="SANADXPERTS" className="footer-logo-premium" />
            <p className="footer-tagline-premium">{t('footer.tagline')}</p>
            <div className="footer-socials-premium">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a key={index} href={social.url} target="_blank" rel="noopener noreferrer" className="social-icon-btn">
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="footer-links-grid">
            <div className="links-group">
              <h4>{t('footer.quick_links')}</h4>
              <ul>
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <button onClick={() => scrollToSection(link.href)}>{link.name}</button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="links-group">
              <h4>{t('footer.our_services')}</h4>
              <ul>
                {services.map((service, index) => (
                  <li key={index}>
                    <button onClick={() => scrollToSection(service.href)}>{service.name}</button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="links-group contact-links">
              <h4>{t('footer.contact_info')}</h4>
              <ul className="contact-list">
                <li>
                  <Phone size={16} />
                  <button 
                    className="footer-contact-btn" 
                    onClick={() => {
                      setSelectedPhone('+9647800407407');
                      setIsContactModalOpen(true);
                    }}
                    dir="ltr"
                  >
                    +9647800407407
                  </button>

                </li>

                <li>
                  <Mail size={16} />
                  <a href="mailto:info@sanadxperts.com" className="footer-contact-btn" dir="ltr">
                    info@sanadxperts.com
                  </a>

                </li>

                <li>
                  <MapPin size={16} />
                  <a 
                    href={t('contact.address_link')} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="footer-contact-btn"
                  >
                    {t('contact.address')}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom-premium">
          <div className="legal-links">
            <button onClick={() => setOpenModal('privacy')}>{t('footer.privacy_policy')}</button>
            <button onClick={() => setOpenModal('terms')}>{t('footer.terms_conditions')}</button>
          </div>
          <p className="copyright-premium">
            &copy; {currentYear} SANADXPERTS. {t('footer.rights')}
          </p>
        </div>
      </div>

      {/* Basic Re-implementation of Modal Logic if needed or keeping the visual clean */}
      {openModal && (
        <div className="modal-overlay-premium" onClick={closeModal}>
          <div className="modal-content-premium glass-card" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal}>×</button>
            <h3>{openModal === 'privacy' ? t('footer.privacy_policy') : t('footer.terms_conditions')}</h3>
            <div className="modal-body">
              {openModal === 'privacy' ? (
                <>
                  <p className="modal-intro">{t('footer.privacy.intro')}</p>

                  <h4>{t('footer.privacy.data_collection_title')}</h4>
                  <p>{t('footer.privacy.data_collection')}</p>

                  <h4>{t('footer.privacy.use_title')}</h4>
                  <p>{t('footer.privacy.use')}</p>

                  <h4>{t('footer.privacy.sharing_title')}</h4>
                  <p>{t('footer.privacy.sharing')}</p>

                  <h4>{t('footer.privacy.security_title')}</h4>
                  <p>{t('footer.privacy.security')}</p>

                  <h4>{t('footer.privacy.retention_title')}</h4>
                  <p>{t('footer.privacy.retention')}</p>

                  <h4>{t('footer.privacy.rights_title')}</h4>
                  <p>{t('footer.privacy.rights')}</p>

                  <h4>{t('footer.privacy.cookies_title')}</h4>
                  <p>{t('footer.privacy.cookies')}</p>

                  <h4>{t('footer.privacy.contact_title')}</h4>
                  <p>{t('footer.privacy.contact_text')} <a href="mailto:info@sanadxperts.com">info@sanadxperts.com</a></p>
                </>
              ) : (
                <>
                  <p className="modal-intro">{t('footer.terms.intro')}</p>

                  <h4>{t('footer.terms.services_title')}</h4>
                  <p>{t('footer.terms.services')}</p>

                  <h4>{t('footer.terms.acceptable_use_title')}</h4>
                  <p>{t('footer.terms.acceptable_use')}</p>

                  <h4>{t('footer.terms.ip_title')}</h4>
                  <p>{t('footer.terms.ip')}</p>

                  <h4>{t('footer.terms.liability_title')}</h4>
                  <p>{t('footer.terms.liability')}</p>

                  <h4>{t('footer.terms.disclaimer_title')}</h4>
                  <p>{t('footer.terms.disclaimer')}</p>

                  <h4>{t('footer.terms.governing_law_title')}</h4>
                  <p>{t('footer.terms.governing_law')}</p>

                  <h4>{t('footer.terms.changes_title')}</h4>
                  <p>{t('footer.terms.changes')}</p>

                  <h4>{t('footer.terms.contact_title')}</h4>
                  <p>{t('footer.terms.contact_text')} <a href="mailto:info@sanadxperts.com">info@sanadxperts.com</a></p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
        phoneNumber={selectedPhone} 
      />

    </footer>
  );
};

export default Footer;