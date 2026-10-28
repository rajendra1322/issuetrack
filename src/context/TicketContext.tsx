import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Ticket,
  TicketStatus,
  Department,
  TerminalId,
  TicketStats,
  ConversationMessage,
} from '../types';
import { ticketService } from '../services/ticketService';
import { notificationService } from '../services/notificationService';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';

interface RaiseModalDefaults {
  terminalId?: TerminalId;
  sourceDepartment?: Department;
  assignedDepartment?: Department;
}

interface ToastInfo {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface TicketContextType {
  tickets: Ticket[];
  createTicket: (payload: {
    terminalId: TerminalId;
    sourceDepartment: Department;
    assignedDepartment: Department;
    issueDetails: string;
    location: string;
    initialRemarks?: string;
  }) => Ticket | null;
  updateTicketStatus: (
    ticketId: string,
    newStatus: TicketStatus,
    note?: string
  ) => boolean;
  addConversationMessage: (
    ticketId: string,
    message: string
  ) => ConversationMessage | null;
  getTicketById: (id: string) => Ticket | undefined;
  getDepartmentStats: (terminalId: TerminalId, department: Department) => TicketStats;
  getTerminalStats: (terminalId: TerminalId) => TicketStats;
  getGlobalStats: () => TicketStats;
  resetDemoData: () => void;
  // Modal state
  isRaiseModalOpen: boolean;
  raiseModalDefaults: RaiseModalDefaults;
  openRaiseModal: (defaults?: RaiseModalDefaults) => void;
  closeRaiseModal: () => void;
  // Toast state
  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export const TicketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const { refreshNotifications } = useNotifications();
  const [tickets, setTickets] = useState<Ticket[]>(() => ticketService.getAll());
  const [isRaiseModalOpen, setIsRaiseModalOpen] = useState(false);
  const [raiseModalDefaults, setRaiseModalDefaults] = useState<RaiseModalDefaults>({});
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  const refreshTickets = useCallback(() => {
    setTickets([...ticketService.getAll()]);
  }, []);

  useEffect(() => {
    refreshTickets();
  }, [refreshTickets]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const openRaiseModal = (defaults: RaiseModalDefaults = {}) => {
    setRaiseModalDefaults(defaults);
    setIsRaiseModalOpen(true);
  };

  const closeRaiseModal = () => {
    setIsRaiseModalOpen(false);
    setRaiseModalDefaults({});
  };

  const createTicket = (payload: {
    terminalId: TerminalId;
    sourceDepartment: Department;
    assignedDepartment: Department;
    issueDetails: string;
    location: string;
    initialRemarks?: string;
  }): Ticket | null => {
    if (!currentUser) {
      showToast('You must be signed in to raise a ticket.', 'error');
      return null;
    }

    try {
      const newTicket = ticketService.createTicket({
        ...payload,
        raisedBy: currentUser.name,
        raisedByEmail: currentUser.email,
      });

      refreshTickets();
      refreshNotifications();
      showToast(`Ticket ${newTicket.id} raised successfully!`, 'success');
      return newTicket;
    } catch (err) {
      console.error('Failed to create ticket:', err);
      showToast('Failed to raise ticket. Please check input fields.', 'error');
      return null;
    }
  };

  const updateTicketStatus = (
    ticketId: string,
    newStatus: TicketStatus,
    note?: string
  ): boolean => {
    if (!currentUser) return false;

    const res = ticketService.updateTicketStatus(ticketId, newStatus, currentUser, note);
    if (res.success) {
      refreshTickets();
      refreshNotifications();
      showToast(`Ticket status updated to "${newStatus}"`, 'success');
      return true;
    } else {
      showToast(res.error || 'Failed to update ticket status', 'error');
      return false;
    }
  };

  const addConversationMessage = (
    ticketId: string,
    message: string
  ): ConversationMessage | null => {
    if (!currentUser) return null;

    const res = ticketService.addConversationMessage(ticketId, message, currentUser);
    if (res.success && res.message) {
      refreshTickets();
      refreshNotifications();
      showToast('Reply sent successfully', 'success');
      return res.message;
    } else {
      showToast(res.error || 'Failed to send reply', 'error');
      return null;
    }
  };

  const getTicketById = (id: string): Ticket | undefined => {
    return tickets.find((t) => t.id === id);
  };

  const getDepartmentStats = (terminalId: TerminalId, department: Department): TicketStats => {
    return ticketService.getDepartmentStatsForTerminal(terminalId, department);
  };

  const getTerminalStats = (terminalId: TerminalId): TicketStats => {
    return ticketService.getStats(terminalId);
  };

  const getGlobalStats = (): TicketStats => {
    return ticketService.getStats();
  };

  const resetDemoData = () => {
    ticketService.resetTickets();
    notificationService.resetNotifications();
    refreshTickets();
    refreshNotifications();
    showToast('Demo data restored to initial state.', 'info');
  };

  return (
    <TicketContext.Provider
      value={{
        tickets,
        createTicket,
        updateTicketStatus,
        addConversationMessage,
        getTicketById,
        getDepartmentStats,
        getTerminalStats,
        getGlobalStats,
        resetDemoData,
        isRaiseModalOpen,
        raiseModalDefaults,
        openRaiseModal,
        closeRaiseModal,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};

export const useTickets = (): TicketContextType => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
};
