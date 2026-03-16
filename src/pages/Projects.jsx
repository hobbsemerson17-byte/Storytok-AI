import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import { CATEGORY_LABELS, CATEGORY_COLORS, CONTENT_STYLES } from '../utils/constants';
import {
  FolderOpen, Search, Clock, ArrowRight, Trash2, Copy,
  MoreVertical, X, Filter
} from 'lucide-react';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);
  const { showToast } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, [search, filterCategory]);

  async function loadProjects() {
    try {
      const params = {};
      if (search) params.search = search;
      if (filterCategory) params.category = filterCategory;
      const data = await api.getProjects(params);
      setProjects(data.projects);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id, e) {
    e.stopPropagation();
    if (!confirm('Delete this project?')) return;
    try {
      await api.deleteProject(id);
      setProjects(prev => prev.filter(p => p.id !== id));
      showToast('Project deleted');
    } catch (err) {
      showToast('Failed to delete');
    }
    setMenuOpen(null);
  }

  async function handleDuplicate(id, e) {
    e.stopPropagation();
    try {
      const data = await api.duplicateProject(id);
      setProjects(prev => [data.project, ...prev]);
      showToast('Project duplicated');
    } catch (err) {
      showToast('Failed to duplicate');
    }
    setMenuOpen(null);
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">My Projects</h1>
        <p className="page-subtitle">{projects.length} stories created</p>
      </div>

      {/* Search & Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={16} style={{
            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
            color: 'var(--text-muted)'
          }} />
          <input
            className="form-input"
            placeholder="Search projects..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 36 }}
          />
        </div>
        <button
          className={`btn-icon ${filterCategory ? '' : ''}`}
          onClick={() => setShowFilter(!showFilter)}
          style={filterCategory ? { borderColor: 'var(--accent)', color: 'var(--accent)' } : {}}
        >
          <Filter size={18} />
        </button>
      </div>

      {/* Filter chips */}
      {showFilter && (
        <div style={{ marginBottom: 16 }}>
          <div className="chip-group">
            <button
              className={`chip ${filterCategory === '' ? 'active' : ''}`}
              onClick={() => setFilterCategory('')}
            >
              All
            </button>
            {CONTENT_STYLES.map(s => (
              <button
                key={s.value}
                className={`chip ${filterCategory === s.value ? 'active' : ''}`}
                onClick={() => setFilterCategory(s.value)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Project List */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton" style={{ height: 80 }} />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="empty-state">
          <FolderOpen size={48} />
          <h3>No projects found</h3>
          <p>{search || filterCategory ? 'Try different search terms or filters' : 'Create your first story to see it here'}</p>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/create')}>
            Create Story
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {projects.map(project => (
            <div
              key={project.id}
              className="card"
              onClick={() => navigate(`/projects/${project.id}`)}
              style={{ cursor: 'pointer', padding: '14px 16px', position: 'relative' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 0, paddingRight: 32 }}>
                  <div style={{
                    fontSize: 14, fontWeight: 600,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                  }}>
                    {project.title}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.5 }}>
                    <span style={{
                      color: CATEGORY_COLORS[project.category] || 'var(--text-muted)',
                      fontWeight: 600
                    }}>
                      {CATEGORY_LABELS[project.category] || project.category}
                    </span>
                    {' · '}
                    {project.platform}
                    {' · '}
                    {project.video_length}s
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={10} />
                    {new Date(project.created_at).toLocaleDateString()}
                  </div>
                </div>
                <button
                  className="btn-icon"
                  onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === project.id ? null : project.id); }}
                  style={{ padding: 4, position: 'absolute', right: 12, top: 14 }}
                >
                  <MoreVertical size={16} />
                </button>
              </div>

              {/* Context menu */}
              {menuOpen === project.id && (
                <div style={{
                  position: 'absolute', right: 12, top: 40, zIndex: 10,
                  background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)', padding: 4, minWidth: 140,
                  boxShadow: 'var(--shadow-lg)'
                }} onClick={e => e.stopPropagation()}>
                  <button
                    onClick={(e) => handleDuplicate(project.id, e)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                      padding: '8px 12px', background: 'none', color: 'var(--text-primary)',
                      fontSize: 13, borderRadius: 6, cursor: 'pointer'
                    }}
                  >
                    <Copy size={14} /> Duplicate
                  </button>
                  <button
                    onClick={(e) => handleDelete(project.id, e)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                      padding: '8px 12px', background: 'none', color: 'var(--red)',
                      fontSize: 13, borderRadius: 6, cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
