import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Sparkles, Clock, Copy, Hash, Type, ArrowRight, Check, Star } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px 20px', maxWidth: 960, margin: '0 auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'var(--gradient)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 16
          }}>S</div>
          <span style={{ fontWeight: 700, fontSize: 18 }}>StoryTok AI</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" onClick={() => navigate('/login')}>Log in</button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/signup')}>Get Started</button>
        </div>
      </header>

      {/* Hero */}
      <section style={{
        textAlign: 'center', padding: '60px 20px 40px',
        maxWidth: 640, margin: '0 auto'
      }}>
        <div className="badge badge-pro" style={{ marginBottom: 16, display: 'inline-flex', gap: 6 }}>
          <Sparkles size={12} /> AI-Powered Content Engine
        </div>
        <h1 style={{
          fontSize: 'clamp(32px, 7vw, 52px)', fontWeight: 900,
          lineHeight: 1.1, letterSpacing: -1, marginBottom: 16
        }}>
          Generate <span className="gradient-text">Viral Story</span> Content in Seconds
        </h1>
        <p style={{
          fontSize: 'clamp(15px, 3vw, 18px)', color: 'var(--text-secondary)',
          maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.6
        }}>
          Create scroll-stopping stories, voiceover scripts, captions, and
          hashtags for TikTok, Reels, and Shorts — all in under 60 seconds.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/signup')}>
            Start Creating Free <ArrowRight size={18} />
          </button>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 12 }}>
          No credit card required. 3 free stories per week.
        </p>
      </section>

      {/* Preview Card */}
      <section style={{ padding: '0 20px 60px', maxWidth: 480, margin: '0 auto' }}>
        <div className="card" style={{
          background: 'var(--bg-secondary)',
          border: '1px solid rgba(139,92,246,0.3)',
          boxShadow: '0 0 60px rgba(139,92,246,0.1)'
        }}>
          <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
            Example Output
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4, fontWeight: 600 }}>HOOK</div>
          <p style={{ fontSize: 14, marginBottom: 16, lineHeight: 1.5 }}>
            "My roommate seemed perfect until I found what was hidden under her bed..."
          </p>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4, fontWeight: 600 }}>VOICEOVER SCRIPT</div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>
            My roommate seemed perfect... until I found what was hidden under her bed. She was quiet. Clean. Always paid rent on time. The perfect roommate... right? Wrong...
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['#roommate', '#storytime', '#viral', '#fyp', '#drama'].map(tag => (
              <span key={tag} style={{
                fontSize: 11, color: 'var(--accent)', background: 'rgba(139,92,246,0.15)',
                padding: '4px 8px', borderRadius: 6
              }}>{tag}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '40px 20px', maxWidth: 640, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
          Everything You Need
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 32 }}>
          One click. Full content package. Ready to post.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
          {[
            { icon: Zap, title: 'Viral Story Generator', desc: 'AI creates scroll-stopping stories optimized for short-form video.' },
            { icon: Type, title: 'Voiceover Scripts', desc: 'Stories rewritten for spoken delivery. Just read and record.' },
            { icon: Copy, title: 'Auto Captions', desc: 'Subtitle lines broken into perfect chunks for on-screen text.' },
            { icon: Hash, title: 'Hashtags & Captions', desc: 'Platform-optimized hashtags and post descriptions generated instantly.' },
            { icon: Clock, title: 'Under 60 Seconds', desc: 'Full content package generated in seconds, not hours.' },
            { icon: Sparkles, title: 'Multiple Styles', desc: 'Scary, drama, luxury, Reddit, motivational — pick your vibe.' },
          ].map((f, i) => (
            <div key={i} className="card" style={{ padding: 20 }}>
              <f.icon size={24} color="var(--accent)" style={{ marginBottom: 12 }} />
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: '60px 20px', maxWidth: 640, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
          Simple Pricing
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 32 }}>
          Start free. Upgrade when you're ready.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          {/* Free */}
          <div className="card" style={{ padding: 24 }}>
            <div className="badge badge-free" style={{ marginBottom: 12 }}>Free</div>
            <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 4 }}>$0<span style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 400 }}>/month</span></div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>Perfect to get started</p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {['3 stories per week', 'Basic templates', 'Copy & export text', 'All story categories'].map(item => (
                <li key={item} style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Check size={14} color="var(--green)" /> {item}
                </li>
              ))}
            </ul>
            <button className="btn btn-secondary btn-full" onClick={() => navigate('/signup')}>Get Started</button>
          </div>
          {/* Pro */}
          <div className="card card-glow" style={{
            padding: 24,
            border: '1px solid rgba(139,92,246,0.5)',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute', top: -10, right: 16,
              background: 'var(--gradient)', color: 'white',
              padding: '4px 12px', borderRadius: 20,
              fontSize: 11, fontWeight: 700
            }}>POPULAR</div>
            <div className="badge badge-pro" style={{ marginBottom: 12 }}>Pro</div>
            <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 4 }}>$9<span style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 400 }}>/month</span></div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>For serious creators</p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {['Unlimited generations', 'All premium templates', 'Priority generation', 'Full export package', 'Advanced story styles', 'Project history'].map(item => (
                <li key={item} style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Check size={14} color="var(--accent)" /> {item}
                </li>
              ))}
            </ul>
            <button className="btn btn-primary btn-full" onClick={() => navigate('/signup')}>Start Pro Free Trial</button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        textAlign: 'center', padding: '60px 20px',
        maxWidth: 640, margin: '0 auto'
      }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
          Ready to Go Viral?
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
          Join thousands of creators using StoryTok AI to create content faster.
        </p>
        <button className="btn btn-primary btn-lg" onClick={() => navigate('/signup')}>
          Start Creating Now <ArrowRight size={18} />
        </button>
      </section>

      {/* Footer */}
      <footer style={{
        textAlign: 'center', padding: '32px 20px',
        borderTop: '1px solid var(--border)',
        color: 'var(--text-muted)', fontSize: 13
      }}>
        <p>StoryTok AI — Create viral story content in seconds.</p>
      </footer>
    </div>
  );
}
