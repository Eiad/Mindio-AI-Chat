const STORAGE_KEY = 'chat_sessions';

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
  }
};