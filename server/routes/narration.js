import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { authenticateToken } from '../middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const AUDIO_DIR = path.join(__dirname, '..', 'audio');

// Ensure audio directory exists
if (!fs.existsSync(AUDIO_DIR)) {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
}

const router = Router();

// Voice style configurations (for mock TTS engine)
const VOICE_CONFIGS = {
  'male-deep': { pitch: 0.7, rate: 0.9, name: 'Deep Male' },
  'female-smooth': { pitch: 1.2, rate: 1.0, name: 'Smooth Female' },
  'dramatic': { pitch: 0.9, rate: 0.85, name: 'Dramatic Narrator' },
  'eerie': { pitch: 1.1, rate: 0.75, name: 'Eerie Whisper' },
  'storyteller': { pitch: 1.0, rate: 0.95, name: 'Classic Storyteller' },
  'calm': { pitch: 1.0, rate: 0.8, name: 'Calm & Soothing' }
};

// Generate mock audio narration (simulates TTS)
// In production, replace with real TTS API (ElevenLabs, Google TTS, Amazon Polly, etc.)
function generateMockAudio(text, voiceStyle, format) {
  const config = VOICE_CONFIGS[voiceStyle] || VOICE_CONFIGS['storyteller'];

  // Calculate approximate audio duration based on word count and speech rate
  const wordCount = text.split(/\s+/).length;
  const wordsPerMinute = 150 * config.rate;
  const durationSeconds = Math.ceil((wordCount / wordsPerMinute) * 60);

  // Generate a minimal valid audio file (WAV header with silence)
  // This is a mock — in production, this would call a real TTS API
  const sampleRate = 44100;
  const numChannels = 1;
  const bitsPerSample = 16;
  const numSamples = sampleRate * Math.min(durationSeconds, 5); // Cap at 5s for mock
  const dataSize = numSamples * numChannels * (bitsPerSample / 8);
  const headerSize = 44;
  const fileSize = headerSize + dataSize;

  const buffer = Buffer.alloc(fileSize);

  // WAV header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(fileSize - 8, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // fmt chunk size
  buffer.writeUInt16LE(1, 20); // PCM format
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * numChannels * (bitsPerSample / 8), 28);
  buffer.writeUInt16LE(numChannels * (bitsPerSample / 8), 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Generate a simple tone pattern instead of silence (makes it clear audio was generated)
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    // Generate a soft 220Hz tone with fade in/out
    const fadeIn = Math.min(1, t * 4);
    const fadeOut = Math.min(1, (numSamples / sampleRate - t) * 4);
    const amplitude = 2000 * fadeIn * fadeOut;
    const sample = Math.floor(amplitude * Math.sin(2 * Math.PI * 220 * t));
    buffer.writeInt16LE(Math.max(-32768, Math.min(32767, sample)), headerSize + i * 2);
  }

  return { buffer, durationSeconds, format: 'wav' };
}

// POST /api/narration/generate — Generate TTS narration for a project
router.post('/generate', authenticateToken, (req, res) => {
  const { projectId, text, voiceStyle, format } = req.body;

  // Check if user is on Pro plan
  const user = req.db.findUserById(req.userId);
  if (user.plan !== 'pro') {
    return res.status(403).json({
      error: 'Premium feature',
      message: 'AI Voice Narration is a Pro-only feature. Upgrade to unlock.',
      requiresPro: true
    });
  }

  if (!text || text.trim().length === 0) {
    return res.status(400).json({ error: 'Text is required for narration' });
  }

  const voice = voiceStyle || 'storyteller';
  const audioFormat = format || 'wav';

  if (!VOICE_CONFIGS[voice]) {
    return res.status(400).json({ error: 'Invalid voice style' });
  }

  // Generate audio
  const { buffer, durationSeconds } = generateMockAudio(text, voice, audioFormat);

  // Save audio file
  const audioId = uuidv4();
  const filename = `narration-${audioId}.wav`;
  const filePath = path.join(AUDIO_DIR, filename);
  fs.writeFileSync(filePath, buffer);

  // Store narration record in database
  req.db.createNarration({
    id: audioId,
    user_id: req.userId,
    project_id: projectId || null,
    voice_style: voice,
    format: audioFormat,
    duration: durationSeconds,
    filename,
    text_length: text.length,
    created_at: new Date().toISOString()
  });

  res.json({
    narrationId: audioId,
    voiceStyle: voice,
    voiceName: VOICE_CONFIGS[voice].name,
    duration: durationSeconds,
    format: audioFormat,
    downloadUrl: `/api/narration/audio/${audioId}`,
    message: 'Narration generated successfully! (Mock TTS — connect a real TTS API for production)'
  });
});

// GET /api/narration/audio/:id — Download/stream the audio file
router.get('/audio/:id', (req, res) => {
  const narration = req.db.findNarrationById(req.params.id);
  if (!narration) {
    return res.status(404).json({ error: 'Audio not found' });
  }

  const filePath = path.join(AUDIO_DIR, narration.filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Audio file not found' });
  }

  res.setHeader('Content-Type', 'audio/wav');
  res.setHeader('Content-Disposition', `attachment; filename="${narration.filename}"`);
  fs.createReadStream(filePath).pipe(res);
});

// GET /api/narration/voices — List available voice styles
router.get('/voices', (req, res) => {
  const voices = Object.entries(VOICE_CONFIGS).map(([key, val]) => ({
    value: key,
    label: val.name,
    pitch: val.pitch,
    rate: val.rate
  }));
  res.json({ voices });
});

// GET /api/narration/project/:projectId — Get narrations for a project
router.get('/project/:projectId', authenticateToken, (req, res) => {
  const narrations = req.db.findNarrationsByProject(req.params.projectId, req.userId);
  res.json({ narrations });
});

export default router;
