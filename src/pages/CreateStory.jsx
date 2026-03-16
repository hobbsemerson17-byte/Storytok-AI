import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import { CONTENT_STYLES, TONES, STORY_LENGTHS, PLATFORMS, HOOK_STYLES } from '../utils/constants';
import { Sparkles, Shuffle, Wand2, Crown, AlertCircle } from 'lucide-react';

export default function CreateStory() {
  const location = useLocation();
  const { user, preferences, weekUsage, incrementUsage, showToast } = useAuth();
  const navigate = useNavigate();

  const [topic, setTopic] = useState(location.state?.topic || '');
  const [category, setCategory] = useState(location.state?.category || preferences?.content_style || 'crazy-true-story');
  const [tone, setTone] = useState(location.state?.tone || preferences?.tone || 'dramatic');
  const [videoLength, setVideoLength] = useState(preferences?.story_length || '60');
  const [platform, setPlatform] = useState(preferences?.platform || 'tiktok');
  const [hookStyle, setHookStyle] = useState(location.state?.hookStyle || 'shock');
  const [keywords, setKeywords] = useState('');
  const [cta, setCta] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const atLimit = user?.plan === 'free' && weekUsage >= 3;

  async function handleGenerate() {
    if (atLimit) {
      navigate('/upgrade');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const data = await api.generateStory({
        topic, category, tone, videoLength, platform, hookStyle, keywords, cta
      });
      incrementUsage();
      showToast('Story generated!');
      navigate(`/result/${data.projectId}`, { state: { result: data } });
    } catch (err) {
      if (err.message.includes('Weekly limit') || err.message.includes('limit')) {
        setError('You\'ve reached your weekly limit (3 free stories per week). Upgrade to Pro for unlimited generations.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSurprise() {
    try {
      const idea = await api.surpriseMe();
      setTopic(idea.topic);
      setCategory(idea.category);
      setTone(idea.tone);
      setHookStyle(idea.hookStyle);
      showToast('Surprise idea loaded!');
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Create Story</h1>
        <p className="page-subtitle">Generate viral content in seconds</p>
      </div>

      {/* Surprise Me */}
      <button
        className="card btn-full"
        onClick={handleSurprise}
        style={{
          cursor: 'pointer', textAlign: 'center', marginBottom: 20, padding: '16px',
          background: 'linear-gradient(135deg, rgba(236,72,153,0.1), rgba(139,92,246,0.1))',
          borderColor: 'rgba(236,72,153,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          fontWeight: 600, fontSize: 14, color: 'var(--pink)'
        }}
      >
        <Shuffle size={18} /> Surprise Me
      </button>

      {/* Topic */}
      <div className="form-group">
        <label className="form-label">Topic or Idea</label>
        <textarea
          className="form-input"
          placeholder="e.g. My neighbor's secret double life, a creepy Airbnb experience..."
          value={topic}
          onChange={e => setTopic(e.target.value)}
          rows={2}
        />
      </div>

      {/* Category */}
      <div className="form-group">
        <label className="form-label">Story Category</label>
        <div className="chip-group">
          {CONTENT_STYLES.map(s => (
            <button
              key={s.value}
              className={`chip ${category === s.value ? 'active' : ''}`}
              onClick={() => setCategory(s.value)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tone */}
      <div className="form-group">
        <label className="form-label">Tone</label>
        <div className="chip-group">
          {TONES.map(t => (
            <button
              key={t.value}
              className={`chip ${tone === t.value ? 'active' : ''}`}
              onClick={() => setTone(t.value)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Video Length */}
      <div className="form-group">
        <label className="form-label">Video Length</label>
        <div className="chip-group">
          {STORY_LENGTHS.map(l => (
            <button
              key={l.value}
              className={`chip ${videoLength === l.value ? 'active' : ''}`}
              onClick={() => setVideoLength(l.value)}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Platform */}
      <div className="form-group">
        <label className="form-label">Target Platform</label>
        <div className="chip-group">
          {PLATFORMS.map(p => (
            <button
              key={p.value}
              className={`chip ${platform === p.value ? 'active' : ''}`}
              onClick={() => setPlatform(p.value)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hook Style */}
      <div className="form-group">
        <label className="form-label">Hook Style</label>
        <select
          className="form-select"
          value={hookStyle}
          onChange={e => setHookStyle(e.target.value)}
        >
          {HOOK_STYLES.map(h => (
            <option key={h.value} value={h.value}>{h.label}</option>
          ))}
        </select>
      </div>

      {/* Keywords */}
      <div className="form-group">
        <label className="form-label">Keywords (Optional)</label>
        <input
          className="form-input"
          placeholder="e.g. revenge, plot twist, secret"
          value={keywords}
          onChange={e => setKeywords(e.target.value)}
        />
      </div>

      {/* CTA */}
      <div className="form-group">
        <label className="form-label">Call to Action (Optional)</label>
        <input
          className="form-input"
          placeholder="e.g. Follow for part 2, Comment what you'd do"
          value={cta}
          onChange={e => setCta(e.target.value)}
        />
      </div>

      {error && (
        <div style={{
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: 'var(--radius)', padding: '12px 16px', marginBottom: 16,
          color: 'var(--red)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8
        }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Generate Button */}
      <button
        className="btn btn-primary btn-full btn-lg"
        onClick={handleGenerate}
        disabled={loading}
        style={{ marginBottom: 12 }}
      >
        {loading ? (
          <><div className="spinner" /> Generating...</>
        ) : atLimit ? (
          <><Crown size={18} /> Upgrade to Generate</>
        ) : (
          <><Wand2 size={18} /> Generate Story</>
        )}
      </button>

      {/* Usage indicator */}
      {user?.plan === 'free' && (
        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>
          {weekUsage}/3 free stories used this week
        </p>
      )}
    </div>
  );
}
