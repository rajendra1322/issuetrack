import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserAvatar } from '../common/UserAvatar';
import { ArrowRight, Sparkles, Terminal } from 'lucide-react';
import { TerminalId } from '../../types';

interface QuickDemoAccountsProps {
  onSelectAccount?: (email: string) => void;
  onInstantLogin?: (userId: string) => void;
}

export const QuickDemoAccounts: React.FC<QuickDemoAccountsProps> = ({
  onSelectAccount,
  onInstantLogin,
}) => {
  const { allUsers, quickSwitch } = useAuth();
  const [selectedTerminal, setSelectedTerminal] = useState<TerminalId>('container-terminal');

  const filteredUsers = allUsers.filter((u) => u.terminalId === selectedTerminal);

  const handleClick = (userId: string, email: string) => {
    if (onInstantLogin) {
      onInstantLogin(userId);
    } else if (onSelectAccount) {
      onSelectAccount(email);
    } else {
      quickSwitch(userId);
    }
  };

  return (
    <div className="bg-charcoal-50/80 rounded-2xl p-5 border border-charcoal-200 mt-6">
      <div className="flex items-center justify-between pb-3 border-b border-charcoal-200">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-charcoal-900 uppercase tracking-wider">
              Quick Test Accounts (1-Click Demo Login)
            </h4>
            <p className="text-[11px] text-charcoal-500">
              Select any department role to test cross-department workflows instantly.
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-block text-[10px] font-mono font-medium text-brand-700 bg-brand-100 px-2 py-0.5 rounded">
          Password: password123
        </span>
      </div>

      {/* Terminal Filter Tabs */}
      <div className="mt-3 flex rounded-xl bg-charcoal-200/70 p-1">
        <button
          type="button"
          onClick={() => setSelectedTerminal('container-terminal')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
            selectedTerminal === 'container-terminal'
              ? 'bg-white text-brand-700 shadow-xs'
              : 'text-charcoal-600 hover:text-charcoal-900'
          }`}
        >
          Container Terminal (8 Depts)
        </button>
        <button
          type="button"
          onClick={() => setSelectedTerminal('coal-terminal')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
            selectedTerminal === 'coal-terminal'
              ? 'bg-white text-brand-700 shadow-xs'
              : 'text-charcoal-600 hover:text-charcoal-900'
          }`}
        >
          Coal Terminal (8 Depts)
        </button>
      </div>

      {/* Account Buttons Grid */}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
        {filteredUsers.map((user) => (
          <button
            key={user.id}
            type="button"
            onClick={() => handleClick(user.id, user.email)}
            className="group flex items-center justify-between p-2.5 rounded-xl border border-charcoal-200 bg-white hover:border-brand-400 hover:bg-brand-50/40 text-left transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <UserAvatar name={user.name} size="xs" department={user.department} />
              <div className="min-w-0">
                <div className="text-xs font-bold text-charcoal-900 truncate flex items-center gap-1.5">
                  <span className="truncate">{user.name}</span>
                  <span className="text-[10px] font-semibold bg-brand-100 text-brand-800 px-1 rounded">
                    {user.department}
                  </span>
                </div>
                <div className="text-[10px] text-charcoal-500 font-mono truncate">{user.email}</div>
              </div>
            </div>

            <ArrowRight className="w-3.5 h-3.5 text-charcoal-400 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-1.5" />
          </button>
        ))}
      </div>
    </div>
  );
};
