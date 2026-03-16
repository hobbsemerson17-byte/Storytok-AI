const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('storytok_token');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    },
    ...options
  };

  const res = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.message || 'Something went wrong');
  }

  return data;
}

export const api = {
  // Auth
  signup: (data) => request('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => request('/auth/me'),

  // User
  updatePreferences: (data) => request('/users/preferences', { method: 'PUT', body: JSON.stringify(data) }),
  completeOnboarding: (data) => request('/users/onboard', { method: 'PUT', body: JSON.stringify(data) }),
  updateProfile: (data) => request('/users/profile', { method: 'PUT', body: JSON.stringify(data) }),
  upgradePlan: () => request('/users/upgrade', { method: 'POST' }),

  // Generate
  generateStory: (data) => request('/generate', { method: 'POST', body: JSON.stringify(data) }),
  surpriseMe: () => request('/generate/surprise'),

  // Projects
  getProjects: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/projects${query ? '?' + query : ''}`);
  },
  getProject: (id) => request(`/projects/${id}`),
  updateProject: (id, data) => request(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  duplicateProject: (id) => request(`/projects/${id}/duplicate`, { method: 'POST' }),
  deleteProject: (id) => request(`/projects/${id}`, { method: 'DELETE' }),

  // Templates
  getTemplates: () => request('/templates'),
  getTemplate: (id) => request(`/templates/${id}`),

  // Premium: Narration / TTS
  generateNarration: (data) => request('/narration/generate', { method: 'POST', body: JSON.stringify(data) }),
  getNarrationVoices: () => request('/narration/voices'),
  getProjectNarrations: (projectId) => request(`/narration/project/${projectId}`),

  // Premium: Video Suggestions
  getVideoSuggestions: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/videos/suggest${query ? '?' + query : ''}`);
  },
  getAllVideos: () => request('/videos/all'),
};
