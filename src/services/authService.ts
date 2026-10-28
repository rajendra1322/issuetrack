import { User, Department, TerminalId, TERMINALS } from '../types';
import { getItem, setItem, removeItem, STORAGE_KEYS } from '../utils/localStorage';
import { SEED_USERS, COMMON_DEMO_PASSWORD } from '../utils/seedData';

export const authService = {
  initUsers(): User[] {
    const existing = getItem<User[]>(STORAGE_KEYS.USERS, []);
    if (existing.length === 0) {
      setItem(STORAGE_KEYS.USERS, SEED_USERS);
      return SEED_USERS;
    }
    return existing;
  },

  getAllUsers(): User[] {
    return this.initUsers();
  },

  getCurrentUser(): User | null {
    const user = getItem<User | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (!user) {
      // Default initial demo user if nothing logged in: Rahul Kumar (IT, Container Terminal)
      const users = this.getAllUsers();
      const defaultUser = users[0] || SEED_USERS[0];
      setItem(STORAGE_KEYS.CURRENT_USER, defaultUser);
      return defaultUser;
    }
    return user;
  },

  setCurrentUser(user: User | null): void {
    if (user) {
      setItem(STORAGE_KEYS.CURRENT_USER, user);
    } else {
      removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  registerUser(
    name: string,
    email: string,
    department: Department,
    terminalId: TerminalId
  ): { success: boolean; user?: User; error?: string } {
    const users = this.getAllUsers();
    const cleanEmail = email.trim().toLowerCase();

    const exists = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (exists) {
      return { success: false, error: 'An account with this email address already exists.' };
    }

    const terminalInfo = TERMINALS[terminalId];
    const firstLetter = name.trim().charAt(0).toUpperCase() || 'U';

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      department,
      terminalId,
      terminalName: terminalInfo.name,
      avatarInitial: firstLetter,
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [newUser, ...users];
    setItem(STORAGE_KEYS.USERS, updatedUsers);
    this.setCurrentUser(newUser);

    return { success: true, user: newUser };
  },

  signIn(email: string, _password?: string): { success: boolean; user?: User; error?: string } {
    const users = this.getAllUsers();
    const cleanEmail = email.trim().toLowerCase();

    const matchedUser = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!matchedUser) {
      return {
        success: false,
        error: 'No account found with this email. Please check your email or pick a demo account below.',
      };
    }

    // Notice: Simulated auth for prototype without storing plaintext password
    this.setCurrentUser(matchedUser);
    return { success: true, user: matchedUser };
  },

  quickSwitchUser(userId: string): User | null {
    const users = this.getAllUsers();
    const target = users.find((u) => u.id === userId);
    if (target) {
      this.setCurrentUser(target);
      return target;
    }
    return null;
  },

  signOut(): void {
    this.setCurrentUser(null);
  },

  updateProfile(name: string, department: Department, terminalId: TerminalId): User | null {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return null;

    const terminalInfo = TERMINALS[terminalId];
    const updated: User = {
      ...currentUser,
      name: name.trim(),
      department,
      terminalId,
      terminalName: terminalInfo.name,
      avatarInitial: name.trim().charAt(0).toUpperCase() || 'U',
    };

    this.setCurrentUser(updated);

    // Also update in all users list
    const users = this.getAllUsers();
    const updatedUsers = users.map((u) => (u.id === updated.id ? updated : u));
    setItem(STORAGE_KEYS.USERS, updatedUsers);

    return updated;
  },

  getDemoPassword(): string {
    return COMMON_DEMO_PASSWORD;
  },
};
