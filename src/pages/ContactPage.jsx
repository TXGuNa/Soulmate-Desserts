import React, { useState, useEffect } from 'react';
import { useTranslation } from '../context/TranslationContext';
import { api } from '../api/client';
import { Globe, Mail, Phone, MapPin } from 'lucide-react';

const ContactPage = ({ onNavigate }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle, submitting, success
  const [userLocation, setUserLocation] = useState({ countryCode: null, countryName: null });
  const [contactInfo, setContactInfo] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);

  useEffect(() => {
    // Get user's country from IP and load appropriate contact info
    const loadContactInfo = async () => {
      try {
        setLoadingLocation(true);
        
        // Fetch location and contacts in parallel for faster loading
        const [location, contacts] = await Promise.all([
          api.getCountryFromIP(),
          api.getCountryContacts()
        ]);
        
        setUserLocation(location);
        
        // Find matching contact for user's country
        let matchingContact = contacts.find(c => c.countryCode === location.countryCode);
        
        // If no match, use default contact
        if (!matchingContact) {
          matchingContact = contacts.find(c => c.isDefault) || contacts[0];
        }
        
        setContactInfo(matchingContact);
      } catch (err) {
        console.error('Failed to load contact info:', err);
        // Try to load at least contacts if IP fails
        try {
           const contacts = await api.getCountryContacts();
           const defaultContact = contacts.find(c => c.isDefault) || contacts[0];
           setContactInfo(defaultContact);
        } catch (e) { console.error('Double fail', e); }
      } finally {
        setLoadingLocation(false);
      }
    };
    
    loadContactInfo();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('submitting');
    
    setTimeout(() => {
      const newMsg = {
        id: Date.now(),
        ...formData,
        date: new Date().toISOString(),
        read: false
      };
      
      const existing = JSON.parse(localStorage.getItem('soulmate_messages') || '[]');
      localStorage.setItem('soulmate_messages', JSON.stringify([newMsg, ...existing]));
      
      setStatus('success');
    }, 1500);
  };

  if (status === 'success') {
    return (
      <div className="page">
        <div className="success-msg">
          <div className="success-icon">💌</div>
          <h2>{t('messageSent')}</h2>
          <p>{t('messageCreateSuccess') || t('messageSentConfirm')}</p>
          <button className="btn btn-primary" onClick={() => onNavigate('home')}>{t('back')}</button>
          <button 
            className="btn btn-secondary" 
            style={{marginTop: '1rem', marginLeft: '1rem'}}
            onClick={() => { setStatus('idle'); setFormData({ name: '', phone: '', email: '', message: '' }); }}
          >
            {t('sendAnother') || 'Send Another'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page" style={{maxWidth:'600px'}}>
      <div className="page-header"><h1>{t('getInTouch')}</h1><p>{t('contactSubtitle')}</p></div>
      
      {/* Contact Form */}
      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>{t('name')} *</label>
              <input 
                type="text" 
                required 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>{t('phone')} *</label>
              <input 
                type="tel" 
                required 
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>
          <div className="form-group">
            <label>{t('email')}</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>{t('message')} *</label>
            <textarea 
              required 
              placeholder={t('tellUsAboutDreamDessert')}
              value={formData.message}
              onChange={e => setFormData({...formData, message: e.target.value})}
            />
          </div>
          <button 
            type="submit" 
            className="form-submit" 
            disabled={status === 'submitting'}
            style={{opacity: status === 'submitting' ? 0.7 : 1}}
          >
            {status === 'submitting' ? t('loading') : t('sendMessage')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
