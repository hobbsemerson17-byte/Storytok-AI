import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Crown, Check, Zap, Layers, Sparkles, Download,
  Clock, FolderOpen, ArrowLeft, Star, Volume2, Video,
  Mic, Music
} from 'lucide-react';

export default function Upgrade() {
  const { user, upgradePlan, showToast } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleUpgrade() {
    setLoading(true);
    try {
      await upgradePlan();
      showToast('Upgraded to Pro! Enjoy unlimited access.');
      navigate('/dashboard');
    } catch (err) {
      showToast('Upgrade failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (user?.plan === 'pro') {
    return (
      <div className="fade-in">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <button className="btn-icon" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
          </button>
          <h1 style={{ fontSize: 20, fontWeight: 800 }}>Subscription</h1>
        </div>
        <div className="card card-glow" style={{
          textAlign: 'center', padding: 32,
          background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(236,72,153,0.1))',
          borderColor: 'rgba(139,92,246,0.3)'
        }}>
          <Crown size={40} color="var(--accent)" />
          <h2 style={{ fontSize: 22, fontWeight: 800, marginTop: 16 }}>You're on Pro!</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>
            Enjoy unlimited story generations and all premium features.
          </p>
          <div className="badge badge-pro" style={{ marginTop: 16 }}>
            <Star size={12} style={{ marginRight: 4 }} /> Pro Plan Active
          </div>
        </div>

        {/* Premium features unlocked summary */}
        <div className="card" style={{ padding: 16, marginTop: 16 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: 'var(--accent)' }}>Your Premium Features</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { icon: Volume2, text: 'AI Voice Narration with 6 voice styles' },
              { icon: Music, text: 'Downloadable audio files (WAV)' },
              { icon: Video, text: 'Background video suggestions' },
              { icon: Zap, text: 'Unlimited story generations' },
              { icon: Layers, text: 'All premium templates' },
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Check size={14} color="var(--green)" />
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <button className="btn-icon" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
        </button>
      </div>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '20px 0 32px' }}>
        <div style={{
          width: 56, height: 56, borderRadius: 14,
          background: 'var(--gradient)', display: 'inline-flex',
          alignItems: 'center', justifyContent: 'center', marginBottom: 16
        }}>
          <Crown size={28} color="white" />
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 900, lineHeight: 1.2 }}>
          Go <span className="gradient-text">Unlimited</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 8, lineHeight: 1.5 }}>
          Unlock AI narration, video backgrounds, and unlimited content creation.
        </p>
      </div>

      {/* Features */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
        {[
          { icon: Volume2, text: 'AI Voice Narration', desc: '6 voice styles — male, female, dramatic, eerie, storyteller, calm', isNew: true },
          { icon: Music, text: 'Downloadable Audio', desc: 'Export voiceovers as MP3/WAV files', isNew: true },
          { icon: Video, text: 'Background Video Suggestions', desc: 'Mood-matched videos for Minecraft parkour, subway surfers & more', isNew: true },
          { icon: Zap, text: 'Unlimited story generations', desc: 'No more 3/week limit' },
          { icon: Layers, text: 'All premium templates', desc: 'Access every story format' },
          { icon: Sparkles, text: 'Advanced story styles', desc: 'Premium AI story quality' },
          { icon: Clock, text: 'Priority generation', desc: 'Faster content creation' },
          { icon: Download, text: 'Full export package', desc: 'Download complete bundles' },
          { icon: FolderOpen, text: 'Unlimited project history', desc: 'Save everything forever' },
        ].map((f, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '12px 16px', borderRadius: 'var(--radius)',
            background: f.isNew ? 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(236,72,153,0.05))' : 'var(--bg-card)',
            border: `1px solid ${f.isNew ? 'rgba(139,92,246,0.3)' : 'var(--border)'}`
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: f.isNew ? 'rgba(236,72,153,0.15)' : 'rgba(139,92,246,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <f.icon size={18} color={f.isNew ? 'var(--pink)' : 'var(--accent)'} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                {f.text}
                {f.isNew && (
                  <span style={{
                    fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
                    color: 'var(--pink)', background: 'rgba(236,72,153,0.15)',
                    padding: '1px 5px', borderRadius: 4
                  }}>NEW</span>
                )}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{f.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Pricing card */}
      <div className="card card-glow" style={{
        textAlign: 'center', padding: '28px 20px', marginBottom: 20,
        borderColor: 'rgba(139,92,246,0.4)',
        background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(236,72,153,0.05))'
      }}>
        <div style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600, marginBottom: 8 }}>PRO PLAN</div>
        <div style={{ fontSize: 48, fontWeight: 900, lineHeight: 1 }}>
          $9
          <span style={{ fontSize: 16, color: 'var(--text-muted)', fontWeight: 400 }}>/month</span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 8, marginBottom: 24 }}>
          Cancel anytime. No contracts.
        </p>

        <button
          className="btn btn-primary btn-full btn-lg"
          onClick={handleUpgrade}
          disabled={loading}
        >
          {loading ? <div className="spinner" /> : <><Crown size={18} /> Upgrade to Pro</>}
        </button>

        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 12 }}>
          Placeholder payment — instant activation for demo
        </p>
      </div>

      {/* Comparison */}
      <div className="card" style={{ padding: 20, marginBottom: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Free vs Pro</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { feature: 'Weekly generations', free: '3', pro: 'Unlimited' },
            { feature: 'Templates', free: 'Basic', pro: 'All Premium' },
            { feature: 'Story quality', free: 'Standard', pro: 'Premium' },
            { feature: 'Export options', free: 'Copy text', pro: 'Full package' },
            { feature: 'AI Narration', free: '—', pro: '6 voice styles' },
            { feature: 'Audio download', free: '—', pro: 'MP3 / WAV' },
            { feature: 'Video backgrounds', free: '—', pro: 'Mood-matched' },
            { feature: 'Project history', free: 'Limited', pro: 'Unlimited' },
          ].map((row, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8,
              fontSize: 12, padding: '8px 0',
              borderBottom: i < 7 ? '1px solid var(--border)' : 'none'
            }}>
              <span style={{ color: 'var(--text-secondary)' }}>{row.feature}</span>
              <span style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{row.free}</span>
              <span style={{ textAlign: 'center', color: 'var(--accent)', fontWeight: 600 }}>{row.pro}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
