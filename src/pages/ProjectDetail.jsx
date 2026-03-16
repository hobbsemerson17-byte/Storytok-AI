import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import { CATEGORY_LABELS, CATEGORY_COLORS, VOICE_STYLES, STORY_MOODS } from '../utils/constants';
import {
  ArrowLeft, Copy, Download, Edit3, Check, Save,
  Zap, Mic, Type, Hash, MessageSquare, Lightbulb,
  Trash2, Clock, Play, Pause, Volume2, Lock, Crown,
  Video, RefreshCw
} from 'lucide-react';

function EditableSection({ title, icon: Icon, content, color, onSave }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(content);
  const [copied, setCopied] = useState(false);
  const { showToast } = useAuth();

  function handleCopy() {
    navigator.clipboard.writeText(content);
    setCopied(true);
    showToast('Copied!');
    setTimeout(() => setCopied(false), 2000);
  }

  function handleSave() {
    onSave(value);
    setEditing(false);
    showToast('Saved!');
  }

  if (!content && !editing) return null;

  return (
    <div className="card" style={{ marginBottom: 12, padding: 16 }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon size={16} color={color} />
          <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--text-secondary)' }}>
            {title}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {editing ? (
            <button className="btn-icon" onClick={handleSave} style={{ padding: 6 }}>
              <Save size={14} color="var(--green)" />
            </button>
          ) : (
            <>
              <button className="btn-icon" onClick={() => setEditing(true)} style={{ padding: 6 }}>
                <Edit3 size={14} />
              </button>
              <button className="btn-icon" onClick={handleCopy} style={{ padding: 6 }}>
                {copied ? <Check size={14} color="var(--green)" /> : <Copy size={14} />}
              </button>
            </>
          )}
        </div>
      </div>
      {editing ? (
        <textarea
          className="form-input"
          value={value}
          onChange={e => setValue(e.target.value)}
          rows={6}
          style={{ fontSize: 14, lineHeight: 1.7 }}
        />
      ) : (
        <p style={{ fontSize: 14, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{content}</p>
      )}
    </div>
  );
}

function PremiumLock({ title, description, onUpgrade }) {
  return (
    <div className="card premium-lock-card" style={{ marginBottom: 12, padding: 20, textAlign: 'center' }}>
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: 'rgba(139,92,246,0.15)', display: 'inline-flex',
        alignItems: 'center', justifyContent: 'center', marginBottom: 10
      }}>
        <Lock size={20} color="var(--accent)" />
      </div>
      <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{title}</h4>
      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>{description}</p>
      <button className="btn btn-primary btn-sm" onClick={onUpgrade}>
        <Crown size={14} /> Upgrade to Pro
      </button>
    </div>
  );
}

