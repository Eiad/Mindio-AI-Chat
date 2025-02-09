const STORAGE_KEY = 'chat_sessions';
const API_KEY_STORAGE_KEY = 'openai_api_key';

export const storage = {
  getSessions() {
    if (typeof window === 'undefined') return [];
    const sessions = localStorage.getItem(STORAGE_KEY);
    return sessions ? JSON.parse(sessions) : [];
  },

  saveSession(session) {
    const sessions = this.getSessions();
    const existingIndex = sessions.findIndex(s => s.id === session.id);
    
    if (existingIndex >= 0) {
      sessions[existingIndex] = session;
    } else {
      sessions.push(session);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  },

  deleteSession(sessionId) {
    const sessions = this.getSessions().filter(s => s.id !== sessionId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  },

  deleteAllSessions() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  },

  getApiKey() {
    if (typeof window === 'undefined') return null;
    const storedData = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (!storedData) return null;

    const { key, expiryDate } = JSON.parse(storedData);
    if (new Date(expiryDate) < new Date()) {
      this.removeApiKey();
      return null;
    }
    return key;
  },

  saveApiKey(key) {
    if (typeof window === 'undefined') return;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30); // Key expires in 30 days
    
    localStorage.setItem(API_KEY_STORAGE_KEY, JSON.stringify({
      key,
      expiryDate: expiryDate.toISOString()
    }));
  },

  removeApiKey() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(API_KEY_STORAGE_KEY);
  },

  getDalleSettings() {
    if (typeof window === 'undefined') return {
      imageSize: '1024x1024',
      imageQuality: 'standard',
      model: 'dall-e-3',
      replicate: {
        scheduler: 'DPMSolverMultistep',
        steps: 30,
        guidanceScale: 7.5
      }
    };
    
    const settings = localStorage.getItem('dalle_settings');
    return settings ? JSON.parse(settings) : {
      imageSize: '1024x1024',
      imageQuality: 'standard',
      model: 'dall-e-3',
      replicate: {
        scheduler: 'DPMSolverMultistep',
        steps: 30,
        guidanceScale: 7.5
      }
    };
  },

  saveDalleSettings(settings) {
    if (typeof window === 'undefined') return;
    localStorage.setItem('dalle_settings', JSON.stringify(settings));
  },

  getReplicateApiKey() {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem('REPLICATE_API_KEY');
  },

  saveReplicateApiKey(key) {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem('REPLICATE_API_KEY', key);
  },

  removeReplicateApiKey() {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem('REPLICATE_API_KEY');
  }
};