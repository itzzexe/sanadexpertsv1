import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageCircle, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './ContactModal.css';

const ContactModal = ({ isOpen, onClose, phoneNumber }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const cleanPhone = phoneNumber.replace(/\s+/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone.replace('+', '')}`;
  const callUrl = `tel:${cleanPhone}`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="contact-modal-overlay"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="contact-modal-content glass-card"
          onClick={(e) => e.stopPropagation()}
        >
          <button className="contact-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
          
          <h3 className="contact-modal-title">{t('whatsapp.title')}</h3>
          <p className="contact-modal-phone" dir="ltr">{phoneNumber}</p>
          
          <div className="contact-modal-options">
            <a href={callUrl} className="contact-option-card call" onClick={onClose}>
              <div className="option-icon">
                <Phone size={24} />
              </div>
              <span>{t('contact.phone')}</span>
            </a>
            
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="contact-option-card whatsapp" onClick={onClose}>
              <div className="option-icon">
                <MessageCircle size={24} />
              </div>
              <span>WhatsApp</span>
            </a>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ContactModal;
