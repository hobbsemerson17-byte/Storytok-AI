import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../utils/constants';
import {
  Layers, Crown, Home, Moon, HeartCrack, Gem, Search,
  MessageCircle, Zap, ArrowRight, Lock
} from 'lucide-react';

const iconMap = {
  home: Home,
  moon: Moon,
  'heart-crack': HeartCrack,
  gem: Gem,
  search: Search,
  'message-circle': MessageCircle,
  zap: Zap
};

export default function Templates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadTemplates();
  }, []);

  async function loadTemplates() {
    try {
      const data = await api.getTemplates();
      setTemplates(data.templates);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleUseTemplate(template) {
    if (template.is_premium && user?.plan !== 'pro') {
      navigate('/upgrade');
      return;
    }
    navigate('/create', {
      state: {
        topic: template.story_prompt,
        category: template.category,
        tone: template.tone
      }
    });
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Templates</h1>
        <p className="page-subtitle">Ready-made viral story formats</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton" style={{ height: 120 }} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {templates.map(template => {
            const Icon = iconMap[template.icon] || Zap;
            const isLocked = template.is_premium && user?.plan !== 'pro';
            const catColor = CATEGORY_COLORS[template.category] || 'var(--accent)';

            return (
              <button
                key={template.id}
                className="card"
                onClick={() => handleUseTemplate(template)}
                style={{
                  cursor: 'pointer', textAlign: 'left', padding: '18px 16px',
                  position: 'relative', overflow: 'hidden',
                  opacity: isLocked ? 0.7 : 1
                }}
              >
                {/* Gradient accent */}
                <div style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
                  background: catColor
                }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: 12, flex: 1 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: `${catColor}20`, display: 'flex',
                      alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                      <Icon size={20} color={catColor} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 15, fontWeight: 700 }}>{template.name}</span>
                        {template.is_premium && (
                          <span className="badge badge-pro" style={{ fontSize: 9, padding: '2px 6px' }}>
                            PRO
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.4 }}>
                        {template.description}
                      </p>
                      <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        "{template.hook_example}"
                      </div>
                    </div>
                  </div>
                  <div style={{ flexShrink: 0, marginLeft: 8 }}>
                    {isLocked ? <Lock size={16} color="var(--text-muted)" /> : <ArrowRight size={16} color="var(--text-muted)" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
