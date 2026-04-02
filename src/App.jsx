import React, { Suspense, lazy, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import { fetchJobs } from './services/emailService'; // reuse fetch logic for layout

const Header = lazy(() => import('./components/Header'));
const ServicesBanners = lazy(() => import('./components/ServicesBanners'));
const Services = lazy(() => import('./components/Services'));
const About = lazy(() => import('./components/About'));
const WhyUs = lazy(() => import('./components/WhyUs'));
const WorkProcess = lazy(() => import('./components/WorkProcess'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));
const FinancialConsulting = lazy(() => import('./pages/FinancialConsulting'));
const TechInnovation = lazy(() => import('./pages/TechInnovation'));
const ManagementHR = lazy(() => import('./pages/ManagementHR'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const BackToTop = lazy(() => import('./components/BackToTop'));
const DocumentSEO = lazy(() => import('./components/DocumentSEO'));
const AvailableJobs = lazy(() => import('./components/AvailableJobs'));
const Recruitment = lazy(() => import('./components/Recruitment'));

const componentMap = {
  hero: ServicesBanners,
  services_banners: ServicesBanners,
  services: Services,
  work_process: WorkProcess,
  why_us: WhyUs,
  about: About
};

const DynamicHome = () => {
  const [layout, setLayout] = useState(['hero', 'services', 'work_process', 'why_us']);
  
  useEffect(() => {
    // Fetch layout from backend
    fetch('/api/content.php?type=layout')
      .then(res => res.json())
      .then(json => {
        if (json.ok && json.data?.homepage) {
          // Filter out Sections that are now separate pages
          const filtered = json.data.homepage.filter(id => id !== 'about' && id !== 'contact');
          setLayout(filtered);
        }
      })
      .catch(err => console.error('Failed to load layout:', err));
  }, []);

  return (
    <>
      <DocumentSEO pageKey="home" />
      {layout.map((sectionId, index) => {
        const Component = componentMap[sectionId];
        if (!Component) return null;
        return <Component key={`${sectionId}-${index}`} />;
      })}
    </>
  );
};

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const dir = i18n.language.startsWith('ar') ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <div className="App">
      <Suspense fallback={<div className="page-loading">Loading…</div>}>
        <Header />
        <Routes>
          <Route path="/" element={<DynamicHome />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/financial-consulting" element={<FinancialConsulting />} />
          <Route path="/technology-innovation" element={<TechInnovation />} />
          <Route path="/management-consulting-hr" element={<ManagementHR />} />
          <Route path="/recruitment" element={<Recruitment />} />
          <Route path="/available-jobs" element={<AvailableJobs />} />
        </Routes>
        <Footer />
        <BackToTop />
      </Suspense>
    </div>
  );
}

export default App;
