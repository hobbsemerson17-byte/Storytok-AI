import { Router } from 'express';
import { authenticateToken } from '../middleware.js';

const router = Router();

// Background video database with mood matching
const VIDEO_LIBRARY = [
  {
    id: 'minecraft-parkour',
    name: 'Minecraft Parkour',
    description: 'Satisfying parkour gameplay — the #1 most-used background for story content',
    moods: ['intense', 'hype', 'neutral'],
    platforms: ['tiktok', 'shorts', 'reels'],
    searchTerms: ['minecraft parkour gameplay no copyright', 'minecraft satisfying parkour'],
    popularity: 98,
    emoji: '🎮'
  },
  {
    id: 'subway-surfers',
    name: 'Subway Surfers',
    description: 'Fast-paced runner gameplay — keeps viewers watching through the whole video',
    moods: ['hype', 'intense', 'neutral'],
    platforms: ['tiktok', 'shorts', 'reels'],
    searchTerms: ['subway surfers gameplay no copyright', 'subway surfers background video'],
    popularity: 95,
    emoji: '🏃'
  },
  {
    id: 'cinematic-city',
    name: 'Cinematic City Driving',
    description: 'Night city driving footage with neon lights — great for emotional and dramatic stories',
    moods: ['chill', 'emotional', 'neutral'],
    platforms: ['tiktok', 'reels', 'shorts'],
    searchTerms: ['cinematic night driving city', 'aesthetic city night drive 4k'],
    popularity: 88,
    emoji: '🌃'
  },
  {
    id: 'creepy-forest',
    name: 'Creepy Forest Walk',
    description: 'Dark forest footage with ambient fog — perfect for horror and scary stories',
    moods: ['dark', 'intense'],
    platforms: ['tiktok', 'shorts', 'reels'],
    searchTerms: ['creepy forest walk footage', 'dark forest ambient video'],
    popularity: 82,
    emoji: '🌲'
  },
  {
    id: 'dark-rainy-street',
    name: 'Dark Rainy Street',
    description: 'Rain on dark streets at night — moody atmosphere for confessions and drama',
    moods: ['dark', 'emotional'],
    platforms: ['tiktok', 'reels', 'shorts'],
    searchTerms: ['rainy street night footage', 'dark rain ambience video'],
    popularity: 85,
    emoji: '🌧️'
  },
  {
    id: 'relaxing-aesthetic',
    name: 'Relaxing Aesthetic',
    description: 'Soft aesthetic footage — pastel clouds, sunsets, gentle waves',
    moods: ['chill', 'emotional'],
    platforms: ['reels', 'tiktok', 'shorts'],
    searchTerms: ['aesthetic relaxing video background', 'soft aesthetic footage no copyright'],
    popularity: 78,
    emoji: '✨'
  },
  {
    id: 'podcast-style',
    name: 'Podcast Style (Static)',
    description: 'Clean static background with waveform animation — for longer narration-focused content',
    moods: ['neutral', 'chill'],
    platforms: ['shorts', 'tiktok', 'reels'],
    searchTerms: ['podcast background animation', 'audio waveform background video'],
    popularity: 72,
    emoji: '🎙️'
  },
  {
    id: 'ocean-waves',
    name: 'Ocean Waves',
    description: 'Calming ocean wave footage — ideal for motivational and emotional stories',
    moods: ['chill', 'emotional'],
    platforms: ['reels', 'tiktok', 'shorts'],
    searchTerms: ['ocean waves 4k footage', 'calming sea waves video'],
    popularity: 75,
    emoji: '🌊'
  },
  {
    id: 'neon-tunnel',
    name: 'Neon Tunnel Drive',
    description: 'Futuristic neon tunnel animation — eye-catching for hype and dramatic content',
    moods: ['hype', 'intense'],
    platforms: ['tiktok', 'shorts', 'reels'],
    searchTerms: ['neon tunnel drive animation', 'synthwave tunnel background'],
    popularity: 80,
    emoji: '🚗'
  },
  {
    id: 'cooking-asmr',
    name: 'Cooking / ASMR',
    description: 'Satisfying cooking clips — unique background that keeps viewers engaged',
    moods: ['chill', 'neutral'],
    platforms: ['tiktok', 'reels', 'shorts'],
    searchTerms: ['satisfying cooking video', 'cooking asmr compilation'],
    popularity: 70,
    emoji: '🍳'
  },
  {
    id: 'space-footage',
    name: 'Space / Galaxy',
    description: 'NASA space footage and galaxy visuals — mesmerizing for dark and contemplative stories',
    moods: ['dark', 'chill'],
    platforms: ['tiktok', 'shorts', 'reels'],
    searchTerms: ['space footage 4k nasa', 'galaxy nebula background video'],
    popularity: 77,
    emoji: '🪐'
  },
  {
    id: 'gta-gameplay',
    name: 'GTA Gameplay',
    description: 'GTA driving and action clips — popular background for drama and crime stories',
    moods: ['hype', 'intense', 'neutral'],
    platforms: ['tiktok', 'shorts', 'reels'],
    searchTerms: ['gta 5 gameplay no copyright', 'gta driving gameplay background'],
    popularity: 90,
    emoji: '🔫'
  }
];

