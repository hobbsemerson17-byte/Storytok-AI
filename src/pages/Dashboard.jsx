import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../utils/constants';
import {
  PenSquare, Sparkles, FolderOpen, Crown, Zap, TrendingUp,
  ArrowRight, Clock
} from 'lucide-react';

export default function Dashboard() {
  const { user, weekUsage } = useAuth();
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadRecent();
  }, []);

  async function loadRecent() {
    try {
      const data = await api.getProjects();
      setRecentProjects(data.projects.slice(0, 3));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const weeklyLimit = user?.plan === 'pro' ? 999 : 3;
  const usagePercent = Math.min((weekUsage / weeklyLimit) * 100, 100);

  return (
    <div className="fade-in">
      {/* Greeting */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800 }}>
              Hey, {user?.name?.split(' ')[0]} <span style={{ fontSize: 22 }}>&#128075;</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 2 }}>
              Ready to create something viral?
            </p>
          </div>
          {user?.plan === 'free' && (
            <button className="badge badge-pro" onClick={() => navigate('/upgrade')} style={{ cursor: 'pointer' }}>
              <Crown size={12} style={{ marginRight: 4 }} /> Upgrade
            </button>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
        <button
          className="card"
          onClick={() => navigate('/create')}
          style={{
            cursor: 'pointer', textAlign: 'left', padding: 20,
            background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(236,72,153,0.1))',
            borderColor: 'rgba(139,92,246,0.3)'
          }}
        >
          <PenSquare size={24} color="var(--accent)" />
          <div style={{ fontWeight: 700, fontSize: 14, marginTop: 10 }}>New Story</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>Create content</div>
        </button>
        <button
          className="card"
          onClick={() => navigate('/templates')}
          style={{ cursor: 'pointer', textAlign: 'left', padding: 20 }}
        >
          <Sparkles size={24} color="var(--pink)" />
          <div style={{ fontWeight: 700, fontSize: 14, marginTop: 10 }}>Templates</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>Quick start</div>
        </button>
      </div>

      {/* Usage */}
      <div className="card" style={{ marginBottom: 24, padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Zap size={16} color="var(--accent)" />
            <span style={{ fontSize: 13, fontWeight: 600 }}>This Week's Usage</span>
          </div>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            {weekUsage} / {user?.plan === 'pro' ? '∞' : '3'} stories
          </span>
        </div>
        <div className="usage-bar">
          <div className="usage-fill" style={{ width: `${user?.plan === 'pro' ? 10 : usagePercent}%` }} />
        </div>
        {user?.plan === 'free' && weekUsage >= 3 && (
          <button
            className="btn btn-outline btn-sm btn-full"
            onClick={() => navigate('/upgrade')}
            style={{ marginTop: 12 }}
          >
            <Crown size={14} /> Upgrade for Unlimited
          </button>
        )}
      </div>

      {/* Trending Ideas */}
      <div className="section">
        <div className="section-title">
          <TrendingUp size={16} color="var(--accent)" /> Trending Ideas
        </div>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          {[
            'Roommate horror story',
            'Creepy Uber ride',
            'Ex showed up at wedding',
            'Found secret room',
            'Mystery neighbor'
          ].map(idea => (
            <button
              key={idea}
              className="chip"
              onClick={() => navigate('/create', { state: { topic: idea } })}
              style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
            >
              {idea}
            </button>
          ))}
        </div>
      </div>

      {/* Recent Projects */}
      <div className="section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div className="section-title" style={{ marginBottom: 0 }}>
            <FolderOpen size={16} color="var(--accent)" /> Recent Projects
          </div>
          {recentProjects.length > 0 && (
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/projects')}>
              See all <ArrowRight size={14} />
            </button>
          )}
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[1, 2].map(i => (
              <div key={i} className="skeleton" style={{ height: 72 }} />
            ))}
          </div>
        ) : recentProjects.length === 0 ? (
          <div className="empty-state" style={{ padding: '30px 20px' }}>
            <FolderOpen size={40} />
            <h3>No projects yet</h3>
            <p>Create your first viral story!</p>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/create')}>
              <PenSquare size={14} /> Create Story
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recentProjects.map(project => (
              <button
                key={project.id}
                className="card"
                onClick={() => navigate(`/projects/${project.id}`)}
                style={{ cursor: 'pointer', textAlign: 'left', padding: '14px 16px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 14, fontWeight: 600,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                    }}>
                      {project.title}
                    </div>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 8, marginTop: 4
                    }}>
                      <span style={{
                        fontSize: 11, fontWeight: 600,
                        color: CATEGORY_COLORS[project.category] || 'var(--text-muted)',
                        textTransform: 'uppercase'
                      }}>
                        {CATEGORY_LABELS[project.category] || project.category}
                      </span>
                      <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>
                        <Clock size={10} style={{ marginRight: 2, verticalAlign: 'middle' }} />
                        {new Date(project.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <ArrowRight size={16} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: 4 }} />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
