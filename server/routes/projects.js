import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authenticateToken } from '../middleware.js';

const router = Router();

router.get('/', authenticateToken, (req, res) => {
  const { search, category, status } = req.query;
  const projects = req.db.findProjects(req.userId, { search, category, status });
  res.json({ projects });
});

router.get('/:id', authenticateToken, (req, res) => {
  const project = req.db.findProjectById(req.params.id, req.userId);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  res.json({ project });
});

router.put('/:id', authenticateToken, (req, res) => {
  const { title, hook, story, voiceover, captions, post_caption, hashtags, video_titles, status } = req.body;

  const existing = req.db.findProjectById(req.params.id, req.userId);
  if (!existing) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const project = req.db.updateProject(req.params.id, req.userId, {
    title, hook, story, voiceover, captions, post_caption, hashtags, video_titles, status
  });
  res.json({ project });
});

router.post('/:id/duplicate', authenticateToken, (req, res) => {
  const original = req.db.findProjectById(req.params.id, req.userId);
  if (!original) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const now = new Date().toISOString();
  const project = req.db.createProject({
    id: uuidv4(),
    user_id: req.userId,
    title: original.title + ' (Copy)',
    category: original.category,
    platform: original.platform,
    tone: original.tone,
    video_length: original.video_length,
    hook: original.hook,
    story: original.story,
    voiceover: original.voiceover,
    captions: original.captions,
    post_caption: original.post_caption,
    hashtags: original.hashtags,
    video_titles: original.video_titles,
    status: 'draft',
    created_at: now,
    updated_at: now
  });
  res.json({ project });
});

router.delete('/:id', authenticateToken, (req, res) => {
  const deleted = req.db.deleteProject(req.params.id, req.userId);
  if (!deleted) {
    return res.status(404).json({ error: 'Project not found' });
  }
  res.json({ success: true });
});

export default router;
