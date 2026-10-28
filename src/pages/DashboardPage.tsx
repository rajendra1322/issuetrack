import React, { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTickets } from '../context/TicketContext';
import { StatisticsCard } from '../components/dashboard/StatisticsCard';
import { TerminalCard } from '../components/dashboard/TerminalCard';
import { TicketTable } from '../components/tickets/TicketTable';
import { Plus, Building2, Activity, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { tickets, openRaiseModal } = useTickets();

  // "only in dashboard not all people see the all total ticket only related departments can able to see their ticket details"
  // Scope dashboard tickets strictly to the current user's department and issues they raised:
  const relatedTickets = useMemo(() => {
    if (!currentUser) return [];
    const userEmail = currentUser.email.toLowerCase();
    const userDept = currentUser.department;

    return tickets.filter((t) => {
      const isAssignedToMyDept = t.assignedDepartment === userDept;
      const isRaisedByMyDept = t.sourceDepartment === userDept;
      const isRaisedByMe = t.raisedByEmail.toLowerCase() === userEmail;

      return isAssignedToMyDept || isRaisedByMyDept || isRaisedByMe;
    });
  }, [tickets, currentUser]);

  // Dynamic statistics calculated strictly from related department tickets
  const departmentStats = useMemo(() => {
    return {
      total: relatedTickets.length,
      pending: relatedTickets.filter((t) => t.status === 'Pending').length,
      checked: relatedTickets.filter((t) => t.status === 'Checked').length,
      solved: relatedTickets.filter((t) => t.status === 'Solved').length,
    };
  }, [relatedTickets]);

  // Recent tickets sorted by newest
  const recentTickets = useMemo(() => {
    return [...relatedTickets]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [relatedTickets]);

  const currentDept = currentUser?.department || 'Operations';

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Section: Action Button + Title & Subtitle */}
      <div>
        {/* Prominent Sky-blue + Raise Ticket Button at top-left of main content area */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => openRaiseModal()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-brand-500 hover:bg-brand-600 shadow-sm transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Raise Ticket</span>
          </button>
        </div>

        {/* Dashboard Heading & Subtitle */}
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
              Welcome to IssueTrack
            </h1>
            <span className="text-xs font-bold bg-brand-50 text-brand-700 px-3 py-1 rounded-full border border-brand-200">
              {currentDept} Department View
            </span>
          </div>
          <p className="mt-1 text-sm text-charcoal-600 font-medium">
            Department dashboard for {currentUser?.name}. Viewing tickets assigned to or raised by {currentDept}.
          </p>
        </div>
      </div>

      {/* Department-Scoped Statistics (No organization-wide total; only related tickets) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-brand-600" />
            <h2 className="text-xs font-bold text-charcoal-700 uppercase tracking-wider">
              {currentDept} Department Overview
            </h2>
          </div>
          <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>Department Data Scoped</span>
          </span>
        </div>
        <StatisticsCard stats={departmentStats} titlePrefix={currentDept} />
      </div>

      {/* Two Large Terminal Cards (Scoped to user's department) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-brand-600" />
            <h2 className="text-sm font-bold text-charcoal-900 uppercase tracking-wider">
              Port Terminals ({currentDept} Department)
            </h2>
          </div>
          <span className="text-xs text-charcoal-500">
            Showing tickets for {currentDept} in each terminal
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TerminalCard
            terminalId="container-terminal"
            department={currentUser?.department}
          />
          <TerminalCard
            terminalId="coal-terminal"
            department={currentUser?.department}
          />
        </div>
      </div>

      {/* Recent Department Activity Feed */}
      <div className="pt-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-charcoal-900">
              {currentDept} Recent Department Tickets
            </h3>
            <p className="text-xs text-charcoal-500">
              Issues assigned to {currentDept} or raised by your department team.
            </p>
          </div>
          <Link
            to="/my-tickets"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 hover:underline"
          >
            <span>View All My Tickets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <TicketTable
          tickets={recentTickets}
          emptyMessage={`No recent tickets found for ${currentDept}`}
          emptySubtitle={`When tickets are assigned to ${currentDept} or raised by you, they will appear here.`}
          onRaiseTicket={() => openRaiseModal()}
        />
      </div>
    </div>
  );
};
