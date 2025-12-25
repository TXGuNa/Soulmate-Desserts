import React, { useState, useEffect } from 'react';
import { useTranslation } from '../context/TranslationContext';
import { api } from '../api/client';

const Footer = ({ onNavigate, contactInfo }) => {
  const { t } = useTranslation();
  const [footerContact, setFooterContact] = useState(contactInfo);
  
  // Fetch latest settings on mount to ensure we have current contact info
  useEffect(() => {
    const fetchLatestSettings = async () => {
      try {
        const latestSettings = await api.getSettings();
        if (latestSettings?.contactInfo) {
          setFooterContact(latestSettings.contactInfo);
        }
      } catch (err) {
        console.error('Failed to fetch settings for footer:', err);
      }
    };
    fetchLatestSettings();
  }, []);
  
  // Also update when contactInfo prop changes
  useEffect(() => {
    if (contactInfo) {
      setFooterContact(contactInfo);
    }
  }, [contactInfo]);
  
  const phone = footerContact?.phone || '(512) 555-CAKE';
  const email = footerContact?.email || 'hello@soulmatedesserts.com';

  return (
  <footer className="footer">
    <div className="footer-content">
      <div className="footer-brand"><img src="/Soulmate.png" alt="Soulmate Desserts" style={{height:'60px',width:'auto',objectFit:'contain',maxWidth:'300px',display:'block',marginBottom:'0.5rem'}} /><p>{t('footerDescription')}</p></div>
      <div className="footer-section"><h4>{t('quickLinks')}</h4><ul><li><a onClick={() => onNavigate('home')}>{t('home')}</a></li><li><a onClick={() => onNavigate('catalog')}>{t('ourCakes')}</a></li><li><a onClick={() => onNavigate('contact')}>{t('contact')}</a></li></ul></div>
      <div className="footer-section"><h4>{t('contact')}</h4><ul><li>{phone}</li><li>{email}</li></ul></div>
    </div>
    <div className="footer-bottom"><p>© 2025 Soulmate Desserts. {t('madeWithLove')}</p></div>
  </footer>
);
};

export default Footer;
