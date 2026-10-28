export const STORAGE_KEYS = {
  CURRENT_USER: 'issuetrack_current_user_v1',
  USERS: 'issuetrack_users_v1',
  TICKETS: 'issuetrack_tickets_v1',
  NOTIFICATIONS: 'issuetrack_notifications_v1',
  SEEDED: 'issuetrack_seeded_v1',
} as const;

export function getItem<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`Error reading key "${key}" from localStorage:`, err);
    return defaultValue;
  }
}

export function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error writing key "${key}" to localStorage:`, err);
  }
}

export function removeItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error(`Error removing key "${key}" from localStorage:`, err);
  }
}

export function clearAllAppData(): void {
  try {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
  } catch (err) {
    console.error('Error clearing localStorage app data:', err);
  }
}
