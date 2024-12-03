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

  saveApiKey(apiKey) {
    if (typeof window === 'undefined') return;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30); // 30 days from now
    
    localStorage.setItem(API_KEY_STORAGE_KEY, JSON.stringify({
      key: apiKey,
      expiryDate: expiryDate.toISOString()
    }));

    sessionStorage.setItem('OPENAI_API_KEY', apiKey);
  },

  removeApiKey() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    sessionStorage.removeItem('OPENAI_API_KEY');
  }
};