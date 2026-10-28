import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTickets } from '../../context/TicketContext';
import {
  LayoutDashboard,
  Ticket,
  Inbox,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenResetModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentUser } = useAuth();
  const { tickets } = useTickets();

  // Count tickets raised by user
  const myTicketsCount = currentUser
    ? tickets.filter(
        (t) => t.raisedByEmail.toLowerCase() === currentUser.email.toLowerCase()
      ).length
    : 0;

  // Count tickets assigned to user's department
  const assignedTicketsCount = currentUser
    ? tickets.filter(
        (t) =>
          t.assignedDepartment === currentUser.department &&
          t.status !== 'Solved'
      ).length
    : 0;

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
      isActive
        ? 'bg-brand-500 text-white shadow-xs'
        : 'text-charcoal-600 hover:text-charcoal-900 hover:bg-charcoal-100'
    }`;

  const iconClass = (isActive: boolean) =>
    `w-4 h-4 mr-3 shrink-0 ${isActive ? 'text-white' : 'text-charcoal-500'}`;

  const renderContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-border w-64 select-none">
      {/* Main Navigation (Clean, essential items only) */}
      <div className="flex-1 overflow-y-auto px-3 py-5 space-y-4">
        <div>
          <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-charcoal-400">
            Navigation
          </span>
          <div className="mt-2 space-y-1">
            <NavLink
              to="/"
              end
              onClick={onClose}
              className={navItemClass}
            >
              {({ isActive }) => (
                <div className="flex items-center w-full justify-between">
                  <div className="flex items-center">
                    <LayoutDashboard className={iconClass(isActive)} />
                    <span>Dashboard</span>
                  </div>
                </div>
              )}
            </NavLink>

            <NavLink
              to="/my-tickets"
              onClick={onClose}
              className={navItemClass}
            >
              {({ isActive }) => (
                <div className="flex items-center w-full justify-between">
                  <div className="flex items-center">
                    <Ticket className={iconClass(isActive)} />
                    <span>My Tickets</span>
                  </div>
                  {myTicketsCount > 0 && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-brand-100 text-brand-700'
                      }`}
                    >
                      {myTicketsCount}
                    </span>
                  )}
                </div>
              )}
            </NavLink>

            <NavLink
              to="/assigned-tickets"
              onClick={onClose}
              className={navItemClass}
            >
              {({ isActive }) => (
                <div className="flex items-center w-full justify-between">
                  <div className="flex items-center">
                    <Inbox className={iconClass(isActive)} />
                    <span>Assigned Tickets</span>
                  </div>
                  {assignedTicketsCount > 0 && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {assignedTicketsCount}
                    </span>
                  )}
                </div>
              )}
            </NavLink>
          </div>
        </div>
      </div>

      {/* Footer User Department Badge */}
      {currentUser && (
        <div className="p-3 border-t border-charcoal-100 bg-charcoal-50/70 flex items-center justify-between">
          <div className="min-w-0 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Active" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-charcoal-900 truncate">{currentUser.name}</p>
              <p className="text-[10px] text-charcoal-500 truncate">{currentUser.department} Department</p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-medium text-brand-700 bg-brand-100/80 px-1.5 py-0.5 rounded">
            {currentUser.terminalId === 'container-terminal' ? 'CT' : 'CLT'}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block shrink-0 sticky top-16 h-[calc(100vh-4rem)]">
        {renderContent()}
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-charcoal-900/60 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl z-10 flex flex-col animate-fade-in">
            <div className="h-16 px-4 border-b border-charcoal-100 flex items-center justify-between">
              <span className="font-bold text-sm text-charcoal-900">Navigation</span>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal-600 hover:bg-charcoal-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">{renderContent()}</div>
          </div>
        </div>
      )}
    </>
  );
};
