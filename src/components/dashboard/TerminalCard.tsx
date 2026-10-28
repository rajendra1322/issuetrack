import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TerminalId, Department, TERMINALS } from '../../types';
import { useTickets } from '../../context/TicketContext';
import { Container, Flame, ArrowRight, Layers, Clock, CheckCircle2 } from 'lucide-react';

interface TerminalCardProps {
  terminalId: TerminalId;
  department?: Department;
}

export const TerminalCard: React.FC<TerminalCardProps> = ({ terminalId, department }) => {
  const navigate = useNavigate();
  const { getTerminalStats, getDepartmentStats } = useTickets();
  const terminalInfo = TERMINALS[terminalId];
  
  // If department is provided, show stats specific to the user's department for this terminal
  const stats = department
    ? getDepartmentStats(terminalId, department)
    : getTerminalStats(terminalId);

  const isContainer = terminalId === 'container-terminal';

  const handleClick = () => {
    if (department) {
      navigate(`/terminals/${terminalId}/departments/${encodeURIComponent(department)}`);
    } else {
      navigate(`/terminals/${terminalId}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group relative bg-white rounded-3xl p-6 sm:p-8 border border-border shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between hover:border-brand-400 active:scale-[0.995]"
    >
      {/* Decorative top accent */}
      <div
        className={`absolute top-0 left-0 right-0 h-1.5 transition-colors ${
          isContainer
            ? 'bg-gradient-to-r from-brand-500 to-sky-400 group-hover:h-2'
            : 'bg-gradient-to-r from-charcoal-800 to-amber-600 group-hover:h-2'
        }`}
      />

      <div>
        {/* Terminal Header with Icon and Code */}
        <div className="flex items-start justify-between gap-4">
          <div
            className={`p-4 rounded-2xl shadow-sm transition-transform group-hover:scale-105 ${
              isContainer
                ? 'bg-sky-50 text-brand-600 border border-sky-100'
                : 'bg-amber-50 text-amber-700 border border-amber-100'
            }`}
          >
            {isContainer ? (
              <Container className="w-8 h-8 stroke-[1.75]" />
            ) : (
              <Flame className="w-8 h-8 stroke-[1.75]" />
            )}
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {department && (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                {department} Dept
              </span>
            )}
            <span
              className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${
                isContainer
                  ? 'bg-sky-50 text-brand-700 border-sky-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
            >
              {terminalInfo.code}
            </span>
          </div>
        </div>

        {/* Title and Description */}
        <div className="mt-5">
          <h3 className="text-xl sm:text-2xl font-extrabold text-charcoal-900 group-hover:text-brand-600 transition-colors">
            {terminalInfo.name}
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-charcoal-600 leading-relaxed font-normal">
            {terminalInfo.description}
          </p>
          <p className="mt-1 text-[11px] text-charcoal-500 font-medium italic">
            {terminalInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Ticket Stat Badges & Action */}
      <div className="mt-8 pt-5 border-t border-charcoal-100">
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-charcoal-50 p-2.5 rounded-xl text-center">
            <div className="flex items-center justify-center gap-1 text-[10px] text-charcoal-500 font-semibold uppercase">
              <Layers className="w-3 h-3" />
              <span>{department ? `${department}` : 'Total'}</span>
            </div>
            <div className="text-base font-bold text-charcoal-900 mt-0.5">{stats.total}</div>
          </div>

          <div className="bg-amber-50/70 p-2.5 rounded-xl text-center border border-amber-100">
            <div className="flex items-center justify-center gap-1 text-[10px] text-amber-700 font-semibold uppercase">
              <Clock className="w-3 h-3" />
              <span>Pending</span>
            </div>
            <div className="text-base font-bold text-amber-800 mt-0.5">{stats.pending}</div>
          </div>

          <div className="bg-emerald-50/70 p-2.5 rounded-xl text-center border border-emerald-100">
            <div className="flex items-center justify-center gap-1 text-[10px] text-emerald-700 font-semibold uppercase">
              <CheckCircle2 className="w-3 h-3" />
              <span>Solved</span>
            </div>
            <div className="text-base font-bold text-emerald-800 mt-0.5">{stats.solved}</div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs font-bold text-brand-600 group-hover:text-brand-700">
          <span>
            {department
              ? `Open ${terminalInfo.code} ${department} Queue`
              : 'Open Department Dashboard'}
          </span>
          <div className="w-8 h-8 rounded-full bg-brand-50 group-hover:bg-brand-500 group-hover:text-white flex items-center justify-center transition-all">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
