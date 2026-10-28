import React, { useState } from 'react';
import { Ticket } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useTickets } from '../../context/TicketContext';
import { UserAvatar } from '../common/UserAvatar';
import { formatDateTime, formatRelativeTime } from '../../utils/dateFormatter';
import { MessageSquare, Send, CornerDownRight } from 'lucide-react';

interface TicketConversationProps {
  ticket: Ticket;
}

export const TicketConversation: React.FC<TicketConversationProps> = ({ ticket }) => {
  const { currentUser } = useAuth();
  const { addConversationMessage } = useTickets();
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const conversation = ticket.conversation || [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || isSending) return;

    setIsSending(true);
    const msg = addConversationMessage(ticket.id, replyText);
    if (msg) {
      setReplyText('');
    }
    setIsSending(false);
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-charcoal-200 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-charcoal-100 mb-5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
            <MessageSquare className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-charcoal-900">
            Conversation & Department Remarks ({conversation.length})
          </h3>
        </div>

        <span className="text-[11px] text-charcoal-500 font-medium">
          Real-time updates enabled
        </span>
      </div>

      {/* Messages Timeline */}
      <div className="space-y-4 mb-6">
        {conversation.length === 0 ? (
          <div className="py-8 text-center text-charcoal-400 bg-charcoal-50/50 rounded-xl border border-dashed border-charcoal-200">
            <MessageSquare className="w-6 h-6 mx-auto mb-1.5 text-charcoal-300" />
            <p className="text-xs font-semibold text-charcoal-600">No replies yet</p>
            <p className="text-[11px] text-charcoal-400 mt-0.5">
              The assigned department ({ticket.assignedDepartment}) or ticket creator can leave remarks below.
            </p>
          </div>
        ) : (
          conversation.map((msg) => {
            const isMe =
              currentUser?.email.toLowerCase() === msg.authorEmail.toLowerCase();
            const isAssignedDept = msg.authorDepartment === ticket.assignedDepartment;

            return (
              <div
                key={msg.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isAssignedDept
                    ? 'bg-brand-50/30 border-brand-200 shadow-xs'
                    : 'bg-charcoal-50/70 border-charcoal-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <UserAvatar name={msg.authorName} size="xs" department={msg.authorDepartment} />
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-charcoal-900">
                          {msg.authorName}
                        </span>
                        <span className="text-[10px] font-semibold bg-brand-100 text-brand-700 px-1.5 py-0.2 rounded">
                          {msg.authorDepartment}
                        </span>
                        {isMe && (
                          <span className="text-[10px] text-charcoal-400 font-medium italic">
                            (You)
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-charcoal-400 font-mono">
                        {msg.authorEmail}
                      </span>
                    </div>
                  </div>

                  <span
                    className="text-[10px] text-charcoal-400 shrink-0 font-medium"
                    title={formatDateTime(msg.timestamp)}
                  >
                    {formatRelativeTime(msg.timestamp)}
                  </span>
                </div>

                <p className="text-xs text-charcoal-800 whitespace-pre-wrap leading-relaxed pl-8">
                  {msg.message}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* Reply input form */}
      <form onSubmit={handleSend} className="pt-4 border-t border-charcoal-100">
        <label className="block text-xs font-semibold text-charcoal-700 mb-1.5 flex items-center gap-1.5">
          <CornerDownRight className="w-3.5 h-3.5 text-brand-600" />
          <span>Post a Reply / Remark as {currentUser?.name} ({currentUser?.department})</span>
        </label>

        <textarea
          rows={3}
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder={`Write an update, progress note, or request additional information...`}
          className="w-full text-xs font-medium bg-charcoal-50 border border-charcoal-300 rounded-xl p-3 text-charcoal-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 resize-y"
        />

        <div className="mt-2.5 flex items-center justify-between">
          <span className="text-[11px] text-charcoal-400">
            Pressing send will notify the ticket creator or receiving department.
          </span>

          <button
            type="submit"
            disabled={!replyText.trim() || isSending}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-lg shadow-xs transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSending ? 'Sending...' : 'Send Reply'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
