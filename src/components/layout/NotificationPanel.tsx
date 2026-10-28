import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { Bell, CheckCheck, MessageSquare, AlertCircle, RefreshCw, X } from 'lucide-react';
import { formatRelativeTime } from '../../utils/dateFormatter';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleNotificationClick = (notificationId: string, ticketId: string) => {
    markAsRead(notificationId);
    onClose();
    navigate(`/tickets/${ticketId}`);
  };

  return (
    <div
      ref={panelRef}
      className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-charcoal-200 z-50 overflow-hidden animate-fade-in"
    >
      {/* Header */}
      <div className="p-4 border-b border-charcoal-100 flex items-center justify-between bg-charcoal-50/50">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-brand-600" />
          <h3 className="font-semibold text-charcoal-900 text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-brand-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1 px-2 py-1 rounded-md hover:bg-brand-50 transition-colors"
              title="Mark all as read"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="text-charcoal-400 hover:text-charcoal-600 p-1 rounded-md hover:bg-charcoal-100 transition-colors"
            aria-label="Close notifications"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notifications list */}
      <div className="max-h-[380px] overflow-y-auto divide-y divide-charcoal-100">
        {notifications.length === 0 ? (
          <div className="py-12 text-center text-charcoal-400">
            <Bell className="w-8 h-8 mx-auto mb-2 text-charcoal-300 stroke-[1.5]" />
            <p className="text-sm font-medium">No notifications yet</p>
            <p className="text-xs text-charcoal-400 mt-0.5">
              Updates to your tickets and department issues will appear here.
            </p>
          </div>
        ) : (
          notifications.map((notif) => {
            const isUnread = !notif.isRead;
            return (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif.id, notif.ticketId)}
                className={`p-4 flex items-start gap-3 cursor-pointer transition-colors ${
                  isUnread
                    ? 'bg-brand-50/40 hover:bg-brand-50/70'
                    : 'hover:bg-charcoal-50/80'
                }`}
              >
                <div
                  className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                    notif.type === 'ticket_created'
                      ? 'bg-amber-100 text-amber-700'
                      : notif.type === 'status_changed'
                      ? 'bg-brand-100 text-brand-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {notif.type === 'ticket_created' && <AlertCircle className="w-4 h-4" />}
                  {notif.type === 'status_changed' && <RefreshCw className="w-4 h-4" />}
                  {notif.type === 'reply_added' && <MessageSquare className="w-4 h-4" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-semibold text-xs text-charcoal-900 truncate">
                      {notif.title}
                    </span>
                    <span className="text-[10px] text-charcoal-400 shrink-0">
                      {formatRelativeTime(notif.createdAt)}
                    </span>
                  </div>

                  <p className="text-xs text-charcoal-600 line-clamp-2 leading-relaxed">
                    {notif.message}
                  </p>

                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="inline-block text-[10px] font-mono font-medium text-brand-600 bg-brand-100/60 px-1.5 py-0.5 rounded">
                      {notif.ticketId}
                    </span>
                    {isUnread && (
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-500" />
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-2.5 bg-charcoal-50/50 border-t border-charcoal-100 text-center">
          <button
            onClick={() => {
              onClose();
              navigate('/notifications');
            }}
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 py-1"
          >
            View all notification history →
          </button>
        </div>
      )}
    </div>
  );
};
