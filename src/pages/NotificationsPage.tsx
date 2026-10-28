import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { formatDateTime, formatRelativeTime } from '../utils/dateFormatter';
import {
  Bell,
  CheckCheck,
  AlertCircle,
  RefreshCw,
  MessageSquare,
  ArrowRight,
  Inbox,
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  const handleOpenTicket = (notificationId: string, ticketId: string) => {
    markAsRead(notificationId);
    navigate(`/tickets/${ticketId}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumb items={[{ label: 'Notifications' }]} />

      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand-50 text-brand-600 rounded-2xl">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-charcoal-900 tracking-tight">Notification Center</h1>
            <p className="text-xs text-charcoal-500 mt-0.5">
              Updates on tickets raised by you and issues assigned to your department.
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 transition-colors"
          >
            <CheckCheck className="w-4 h-4 text-brand-600" />
            <span>Mark All as Read ({unreadCount})</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-2xl border border-charcoal-200 shadow-xs overflow-hidden divide-y divide-charcoal-100">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-charcoal-400">
            <Inbox className="w-10 h-10 mx-auto mb-2 text-charcoal-300 stroke-[1.5]" />
            <h3 className="text-sm font-bold text-charcoal-800">No notifications yet</h3>
            <p className="text-xs text-charcoal-400 mt-1 max-w-sm mx-auto">
              When tickets are raised, updated, or replied to, you will receive real-time notifications here.
            </p>
          </div>
        ) : (
          notifications.map((notif) => {
            const isUnread = !notif.isRead;

            return (
              <div
                key={notif.id}
                onClick={() => handleOpenTicket(notif.id, notif.ticketId)}
                className={`p-4 sm:p-5 flex items-start gap-4 cursor-pointer transition-colors ${
                  isUnread
                    ? 'bg-brand-50/40 hover:bg-brand-50/70'
                    : 'hover:bg-charcoal-50/80'
                }`}
              >
                <div
                  className={`p-3 rounded-2xl shrink-0 mt-0.5 ${
                    notif.type === 'ticket_created'
                      ? 'bg-amber-100 text-amber-700'
                      : notif.type === 'status_changed'
                      ? 'bg-brand-100 text-brand-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {notif.type === 'ticket_created' && <AlertCircle className="w-5 h-5" />}
                  {notif.type === 'status_changed' && <RefreshCw className="w-5 h-5" />}
                  {notif.type === 'reply_added' && <MessageSquare className="w-5 h-5" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-charcoal-900">
                        {notif.title}
                      </span>
                      {isUnread && (
                        <span className="bg-brand-500 text-white text-[10px] font-bold px-2 py-0.2 rounded-full">
                          NEW
                        </span>
                      )}
                    </div>

                    <span className="text-xs text-charcoal-400 font-medium">
                      {formatDateTime(notif.createdAt)} ({formatRelativeTime(notif.createdAt)})
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
                    {notif.message}
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                      {notif.ticketId}
                    </span>

                    <span className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:underline">
                      <span>Open Ticket</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
