import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { PLATFORMS, TONES, STORY_LENGTHS, CONTENT_STYLES } from '../utils/constants';
import {
  User, Palette, Crown, LogOut, ChevronRight, Save,
  Bell, Shield, HelpCircle
} from 'lucide-react';

export default function Settings() {
  const { user, preferences, logout, updatePreferences, showToast, setUser } = useAuth();
  const navigate = useNavigate();
  const [editingProfile, setEditingProfile] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [editingPrefs, setEditingPrefs] = useState(false);
  const [prefs, setPrefs] = useState({
    platform: preferences?.platform || 'tiktok',
    content_style: preferences?.content_style || 'crazy-true-story',
    tone: preferences?.tone || 'dramatic',
    story_length: preferences?.story_length || '60'
  });

  async function handleSaveProfile() {
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('storytok_token')}`
        },
        body: JSON.stringify({ name })
      });
      const data = await res.json();
      setUser(data.user);
      setEditingProfile(false);
      showToast('Profile updated!');
    } catch (err) {
      showToast('Failed to update');
    }
  }

  async function handleSavePrefs() {
    try {
      await updatePreferences(prefs);
      setEditingPrefs(false);
      showToast('Preferences saved!');
    } catch (err) {
      showToast('Failed to save');
    }
  }

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
      </div>

      {/* Profile Section */}
      <div className="section">
        <div className="section-title">
          <User size={16} color="var(--accent)" /> Profile
        </div>
        <div className="card" style={{ padding: 16 }}>
          {editingProfile ? (
            <div>
              <div className="form-group" style={{ marginBottom: 12 }}>
                <label className="form-label">Name</label>
                <input className="form-input" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: 12 }}>
                <label className="form-label">Email</label>
                <input className="form-input" value={user?.email} disabled style={{ opacity: 0.5 }} />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-primary btn-sm" onClick={handleSaveProfile}>
                  <Save size={14} /> Save
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => setEditingProfile(false)}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{user?.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{user?.email}</div>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => setEditingProfile(true)}>
                  Edit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Plan */}
      <div className="section">
        <div className="section-title">
          <Crown size={16} color="var(--accent)" /> Subscription
        </div>
        <button
          className="card"
          onClick={() => navigate('/upgrade')}
          style={{ cursor: 'pointer', padding: 16, width: '100%', textAlign: 'left' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontWeight: 600, fontSize: 15 }}>
                  {user?.plan === 'pro' ? 'Pro Plan' : 'Free Plan'}
                </span>
                <span className={`badge ${user?.plan === 'pro' ? 'badge-pro' : 'badge-free'}`}>
                  {user?.plan === 'pro' ? 'PRO' : 'FREE'}
                </span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                {user?.plan === 'pro' ? 'Unlimited generations' : '3 free stories/week'}
              </div>
            </div>
            <ChevronRight size={18} color="var(--text-muted)" />
          </div>
        </button>
      </div>

      {/* Preferences */}
      <div className="section">
        <div className="section-title">
          <Palette size={16} color="var(--accent)" /> Content Preferences
        </div>
        <div className="card" style={{ padding: 16 }}>
          {editingPrefs ? (
            <div>
              <div className="form-group">
                <label className="form-label">Default Platform</label>
                <select
                  className="form-select"
                  value={prefs.platform}
                  onChange={e => setPrefs({ ...prefs, platform: e.target.value })}
                >
                  {PLATFORMS.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Default Content Style</label>
                <select
                  className="form-select"
                  value={prefs.content_style}
                  onChange={e => setPrefs({ ...prefs, content_style: e.target.value })}
                >
                  {CONTENT_STYLES.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Default Tone</label>
                <select
                  className="form-select"
                  value={prefs.tone}
                  onChange={e => setPrefs({ ...prefs, tone: e.target.value })}
                >
                  {TONES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Default Story Length</label>
                <div className="chip-group">
                  {STORY_LENGTHS.map(l => (
                    <button
                      key={l.value}
                      className={`chip ${prefs.story_length === l.value ? 'active' : ''}`}
                      onClick={() => setPrefs({ ...prefs, story_length: l.value })}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-primary btn-sm" onClick={handleSavePrefs}>
                  <Save size={14} /> Save
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => setEditingPrefs(false)}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ fontSize: 13 }}>
                    <span style={{ color: 'var(--text-muted)' }}>Platform: </span>
                    <span style={{ fontWeight: 600 }}>{PLATFORMS.find(p => p.value === preferences?.platform)?.label || 'TikTok'}</span>
                  </div>
                  <div style={{ fontSize: 13 }}>
                    <span style={{ color: 'var(--text-muted)' }}>Style: </span>
                    <span style={{ fontWeight: 600 }}>{CONTENT_STYLES.find(s => s.value === preferences?.content_style)?.label || 'Crazy True Story'}</span>
                  </div>
                  <div style={{ fontSize: 13 }}>
                    <span style={{ color: 'var(--text-muted)' }}>Tone: </span>
                    <span style={{ fontWeight: 600 }}>{TONES.find(t => t.value === preferences?.tone)?.label || 'Dramatic'}</span>
                  </div>
                  <div style={{ fontSize: 13 }}>
                    <span style={{ color: 'var(--text-muted)' }}>Length: </span>
                    <span style={{ fontWeight: 600 }}>{preferences?.story_length || '60'}s</span>
                  </div>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => setEditingPrefs(true)}>
                  Edit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Other */}
      <div className="section">
        <div className="section-title" style={{ color: 'var(--text-muted)', fontSize: 13 }}>Other</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div className="card" style={{
            padding: '14px 16px', display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', borderRadius: '12px 12px 4px 4px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
              <HelpCircle size={18} color="var(--text-muted)" /> Help & Support
            </div>
            <ChevronRight size={16} color="var(--text-muted)" />
          </div>
          <div className="card" style={{
            padding: '14px 16px', display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', borderRadius: '4px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
              <Shield size={18} color="var(--text-muted)" /> Privacy Policy
            </div>
            <ChevronRight size={16} color="var(--text-muted)" />
          </div>
          <button
            className="card"
            onClick={handleLogout}
            style={{
              padding: '14px 16px', display: 'flex', alignItems: 'center',
              gap: 10, fontSize: 14, color: 'var(--red)', cursor: 'pointer',
              width: '100%', textAlign: 'left', borderRadius: '4px 4px 12px 12px'
            }}
          >
            <LogOut size={18} /> Log Out
          </button>
        </div>
      </div>

      {/* Version */}
      <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', marginTop: 20, marginBottom: 20 }}>
        StoryTok AI v1.0.0
      </p>
    </div>
  );
}