// Mood auto-detection from category + tone
const MOOD_MAP = {
  'crazy-true-story': { dramatic: 'intense', serious: 'intense', funny: 'hype', emotional: 'emotional', creepy: 'dark' },
  'scary-story': { dramatic: 'dark', serious: 'dark', funny: 'neutral', emotional: 'dark', creepy: 'dark' },
  'relationship-drama': { dramatic: 'emotional', serious: 'emotional', funny: 'neutral', emotional: 'emotional', creepy: 'dark' },
  'rich-luxury': { dramatic: 'hype', serious: 'neutral', funny: 'hype', emotional: 'emotional', creepy: 'dark' },
  'crime-mystery': { dramatic: 'intense', serious: 'dark', funny: 'neutral', emotional: 'emotional', creepy: 'dark' },
  'reddit-confession': { dramatic: 'intense', serious: 'neutral', funny: 'hype', emotional: 'emotional', creepy: 'dark' },
  'motivational': { dramatic: 'emotional', serious: 'neutral', funny: 'chill', emotional: 'emotional', creepy: 'dark' }
};

// GET /api/videos/suggest — Get background video suggestions based on story mood
router.get('/suggest', authenticateToken, (req, res) => {
  const user = req.db.findUserById(req.userId);
  if (user.plan !== 'pro') {
    return res.status(403).json({
      error: 'Premium feature',
      message: 'Background video suggestions are a Pro-only feature. Upgrade to unlock.',
      requiresPro: true
    });
  }

  const { category, tone, mood, platform } = req.query;

  // Auto-detect mood if not provided
  let targetMood = mood;
  if (!targetMood && category && tone) {
    const catMap = MOOD_MAP[category];
    targetMood = catMap ? catMap[tone] || 'neutral' : 'neutral';
  }
  if (!targetMood) targetMood = 'neutral';

  // Filter videos by mood match
  let suggestions = VIDEO_LIBRARY.filter(v => v.moods.includes(targetMood));

  // Optionally filter by platform
  if (platform) {
    const platformMatch = suggestions.filter(v => v.platforms[0] === platform);
    if (platformMatch.length >= 3) {
      suggestions = platformMatch;
    }
  }

  // Sort by popularity
  suggestions.sort((a, b) => b.popularity - a.popularity);

  // Return top 5 with the detected mood
  res.json({
    mood: targetMood,
    suggestions: suggestions.slice(0, 5).map(v => ({
      id: v.id,
      name: v.name,
      description: v.description,
      emoji: v.emoji,
      popularity: v.popularity,
      searchTerms: v.searchTerms,
      bestFor: v.moods
    }))
  });
});

// GET /api/videos/all — List all background video options
router.get('/all', (req, res) => {
  res.json({
    videos: VIDEO_LIBRARY.map(v => ({
      id: v.id,
      name: v.name,
      description: v.description,
      emoji: v.emoji,
      moods: v.moods,
      popularity: v.popularity
    }))
  });
});

export default router;
