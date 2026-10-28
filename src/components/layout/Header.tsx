import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useTickets } from '../../context/TicketContext';
import { Logo } from '../common/Logo';
import { UserAvatar } from '../common/UserAvatar';
import { NotificationPanel } from './NotificationPanel';
import { QuickAccountSwitcher } from './QuickAccountSwitcher';
import { ConfirmationModal } from '../common/ConfirmationModal';
import {
  Bell,
  ChevronDown,
  User as UserIcon,
  LogOut,
  RotateCcw,
  Menu,
  Plus,
  ArrowRightLeft,
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { currentUser, signOut } = useAuth();
  const { unreadCount } = useNotifications();
  const { openRaiseModal, resetDemoData } = useTickets();
  const navigate = useNavigate();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSwitchUserOpen, setIsSwitchUserOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  const handleLogout = () => {
    signOut();
    navigate('/signin');
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-border shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left Side: Mobile Menu + JSW Logo */}
          <div className="flex items-center gap-3">
            {onToggleSidebar && (
              <button
                type="button"
                onClick={onToggleSidebar}
                className="lg:hidden p-2 rounded-lg text-charcoal-600 hover:text-charcoal-900 hover:bg-charcoal-100 transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <Link to="/" className="flex items-center">
              <Logo size="lg" />
            </Link>
          </div>

          {/* Right Side: Quick Switch + Raise Action + Notifications + User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Switch Demo User Pill (Great for evaluation) */}
            <button
              type="button"
              onClick={() => setIsSwitchUserOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 transition-colors"
              title="Click to switch simulated demo account"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-brand-600" />
              <span>Switch User</span>
              <span className="bg-brand-200 text-brand-800 text-[10px] px-1.5 py-0.2 rounded font-mono">
                {currentUser?.department}
              </span>
            </button>

            {/* Quick Raise Ticket in Header for quick access */}
            <button
              type="button"
              onClick={() => openRaiseModal()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-500 hover:bg-brand-600 text-white shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Raise Ticket</span>
            </button>

            {/* Notification Bell with Badge */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className={`relative p-2 rounded-xl text-charcoal-600 hover:text-charcoal-900 hover:bg-charcoal-100 transition-colors ${isNotifOpen ? 'bg-charcoal-100 text-charcoal-900' : ''
                  }`}
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-brand-500 text-white text-[10px] font-bold leading-none ring-2 ring-white animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              <NotificationPanel
                isOpen={isNotifOpen}
                onClose={() => setIsNotifOpen(false)}
              />
            </div>

            {/* User Profile Avatar & Dropdown */}
            {currentUser && (
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1 pl-1.5 rounded-xl hover:bg-charcoal-100 transition-colors border border-transparent hover:border-charcoal-200 text-left"
                >
                  <UserAvatar
                    name={currentUser.name}
                    size="sm"
                    department={currentUser.department}
                  />

                  <div className="hidden lg:flex flex-col">
                    <span className="text-xs font-bold text-charcoal-900 leading-tight truncate max-w-[120px]">
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] font-medium text-charcoal-500 leading-tight">
                      {currentUser.department} &bull; {currentUser.terminalId === 'container-terminal' ? 'CT' : 'Coal'}
                    </span>
                  </div>

                  <ChevronDown
                    className={`w-3.5 h-3.5 text-charcoal-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''
                      }`}
                  />
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-charcoal-200 py-1.5 z-50 animate-fade-in">
                    {/* User summary */}
                    <div className="px-4 py-3 border-b border-charcoal-100 bg-charcoal-50/50">
                      <p className="text-xs font-bold text-charcoal-900">{currentUser.name}</p>
                      <p className="text-[11px] text-charcoal-500 truncate">{currentUser.email}</p>
                      <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-semibold bg-brand-50 text-brand-700 px-2 py-0.5 rounded border border-brand-200">
                          {currentUser.department}
                        </span>
                        <span className="text-[10px] font-medium bg-charcoal-100 text-charcoal-700 px-2 py-0.5 rounded">
                          {currentUser.terminalName}
                        </span>
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-charcoal-700 hover:bg-charcoal-50 hover:text-charcoal-900 transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-charcoal-400" />
                        <span>My Profile</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileOpen(false);
                          setIsSwitchUserOpen(true);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-charcoal-700 hover:bg-charcoal-50 hover:text-charcoal-900 transition-colors"
                      >
                        <ArrowRightLeft className="w-4 h-4 text-charcoal-400" />
                        <span>Switch Demo Account</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileOpen(false);
                          setIsResetConfirmOpen(true);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-amber-700 hover:bg-amber-50 transition-colors"
                      >
                        <RotateCcw className="w-4 h-4 text-amber-500" />
                        <span>Reset Demo Data</span>
                      </button>
                    </div>

                    <div className="border-t border-charcoal-100 pt-1 mt-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Switch User Modal */}
      <QuickAccountSwitcher
        isOpen={isSwitchUserOpen}
        onClose={() => setIsSwitchUserOpen(false)}
      />

      {/* Reset Demo Data Modal */}
      <ConfirmationModal
        isOpen={isResetConfirmOpen}
        title="Restore Initial Demo Data?"
        message="This will reset all tickets, status updates, conversation replies, and notifications back to the default seed dataset. Any tickets created during this session will be replaced."
        confirmLabel="Reset All Data"
        cancelLabel="Keep Current Data"
        isDestructive={true}
        onConfirm={() => resetDemoData()}
        onCancel={() => setIsResetConfirmOpen(false)}
      />
    </>
  );
};
