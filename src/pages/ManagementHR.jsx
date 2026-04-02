import React from 'react';
import ServicePageTemplate from '../components/ServicePageTemplate';
import Recruitment from '../components/Recruitment';

const ManagementHR = () => {
  const { hash } = window.location;
  
  React.useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    }
  }, [hash]);

  return (
    <ServicePageTemplate 
      serviceKey="consulting" 
      seoKey="management_consulting" 
    >
      <div id="join-us-section" className="container">
        <Recruitment />
      </div>
    </ServicePageTemplate>
  );
};

export default ManagementHR;
