import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import './Header.css';
import LanguageToggle from './LanguageToggle';

const sanadLogo = '/assets/images/sanadxperts (2).svg';

const NAV_HEIGHT = 90; // Define a constant for navigation height

const Header = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleNavClick = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        const offset = 90;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
    setIsMenuOpen(false);
  };

  useEffect(() => {
    if (location.pathname === '/' && location.state?.scrollTo) {
      const sectionId = location.state.scrollTo;
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const offset = 90;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
        window.history.replaceState({}, document.title);
      }, 100);
    }
  }, [location]);

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">

        {/* Logo — always on the inline-start side */}
        <div className="logo-section">
          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="logo-link">
            <img src={sanadLogo} alt="SANADXPERTS" className="logo-image" />
          </Link>
        </div>

        {/* Centre nav — hidden on mobile, slides in as fullscreen overlay */}
        <div className={`nav-menu-wrapper ${isMenuOpen ? 'active' : ''}`}>
          <ul className="nav-menu">
            <li>
              <button className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} onClick={() => handleNavClick('home')}>
                {t('nav.home')}
              </button>
            </li>
            <li>
              <div className="nav-dropdown-wrapper">
                <button 
                  className={`nav-link ${(location.pathname === '/financial-consulting' || location.pathname === '/technology-innovation' || location.pathname === '/management-consulting-hr') ? 'active' : ''}`}
                  onClick={() => handleNavClick('services')}
                >
                  {t('nav.services')}
                  <ChevronDown size={14} className="dropdown-arrow" />
                </button>
                
                <div className="dropdown-menu">
                  <Link to="/financial-consulting" className="dropdown-item">
                    {t('services.financial.title')}
                  </Link>
                  <Link to="/technology-innovation" className="dropdown-item">
                    {t('services.technology.title')}
                  </Link>
                  <Link to="/management-consulting-hr" className="dropdown-item">
                    {t('services.consulting.title')}
                  </Link>
                </div>
              </div>
            </li>
            <li>
              <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>
                {t('nav.about')}
              </Link>
            </li>
            <li>
              <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>
                {t('nav.contact')}
              </Link>
            </li>
            <li>
              <Link to="/management-consulting-hr#join-us-section" className="nav-link">
                {t('nav.careers')}
              </Link>
            </li>
          </ul>
        </div>

        {/* Right-side actions: lang toggle + hamburger */}
        <div className="nav-actions">
          <div className="lang-wrapper">
            <LanguageToggle />
          </div>
          <button
            className={`mobile-toggle ${isMenuOpen ? 'open' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Navigation"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

      </div>
    </header>
  );

};

export default Header;