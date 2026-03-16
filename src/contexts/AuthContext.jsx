import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [weekUsage, setWeekUsage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('storytok_token');
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  async function loadUser() {
    try {
      const data = await api.getMe();
      setUser(data.user);
      setPreferences(data.preferences);
      setWeekUsage(data.weekUsage || 0);
    } catch (err) {
      localStorage.removeItem('storytok_token');
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    const data = await api.login({ email, password });
    localStorage.setItem('storytok_token', data.token);
    setUser(data.user);
    setPreferences(data.preferences);
    return data;
  }

  async function signup(email, password, name) {
    const data = await api.signup({ email, password, name });
    localStorage.setItem('storytok_token', data.token);
    setUser(data.user);
    return data;
  }

  function logout() {
    localStorage.removeItem('storytok_token');
    setUser(null);
    setPreferences(null);
    setWeekUsage(0);
  }

  async function completeOnboarding(prefs) {
    await api.completeOnboarding(prefs);
    setUser(prev => ({ ...prev, onboarded: 1 }));
    setPreferences(prev => ({ ...prev, ...prefs }));
  }

  async function updatePreferences(prefs) {
    const data = await api.updatePreferences(prefs);
    setPreferences(data.preferences);
  }

  async function upgradePlan() {
    await api.upgradePlan();
    setUser(prev => ({ ...prev, plan: 'pro' }));
  }

  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  }

  function incrementUsage() {
    setWeekUsage(prev => prev + 1);
  }

  return (
    <AuthContext.Provider value={{
      user, preferences, weekUsage, loading,
      login, signup, logout, loadUser,
      completeOnboarding, updatePreferences, upgradePlan,
      showToast, toast, incrementUsage,
      setUser, setPreferences
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
