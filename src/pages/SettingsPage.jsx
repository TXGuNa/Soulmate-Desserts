import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/TranslationContext';
import { Star, Edit2, Trash2 } from 'lucide-react';

const SettingsPage = ({ onNavigate, settings, setSettings, onBaseCurrencyChange }) => {
  const { user, isAdmin } = useAuth();

  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    if (!isAdmin && (activeTab === 'currencies' || activeTab === 'store')) {
      setActiveTab('general');
    }
  }, [isAdmin, activeTab]);
  const [currencyForm, setCurrencyForm] = useState({ code: '', name: '', symbol: '', rate: 1 });
  const [editingCurrency, setEditingCurrency] = useState(null);
  const [shippingInput, setShippingInput] = useState('');

  // Update shipping input when settings or currency changes
  useEffect(() => {
    const rate = settings.currencies.find(c => c.code === settings.currency)?.rate || 1;
    const val = settings.store?.shipping || 0;
    setShippingInput((val * rate).toFixed(2));
  }, [settings.store?.shipping, settings.currency, settings.currencies]);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ru', name: 'Russian' },
    { code: 'tr', name: 'Turkish' },
    { code: 'tk', name: 'Turkmen' }
  ];

  const handleLanguageChange = async (langCode) => {
    const newSettings = { ...settings, language: langCode };
    setSettings(newSettings);
    try {
      await api.updateSettings(newSettings);
    } catch (err) {
      console.error("Failed to save language:", err);
    }
  };

  const handleCurrencyChange = async (currencyCode) => {
    const newSettings = { ...settings, currency: currencyCode };
    setSettings(newSettings);
    try {
      await api.updateSettings(newSettings);
    } catch (err) {
      console.error("Failed to save default currency:", err);
    }
  };

  const handleAddCurrency = async (e) => {
    e.preventDefault();
    let newSettings;
    if (editingCurrency) {
      // If editing a non-base currency, convert the rate back (invert it for storage)
      const storedRate = editingCurrency.rate !== 1 && currencyForm.rate !== 0 
        ? parseFloat((1 / currencyForm.rate).toFixed(6))
        : currencyForm.rate;
      
      newSettings = {
        ...settings,
        currencies: settings.currencies.map(c => 
          c.code === editingCurrency.code 
            ? { ...currencyForm, code: currencyForm.code.toUpperCase(), rate: storedRate }
            : c
        )
      };
    } else {
      newSettings = {
        ...settings,
        currencies: [...settings.currencies, { ...currencyForm, code: currencyForm.code.toUpperCase() }]
      };
    }

    setSettings(newSettings);
    setEditingCurrency(null);
    setCurrencyForm({ code: '', name: '', symbol: '', rate: 1 });

    try {
      await api.updateSettings(newSettings);
    } catch (err) {
      console.error("Failed to save currency changes:", err);
    }
  };

  const handleEditCurrency = (currency) => {
    setEditingCurrency(currency);
    // Store the rate as the inverse if it's not the base currency
    const displayRate = currency.rate !== 0 && currency.rate !== 1 ? parseFloat((1 / currency.rate).toFixed(6)) : currency.rate;
    setCurrencyForm({ ...currency, rate: displayRate });
  };

  const handleDeleteCurrency = async (code) => {
    if (code === 'USD') {
      alert(t('cannotDeleteBase'));
      return;
    }
    if (settings.currency === code) {
      alert(t('cannotDeleteActive'));
      return;
    }
    
    const newSettings = {
      ...settings,
      currencies: settings.currencies.filter(c => c.code !== code)
    };
    
    setSettings(newSettings);
    
    try {
      await api.updateSettings(newSettings);
    } catch (err) {
      console.error("Failed to delete currency:", err);
    }
  };

  const handleUpdateExchangeRate = async (code, newRate) => {
    const newSettings = {
      ...settings,
      currencies: settings.currencies.map(c => 
        c.code === code ? { ...c, rate: parseFloat(newRate) || 1 } : c
      )
    };

    setSettings(newSettings);

    // Debouncing could be good here, but for now direct update
    try {
      await api.updateSettings(newSettings);
    } catch (err) {
      console.error("Failed to update exchange rate:", err);
    }
  };

  const baseCurrencyObj = settings.currencies.find(c => c.rate === 1) || { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1 };
  const currentCurrency = settings.currencies.find(c => c.code === settings.currency) || baseCurrencyObj;

  return (
    <div className="page" style={{maxWidth:'1200px'}}>
      <div className="page-header">
        <h1>{t('settings')}</h1>
        <p style={{color:'var(--chocolate)',opacity:0.7,marginTop:'0.5rem'}}>Manage your language and currency preferences</p>
      </div>

      <div className="tabs" style={{marginBottom:'2rem'}}>
        <button className={`tab ${activeTab === 'general' ? 'active' : ''}`} onClick={() => setActiveTab('general')}>
          {t('general')}
        </button>
        {isAdmin && (
          <button className={`tab ${activeTab === 'currencies' ? 'active' : ''}`} onClick={() => setActiveTab('currencies')}>
            {t('currencies')}
          </button>
        )}
        {isAdmin && (
          <button className={`tab ${activeTab === 'store' ? 'active' : ''}`} onClick={() => setActiveTab('store')}>
            {t('storeSettings')}
          </button>
        )}
      </div>

      {activeTab === 'general' && (
        <div className="form-card">

          <h3 style={{fontFamily:"'Playfair Display',serif",marginBottom:'1.5rem'}}>{t('languageSettings')}</h3>
          <div className="form-group">
            <label>{t('selectLanguage')}</label>
            <select 
              value={settings.language} 
              onChange={e => handleLanguageChange(e.target.value)}
              style={{width:'100%',padding:'1rem',border:'2px solid var(--blush)',borderRadius:'12px',background:'rgba(255,255,255,0.8)'}}
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>


        </div>
      )}

      {activeTab === 'currencies' && isAdmin && (
        <>
          <div className="form-card" style={{marginBottom:'2rem'}}>
            <h3 style={{fontFamily:"'Playfair Display',serif",marginBottom:'1.5rem'}}>
              {editingCurrency ? t('editCurrency') : t('addNewCurrency')}
            </h3>
            <form onSubmit={handleAddCurrency}>
              <div className="form-row">
                <div className="form-group">
                  <label>{t('currencyCode')} *</label>
                  <input 
                    type="text" 
                    value={currencyForm.code} 
                    onChange={e => setCurrencyForm({...currencyForm, code: e.target.value.toUpperCase()})}
                    placeholder="EUR, GBP, JPY, etc."
                    maxLength="3"
                    required
                    disabled={editingCurrency && editingCurrency.rate === 1}
                  />
                </div>
                <div className="form-group">
                  <label>{t('currencyName')} *</label>
                  <input 
                    type="text" 
                    value={currencyForm.name} 
                    onChange={e => setCurrencyForm({...currencyForm, name: e.target.value})}
                    placeholder="Euro, British Pound, etc."
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>{t('symbol')}</label>
                  <input 
                    type="text" 
                    value={currencyForm.symbol} 
                    onChange={e => setCurrencyForm({...currencyForm, symbol: e.target.value})}
                    placeholder="€, £, ¥ (optional)"
                  />
                  <small style={{color:'var(--chocolate)',opacity:0.7,display:'block',marginTop:'0.25rem'}}>
                    {t('symbolOptionalNote') || 'Leave blank to use currency code as symbol'}
                  </small>
                </div>
                <div className="form-group">
                  <label>{t('exchangeRate')} {editingCurrency && editingCurrency.rate !== 1 ? `(1 ${currencyForm.code} = ?)` : `(1 ${baseCurrencyObj.code} = ?)`} *</label>
                  <input 
                    type="number" 
                    step="0.0001"
                    value={currencyForm.rate} 
                    onChange={e => setCurrencyForm({...currencyForm, rate: parseFloat(e.target.value) || 1})}
                    placeholder="1.0"
                    min="0.0001"
                    required
                  />
                  <small style={{color:'var(--chocolate)',opacity:0.7,display:'block',marginTop:'0.25rem'}}>
                    {editingCurrency && editingCurrency.rate !== 1 
                      ? `1 ${currencyForm.code || 'XXX'} = ${currencyForm.rate} ${baseCurrencyObj.code}`
                      : `1 ${baseCurrencyObj.code} = ${currencyForm.rate} ${currencyForm.code || 'XXX'}`
                    }
                  </small>
                </div>
              </div>
              <div style={{display:'flex',gap:'1rem'}}>
                <button type="submit" className="btn btn-primary">
                  {editingCurrency ? t('updateCurrency') : t('confirmAddCurrency')}
                </button>
                {editingCurrency && (
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => {
                      setEditingCurrency(null);
                      setCurrencyForm({ code: '', name: '', symbol: '', rate: 1 });
                    }}
                  >
                    {t('cancel')}
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="form-card">
            <h3 style={{fontFamily:"'Playfair Display',serif",marginBottom:'1.5rem'}}>{t('manageCurrencies')}</h3>
            {settings.currencies.length === 0 ? (
              <p style={{color:'var(--chocolate)',opacity:0.7}}>{t('noCurrenciesAdded')}</p>
            ) : (
              <div style={{overflowX:'auto'}}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{width:'40px'}}>{t('defaultCurrency')}</th>
                      <th>{t('currencyCode')}</th>
                      <th>{t('currencyName')}</th>
                      <th>{t('symbol')}</th>
                      <th>{t('exchangeRate')}</th>
                      <th style={{textAlign:'center'}}>{t('actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {settings.currencies.map(curr => (
                      <tr key={curr.code}>
                        <td style={{textAlign:'center'}}>
                          <button
                            onClick={() => {
                                if (curr.rate !== 1 && onBaseCurrencyChange) {
                                  // If not base currency, perform full rotation (updates rates + active currency)
                                  onBaseCurrencyChange(curr.code);
                                } else {
                                  // If already base currency (rate 1), just set as active
                                  handleCurrencyChange(curr.code);
                                }
                            }}
                            title={t('setDefault')}
                            style={{background:'none',border:'none',cursor:'pointer',padding:'4px'}}
                          >
                            <Star 
                              size={20} 
                              fill={settings.currency === curr.code ? "#d4af37" : "none"} 
                              color={settings.currency === curr.code ? "#d4af37" : "#ccc"} 
                            />
                          </button>
                        </td>
                        <td><strong>{curr.code}</strong></td>
                        <td>{curr.name}</td>
                        <td>{curr.symbol}</td>
                        <td>
                          {curr.rate === 1 ? (
                            <span>1 ({t('baseCurrencyLabel')})</span>
                          ) : (
                            <input 
                              type="number" 
                              step="0.0001"
                              value={curr.rate !== 0 ? parseFloat((1 / curr.rate).toFixed(6)) : 1} 
                              onChange={e => {
                                const displayRate = parseFloat(e.target.value) || 1;
                                const storedRate = displayRate !== 0 ? parseFloat((1 / displayRate).toFixed(6)) : 1;
                                handleUpdateExchangeRate(curr.code, storedRate);
                              }}
                              style={{width:'120px',padding:'0.5rem',border:'2px solid var(--blush)',borderRadius:'8px',background:'rgba(255,255,255,0.8)'}}
                            />
                          )}
                        </td>
                        <td style={{textAlign:'center'}}>
                          {curr.rate !== 1 && (
                            <div style={{display:'flex',gap:'0.5rem',justifyContent:'center'}}>
                              <button 
                                className="btn btn-small btn-secondary icon-btn" 
                                onClick={() => handleEditCurrency(curr)}
                                title={t('edit')}
                                style={{padding:'0.5rem',display:'flex',alignItems:'center',justifyContent:'center'}}
                              >
                                <Edit2 size={16} />
                              </button>
                              <button 
                                className="btn btn-small btn-danger icon-btn" 
                                onClick={() => handleDeleteCurrency(curr.code)}
                                title={t('delete')}
                                style={{padding:'0.5rem',display:'flex',alignItems:'center',justifyContent:'center'}}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'store' && isAdmin && (
        <div className="form-card">
          <h3 style={{fontFamily:"'Playfair Display',serif",marginBottom:'1.5rem'}}>{t('storeSettings')}</h3>
          <div className="form-group">
            <label>{t('shippingCost')} ({currentCurrency.symbol || currentCurrency.code})</label>
            <input 
              type="number" 
              value={shippingInput} 
              onChange={e => setShippingInput(e.target.value)}
              onBlur={() => {
                  const val = parseFloat(shippingInput);
                  if (!isNaN(val)) {
                    const baseVal = val / currentCurrency.rate;
                    setSettings(prev => ({ ...prev, store: { ...prev.store, shipping: baseVal } }));
                    // Optional: re-format on blur to look nice
                    setShippingInput(val.toFixed(2));
                  } else {
                    setSettings(prev => ({ ...prev, store: { ...prev.store, shipping: 0 } }));
                    setShippingInput('0.00');
                  }
              }}
              style={{width:'100%',padding:'1rem',border:'2px solid var(--blush)',borderRadius:'12px',background:'rgba(255,255,255,0.8)'}}
            />
          </div>
          <div className="form-group">
            <label>{t('taxRate')}</label>
            <input 
              type="number" 
              value={settings.store?.taxRate || 0} 
              onChange={e => setSettings(prev => ({ ...prev, store: { ...prev.store, taxRate: parseFloat(e.target.value) || 0 } }))}
              style={{width:'100%',padding:'1rem',border:'2px solid var(--blush)',borderRadius:'12px',background:'rgba(255,255,255,0.8)'}}
            />
          </div>
          <button 
            className="btn btn-primary"
            style={{marginTop:'1rem'}}
            onClick={async () => {
              try {
                await api.updateSettings(settings);
                alert(t('success'));
              } catch (err) {
                console.error(err);
                alert(t('error'));
              }
            }}
          >
            {t('saveChanges')}
          </button>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
