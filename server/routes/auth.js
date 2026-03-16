import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { JWT_SECRET, authenticateToken } from '../middleware.js';

const router = Router();

router.post('/signup', (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name are required' });
  }

  const existing = req.db.findUserByEmail(email);
  if (existing) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const id = uuidv4();
  const hashedPassword = bcrypt.hashSync(password, 10);

  req.db.createUser({
    id, email, password: hashedPassword, name,
    avatar: '', plan: 'free',
    created_at: new Date().toISOString(),
    onboarded: 0
  });

  req.db.createPreferences({
    user_id: id,
    platform: 'tiktok',
    content_style: 'crazy-true-story',
    tone: 'dramatic',
    story_length: '60',
    theme: 'dark'
  });

  const token = jwt.sign({ userId: id }, JWT_SECRET, { expiresIn: '30d' });

  res.json({
    token,
    user: { id, email, name, plan: 'free', onboarded: 0 }
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = req.db.findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' });
  const preferences = req.db.findPreferences(user.id);

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      plan: user.plan,
      onboarded: user.onboarded
    },
    preferences
  });
});

router.get('/me', authenticateToken, (req, res) => {
  const user = req.db.findUserById(req.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const preferences = req.db.findPreferences(req.userId);
  const weekUsage = req.db.getWeeklyUsage(req.userId);

  res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      plan: user.plan,
      onboarded: user.onboarded,
      created_at: user.created_at
    },
    preferences,
    weekUsage
  });
});

export default router;