function NarrationSection({ project, isPro, onUpgrade }) {
  const [selectedVoice, setSelectedVoice] = useState('storyteller');
  const [generating, setGenerating] = useState(false);
  const [narration, setNarration] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [audioRef] = useState({ current: null });
  const { showToast } = useAuth();

  if (!isPro) {
    return (
      <PremiumLock
        title="AI Voice Narration"
        description="Generate professional voiceovers with 6 voice styles. Download as MP3/WAV."
        onUpgrade={onUpgrade}
      />
    );
  }

  async function handleGenerate() {
    setGenerating(true);
    try {
      const data = await api.generateNarration({
        projectId: project.id,
        text: project.voiceover || project.story,
        voiceStyle: selectedVoice,
        format: 'wav'
      });
      setNarration(data);
      showToast('Narration generated!');
    } catch (err) {
      showToast(err.message || 'Failed to generate narration');
    } finally {
      setGenerating(false);
    }
  }

  function handlePlayPause() {
    if (!narration) return;
    if (audioRef.current) {
      if (playing) {
        audioRef.current.pause();
        setPlaying(false);
      } else {
        audioRef.current.play();
        setPlaying(true);
      }
    }
  }

  function handleDownloadAudio() {
    if (!narration) return;
    const a = document.createElement('a');
    a.href = narration.downloadUrl;
    a.download = `storytok-narration-${selectedVoice}.wav`;
    a.click();
    showToast('Downloading audio...');
  }

  return (
    <div className="card premium-feature-card" style={{ marginBottom: 12, padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Volume2 size={16} color="var(--accent)" />
        <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--text-secondary)' }}>
          AI Voice Narration
        </span>
        <span className="badge badge-pro" style={{ marginLeft: 'auto', fontSize: 9, padding: '2px 6px' }}>PRO</span>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Voice Style</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {VOICE_STYLES.map(v => (
            <button
              key={v.value}
              className={`chip ${selectedVoice === v.value ? 'active' : ''}`}
              onClick={() => setSelectedVoice(v.value)}
              style={{ padding: '5px 12px', fontSize: 11 }}
            >
              {v.label}
            </button>
          ))}
        </div>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
          {VOICE_STYLES.find(v => v.value === selectedVoice)?.desc}
        </p>
      </div>

      {!narration ? (
        <button
          className="btn btn-primary btn-full btn-sm"
          onClick={handleGenerate}
          disabled={generating}
        >
          {generating ? <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : <><Mic size={14} /> Generate Narration</>}
        </button>
      ) : (
        <div>
          <div className="audio-player" style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: 10, borderRadius: 'var(--radius)',
            background: 'var(--bg-input)', border: '1px solid var(--border)', marginBottom: 8
          }}>
            <button
              className="btn-icon"
              onClick={handlePlayPause}
              style={{ background: 'var(--gradient)', border: 'none', color: 'white', width: 32, height: 32, borderRadius: 8 }}
            >
              {playing ? <Pause size={14} /> : <Play size={14} />}
            </button>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{narration.voiceName}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                {narration.duration}s duration (mock)
              </div>
            </div>
            <button className="btn-icon" onClick={handleDownloadAudio} style={{ padding: 6 }}>
              <Download size={14} />
            </button>
            <audio
              ref={el => { audioRef.current = el; }}
              src={narration.downloadUrl}
              onEnded={() => setPlaying(false)}
            />
          </div>
          <button
            className="btn btn-secondary btn-full btn-sm"
            onClick={handleGenerate}
            disabled={generating}
            style={{ fontSize: 11 }}
          >
            {generating ? <div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : <><RefreshCw size={12} /> Try Different Voice</>}
          </button>
        </div>
      )}
    </div>
  );
}

