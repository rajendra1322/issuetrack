import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { RaiseTicketModal } from '../tickets/RaiseTicketModal';
import { ToastContainer } from '../common/ToastContainer';
import { ConfirmationModal } from '../common/ConfirmationModal';
import { useTickets } from '../../context/TicketContext';

export const AppLayout: React.FC = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const { resetDemoData } = useTickets();

  return (
    <div className="min-h-screen bg-page flex flex-col antialiased">
      {/* Header */}
      <Header onToggleSidebar={() => setIsMobileSidebarOpen(true)} />

      {/* Main Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar */}
        <Sidebar
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
          onOpenResetModal={() => setIsResetModalOpen(true)}
        />

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Modals & Toasts */}
      <RaiseTicketModal />
      <ToastContainer />
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
