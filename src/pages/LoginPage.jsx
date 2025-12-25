import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/TranslationContext';

const LoginPage = ({ onNavigate }) => {
  const { login, registerWithInvite } = useAuth();
  const { t } = useTranslation();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', token: '', phone: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault(); 
    setError('');
    setSuccess('');
    setIsLoading(true);
    
    // AuthContext login returns boolean
    const result = login(form.email, form.password);
    
    // Original code expected object { success: true/false }
    // My AuthContext returns boolean.
    // I need to adapt here. 
    if (result === true) {
      setSuccess(t('loginSuccessful'));
      const savedUser = localStorage.getItem('soulmate_user');
      const isAdminUser = savedUser && JSON.parse(savedUser).role === 'admin';
      
      setTimeout(() => {
        setIsLoading(false);
        if (isAdminUser) {
          onNavigate('admin');
        } else {
          onNavigate('home');
        }
      }, 500);
    } else {
      setIsLoading(false);
      setError(t('invalidCredentials'));
    }
  };

  const handleRegister = (e) => {
    e.preventDefault(); 
    setError('');
    setSuccess('');
    
    if (!form.token.trim()) {
      setError(t('inviteToken') + ' ' + t('required'));
      return;
    }
    if (!form.name.trim()) {
      setError(t('fullName') + ' ' + t('required'));
      return;
    }
    if (!form.email.trim()) {
      setError(t('email') + ' ' + t('required'));
      return;
    }
    if (!form.password.trim()) {
      setError(t('password') + ' ' + t('required'));
      return;
    }
    
    // AuthContext registerWithInvite returns boolean
    const result = registerWithInvite(form.token.trim().toUpperCase(), form.name, form.email, form.password, form.phone);
    if (result === true) { 
      setSuccess(t('success') + '!'); 
      setTimeout(() => onNavigate('home'), 500); 
    } else {
      setError(t('error')); // Or specific error if AuthContext returned it? My AuthContext returns boolean false.
      // Ideally update AuthContext to return reason, but strictly keeping to boolean for now.
    }
  };

  return (
    <div className="page" style={{maxWidth:'480px'}}>
      <div className="page-header">
        <h1>{mode === 'login' ? t('welcomeBack') : t('joinUs')}</h1>
        <p>{mode === 'login' ? t('signInToAccount') : t('registerWithInvite')}</p>
      </div>
      <div className="form-card">
        <div className="tabs">
          <button className={`tab ${mode === 'login' ? 'active' : ''}`} onClick={() => { setMode('login'); setError(''); setSuccess(''); }}>{t('login')}</button>
          <button className={`tab ${mode === 'invite' ? 'active' : ''}`} onClick={() => { setMode('invite'); setError(''); setSuccess(''); }}>{t('register')}</button>
        </div>
        {mode === 'login' ? (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>{t('email')} *</label>
              <input 
                type="email" 
                value={form.email} 
                onChange={e => setForm({...form, email: e.target.value})} 
                placeholder="admin@soulmate.com"
                required 
              />
            </div>
            <div className="form-group">
              <label>{t('password')} *</label>
              <input 
                type="password" 
                value={form.password} 
                onChange={e => setForm({...form, password: e.target.value})} 
                required 
              />
            </div>
            {error && <p className="form-error">{error}</p>}
            {success && <p className="form-success">{success}</p>}
            <button type="submit" className="form-submit" disabled={isLoading}>
              {isLoading ? t('signingIn') : t('signIn')}
            </button>
            <div style={{marginTop:'2rem',padding:'1.25rem',background:'var(--blush)',borderRadius:'12px',fontSize:'0.9rem'}}>
              <strong>🔐 {t('adminLogin')}:</strong><br/>
              <span style={{fontFamily:'monospace'}}>admin@soulmate.com</span><br/>
              <span style={{fontFamily:'monospace'}}>Admin@2024!</span>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label>{t('inviteToken')} *</label>
              <input 
                type="text" 
                value={form.token} 
                onChange={e => setForm({...form, token: e.target.value.toUpperCase()})} 
                placeholder="XXXXXXXX" 
                style={{textTransform:'uppercase',fontFamily:'monospace'}} 
                required 
              />
              <small style={{color:'var(--chocolate)',opacity:0.7,display:'block',marginTop:'0.5rem'}}>{t('enterInviteToken')}</small>
            </div>
            <div className="form-group">
              <label>{t('fullName')} *</label>
              <input 
                type="text" 
                value={form.name} 
                onChange={e => setForm({...form, name: e.target.value})} 
                required 
              />
            </div>
            <div className="form-group">
              <label>{t('email')} *</label>
              <input 
                type="email" 
                value={form.email} 
                onChange={e => setForm({...form, email: e.target.value})} 
                required 
              />
            </div>
            <div className="form-group">
              <label>{t('phone')} ({t('optional')})</label>
               <input 
                type="tel" 
                value={form.phone} 
                onChange={e => setForm({...form, phone: e.target.value})} 
              />
            </div>
            <div className="form-group">
              <label>{t('createPassword')} *</label>
              <input 
                type="password" 
                value={form.password} 
                onChange={e => setForm({...form, password: e.target.value})} 
                required 
              />
            </div>
            {error && <p className="form-error">{error}</p>}
            {success && <p className="form-success">{success}</p>}
            <button type="submit" className="form-submit">
              {t('register')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
