import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDatabase } from './database.js';
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import generateRoutes from './routes/generate.js';
import templateRoutes from './routes/templates.js';
import userRoutes from './routes/users.js';
import narrationRoutes from './routes/narration.js';
import videoRoutes from './routes/videos.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const db = initDatabase();

app.use((req, res, next) => {
  req.db = db;
  next();
});

// Serve audio files statically
app.use('/api/audio', express.static(path.join(__dirname, 'audio')));

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/generate', generateRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/users', userRoutes);
app.use('/api/narration', narrationRoutes);
app.use('/api/videos', videoRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'StoryTok AI server is running' });
});

// --- Production: serve built frontend ---
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// SPA catch-all: any non-API route serves index.html so React Router works
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log('');
  console.log('  ========================================');
  console.log('  StoryTok AI Server is running!');
  console.log(`  http://localhost:${PORT}`);
  console.log('  ========================================');
  console.log('');
});
