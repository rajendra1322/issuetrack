import React, { useState, useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { TerminalId, Department, TERMINALS, DEPARTMENTS } from '../types';
import { useTickets } from '../context/TicketContext';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { StatisticsCard } from '../components/dashboard/StatisticsCard';
import { TicketFilters } from '../components/tickets/TicketFilters';
import { TicketTable } from '../components/tickets/TicketTable';
import { Plus, ShieldCheck, ArrowRightLeft } from 'lucide-react';

export const DepartmentTicketsPage: React.FC = () => {
  const { terminalId, dept } = useParams<{ terminalId: string; dept: string }>();
  const { tickets, getDepartmentStats, openRaiseModal } = useTickets();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sourceDeptFilter, setSourceDeptFilter] = useState('ALL');

  if (
    !terminalId ||
    !dept ||
    (terminalId !== 'container-terminal' && terminalId !== 'coal-terminal') ||
    !DEPARTMENTS.includes(dept as Department)
  ) {
    return <Navigate to="/" replace />;
  }

  const validTerminalId = terminalId as TerminalId;
  const validDepartment = dept as Department;
  const terminalInfo = TERMINALS[validTerminalId];

  // Isolated department statistics for this specific terminal
  const stats = getDepartmentStats(validTerminalId, validDepartment);

  // Filter tickets: STRICT ISOLATION BY TERMINAL AND ASSIGNED DEPARTMENT
  const departmentTickets = useMemo(() => {
    return tickets.filter((t) => {
      // Must match terminal and receiving department
      if (t.terminalId !== validTerminalId) return false;
      if (t.assignedDepartment !== validDepartment) return false;

      // Filter by status
      if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;

      // Filter by source department
      if (sourceDeptFilter !== 'ALL' && t.sourceDepartment !== sourceDeptFilter) return false;

      // Filter by search term
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchId = t.id.toLowerCase().includes(query);
        const matchRaiser = t.raisedBy.toLowerCase().includes(query);
        const matchEmail = t.raisedByEmail.toLowerCase().includes(query);
        const matchLocation = t.location.toLowerCase().includes(query);
        const matchDetails = t.issueDetails.toLowerCase().includes(query);
        if (!matchId && !matchRaiser && !matchEmail && !matchLocation && !matchDetails) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [tickets, validTerminalId, validDepartment, statusFilter, sourceDeptFilter, searchTerm]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumbs: Dashboard > Container Terminal > Departments > IT */}
      <Breadcrumb
        items={[
          { label: terminalInfo.name, href: `/terminals/${validTerminalId}` },
          { label: 'Departments', href: `/terminals/${validTerminalId}` },
          { label: `${validDepartment} Queue` },
        ]}
      />

      {/* Department Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-black text-charcoal-900 tracking-tight">
              {validDepartment} Department Assigned Queue
            </h1>
            <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
              {terminalInfo.name}
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-charcoal-600">
            Issues routed from various port departments to {validDepartment} for resolution.
          </p>
          <div className="mt-2 flex items-center gap-2 text-xs text-charcoal-500 font-medium">
            <span className="flex items-center gap-1 text-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Isolated queue for {terminalInfo.name}</span>
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1 text-brand-700">
              <ArrowRightLeft className="w-3.5 h-3.5 text-brand-600" />
              <span>Receiving requests from all 8 departments</span>
            </span>
          </div>
        </div>

        {/* Raise Ticket CTA */}
        <button
          type="button"
          onClick={() =>
            openRaiseModal({
              terminalId: validTerminalId,
              assignedDepartment: validDepartment,
            })
          }
          className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-brand-500 hover:bg-brand-600 shadow-sm transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Raise Ticket for {validDepartment}</span>
        </button>
      </div>

      {/* Queue Statistics */}
      <div>
        <h2 className="text-xs font-bold text-charcoal-600 uppercase tracking-wider mb-2.5">
          {validDepartment} Queue Metrics ({terminalInfo.code})
        </h2>
        <StatisticsCard stats={stats} titlePrefix={validDepartment} />
      </div>

      {/* Filters */}
      <TicketFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        sourceDeptFilter={sourceDeptFilter}
        onSourceDeptChange={setSourceDeptFilter}
        showSourceDeptFilter={true}
        showTerminalFilter={false}
      />

      {/* Ticket Table */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-charcoal-900">
            Assigned Tickets ({departmentTickets.length})
          </h3>
          <span className="text-xs text-charcoal-500">
            Click any row to view full issue details, post remarks, or update status
          </span>
        </div>

        <TicketTable
          tickets={departmentTickets}
          emptyMessage={`No tickets currently assigned to ${validDepartment} in ${terminalInfo.name}`}
          emptySubtitle={`When tickets are raised with Assist To: ${validDepartment}, they will appear here.`}
          onRaiseTicket={() =>
            openRaiseModal({
              terminalId: validTerminalId,
              assignedDepartment: validDepartment,
            })
          }
        />
      </div>
    </div>
  );
};
