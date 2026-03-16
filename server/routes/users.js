import { Router } from 'express';
import { authenticateToken } from '../middleware.js';

const router = Router();

router.put('/preferences', authenticateToken, (req, res) => {
  const { platform, content_style, tone, story_length, theme } = req.body;
  const preferences = req.db.updatePreferences(req.userId, { platform, content_style, tone, story_length, theme });
  res.json({ preferences });
});

router.put('/onboard', authenticateToken, (req, res) => {
  const { platform, content_style, tone, story_length } = req.body;
  req.db.updatePreferences(req.userId, { platform, content_style, tone, story_length });
  req.db.updateUser(req.userId, { onboarded: 1 });
  res.json({ success: true });
});

router.put('/profile', authenticateToken, (req, res) => {
  const { name } = req.body;
  if (name) {
    req.db.updateUser(req.userId, { name });
  }
  const user = req.db.findUserById(req.userId);
  res.json({
    user: { id: user.id, email: user.email, name: user.name, plan: user.plan, onboarded: user.onboarded }
  });
});

router.post('/upgrade', authenticateToken, (req, res) => {
  req.db.updateUser(req.userId, { plan: 'pro' });
  res.json({ success: true, plan: 'pro' });
});

export default router;
