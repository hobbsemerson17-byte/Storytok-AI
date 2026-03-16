export const PLATFORMS = [
  { value: 'tiktok', label: 'TikTok', icon: 'video' },
  { value: 'reels', label: 'Instagram Reels', icon: 'instagram' },
  { value: 'shorts', label: 'YouTube Shorts', icon: 'youtube' }
];

export const CONTENT_STYLES = [
  { value: 'crazy-true-story', label: 'Crazy True Story', icon: 'zap' },
  { value: 'scary-story', label: 'Scary Story', icon: 'ghost' },
  { value: 'relationship-drama', label: 'Relationship Drama', icon: 'heart' },
  { value: 'rich-luxury', label: 'Rich / Luxury', icon: 'gem' },
  { value: 'crime-mystery', label: 'Crime / Mystery', icon: 'search' },
  { value: 'motivational', label: 'Motivational', icon: 'sunrise' },
  { value: 'reddit-confession', label: 'Reddit Confession', icon: 'message' }
];

export const TONES = [
  { value: 'serious', label: 'Serious' },
  { value: 'dramatic', label: 'Dramatic' },
  { value: 'creepy', label: 'Creepy' },
  { value: 'funny', label: 'Funny' },
  { value: 'emotional', label: 'Emotional' }
];

export const STORY_LENGTHS = [
  { value: '15', label: '15 sec' },
  { value: '30', label: '30 sec' },
  { value: '60', label: '60 sec' },
  { value: '90', label: '90 sec' }
];

export const HOOK_STYLES = [
  { value: 'shock', label: 'Shock / Surprise' },
  { value: 'question', label: 'Question Hook' },
  { value: 'confession', label: 'Confession' },
  { value: 'challenge', label: 'Challenge' },
  { value: 'cliffhanger', label: 'Cliffhanger' }
];

export const CATEGORY_LABELS = {
  'crazy-true-story': 'Crazy True Story',
  'scary-story': 'Scary Story',
  'relationship-drama': 'Relationship Drama',
  'rich-luxury': 'Rich / Luxury',
  'crime-mystery': 'Crime / Mystery',
  'motivational': 'Motivational',
  'reddit-confession': 'Reddit Confession'
};

export const CATEGORY_COLORS = {
  'crazy-true-story': '#f59e0b',
  'scary-story': '#ef4444',
  'relationship-drama': '#ec4899',
  'rich-luxury': '#8b5cf6',
  'crime-mystery': '#3b82f6',
  'motivational': '#10b981',
  'reddit-confession': '#f97316'
};

// ── Premium: Voice Styles for AI Narration ──
export const VOICE_STYLES = [
  { value: 'male-deep', label: 'Male (Deep)', desc: 'Deep, commanding male voice' },
  { value: 'female-smooth', label: 'Female (Smooth)', desc: 'Smooth, captivating female voice' },
  { value: 'dramatic', label: 'Dramatic', desc: 'Intense theatrical narration' },
  { value: 'eerie', label: 'Eerie', desc: 'Unsettling whisper-like tone' },
  { value: 'storyteller', label: 'Storyteller', desc: 'Classic campfire narrator' },
  { value: 'calm', label: 'Calm', desc: 'Gentle, soothing delivery' }
];

// ── Premium: Story Mood for Video Background Matching ──
export const STORY_MOODS = [
  { value: 'intense', label: 'Intense', color: '#ef4444' },
  { value: 'dark', label: 'Dark / Creepy', color: '#6b21a8' },
  { value: 'emotional', label: 'Emotional', color: '#ec4899' },
  { value: 'chill', label: 'Chill / Aesthetic', color: '#06b6d4' },
  { value: 'hype', label: 'Hype / Energetic', color: '#f59e0b' },
  { value: 'neutral', label: 'Neutral', color: '#6b7280' }
];

// ── Premium: Background Video Suggestions ──
export const VIDEO_BACKGROUNDS = [
  { value: 'minecraft-parkour', label: 'Minecraft Parkour', mood: ['intense', 'hype', 'neutral'], emoji: '🎮' },
  { value: 'subway-surfers', label: 'Subway Surfers', mood: ['hype', 'intense', 'neutral'], emoji: '🏃' },
  { value: 'cinematic-city', label: 'Cinematic City Driving', mood: ['chill', 'emotional', 'neutral'], emoji: '🌃' },
  { value: 'creepy-forest', label: 'Creepy Forest Walk', mood: ['dark', 'intense'], emoji: '🌲' },
  { value: 'dark-rainy-street', label: 'Dark Rainy Street', mood: ['dark', 'emotional'], emoji: '🌧️' },
  { value: 'relaxing-aesthetic', label: 'Relaxing Aesthetic', mood: ['chill', 'emotional'], emoji: '✨' },
  { value: 'podcast-style', label: 'Podcast Style (Static)', mood: ['neutral', 'chill'], emoji: '🎙️' },
  { value: 'ocean-waves', label: 'Ocean Waves', mood: ['chill', 'emotional'], emoji: '🌊' },
  { value: 'neon-tunnel', label: 'Neon Tunnel Drive', mood: ['hype', 'intense'], emoji: '🚗' },
  { value: 'cooking-asmr', label: 'Cooking / ASMR', mood: ['chill', 'neutral'], emoji: '🍳' },
  { value: 'space-footage', label: 'Space / Galaxy', mood: ['dark', 'chill'], emoji: '🪐' },
  { value: 'gta-gameplay', label: 'GTA Gameplay', mood: ['hype', 'intense', 'neutral'], emoji: '🔫' }
];

// ── Premium: Platform Export Modes ──
export const PLATFORM_MODES = [
  { value: 'tiktok-optimized', label: 'TikTok Optimized', desc: '9:16 vertical, trend-ready hooks', platform: 'tiktok' },
  { value: 'reels-optimized', label: 'Reels Optimized', desc: '9:16 vertical, IG-style captions', platform: 'reels' },
  { value: 'shorts-optimized', label: 'Shorts Optimized', desc: '9:16 vertical, YT-style titles', platform: 'shorts' },
  { value: 'universal', label: 'Universal', desc: 'Works across all platforms', platform: 'all' }
];

// ── Premium: Audio Formats ──
export const AUDIO_FORMATS = [
  { value: 'mp3', label: 'MP3', desc: 'Standard quality, smaller file' },
  { value: 'wav', label: 'WAV', desc: 'High quality, larger file' }
];

// ── Mood auto-detection from category + tone ──
export const MOOD_MAP = {
  'crazy-true-story': { dramatic: 'intense', serious: 'intense', funny: 'hype', emotional: 'emotional', creepy: 'dark' },
  'scary-story': { dramatic: 'dark', serious: 'dark', funny: 'neutral', emotional: 'dark', creepy: 'dark' },
  'relationship-drama': { dramatic: 'emotional', serious: 'emotional', funny: 'neutral', emotional: 'emotional', creepy: 'dark' },
  'rich-luxury': { dramatic: 'hype', serious: 'neutral', funny: 'hype', emotional: 'emotional', creepy: 'dark' },
  'crime-mystery': { dramatic: 'intense', serious: 'dark', funny: 'neutral', emotional: 'emotional', creepy: 'dark' },
  'reddit-confession': { dramatic: 'intense', serious: 'neutral', funny: 'hype', emotional: 'emotional', creepy: 'dark' },
  'motivational': { dramatic: 'emotional', serious: 'neutral', funny: 'chill', emotional: 'emotional', creepy: 'dark' }
};
