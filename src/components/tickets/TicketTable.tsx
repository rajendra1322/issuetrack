import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { TicketCard } from './TicketCard';
import { formatDateTime } from '../../utils/dateFormatter';
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  MessageSquare,
  Inbox,
} from 'lucide-react';

interface TicketTableProps {
  tickets: Ticket[];
  emptyMessage?: string;
  emptySubtitle?: string;
  onRaiseTicket?: () => void;
}

export const TicketTable: React.FC<TicketTableProps> = ({
  tickets,
  emptyMessage = 'No tickets found',
  emptySubtitle = 'No tickets match the selected filters or search query.',
  onRaiseTicket,
}) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(tickets.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedTickets = tickets.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (tickets.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-charcoal-200 p-12 text-center shadow-xs">
        <div className="w-14 h-14 bg-charcoal-50 text-charcoal-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Inbox className="w-7 h-7 stroke-[1.5]" />
        </div>
        <h3 className="text-base font-bold text-charcoal-900">{emptyMessage}</h3>
        <p className="mt-1 text-xs text-charcoal-500 max-w-sm mx-auto">{emptySubtitle}</p>
        {onRaiseTicket && (
          <button
            type="button"
            onClick={onRaiseTicket}
            className="mt-4 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            + Raise First Ticket
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile Card List (hidden on desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:hidden">
        {paginatedTickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-2xl border border-charcoal-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-charcoal-50/75 border-b border-charcoal-200 text-charcoal-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 whitespace-nowrap">Ticket ID</th>
                <th className="py-3.5 px-4 min-w-[200px]">Issue Details</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Raised By</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Email</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Source Dept</th>
                <th className="py-3.5 px-4 min-w-[150px]">Location</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Date and Time</th>
                <th className="py-3.5 px-4 whitespace-nowrap text-center">Status</th>
                <th className="py-3.5 px-4 whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-100">
              {paginatedTickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  onClick={() => navigate(`/tickets/${ticket.id}`)}
                  className="hover:bg-brand-50/40 transition-colors cursor-pointer group"
                >
                  {/* Ticket ID */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-brand-600 group-hover:underline">
                        {ticket.id}
                      </span>
                      {ticket.conversation?.length > 0 && (
                        <span
                          className="flex items-center gap-0.5 text-[10px] text-charcoal-400 bg-charcoal-100 px-1 rounded"
                          title={`${ticket.conversation.length} replies`}
                        >
                          <MessageSquare className="w-2.5 h-2.5" />
                          <span>{ticket.conversation.length}</span>
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Issue Details */}
                  <td className="py-3.5 px-4">
                    <p className="font-medium text-charcoal-900 line-clamp-2 max-w-xs leading-relaxed">
                      {ticket.issueDetails}
                    </p>
                  </td>

                  {/* Raised By */}
                  <td className="py-3.5 px-4 whitespace-nowrap font-semibold text-charcoal-800">
                    {ticket.raisedBy}
                  </td>

                  {/* Email */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-charcoal-500 font-mono text-[11px]">
                    {ticket.raisedByEmail}
                  </td>

                  {/* Source Department */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-charcoal-100 text-charcoal-700">
                      {ticket.sourceDepartment}
                    </span>
                  </td>

                  {/* Location */}
                  <td className="py-3.5 px-4 text-charcoal-600 max-w-[180px] truncate">
                    {ticket.location}
                  </td>

                  {/* Date and Time */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-charcoal-500 text-[11px]">
                    {formatDateTime(ticket.createdAt)}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-center">
                    <StatusBadge status={ticket.status} size="sm" />
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/tickets/${ticket.id}`);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-brand-600 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="bg-white p-3 sm:p-4 rounded-xl border border-charcoal-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-charcoal-600">
        <div className="flex items-center gap-2">
          <span>
            Showing <strong className="text-charcoal-900">{startIndex + 1}</strong> to{' '}
            <strong className="text-charcoal-900">
              {Math.min(startIndex + pageSize, tickets.length)}
            </strong>{' '}
            of <strong className="text-charcoal-900">{tickets.length}</strong> records
          </span>

          <div className="hidden sm:flex items-center gap-1.5 ml-4 border-l border-charcoal-200 pl-4">
            <span className="text-[11px] text-charcoal-500">Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-charcoal-50 border border-charcoal-200 rounded px-1.5 py-0.5 text-xs font-semibold focus:outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-charcoal-200 hover:bg-charcoal-50 disabled:opacity-40 disabled:hover:bg-transparent"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 font-semibold text-charcoal-800">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-charcoal-200 hover:bg-charcoal-50 disabled:opacity-40 disabled:hover:bg-transparent"
              aria-label="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