function VideoSuggestionsSection({ project, isPro, onUpgrade }) {
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mood, setMood] = useState(null);
  const { showToast } = useAuth();

  if (!isPro) {
    return (
      <PremiumLock
        title="Background Video Suggestions"
        description="Get AI-matched background videos for your story based on mood and category."
        onUpgrade={onUpgrade}
      />
    );
  }

  async function loadSuggestions(selectedMood) {
    setLoading(true);
    try {
      const params = {
        category: project.category,
        tone: project.tone
      };
      if (selectedMood) params.mood = selectedMood;
      const data = await api.getVideoSuggestions(params);
      setSuggestions(data.suggestions);
      setMood(data.mood);
    } catch (err) {
      showToast(err.message || 'Failed to load suggestions');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isPro && !suggestions) {
      loadSuggestions();
    }
  }, [isPro]);

  return (
    <div className="card premium-feature-card" style={{ marginBottom: 12, padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Video size={16} color="var(--pink)" />
        <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--text-secondary)' }}>
          Background Video Suggestions
        </span>
        <span className="badge badge-pro" style={{ marginLeft: 'auto', fontSize: 9, padding: '2px 6px' }}>PRO</span>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Story Mood</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {STORY_MOODS.map(m => (
            <button
              key={m.value}
              className={`chip ${mood === m.value ? 'active' : ''}`}
              onClick={() => { setMood(m.value); loadSuggestions(m.value); }}
              style={{ padding: '5px 12px', fontSize: 11, borderColor: mood === m.value ? m.color : undefined }}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 16 }}>
          <div className="spinner" style={{ margin: '0 auto' }} />
        </div>
      ) : suggestions && suggestions.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {suggestions.map((s, i) => (
            <div key={s.id} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: 10, borderRadius: 'var(--radius)',
              background: 'var(--bg-input)', border: '1px solid var(--border)'
            }}>
              <span style={{ fontSize: 22 }}>{s.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{s.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4 }}>{s.description}</div>
              </div>
              {i === 0 && (
                <span style={{
                  fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
                  color: 'var(--green)', letterSpacing: 0.5
                }}>Best Match</span>
              )}
            </div>
          ))}
          <p style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'center', marginTop: 4 }}>
            Search these on YouTube/Pexels for royalty-free clips
          </p>
        </div>
      ) : null}
    </div>
  );
}

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, showToast } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const isPro = user?.plan === 'pro';

  useEffect(() => {
    loadProject();
  }, [id]);

  async function loadProject() {
    try {
      const data = await api.getProject(id);
      setProject(data.project);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function updateField(field, value) {
    try {
      const data = await api.updateProject(id, { [field]: value });
      setProject(data.project);
    } catch (err) {
      showToast('Failed to save');
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this project?')) return;
    try {
      await api.deleteProject(id);
      showToast('Project deleted');
      navigate('/projects');
    } catch (err) {
      showToast('Failed to delete');
    }
  }

  function handleCopyAll() {
    const fullPackage = `HOOK:\n${project.hook}\n\nFULL STORY:\n${project.story}\n\nVOICEOVER SCRIPT:\n${project.voiceover}\n\nCAPTIONS:\n${project.captions}\n\nPOST CAPTION:\n${project.post_caption}\n\nHASHTAGS:\n${project.hashtags}\n\nVIDEO TITLE IDEAS:\n${project.video_titles}`;
    navigator.clipboard.writeText(fullPackage);
    showToast('Full package copied!');
  }

  function handleDownload() {
    const fullPackage = `StoryTok AI - Content Package\n${'='.repeat(40)}\n\nTitle: ${project.title}\nCategory: ${CATEGORY_LABELS[project.category] || project.category}\nPlatform: ${project.platform}\nLength: ${project.video_length}s\n\n${'='.repeat(40)}\n\nHOOK:\n${project.hook}\n\nFULL STORY:\n${project.story}\n\nVOICEOVER SCRIPT:\n${project.voiceover}\n\nCAPTIONS:\n${project.captions}\n\nPOST CAPTION:\n${project.post_caption}\n\nHASHTAGS:\n${project.hashtags}\n\nVIDEO TITLE IDEAS:\n${project.video_titles}\n\n${'='.repeat(40)}\nGenerated by StoryTok AI`;
    const blob = new Blob([fullPackage], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `storytok-${project.title.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded!');
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner spinner-lg" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="empty-state">
        <p>Project not found</p>
        <button className="btn btn-primary btn-sm" onClick={() => navigate('/projects')}>Go to Projects</button>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
        <button className="btn-icon" onClick={() => navigate('/projects')} style={{ marginTop: 2 }}>
          <ArrowLeft size={18} />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontSize: 18, fontWeight: 800, lineHeight: 1.3 }}>{project.title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
            <span style={{
              fontSize: 11, fontWeight: 600,
              color: CATEGORY_COLORS[project.category] || 'var(--text-muted)',
              textTransform: 'uppercase'
            }}>
              {CATEGORY_LABELS[project.category] || project.category}
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>
              {project.platform} · {project.video_length}s
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: 11, display: 'flex', alignItems: 'center', gap: 3 }}>
              <Clock size={10} /> {new Date(project.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button className="btn btn-primary btn-sm" onClick={handleCopyAll} style={{ flex: 1 }}>
          <Copy size={14} /> Copy All
        </button>
        <button className="btn btn-secondary btn-sm" onClick={handleDownload} style={{ flex: 1 }}>
          <Download size={14} /> Download
        </button>
        <button className="btn-icon" onClick={handleDelete} style={{ color: 'var(--red)' }}>
          <Trash2 size={16} />
        </button>
      </div>

      {/* Content sections */}
      <EditableSection title="Hook" icon={Zap} content={project.hook} color="var(--orange)" onSave={v => updateField('hook', v)} />
      <EditableSection title="Full Story" icon={Edit3} content={project.story} color="var(--accent)" onSave={v => updateField('story', v)} />
      <EditableSection title="Voiceover Script" icon={Mic} content={project.voiceover} color="var(--green)" onSave={v => updateField('voiceover', v)} />

      {/* Premium: AI Narration */}
      <NarrationSection
        project={project}
        isPro={isPro}
        onUpgrade={() => navigate('/upgrade')}
      />

      <EditableSection title="Subtitle Captions" icon={Type} content={project.captions} color="var(--blue)" onSave={v => updateField('captions', v)} />
      <EditableSection title="Post Caption" icon={MessageSquare} content={project.post_caption} color="var(--pink)" onSave={v => updateField('post_caption', v)} />
      <EditableSection title="Hashtags" icon={Hash} content={project.hashtags} color="var(--accent)" onSave={v => updateField('hashtags', v)} />
      <EditableSection title="Video Title Ideas" icon={Lightbulb} content={project.video_titles} color="var(--orange)" onSave={v => updateField('video_titles', v)} />

      {/* Premium: Video Suggestions */}
      <VideoSuggestionsSection
        project={project}
        isPro={isPro}
        onUpgrade={() => navigate('/upgrade')}
      />
    </div>
  );
}
