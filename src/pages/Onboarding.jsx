import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { PLATFORMS, CONTENT_STYLES, TONES, STORY_LENGTHS } from '../utils/constants';
import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

const steps = ['Platform', 'Content Style', 'Tone', 'Story Length'];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [platform, setPlatform] = useState('');
  const [contentStyle, setContentStyle] = useState('');
  const [tone, setTone] = useState('');
  const [storyLength, setStoryLength] = useState('');
  const [loading, setLoading] = useState(false);
  const { completeOnboarding } = useAuth();
  const navigate = useNavigate();

  async function handleFinish() {
    setLoading(true);
    try {
      await completeOnboarding({
        platform: platform || 'tiktok',
        content_style: contentStyle || 'crazy-true-story',
        tone: tone || 'dramatic',
        story_length: storyLength || '60'
      });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function canProceed() {
    if (step === 0) return platform;
    if (step === 1) return contentStyle;
    if (step === 2) return tone;
    if (step === 3) return storyLength;
    return true;
  }

  function handleNext() {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleFinish();
    }
  }

  return (
    <div className="app-layout" style={{ justifyContent: 'center', padding: 20 }}>
      <div style={{ maxWidth: 400, width: '100%', margin: '0 auto' }}>
        {/* Progress */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 32 }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              flex: 1, height: 4, borderRadius: 2,
              background: i <= step ? 'var(--accent)' : 'var(--border)',
              transition: 'background 0.3s ease'
            }} />
          ))}
        </div>

        <div className="fade-in" key={step}>
          {step === 0 && (
            <>
              <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>
                What platform do you create for?
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
                We'll optimize your content for this platform.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {PLATFORMS.map(p => (
                  <button
                    key={p.value}
                    className={`card ${platform === p.value ? 'card-glow' : ''}`}
                    onClick={() => setPlatform(p.value)}
                    style={{
                      textAlign: 'left', cursor: 'pointer',
                      borderColor: platform === p.value ? 'var(--accent)' : 'var(--border)',
                      padding: '16px 20px'
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{p.label}</div>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>
                What's your content style?
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
                Pick your primary story genre.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {CONTENT_STYLES.map(s => (
                  <button
                    key={s.value}
                    className={`card ${contentStyle === s.value ? 'card-glow' : ''}`}
                    onClick={() => setContentStyle(s.value)}
                    style={{
                      textAlign: 'left', cursor: 'pointer',
                      borderColor: contentStyle === s.value ? 'var(--accent)' : 'var(--border)',
                      padding: '14px 20px'
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{s.label}</div>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>
                Pick your tone
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
                How should your stories feel?
              </p>
              <div className="chip-group">
                {TONES.map(t => (
                  <button
                    key={t.value}
                    className={`chip ${tone === t.value ? 'active' : ''}`}
                    onClick={() => setTone(t.value)}
                    style={{ flex: '1 0 auto', textAlign: 'center' }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>
                Preferred story length?
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
                This sets the default length for generations.
              </p>
              <div className="chip-group">
                {STORY_LENGTHS.map(l => (
                  <button
                    key={l.value}
                    className={`chip ${storyLength === l.value ? 'active' : ''}`}
                    onClick={() => setStoryLength(l.value)}
                    style={{ flex: '1 0 auto', textAlign: 'center' }}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
          {step > 0 && (
            <button className="btn btn-secondary" onClick={() => setStep(step - 1)}>
              <ArrowLeft size={16} />
            </button>
          )}
          <button
            className="btn btn-primary btn-full"
            onClick={handleNext}
            disabled={!canProceed() || loading}
          >
            {loading ? <div className="spinner" /> : (
              step === 3 ? <><Sparkles size={16} /> Start Creating</> : <>Next <ArrowRight size={16} /></>
            )}
          </button>
        </div>

        <button
          className="btn btn-ghost btn-full"
          onClick={handleFinish}
          disabled={loading}
          style={{ marginTop: 12, fontSize: 13 }}
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
