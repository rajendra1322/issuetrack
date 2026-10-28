import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTickets } from '../context/TicketContext';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { TicketFilters } from '../components/tickets/TicketFilters';
import { TicketTable } from '../components/tickets/TicketTable';
import { Ticket as TicketIcon, Plus, User } from 'lucide-react';

export const MyTicketsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { tickets, openRaiseModal } = useTickets();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [terminalFilter, setTerminalFilter] = useState('ALL');

  const myTickets = useMemo(() => {
    if (!currentUser) return [];

    const userEmail = currentUser.email.toLowerCase();

    return tickets.filter((t) => {
      // Must be created by current user
      if (t.raisedByEmail.toLowerCase() !== userEmail) return false;

      // Filter by status
      if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;

      // Filter by terminal
      if (terminalFilter !== 'ALL' && t.terminalId !== terminalFilter) return false;

      // Search term
      if (searchTerm.trim() !== '') {
        const q = searchTerm.toLowerCase();
        const matchId = t.id.toLowerCase().includes(q);
        const matchDept = t.assignedDepartment.toLowerCase().includes(q);
        const matchLoc = t.location.toLowerCase().includes(q);
        const matchIssue = t.issueDetails.toLowerCase().includes(q);
        if (!matchId && !matchDept && !matchLoc && !matchIssue) return false;
      }

      return true;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [tickets, currentUser, statusFilter, terminalFilter, searchTerm]);

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumb items={[{ label: 'My Tickets' }]} />

      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-brand-50 text-brand-600 rounded-2xl">
              <TicketIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-charcoal-900 tracking-tight">My Raised Tickets</h1>
              <p className="text-xs text-charcoal-500 mt-0.5">
                Tickets raised by you across port terminals. Track replies and real-time status updates.
              </p>
            </div>
          </div>

          {currentUser && (
            <div className="mt-3 flex items-center gap-2 text-xs text-charcoal-600">
              <User className="w-3.5 h-3.5 text-charcoal-400" />
              <span>
                Viewing issues submitted by: <strong>{currentUser.name}</strong> ({currentUser.email})
              </span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => openRaiseModal()}
          className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-brand-500 hover:bg-brand-600 shadow-sm transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Raise New Ticket</span>
        </button>
      </div>

      {/* Filters */}
      <TicketFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        terminalFilter={terminalFilter}
        onTerminalChange={setTerminalFilter}
        showTerminalFilter={true}
        showSourceDeptFilter={false}
      />

      {/* Table */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-charcoal-900">
            Tickets Log ({myTickets.length})
          </h2>
          <span className="text-xs text-charcoal-500">
            Click any ticket to read responses from destination departments
          </span>
        </div>

        <TicketTable
          tickets={myTickets}
          emptyMessage="You have not raised any tickets yet"
          emptySubtitle="When you submit issues or technical requests, they will be tracked here."
          onRaiseTicket={() => openRaiseModal()}
        />
      </div>
    </div>
  );
};
