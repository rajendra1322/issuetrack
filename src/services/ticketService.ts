import {
  Ticket,
  TicketStatus,
  Department,
  TerminalId,
  TERMINALS,
  User,
  TicketStats,
  StatusHistoryEntry,
  ConversationMessage,
} from '../types';
import { getItem, setItem, STORAGE_KEYS } from '../utils/localStorage';
import { SEED_TICKETS } from '../utils/seedData';
import { notificationService } from './notificationService';

export const ticketService = {
  initTickets(): Ticket[] {
    const existing = getItem<Ticket[]>(STORAGE_KEYS.TICKETS, []);
    if (existing.length === 0) {
      setItem(STORAGE_KEYS.TICKETS, SEED_TICKETS);
      return SEED_TICKETS;
    }
    return existing;
  },

  getAll(): Ticket[] {
    return this.initTickets();
  },

  getById(id: string): Ticket | undefined {
    return this.getAll().find((t) => t.id === id);
  },

  generateNextTicketId(): string {
    const tickets = this.getAll();
    const currentYear = new Date().getFullYear();
    const prefix = `ITK-${currentYear}-`;

    let maxNum = 0;
    tickets.forEach((t) => {
      if (t.id.startsWith(prefix)) {
        const numPart = parseInt(t.id.replace(prefix, ''), 10);
        if (!isNaN(numPart) && numPart > maxNum) {
          maxNum = numPart;
        }
      }
    });

    const nextNum = maxNum + 1;
    return `${prefix}${nextNum.toString().padStart(4, '0')}`;
  },

  createTicket(payload: {
    terminalId: TerminalId;
    sourceDepartment: Department;
    assignedDepartment: Department;
    raisedBy: string;
    raisedByEmail: string;
    issueDetails: string;
    location: string;
    initialRemarks?: string;
  }): Ticket {
    const tickets = this.getAll();
    const terminalInfo = TERMINALS[payload.terminalId];
    const ticketId = this.generateNextTicketId();
    const now = new Date().toISOString();

    const newTicket: Ticket = {
      id: ticketId,
      terminalId: payload.terminalId,
      terminalName: terminalInfo.name,
      sourceDepartment: payload.sourceDepartment,
      assignedDepartment: payload.assignedDepartment,
      raisedBy: payload.raisedBy,
      raisedByEmail: payload.raisedByEmail,
      issueDetails: payload.issueDetails.trim(),
      location: payload.location.trim(),
      status: 'Pending',
      initialRemarks: payload.initialRemarks?.trim() || '',
      createdAt: now,
      updatedAt: now,
      statusHistory: [],
      conversation: [],
    };

    const updated = [newTicket, ...tickets];
    setItem(STORAGE_KEYS.TICKETS, updated);

    // Notify receiving department
    notificationService.createNotification({
      title: `New Ticket Assigned (${ticketId})`,
      message: `A new ticket from ${payload.sourceDepartment} has been assigned to ${payload.assignedDepartment}: "${payload.issueDetails.slice(0, 70)}..."`,
      ticketId: ticketId,
      terminalId: payload.terminalId,
      targetEmail: '', // department-wide
      targetDepartment: payload.assignedDepartment,
      type: 'ticket_created',
    });

    return newTicket;
  },

  updateTicketStatus(
    ticketId: string,
    newStatus: TicketStatus,
    currentUser: User,
    note?: string
  ): { success: boolean; ticket?: Ticket; error?: string } {
    const tickets = this.getAll();
    const target = tickets.find((t) => t.id === ticketId);
    if (!target) {
      return { success: false, error: 'Ticket not found.' };
    }

    if (target.status === newStatus) {
      return { success: true, ticket: target };
    }

    const now = new Date().toISOString();
    const historyEntry: StatusHistoryEntry = {
      id: `sh-${Date.now()}`,
      fromStatus: target.status,
      toStatus: newStatus,
      updatedBy: currentUser.name,
      updatedByEmail: currentUser.email,
      department: currentUser.department,
      timestamp: now,
      note: note || `Status updated to ${newStatus}`,
    };

    const updatedTicket: Ticket = {
      ...target,
      status: newStatus,
      updatedAt: now,
      statusHistory: [historyEntry, ...(target.statusHistory || [])],
    };

    const updatedList = tickets.map((t) => (t.id === ticketId ? updatedTicket : t));
    setItem(STORAGE_KEYS.TICKETS, updatedList);

    // Notify original creator if someone else updated status
    if (currentUser.email.toLowerCase() !== target.raisedByEmail.toLowerCase()) {
      notificationService.createNotification({
        title: `Ticket ${newStatus}: ${ticketId}`,
        message: `${currentUser.name} (${currentUser.department}) changed ticket status to ${newStatus}.`,
        ticketId: ticketId,
        terminalId: target.terminalId,
        targetEmail: target.raisedByEmail,
        type: 'status_changed',
      });
    }

    return { success: true, ticket: updatedTicket };
  },

  addConversationMessage(
    ticketId: string,
    messageText: string,
    currentUser: User
  ): { success: boolean; ticket?: Ticket; message?: ConversationMessage; error?: string } {
    const tickets = this.getAll();
    const target = tickets.find((t) => t.id === ticketId);
    if (!target) {
      return { success: false, error: 'Ticket not found.' };
    }

    const now = new Date().toISOString();
    const newMsg: ConversationMessage = {
      id: `msg-${Date.now()}`,
      ticketId,
      authorName: currentUser.name,
      authorEmail: currentUser.email,
      authorDepartment: currentUser.department,
      message: messageText.trim(),
      timestamp: now,
    };

    const updatedTicket: Ticket = {
      ...target,
      updatedAt: now,
      conversation: [...(target.conversation || []), newMsg],
    };

    const updatedList = tickets.map((t) => (t.id === ticketId ? updatedTicket : t));
    setItem(STORAGE_KEYS.TICKETS, updatedList);

    // Notify appropriate party:
    // If sender is creator, notify assigned department
    // If sender is assigned department, notify creator
    const isCreator = currentUser.email.toLowerCase() === target.raisedByEmail.toLowerCase();
    if (isCreator) {
      notificationService.createNotification({
        title: `Reply from Creator (${ticketId})`,
        message: `${currentUser.name} added a remark: "${messageText.slice(0, 60)}..."`,
        ticketId,
        terminalId: target.terminalId,
        targetEmail: '',
        targetDepartment: target.assignedDepartment,
        type: 'reply_added',
      });
    } else {
      notificationService.createNotification({
        title: `Department Reply (${ticketId})`,
        message: `${currentUser.name} (${currentUser.department}) replied: "${messageText.slice(0, 60)}..."`,
        ticketId,
        terminalId: target.terminalId,
        targetEmail: target.raisedByEmail,
        type: 'reply_added',
      });
    }

    return { success: true, ticket: updatedTicket, message: newMsg };
  },

  getStats(terminalId?: TerminalId, department?: Department): TicketStats {
    let list = this.getAll();

    if (terminalId) {
      list = list.filter((t) => t.terminalId === terminalId);
    }

    if (department) {
      list = list.filter((t) => t.assignedDepartment === department);
    }

    return {
      total: list.length,
      pending: list.filter((t) => t.status === 'Pending').length,
      checked: list.filter((t) => t.status === 'Checked').length,
      solved: list.filter((t) => t.status === 'Solved').length,
    };
  },

  getDepartmentStatsForTerminal(terminalId: TerminalId, department: Department): TicketStats {
    const list = this.getAll().filter(
      (t) => t.terminalId === terminalId && t.assignedDepartment === department
    );

    return {
      total: list.length,
      pending: list.filter((t) => t.status === 'Pending').length,
      checked: list.filter((t) => t.status === 'Checked').length,
      solved: list.filter((t) => t.status === 'Solved').length,
    };
  },

  resetTickets(): void {
    setItem(STORAGE_KEYS.TICKETS, SEED_TICKETS);
  },
};
