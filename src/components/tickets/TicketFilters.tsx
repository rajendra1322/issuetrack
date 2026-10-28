import React from 'react';
import { Department, DEPARTMENTS, TicketStatus, TerminalId, TERMINALS } from '../../types';
import { Search, Filter, X } from 'lucide-react';

interface TicketFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  sourceDeptFilter?: string;
  onSourceDeptChange?: (dept: string) => void;
  terminalFilter?: string;
  onTerminalChange?: (terminal: string) => void;
  showTerminalFilter?: boolean;
  showSourceDeptFilter?: boolean;
}

export const TicketFilters: React.FC<TicketFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sourceDeptFilter = 'ALL',
  onSourceDeptChange,
  terminalFilter = 'ALL',
  onTerminalChange,
  showTerminalFilter = false,
  showSourceDeptFilter = true,
}) => {
  const hasActiveFilters =
    searchTerm.trim() !== '' ||
    statusFilter !== 'ALL' ||
    (showSourceDeptFilter && sourceDeptFilter !== 'ALL') ||
    (showTerminalFilter && terminalFilter !== 'ALL');

  const handleClear = () => {
    onSearchChange('');
    onStatusChange('ALL');
    if (onSourceDeptChange) onSourceDeptChange('ALL');
    if (onTerminalChange) onTerminalChange('ALL');
  };

  return (
    <div className="bg-white p-4 rounded-2xl border border-charcoal-200 shadow-xs mb-6">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by Ticket ID, Employee name, Location, or Issue details..."
            className="w-full pl-10 pr-4 py-2 text-xs font-medium bg-charcoal-50 border border-charcoal-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-charcoal-900 transition-all placeholder:text-charcoal-400"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-charcoal-50 px-2.5 py-1.5 rounded-xl border border-charcoal-200">
            <span className="text-[11px] font-semibold text-charcoal-500">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
              className="text-xs font-bold text-charcoal-800 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Checked">Checked</option>
              <option value="Solved">Solved</option>
            </select>
          </div>

          {/* Source Department Filter */}
          {showSourceDeptFilter && onSourceDeptChange && (
            <div className="flex items-center gap-1.5 bg-charcoal-50 px-2.5 py-1.5 rounded-xl border border-charcoal-200">
              <span className="text-[11px] font-semibold text-charcoal-500">From Dept:</span>
              <select
                value={sourceDeptFilter}
                onChange={(e) => onSourceDeptChange(e.target.value)}
                className="text-xs font-bold text-charcoal-800 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Departments</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Terminal Filter (when viewing cross-terminal lists) */}
          {showTerminalFilter && onTerminalChange && (
            <div className="flex items-center gap-1.5 bg-charcoal-50 px-2.5 py-1.5 rounded-xl border border-charcoal-200">
              <span className="text-[11px] font-semibold text-charcoal-500">Terminal:</span>
              <select
                value={terminalFilter}
                onChange={(e) => onTerminalChange(e.target.value)}
                className="text-xs font-bold text-charcoal-800 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Terminals</option>
                <option value="container-terminal">Container Terminal</option>
                <option value="coal-terminal">Coal Terminal</option>
              </select>
            </div>
          )}

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={handleClear}
              className="px-2.5 py-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 hover:bg-brand-50 rounded-xl transition-colors flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
