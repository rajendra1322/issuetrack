import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTickets } from '../context/TicketContext';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { UserAvatar } from '../components/common/UserAvatar';
import { Department, DEPARTMENTS, TerminalId, TERMINALS } from '../types';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import {
  User as UserIcon,
  Mail,
  RotateCcw,
  CheckCircle2,
  Ticket,
  Inbox,
  ArrowRightLeft,
  ShieldCheck,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { currentUser, updateProfile, allUsers, quickSwitch } = useAuth();
  const { tickets, resetDemoData, showToast } = useTickets();

  const [name, setName] = useState(currentUser?.name || '');
  const [department, setDepartment] = useState<Department>(
    currentUser?.department || 'Operations'
  );
  const [terminalId, setTerminalId] = useState<TerminalId>(
    currentUser?.terminalId || 'container-terminal'
  );

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  if (!currentUser) return null;

  const myTicketsCount = tickets.filter(
    (t) => t.raisedByEmail.toLowerCase() === currentUser.email.toLowerCase()
  ).length;

  const assignedToDeptCount = tickets.filter(
    (t) => t.assignedDepartment === currentUser.department
  ).length;

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    updateProfile(name, department, terminalId);
    showToast('Profile updated successfully!', 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <Breadcrumb items={[{ label: 'Profile' }]} />

      {/* Profile Overview Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-charcoal-100 text-center sm:text-left">
          <UserAvatar
            name={currentUser.name}
            size="xl"
            department={currentUser.department}
          />

          <div className="flex-1">
            <h1 className="text-2xl font-black text-charcoal-900 tracking-tight">
              {currentUser.name}
            </h1>
            <p className="text-xs text-charcoal-500 font-mono mt-0.5">{currentUser.email}</p>

            <div className="mt-3 flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <span className="text-xs font-bold bg-brand-50 text-brand-700 px-3 py-1 rounded-full border border-brand-200">
                {currentUser.department} Department
              </span>
              <span className="text-xs font-medium bg-charcoal-100 text-charcoal-700 px-3 py-1 rounded-full">
                {currentUser.terminalName}
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Simulated Auth Active</span>
              </span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex sm:flex-col gap-3">
            <div className="bg-charcoal-50 p-3 rounded-2xl border border-charcoal-200 text-center min-w-[100px]">
              <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-charcoal-500 uppercase">
                <Ticket className="w-3 h-3 text-brand-500" />
                <span>Raised</span>
              </div>
              <div className="text-xl font-black text-charcoal-900 mt-0.5">{myTicketsCount}</div>
            </div>

            <div className="bg-charcoal-50 p-3 rounded-2xl border border-charcoal-200 text-center min-w-[100px]">
              <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-charcoal-500 uppercase">
                <Inbox className="w-3 h-3 text-amber-500" />
                <span>Dept Queue</span>
              </div>
              <div className="text-xl font-black text-charcoal-900 mt-0.5">{assignedToDeptCount}</div>
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        <form onSubmit={handleUpdate} className="mt-6 space-y-4">
          <h3 className="text-sm font-bold text-charcoal-900">Edit Simulated Profile</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2 text-xs font-medium bg-charcoal-50 border border-charcoal-300 rounded-xl text-charcoal-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Email Address (Read-only ID)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  readOnly
                  value={currentUser.email}
                  className="w-full pl-9 pr-3 py-2 text-xs font-medium bg-charcoal-100 border border-charcoal-200 rounded-xl text-charcoal-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as Department)}
                className="w-full px-3 py-2 text-xs font-semibold bg-charcoal-50 border border-charcoal-300 rounded-xl text-charcoal-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Port Terminal
              </label>
              <select
                value={terminalId}
                onChange={(e) => setTerminalId(e.target.value as TerminalId)}
                className="w-full px-3 py-2 text-xs font-semibold bg-charcoal-50 border border-charcoal-300 rounded-xl text-charcoal-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {Object.values(TERMINALS).map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>

      {/* Switch to any Sample Account */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-charcoal-100 mb-4">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-bold text-charcoal-900">Quick Switch Demo Accounts</h3>
          </div>
          <span className="text-xs text-charcoal-500">16 sample department roles</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
          {allUsers.map((u) => {
            const isMe = u.id === currentUser.id;
            return (
              <button
                key={u.id}
                type="button"
                onClick={() => quickSwitch(u.id)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isMe
                    ? 'border-brand-500 bg-brand-50/50 ring-1 ring-brand-500'
                    : 'border-charcoal-200 hover:border-charcoal-300 hover:bg-charcoal-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <UserAvatar name={u.name} size="xs" department={u.department} />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-charcoal-900 truncate">{u.name}</p>
                    <p className="text-[10px] text-charcoal-500 truncate">
                      {u.department} &bull; {u.terminalId === 'container-terminal' ? 'CT' : 'Coal'}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Danger Zone / Reset Demo Data */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-red-200 shadow-xs">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-red-700">Restore Initial Seed Dataset</h3>
            <p className="text-xs text-charcoal-600 mt-1">
              Reset all tickets, status updates, and remarks to the default sample dataset for clean re-evaluation.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsResetModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 rounded-xl text-xs font-bold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-red-600" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isResetModalOpen}
        title="Restore Default Demo Data?"
        message="This will reset all tickets, status updates, and remarks to the initial seed dataset."
        confirmLabel="Reset All Data"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={() => resetDemoData()}
        onCancel={() => setIsResetModalOpen(false)}
      />
    </div>
  );
};
