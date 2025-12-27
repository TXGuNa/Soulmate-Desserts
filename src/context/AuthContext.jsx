import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';
import { ADMIN } from '../data/mockData';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('public');
  const [invites, setInvites] = useState([]);
  const [users, setUsers] = useState([]);
  const [authVersion, setAuthVersion] = useState(0);

  // Load User Session
  useEffect(() => {
    const savedUser = localStorage.getItem('soulmate_user');
    if (savedUser) {
      const u = JSON.parse(savedUser);
      setUser(u);
      setRole(u.role);
    }
  }, []);

  // Fetch Users and Invites from API
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const [usersData, invitesData] = await Promise.all([
          api.getUsers(),
          api.getInvites()
        ]);
        setUsers(usersData);
        setInvites(invitesData);
      } catch (error) {
        console.error("Failed to load auth data:", error);
      }
    };
    loadAuthData();
  }, [authVersion]); // reload if auth version changes (e.g. after registration)

  const login = (email, password) => {

    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const u = { name: foundUser.name, email: foundUser.email, role: foundUser.role };
      setUser(u);
      setRole(u.role);
      localStorage.setItem('soulmate_user', JSON.stringify(u));
      return true;
    }
    return false;
  };

  const registerWithInvite = async (token, name, email, password) => {
    const invite = invites.find(i => i.token === token && !i.used);
    if (invite) {
      const newUser = { 
        id: Date.now().toString(), 
        name, 
        email, 
        password, 
        role: invite.role, 
        createdAt: new Date().toISOString() 
      };
      
      try {
        // 1. Create User
        await api.createUser(newUser);
        
        // 2. Mark invite as used
        const updatedInvite = { ...invite, used: true };
        await api.updateInvite(invite.id, updatedInvite);
        
        // 3. Update local state
        setUsers([...users, newUser]);
        setInvites(invites.map(i => i.id === invite.id ? updatedInvite : i));
        
        // 4. Auto-login
        const u = { name: newUser.name, email: newUser.email, role: newUser.role };
        setUser(u);
        setRole(u.role);
        localStorage.setItem('soulmate_user', JSON.stringify(u));
        setAuthVersion(v => v + 1);
        return true;
      } catch (err) {
        console.error("Registration failed:", err);
        return false;
      }
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setRole('public');
    localStorage.removeItem('soulmate_user');
  };

  const createInvite = async (role, email = '', expiresInDays = 7) => {
    const token = Math.random().toString(36).substr(2, 8).toUpperCase();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + parseInt(expiresInDays));
    
    const newInvite = { 
      id: Date.now().toString(), 
      token, 
      role, 
      email, 
      used: false, 
      expiresAt: expiresAt.toISOString().split('T')[0] 
    };
    
    try {
      const res = await api.createInvite(newInvite);
      setInvites([...invites, res]);
      return { success: true, invite: res };
    } catch (err) {
      console.error("Failed to create invite:", err);
      return { success: false };
    }
  };

  const deleteInvite = async (id) => {
    try {
      await api.deleteInvite(id);
      setInvites(invites.filter(i => i.id !== id));
    } catch (err) {
      console.error("Failed to delete invite:", err);
    }
  };

  const deleteUser = async (id) => {
    try {
      await api.deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
       console.error("Failed to delete user:", err);
    }
  };

  const isAdmin = role === 'admin' || role === 'owner';
  const isDealer = role === 'dealer' || role === 'admin' || role === 'owner';

  return <AuthContext.Provider value={{ user, role, login, logout, registerWithInvite, createInvite, deleteInvite, deleteUser, invites, users, isDealer, isAdmin, authVersion }}>{children}</AuthContext.Provider>;
};
