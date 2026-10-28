import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { TerminalId, TERMINALS, DEPARTMENTS } from '../types';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { DepartmentCard } from '../components/dashboard/DepartmentCard';
import { StatisticsCard } from '../components/dashboard/StatisticsCard';
import { useTickets } from '../context/TicketContext';
import { Container, Flame, Plus, ShieldCheck } from 'lucide-react';

export const TerminalDepartmentsPage: React.FC = () => {
  const { terminalId } = useParams<{ terminalId: string }>();
  const { getTerminalStats, openRaiseModal } = useTickets();

  if (
    !terminalId ||
    (terminalId !== 'container-terminal' && terminalId !== 'coal-terminal')
  ) {
    return <Navigate to="/" replace />;
  }

  const validTerminalId = terminalId as TerminalId;
  const terminalInfo = TERMINALS[validTerminalId];
  const stats = getTerminalStats(validTerminalId);
  const isContainer = validTerminalId === 'container-terminal';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: terminalInfo.name, href: `/terminals/${validTerminalId}` },
          { label: 'Departments' },
        ]}
      />

      {/* Terminal Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div
            className={`p-4 rounded-2xl shrink-0 ${
              isContainer
                ? 'bg-sky-50 text-brand-600 border border-sky-100'
                : 'bg-amber-50 text-amber-700 border border-amber-100'
            }`}
          >
            {isContainer ? (
              <Container className="w-8 h-8 stroke-[1.8]" />
            ) : (
              <Flame className="w-8 h-8 stroke-[1.8]" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-black text-charcoal-900 tracking-tight">
                {terminalInfo.name} &bull; Departments
              </h1>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-charcoal-100 text-charcoal-700">
                {terminalInfo.code}
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-charcoal-600 max-w-xl">
              {terminalInfo.description}
            </p>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Terminal Data Isolation Active &bull; Issues confined strictly to {terminalInfo.name}</span>
            </div>
          </div>
        </div>

        {/* Raise Ticket in this terminal */}
        <button
          type="button"
          onClick={() => openRaiseModal({ terminalId: validTerminalId })}
          className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-brand-500 hover:bg-brand-600 shadow-sm transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Raise Ticket in {terminalInfo.code}</span>
        </button>
      </div>

      {/* Terminal Statistics */}
      <div>
        <h2 className="text-xs font-bold text-charcoal-600 uppercase tracking-wider mb-2.5">
          {terminalInfo.code} Terminal Ticket Statistics
        </h2>
        <StatisticsCard stats={stats} titlePrefix={terminalInfo.code} />
      </div>

      {/* 8 Department Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-charcoal-900">Department Dashboards</h3>
            <p className="text-xs text-charcoal-500">
              Select a receiving department to view and manage its assigned queue for {terminalInfo.name}.
            </p>
          </div>
          <span className="text-xs font-semibold text-charcoal-500">8 Departments</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DEPARTMENTS.map((dept) => (
            <DepartmentCard
              key={dept}
              terminalId={validTerminalId}
              department={dept}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
