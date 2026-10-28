import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTickets } from '../context/TicketContext';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { TicketFilters } from '../components/tickets/TicketFilters';
import { TicketTable } from '../components/tickets/TicketTable';
import { Inbox, Plus, Building2, ArrowRightLeft } from 'lucide-react';
import { QuickAccountSwitcher } from '../components/layout/QuickAccountSwitcher';

export const AssignedTicketsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { tickets, openRaiseModal } = useTickets();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [terminalFilter, setTerminalFilter] = useState('ALL');
  const [sourceDeptFilter, setSourceDeptFilter] = useState('ALL');
  const [isSwitchUserOpen, setIsSwitchUserOpen] = useState(false);

  const currentDept = currentUser?.department || 'IT';

  const assignedTickets = useMemo(() => {
    return tickets.filter((t) => {
      // Must be assigned to current user's department
      if (t.assignedDepartment !== currentDept) return false;

      // Filter by status
      if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;

      // Filter by terminal
      if (terminalFilter !== 'ALL' && t.terminalId !== terminalFilter) return false;

      // Filter by source department
      if (sourceDeptFilter !== 'ALL' && t.sourceDepartment !== sourceDeptFilter) return false;

      // Search term
      if (searchTerm.trim() !== '') {
        const q = searchTerm.toLowerCase();
        const matchId = t.id.toLowerCase().includes(q);
        const matchRaiser = t.raisedBy.toLowerCase().includes(q);
        const matchEmail = t.raisedByEmail.toLowerCase().includes(q);
        const matchLocation = t.location.toLowerCase().includes(q);
        const matchIssue = t.issueDetails.toLowerCase().includes(q);
        if (!matchId && !matchRaiser && !matchEmail && !matchLocation && !matchIssue) return false;
      }

      return true;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [tickets, currentDept, statusFilter, terminalFilter, sourceDeptFilter, searchTerm]);

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumb items={[{ label: 'Assigned Tickets' }]} />

      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-2xl">
              <Inbox className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-black text-charcoal-900 tracking-tight">
                  Assigned Tickets
                </h1>
                <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-200">
                  {currentDept} Queue
                </span>
              </div>
              <p className="text-xs text-charcoal-500 mt-0.5">
                Issues raised by other port departments requiring action or review by {currentDept}.
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-3 text-xs text-charcoal-600 flex-wrap">
            <span className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-charcoal-400" />
              <span>
                Acting staff: <strong>{currentUser?.name}</strong> ({currentUser?.email})
              </span>
            </span>

            <button
              type="button"
              onClick={() => setIsSwitchUserOpen(true)}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 hover:underline"
            >
              <ArrowRightLeft className="w-3 h-3" />
              <span>Switch Department Role</span>
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => openRaiseModal({ sourceDepartment: currentDept })}
          className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-brand-500 hover:bg-brand-600 shadow-sm transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Raise Ticket from {currentDept}</span>
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
        sourceDeptFilter={sourceDeptFilter}
        onSourceDeptChange={setSourceDeptFilter}
        showTerminalFilter={true}
        showSourceDeptFilter={true}
      />

      {/* Table */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-charcoal-900">
            {currentDept} Action Queue ({assignedTickets.length})
          </h2>
          <span className="text-xs text-charcoal-500">
            Click any row to open ticket details, update status to Checked or Solved, or reply
          </span>
        </div>

        <TicketTable
          tickets={assignedTickets}
          emptyMessage={`No tickets currently assigned to ${currentDept}`}
          emptySubtitle={`When employees from any department raise issues for ${currentDept}, they appear here.`}
          onRaiseTicket={() => openRaiseModal()}
        />
      </div>

      <QuickAccountSwitcher
        isOpen={isSwitchUserOpen}
        onClose={() => setIsSwitchUserOpen(false)}
      />
    </div>
  );
};
