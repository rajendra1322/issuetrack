import React from 'react';
import { StatusHistoryEntry } from '../../types';
import { formatDateTime } from '../../utils/dateFormatter';
import { History, CheckCircle2, ArrowRight } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

interface TicketHistoryTimelineProps {
  history: StatusHistoryEntry[];
  createdAt: string;
  raisedBy: string;
  sourceDepartment: string;
}

export const TicketHistoryTimeline: React.FC<TicketHistoryTimelineProps> = ({
  history = [],
  createdAt,
  raisedBy,
  sourceDepartment,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-charcoal-200 shadow-xs">
      <div className="flex items-center gap-2 pb-3 border-b border-charcoal-100 mb-4">
        <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
          <History className="w-4 h-4" />
        </div>
        <h3 className="text-sm font-bold text-charcoal-900">Status Audit History</h3>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-charcoal-200">
        {/* Initial creation entry */}
        <div className="relative">
          <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center text-white shadow-xs">
            <div className="w-1.5 h-1.5 rounded-full bg-white" />
          </div>

          <div>
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-xs font-bold text-charcoal-900">
                Ticket Created as Pending
              </span>
              <span className="text-[10px] text-charcoal-400">
                {formatDateTime(createdAt)}
              </span>
            </div>

            <p className="text-xs text-charcoal-500 mt-0.5">
              Raised by <strong className="text-charcoal-700">{raisedBy}</strong> ({sourceDepartment} Department)
            </p>
          </div>
        </div>

        {/* Subsequent status history entries */}
        {history.map((entry) => (
          <div key={entry.id} className="relative">
            <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-brand-500 border-2 border-white flex items-center justify-center text-white shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>

            <div>
              <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-charcoal-900">
                  <StatusBadge status={entry.fromStatus} size="sm" />
                  <ArrowRight className="w-3 h-3 text-charcoal-400" />
                  <StatusBadge status={entry.toStatus} size="sm" />
                </div>
                <span className="text-[10px] text-charcoal-400">
                  {formatDateTime(entry.timestamp)}
                </span>
              </div>

              <p className="text-xs text-charcoal-600">
                Updated by <strong className="text-charcoal-800">{entry.updatedBy}</strong> ({entry.department} Dept)
              </p>

              {entry.note && (
                <p className="mt-1 text-xs text-charcoal-500 italic bg-charcoal-50 p-2 rounded-lg border border-charcoal-100">
                  &ldquo;{entry.note}&rdquo;
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
