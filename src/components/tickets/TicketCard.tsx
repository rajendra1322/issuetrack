import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { formatDateTime } from '../../utils/dateFormatter';
import { User, MapPin, ArrowRight, MessageSquare } from 'lucide-react';

interface TicketCardProps {
  ticket: Ticket;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/tickets/${ticket.id}`)}
      className="bg-white rounded-2xl p-4 border border-charcoal-200 shadow-xs hover:shadow-md hover:border-brand-300 transition-all cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Header: ID, Terminal badge, Status badge */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
              {ticket.id}
            </span>
            <span className="text-[10px] text-charcoal-500 font-medium">
              {ticket.terminalId === 'container-terminal' ? 'CT' : 'CLT'}
            </span>
          </div>
          <StatusBadge status={ticket.status} size="sm" />
        </div>

        {/* Issue details snippet */}
        <p className="text-xs font-semibold text-charcoal-900 line-clamp-2 leading-relaxed">
          {ticket.issueDetails}
        </p>

        {/* Routing info */}
        <div className="mt-3 py-2 px-2.5 bg-charcoal-50 rounded-xl text-[11px] flex items-center justify-between text-charcoal-600">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-charcoal-800">{ticket.sourceDepartment}</span>
            <span className="text-charcoal-400">→</span>
            <span className="font-bold text-brand-700">{ticket.assignedDepartment}</span>
          </div>
          {ticket.conversation?.length > 0 && (
            <div className="flex items-center gap-1 text-charcoal-500">
              <MessageSquare className="w-3 h-3 text-brand-500" />
              <span>{ticket.conversation.length}</span>
            </div>
          )}
        </div>

        {/* Location & Creator */}
        <div className="mt-3 space-y-1 text-[11px] text-charcoal-500">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-charcoal-400 shrink-0" />
            <span className="truncate">{ticket.location}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <User className="w-3.5 h-3.5 text-charcoal-400 shrink-0" />
            <span className="font-medium text-charcoal-700 truncate">{ticket.raisedBy}</span>
            <span className="text-charcoal-400">({ticket.raisedByEmail})</span>
          </div>
        </div>
      </div>

      {/* Footer date & arrow */}
      <div className="mt-4 pt-2.5 border-t border-charcoal-100 flex items-center justify-between text-[11px] text-charcoal-400">
        <span>{formatDateTime(ticket.createdAt)}</span>
        <div className="flex items-center gap-1 text-xs font-bold text-brand-600">
          <span>Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
