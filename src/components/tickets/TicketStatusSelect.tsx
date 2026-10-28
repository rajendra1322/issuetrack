import React, { useState } from 'react';
import { Ticket, TicketStatus } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useTickets } from '../../context/TicketContext';
import { RefreshCw, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

interface TicketStatusSelectProps {
  ticket: Ticket;
}

export const TicketStatusSelect: React.FC<TicketStatusSelectProps> = ({ ticket }) => {
  const { currentUser } = useAuth();
  const { updateTicketStatus } = useTickets();

  const [selectedStatus, setSelectedStatus] = useState<TicketStatus>(ticket.status);
  const [note, setNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const isAssignedDeptStaff = currentUser?.department === ticket.assignedDepartment;

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStatus === ticket.status) return;

    setIsUpdating(true);
    const success = updateTicketStatus(ticket.id, selectedStatus, note);
    if (success) {
      setNote('');
    }
    setIsUpdating(false);
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-charcoal-200 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-charcoal-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
            <RefreshCw className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-charcoal-900">Ticket Status Workflow</h3>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          {isAssignedDeptStaff ? (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Receiving Dept Staff</span>
            </span>
          ) : (
            <span
              className="flex items-center gap-1 text-[11px] font-medium text-charcoal-500 bg-charcoal-100 px-2 py-0.5 rounded-full"
              title="In demo mode, you can still simulate status updates"
            >
              <AlertCircle className="w-3 h-3 text-charcoal-400" />
              <span>Simulated Action Mode</span>
            </span>
          )}
        </div>
      </div>

      <form onSubmit={handleUpdate} className="mt-4 space-y-3">
        <div>
          <label className="block text-xs font-semibold text-charcoal-700 mb-1.5">
            Update Workflow State
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['Pending', 'Checked', 'Solved'] as TicketStatus[]).map((st) => {
              const isCurrent = ticket.status === st;
              const isSelected = selectedStatus === st;

              const styleMap = {
                Pending: 'hover:border-amber-400 peer-checked:border-amber-500 peer-checked:bg-amber-50 peer-checked:text-amber-800',
                Checked: 'hover:border-sky-400 peer-checked:border-brand-500 peer-checked:bg-sky-50 peer-checked:text-brand-800',
                Solved: 'hover:border-emerald-400 peer-checked:border-emerald-500 peer-checked:bg-emerald-50 peer-checked:text-emerald-800',
              };

              return (
                <label
                  key={st}
                  className={`relative flex items-center justify-center p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                    isSelected
                      ? st === 'Pending'
                        ? 'border-amber-500 bg-amber-50 text-amber-800 ring-1 ring-amber-500'
                        : st === 'Checked'
                        ? 'border-brand-500 bg-sky-50 text-brand-800 ring-1 ring-brand-500'
                        : 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500'
                      : 'border-charcoal-200 bg-white text-charcoal-700 hover:bg-charcoal-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="ticketStatus"
                    value={st}
                    checked={selectedStatus === st}
                    onChange={() => setSelectedStatus(st)}
                    className="sr-only"
                  />
                  <span className="flex items-center gap-1.5">
                    {st}
                    {isCurrent && (
                      <span className="text-[10px] font-normal text-charcoal-400">(current)</span>
                    )}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-charcoal-700 mb-1">
            Status Change Reason / Note (Optional)
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Technician dispatched, inspection in progress, issue verified resolved..."
            className="w-full text-xs font-medium bg-charcoal-50 border border-charcoal-300 rounded-lg px-3 py-2 text-charcoal-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="pt-2 flex items-center justify-between">
          <p className="text-[11px] text-charcoal-500">
            Action will be recorded in the status audit timeline and notify the raiser.
          </p>

          <button
            type="submit"
            disabled={isUpdating || selectedStatus === ticket.status}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-lg shadow-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Apply Status</span>
          </button>
        </div>
      </form>
    </div>
  );
};
