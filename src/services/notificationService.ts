import { AppNotification, NotificationType, Department, TerminalId } from '../types';
import { getItem, setItem, STORAGE_KEYS } from '../utils/localStorage';
import { SEED_NOTIFICATIONS } from '../utils/seedData';

export const notificationService = {
  initNotifications(): AppNotification[] {
    const existing = getItem<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    if (existing.length === 0) {
      setItem(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
      return SEED_NOTIFICATIONS;
    }
    return existing;
  },

  getAll(): AppNotification[] {
    return this.initNotifications();
  },

  getForUser(email: string, department?: Department): AppNotification[] {
    const all = this.getAll();
    const cleanEmail = email.toLowerCase();

    return all.filter((n) => {
      // Matches user's direct email
      if (n.targetEmail.toLowerCase() === cleanEmail) return true;
      // Or matches user's department queue
      if (department && n.targetDepartment === department) return true;
      return false;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getUnreadCount(email: string, department?: Department): number {
    return this.getForUser(email, department).filter((n) => !n.isRead).length;
  },

  createNotification(params: {
    title: string;
    message: string;
    ticketId: string;
    terminalId: TerminalId;
    targetEmail: string;
    targetDepartment?: Department;
    type: NotificationType;
  }): AppNotification {
    const all = this.getAll();
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: params.title,
      message: params.message,
      ticketId: params.ticketId,
      terminalId: params.terminalId,
      targetEmail: params.targetEmail,
      targetDepartment: params.targetDepartment,
      type: params.type,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    const updated = [newNotif, ...all];
    setItem(STORAGE_KEYS.NOTIFICATIONS, updated);
    return newNotif;
  },

  markAsRead(notificationId: string): void {
    const all = this.getAll();
    const updated = all.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n));
    setItem(STORAGE_KEYS.NOTIFICATIONS, updated);
  },

  markAllAsRead(email: string, department?: Department): void {
    const all = this.getAll();
    const cleanEmail = email.toLowerCase();
    const updated = all.map((n) => {
      const match =
        n.targetEmail.toLowerCase() === cleanEmail ||
        (department && n.targetDepartment === department);
      return match ? { ...n, isRead: true } : n;
    });
    setItem(STORAGE_KEYS.NOTIFICATIONS, updated);
  },

  resetNotifications(): void {
    setItem(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
  },
};
