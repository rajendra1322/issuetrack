export type Department =
  | 'IT'
  | 'Electrical'
  | 'Operations'
  | 'Planning'
  | 'Safety'
  | 'Documentation'
  | 'Financial'
  | 'HR';

export const DEPARTMENTS: Department[] = [
  'IT',
  'Electrical',
  'Operations',
  'Planning',
  'Safety',
  'Documentation',
  'Financial',
  'HR',
];

export type TerminalId = 'container-terminal' | 'coal-terminal';
export type TerminalName = 'Container Terminal' | 'Coal Terminal';

export interface TerminalInfo {
  id: TerminalId;
  name: TerminalName;
  code: string;
  description: string;
  subtitle: string;
}

export const TERMINALS: Record<TerminalId, TerminalInfo> = {
  'container-terminal': {
    id: 'container-terminal',
    name: 'Container Terminal',
    code: 'CT',
    description: 'Manage issues and support requests across container terminal departments.',
    subtitle: 'Container Handling, Gantry Cranes, Yard Operations & CFS',
  },
  'coal-terminal': {
    id: 'coal-terminal',
    name: 'Coal Terminal',
    code: 'CLT',
    description: 'Manage issues and support requests across coal terminal departments.',
    subtitle: 'Bulk Cargo, Conveyor Systems, Stacker Reclaimers & Jetty',
  },
};

export type TicketStatus = 'Pending' | 'Checked' | 'Solved';

export interface User {
  id: string;
  name: string;
  email: string;
  department: Department;
  terminalId: TerminalId;
  terminalName: TerminalName;
  avatarInitial: string;
  role?: 'staff' | 'supervisor' | 'admin';
  createdAt: string;
}

export interface StatusHistoryEntry {
  id: string;
  fromStatus: TicketStatus;
  toStatus: TicketStatus;
  updatedBy: string;
  updatedByEmail: string;
  department: Department;
  timestamp: string;
  note?: string;
}

export interface ConversationMessage {
  id: string;
  ticketId: string;
  authorName: string;
  authorEmail: string;
  authorDepartment: Department;
  message: string;
  timestamp: string;
}

export interface Ticket {
  id: string; // e.g. ITK-2026-0001
  terminalId: TerminalId;
  terminalName: TerminalName;
  sourceDepartment: Department;
  assignedDepartment: Department; // Assist To / Receiving Dept
  raisedBy: string;
  raisedByEmail: string;
  issueDetails: string;
  location: string;
  status: TicketStatus;
  initialRemarks?: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: StatusHistoryEntry[];
  conversation: ConversationMessage[];
}

export type NotificationType = 'ticket_created' | 'status_changed' | 'reply_added';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  ticketId: string;
  terminalId: TerminalId;
  targetEmail: string;
  targetDepartment?: Department;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
}

export interface TicketStats {
  total: number;
  pending: number;
  checked: number;
  solved: number;
}
