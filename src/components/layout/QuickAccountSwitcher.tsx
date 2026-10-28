import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserAvatar } from '../common/UserAvatar';
import { Check, Users, ArrowRightLeft, X } from 'lucide-react';
import { TerminalId } from '../../types';

interface QuickAccountSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickAccountSwitcher: React.FC<QuickAccountSwitcherProps> = ({ isOpen, onClose }) => {
  const { currentUser, allUsers, quickSwitch } = useAuth();
  const [selectedTerminal, setSelectedTerminal] = useState<TerminalId>('container-terminal');

  if (!isOpen) return null;

  const filteredUsers = allUsers.filter((u) => u.terminalId === selectedTerminal);

  const handleSelectUser = (userId: string) => {
    quickSwitch(userId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-charcoal-200 z-10 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-charcoal-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-brand-50 text-brand-600 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-charcoal-900">Switch Demo Account</h3>
              <p className="text-xs text-charcoal-500">
                Instantly simulate cross-department workflows without re-entering credentials.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-charcoal-400 hover:text-charcoal-600 p-1.5 rounded-lg hover:bg-charcoal-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Terminal Switcher Tabs */}
        <div className="mt-4 flex rounded-xl bg-charcoal-100 p-1">
          <button
            type="button"
            onClick={() => setSelectedTerminal('container-terminal')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              selectedTerminal === 'container-terminal'
                ? 'bg-white text-brand-600 shadow-xs'
                : 'text-charcoal-600 hover:text-charcoal-900'
            }`}
          >
            Container Terminal (8 Depts)
          </button>
          <button
            type="button"
            onClick={() => setSelectedTerminal('coal-terminal')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              selectedTerminal === 'coal-terminal'
                ? 'bg-white text-brand-600 shadow-xs'
                : 'text-charcoal-600 hover:text-charcoal-900'
            }`}
          >
            Coal Terminal (8 Depts)
          </button>
        </div>

        {/* User List Grid */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[360px] overflow-y-auto pr-1">
          {filteredUsers.map((user) => {
            const isCurrent = currentUser?.id === user.id;

            return (
              <button
                key={user.id}
                type="button"
                onClick={() => handleSelectUser(user.id)}
                className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                  isCurrent
                    ? 'border-brand-500 bg-brand-50/50 shadow-xs ring-1 ring-brand-500'
                    : 'border-charcoal-200 hover:border-charcoal-300 hover:bg-charcoal-50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <UserAvatar name={user.name} size="sm" department={user.department} />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-charcoal-900 truncate flex items-center gap-1.5">
                      <span>{user.name}</span>
                      <span className="text-[10px] font-semibold text-brand-700 bg-brand-100 px-1.5 py-0.2 rounded">
                        {user.department}
                      </span>
                    </div>
                    <div className="text-[11px] text-charcoal-500 truncate">{user.email}</div>
                  </div>
                </div>

                {isCurrent ? (
                  <Check className="w-4 h-4 text-brand-600 shrink-0 ml-2" />
                ) : (
                  <ArrowRightLeft className="w-3.5 h-3.5 text-charcoal-400 group-hover:text-charcoal-600 shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-charcoal-100 flex items-center justify-between text-xs text-charcoal-500">
          <span>Active user: <strong className="text-charcoal-800">{currentUser?.name}</strong> ({currentUser?.department})</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-charcoal-100 hover:bg-charcoal-200 text-charcoal-700 font-medium rounded-lg text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
