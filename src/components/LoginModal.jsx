import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const LoginModal = ({ isOpen, onClose, onNavigate }) => {
  const { login, registerWithInvite } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', token: '', phone: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isOpen) {
      setForm({ name: '', email: '', password: '', token: '', phone: '' });
      setError('');
      setSuccess('');
      setMode('login');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  const handleLogin = e => {
    e.preventDefault(); 
    setError('');
    const r = login(form.email, form.password);
    if (r) { // Login returns boolean true/false in AuthContext.jsx. ORIGINAL code used r.success (returning an object). 
             // My AuthContext implementation returned boolean. 
             // WAIT. Looking at my AuthContext code: `return true;` or `return false;`. 
             // The original `LoginModal` code expected `r.success`.
             // I must adapt LoginModal or AuthContext. 
             // Adapting LoginModal to expect boolean is easier now since I already wrote AuthContext.
             // BUT `registerWithInvite` in my AuthContext also returns boolean.
             // Original `LoginModal` used `r.role` from `registerWithInvite`.
             // I should probably update `AuthContext` to return objects or update `LoginModal` logic.
             // Let's check `AuthContext` written again.
             // `login` returns boolean.
             // `registerWithInvite` returns boolean.
             // So I need to handle this manually in LoginModal.
             // If `login` returns true, success.
             // If `login` returns false, error "Invalid credentials".
             
      setSuccess('Login successful!');
      const savedUser = localStorage.getItem('soulmate_user');
      const isAdminUser = savedUser && JSON.parse(savedUser).role === 'admin';
      
      onClose();
      
      setTimeout(() => {
        if (isAdminUser) {
          onNavigate('admin');
        } else {
          onNavigate('home');
        }
      }, 100);
    } else {
      setError('Invalid credentials');
    }
  };

  const handleRegister = e => {
    e.preventDefault(); setError('');
    if (!form.token.trim()) return setError('Enter invite token');
    if (!form.name.trim()) return setError('Enter your name');
    const r = registerWithInvite(form.token.trim().toUpperCase(), form.name, form.email, form.password, form.phone);
    if (r) { 
      // I don't have role returned, need to fetch user again? Or just use "registered".
      setSuccess(`Welcome! You're registered.`); 
      onClose();
      setTimeout(() => { 
        onNavigate('home'); 
      }, 100); 
    }
    else setError('Invalid token or token already used');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay open" onClick={onClose}>
      <div className="modal" style={{maxWidth:'500px',gridTemplateColumns:'1fr'}} onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="modal-content">
          <h2 className="modal-title" style={{textAlign:'center',marginBottom:'0.5rem'}}>{mode === 'login' ? 'Welcome Back' : 'Join Us'}</h2>
          <p style={{textAlign:'center',color:'var(--chocolate)',opacity:0.7,marginBottom:'2rem'}}>{mode === 'login' ? 'Sign in to your account' : 'Register with invite token'}</p>
          <div className="tabs" style={{marginBottom:'1.5rem'}}>
            <button className={`tab ${mode === 'login' ? 'active' : ''}`} onClick={() => { setMode('login'); setError(''); setSuccess(''); }}>Login</button>
            <button className={`tab ${mode === 'invite' ? 'active' : ''}`} onClick={() => { setMode('invite'); setError(''); setSuccess(''); }}>Register</button>
          </div>
          {mode === 'login' ? (
            <form onSubmit={handleLogin}>
              <div className="form-group"><label>Email *</label><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required /></div>
              <div className="form-group"><label>Password *</label><input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required /></div>
              {error && <p className="form-error">{error}</p>}
              <button type="submit" className="form-submit">Sign In</button>

            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <div className="form-group"><label>Invite Token *</label><input type="text" value={form.token} onChange={e => setForm({...form, token: e.target.value.toUpperCase()})} placeholder="XXXXXXXX" style={{textTransform:'uppercase',fontFamily:'monospace'}} required /></div>
              <div className="form-group"><label>Full Name *</label><input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
              <div className="form-group"><label>Email *</label><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required /></div>
              <div className="form-group"><label>Phone Number</label><input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+1 (555) 123-4567" /></div>
              <div className="form-group"><label>Create Password *</label><input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required /></div>
              {error && <p className="form-error">{error}</p>}
              {success && <p className="form-success">{success}</p>}
              <button type="submit" className="form-submit">Register</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
