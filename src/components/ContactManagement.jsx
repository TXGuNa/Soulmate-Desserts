import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useTranslation } from '../context/TranslationContext';
import { Trash2, Edit2, Plus, Globe, Phone, Mail, Check, X, Star, MapPin } from 'lucide-react';

const ContactManagement = ({ onDefaultChange, userCountry }) => {
  const { t } = useTranslation();
  const [contacts, setContacts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [detectedCountry, setDetectedCountry] = useState(null);
  const [formData, setFormData] = useState({
    country: '',
    countryCode: '',
    email: '',
    phone: '',
    isDefault: false
  });

  useEffect(() => {
    loadContacts();
    detectUserCountry();
  }, []);

  // Auto-sync based on user location when contacts are loaded
  useEffect(() => {
    if (contacts.length > 0 && detectedCountry) {
      autoSyncBasedOnLocation();
    }
  }, [contacts, detectedCountry]);

  const detectUserCountry = async () => {
    try {
      // Use prop if provided, otherwise detect via IP
      if (userCountry) {
        setDetectedCountry(userCountry);
      } else {
        const countryData = await api.getCountryFromIP();
        setDetectedCountry(countryData.country_code);
      }
    } catch (err) {
      console.error('Failed to detect country:', err);
      setDetectedCountry('GENERAL');
    }
  };

  const autoSyncBasedOnLocation = () => {
    // Check if there's already a manually set default (isDefault: true)
    const manualDefault = contacts.find(c => c.isDefault);
    
    // If there's a manual default, respect it and sync
    if (manualDefault) {
      syncDefaultToSettings(manualDefault);
      return;
    }
    
    // Otherwise, auto-select based on detected location
    // First, try to find a contact matching the user's country
    const matchingContact = contacts.find(c => 
      c.countryCode === detectedCountry || 
      c.countryCode?.toUpperCase() === detectedCountry?.toUpperCase()
    );
    
    if (matchingContact) {
      // Sync the matching country contact
      syncDefaultToSettings(matchingContact);
    } else {
      // Fall back to General contact
      const generalContact = contacts.find(c => 
        c.countryCode?.toUpperCase() === 'GENERAL' || 
        c.country?.toLowerCase() === 'general'
      );
      if (generalContact) {
        syncDefaultToSettings(generalContact);
      }
    }
  };

  const loadContacts = async () => {
    try {
      const data = await api.getCountryContacts();
      setContacts(data);
    } catch (err) {
      console.error('Failed to load country contacts:', err);
    }
  };

  // Sync default contact to main settings
  const syncDefaultToSettings = async (contact) => {
    if (onDefaultChange) {
      onDefaultChange({
        email: contact.email,
        phone: contact.phone
      });
    }
  };

  const resetForm = () => {
    setFormData({ country: '', countryCode: '', email: '', phone: '', isDefault: false });
    setEditingContact(null);
    setIsEditing(false);
  };

  const handleEdit = (contact) => {
    setFormData({
      country: contact.country,
      countryCode: contact.countryCode,
      email: contact.email,
      phone: contact.phone,
      isDefault: contact.isDefault
    });
    setEditingContact(contact);
    setIsEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // If setting this as default, remove default from others
      if (formData.isDefault && !editingContact?.isDefault) {
        const currentDefault = contacts.find(c => c.isDefault);
        if (currentDefault) {
          await api.updateCountryContact(currentDefault.id, { ...currentDefault, isDefault: false });
        }
      }

      let savedContact;
      if (editingContact) {
        // Update existing
        savedContact = { ...editingContact, ...formData };
        await api.updateCountryContact(editingContact.id, savedContact);
      } else {
        // Create new
        savedContact = {
          id: formData.countryCode.toLowerCase(),
          ...formData
        };
        await api.createCountryContact(savedContact);
      }
      
      // If this contact is/becomes default, sync to main settings
      if (savedContact.isDefault) {
        await syncDefaultToSettings(savedContact);
      }
      
      await loadContacts();
      resetForm();
    } catch (err) {
      console.error('Failed to save contact:', err);
    }
  };

  const handleDelete = async (contact) => {
    if (contact.isDefault) {
      alert(t('cannotDeleteDefault'));
      return;
    }
    
    if (window.confirm(t('deleteCountryContact'))) {
      try {
        await api.deleteCountryContact(contact.id);
        await loadContacts();
      } catch (err) {
        console.error('Failed to delete contact:', err);
      }
    }
  };

  const handleSetDefault = async (contact) => {
    try {
      // Remove default from current default
      const currentDefault = contacts.find(c => c.isDefault);
      if (currentDefault) {
        await api.updateCountryContact(currentDefault.id, { ...currentDefault, isDefault: false });
      }
      // Set new default
      const updatedContact = { ...contact, isDefault: true };
      await api.updateCountryContact(contact.id, updatedContact);
      
      // Sync the new default contact to main settings
      await syncDefaultToSettings(updatedContact);
      
      await loadContacts();
    } catch (err) {
      console.error('Failed to set default:', err);
    }
  };

  // Common country codes for quick selection
  const commonCountries = [
    { code: 'GENERAL', name: 'General (Default)' },
    { code: 'US', name: 'United States' },
    { code: 'TM', name: 'Turkmenistan' },
    { code: 'TR', name: 'Turkey' },
    { code: 'RU', name: 'Russia' },
    { code: 'DE', name: 'Germany' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'FR', name: 'France' },
    { code: 'AE', name: 'UAE' },
    { code: 'KZ', name: 'Kazakhstan' },
    { code: 'UZ', name: 'Uzbekistan' },
  ];

  return (
    <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '2px solid var(--blush)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h4 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--espresso)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Globe size={20} /> {t('countryContacts')}
          </h4>
          <p style={{ color: 'var(--chocolate)', opacity: 0.7, fontSize: '0.9rem' }}>
            {t('countryContactsDescription')}
          </p>
          {detectedCountry && (
            <p style={{ color: 'var(--sage)', fontSize: '0.85rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <MapPin size={14} /> {t('yourLocation') || 'Your location'}: <strong>{detectedCountry}</strong>
            </p>
          )}
        </div>
        {!isEditing && (
          <button
            className="btn btn-primary btn-small"
            onClick={() => setIsEditing(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={16} /> {t('addCountryContact')}
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {isEditing && (
        <div style={{ 
          background: 'var(--blush)', 
          padding: '1.5rem', 
          borderRadius: '16px', 
          marginBottom: '1.5rem' 
        }}>
          <h5 style={{ marginBottom: '1rem', fontFamily: "'Playfair Display', serif" }}>
            {editingContact ? t('editCountryContact') : t('addCountryContact')}
          </h5>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>{t('countryName')} *</label>
                <input
                  type="text"
                  required
                  value={formData.country}
                  onChange={e => setFormData({ ...formData, country: e.target.value })}
                  placeholder="e.g., United States"
                />
              </div>
              <div className="form-group">
                <label>{t('countryCode')} *</label>
                <select
                  value={formData.countryCode}
                  onChange={e => {
                    const selected = commonCountries.find(c => c.code === e.target.value);
                    setFormData({ 
                      ...formData, 
                      countryCode: e.target.value,
                      country: selected && e.target.value !== 'custom' ? selected.name : formData.country
                    });
                  }}
                  style={{ marginBottom: formData.countryCode === 'custom' ? '0.5rem' : 0 }}
                >
                  <option value="">-- {t('selectLanguage')} --</option>
                  {commonCountries.map(c => (
                    <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                  ))}
                  <option value="custom">Other (Custom)</option>
                </select>
                {formData.countryCode === 'custom' && (
                  <input
                    type="text"
                    maxLength={2}
                    placeholder="XX"
                    style={{ marginTop: '0.5rem', textTransform: 'uppercase' }}
                    onChange={e => setFormData({ ...formData, countryCode: e.target.value.toUpperCase() })}
                  />
                )}
                <small style={{ color: 'var(--chocolate)', opacity: 0.6, fontSize: '0.8rem' }}>
                  {t('countryCodeHelp')}
                </small>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label><Mail size={14} style={{ marginRight: '0.25rem' }} />{t('email')} *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contact@example.com"
                />
              </div>
              <div className="form-group">
                <label><Phone size={14} style={{ marginRight: '0.25rem' }} />{t('phone')} *</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="checkbox"
                id="isDefault"
                checked={formData.isDefault}
                onChange={e => setFormData({ ...formData, isDefault: e.target.checked })}
                style={{ width: 'auto' }}
              />
              <label htmlFor="isDefault" style={{ cursor: 'pointer', marginBottom: 0 }}>
                {t('setAsDefault')} ({t('countryContactsDescription').split('.')[0]})
              </label>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="submit" className="btn btn-primary btn-small">
                <Check size={16} /> {editingContact ? t('save') : t('add')}
              </button>
              <button type="button" className="btn btn-secondary btn-small" onClick={resetForm}>
                <X size={16} /> {t('cancel')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Contacts List */}
      {contacts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--chocolate)', opacity: 0.7 }}>
          <Globe size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <p>{t('noCountryContacts')}</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {contacts.map(contact => {
            const isLocationMatch = contact.countryCode?.toUpperCase() === detectedCountry?.toUpperCase();
            const isGeneralFallback = contact.countryCode?.toUpperCase() === 'GENERAL' && 
              !contacts.some(c => c.countryCode?.toUpperCase() === detectedCountry?.toUpperCase());
            const shouldHighlightLocation = isLocationMatch || isGeneralFallback;
            
            return (
            <div
              key={contact.id}
              style={{
                background: contact.isDefault ? 'linear-gradient(135deg, rgba(212,133,106,0.1), rgba(248,232,224,0.5))' : 'white',
                border: contact.isDefault ? '2px solid var(--terracotta)' : shouldHighlightLocation ? '2px solid var(--sage)' : '1px solid var(--blush)',
                borderRadius: '12px',
                padding: '1rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                <div style={{
                  width: '45px',
                  height: '45px',
                  borderRadius: '50%',
                  background: contact.isDefault ? 'var(--terracotta)' : shouldHighlightLocation ? 'var(--sage)' : 'var(--blush)',
                  color: contact.isDefault || shouldHighlightLocation ? 'white' : 'var(--chocolate)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.8rem'
                }}>
                  {contact.countryCode === 'GENERAL' ? <Globe size={20} /> : contact.countryCode}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: 'var(--espresso)', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {contact.country}
                    {contact.isDefault && (
                      <span style={{
                        background: 'var(--terracotta)',
                        color: 'white',
                        fontSize: '0.7rem',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '20px',
                        fontWeight: 500
                      }}>
                        {t('defaultContact')}
                      </span>
                    )}
                    {shouldHighlightLocation && !contact.isDefault && (
                      <span style={{
                        background: 'var(--sage)',
                        color: 'white',
                        fontSize: '0.7rem',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '20px',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}>
                        <MapPin size={10} /> {t('yourLocation') || 'Your Location'}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.25rem', fontSize: '0.9rem', color: 'var(--chocolate)', opacity: 0.8 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Mail size={14} /> {contact.email}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Phone size={14} /> {contact.phone}
                    </span>
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button
                  onClick={() => !contact.isDefault && handleSetDefault(contact)}
                  title={contact.isDefault ? t('defaultContact') : t('setAsDefault')}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: contact.isDefault ? 'default' : 'pointer',
                    padding: '0.5rem',
                    color: contact.isDefault ? '#F5A623' : 'var(--rose)',
                    transition: 'all 0.2s'
                  }}
                >
                  <Star size={20} fill={contact.isDefault ? '#F5A623' : 'none'} />
                </button>
                <button
                  onClick={() => handleEdit(contact)}
                  title={t('edit')}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.5rem',
                    color: 'var(--chocolate)'
                  }}
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(contact)}
                  title={t('delete')}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: contact.isDefault ? 'not-allowed' : 'pointer',
                    padding: '0.5rem',
                    color: contact.isDefault ? 'var(--rose)' : '#DC3545',
                    opacity: contact.isDefault ? 0.4 : 1
                  }}
                  disabled={contact.isDefault}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
          })}
        </div>
      )}
    </div>
  );
};

export default ContactManagement;
