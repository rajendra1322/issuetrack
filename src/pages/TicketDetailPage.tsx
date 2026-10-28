import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTickets } from '../context/TicketContext';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { StatusBadge } from '../components/common/StatusBadge';
import { TicketStatusSelect } from '../components/tickets/TicketStatusSelect';
import { TicketConversation } from '../components/tickets/TicketConversation';
import { TicketHistoryTimeline } from '../components/tickets/TicketHistoryTimeline';
import { formatDateTime } from '../utils/dateFormatter';
import {
  MapPin,
  User,
  Building2,
  Calendar,
  ArrowRight,
  FileText,
  AlertCircle,
  HelpCircle,
  ArrowLeft,
  MessageSquare,
  ShieldAlert,
} from 'lucide-react';

export const TicketDetailPage: React.FC = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const { currentUser } = useAuth();
  const { getTicketById } = useTickets();

  const ticket = ticketId ? getTicketById(ticketId) : undefined;

  if (!ticket) {
    return (
      <div className="bg-white rounded-2xl border border-charcoal-200 p-12 text-center shadow-xs animate-fade-in">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-charcoal-900">Ticket Not Found</h2>
        <p className="text-xs text-charcoal-500 mt-1 max-w-sm mx-auto">
          The ticket with ID <span className="font-mono">{ticketId}</span> does not exist or may have been removed.
        </p>
        <Link
          to="/"
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-brand-500 text-white rounded-xl text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    );
  }

  // Determine permissions:
  // Is this user the ticket issuer (creator)?
  const isIssuer =
    currentUser?.email.toLowerCase() === ticket.raisedByEmail.toLowerCase();
  
  // Is this user a staff member of the assigned receiving department?
  const isAssignedStaff =
    currentUser?.department === ticket.assignedDepartment;

  // Check if remarks exist (initial remarks, conversation remarks, or status notes)
  const hasInitialRemarks = Boolean(ticket.initialRemarks && ticket.initialRemarks.trim());
  const hasConversationRemarks = Boolean(ticket.conversation && ticket.conversation.length > 0);
  const statusNotes = (ticket.statusHistory || []).filter((h) => h.note && h.note.trim());
  const hasAnyRemarks = hasInitialRemarks || hasConversationRemarks || statusNotes.length > 0;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: ticket.terminalName, href: `/terminals/${ticket.terminalId}` },
          {
            label: `${ticket.assignedDepartment} Queue`,
            href: `/terminals/${ticket.terminalId}/departments/${encodeURIComponent(
              ticket.assignedDepartment
            )}`,
          },
          { label: ticket.id },
        ]}
      />

      {/* Ticket Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-charcoal-100">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-mono text-lg sm:text-xl font-extrabold text-brand-600 bg-brand-50 px-3 py-1 rounded-xl border border-brand-200">
              {ticket.id}
            </span>
            <span className="font-bold text-xs bg-charcoal-100 text-charcoal-700 px-2.5 py-1 rounded-lg">
              {ticket.terminalName}
            </span>
            <StatusBadge status={ticket.status} size="lg" />
          </div>

          <div className="flex items-center gap-1.5 text-xs text-charcoal-500">
            <Calendar className="w-4 h-4 text-charcoal-400" />
            <span>Raised: {formatDateTime(ticket.createdAt)}</span>
          </div>
        </div>

        {/* Cross-Department Routing Banner */}
        <div className="mt-5 p-4 rounded-2xl bg-brand-50/60 border border-brand-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-charcoal-500 uppercase tracking-wider">
                Source Department
              </span>
              <span className="text-sm font-extrabold text-charcoal-900">
                {ticket.sourceDepartment}
              </span>
            </div>

            <div className="p-1 rounded-full bg-brand-200 text-brand-700 mx-1">
              <ArrowRight className="w-4 h-4" />
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-brand-700 uppercase tracking-wider">
                Assigned / Receiving Department
              </span>
              <span className="text-sm font-extrabold text-brand-800">
                {ticket.assignedDepartment}
              </span>
            </div>
          </div>

          <div className="text-xs text-charcoal-600 bg-white px-3 py-1.5 rounded-xl border border-brand-200 shadow-xs">
            <span className="font-semibold text-charcoal-800">Action Queue:</span>{' '}
            {ticket.terminalName} &bull; {ticket.assignedDepartment}
          </div>
        </div>

        {/* Issuer View Notice Banner */}
        {isIssuer && (
          <div className="mt-4 p-3 rounded-xl bg-charcoal-50 border border-charcoal-200 flex items-center gap-2 text-xs text-charcoal-600">
            <ShieldAlert className="w-4 h-4 text-brand-500 shrink-0" />
            <span>
              <strong>You are the issuer of this ticket.</strong> Ticket status is managed exclusively by the assigned <strong>{ticket.assignedDepartment} Department</strong>.
            </span>
          </div>
        )}

        {/* Issue Details Section */}
        <div className="mt-6">
          <h3 className="text-xs font-bold text-charcoal-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-charcoal-400" />
            <span>Issue Details</span>
          </h3>
          <div className="bg-charcoal-50/70 p-4 rounded-2xl border border-charcoal-200 text-sm font-medium text-charcoal-900 leading-relaxed whitespace-pre-wrap">
            {ticket.issueDetails}
          </div>
        </div>

        {/* Initial Remarks if present */}
        {ticket.initialRemarks && (
          <div className="mt-4">
            <h4 className="text-xs font-bold text-charcoal-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-charcoal-400" />
              <span>Creator Initial Remarks</span>
            </h4>
            <div className="bg-amber-50/50 p-3.5 rounded-xl border border-amber-200/60 text-xs text-charcoal-800 leading-relaxed italic">
              &ldquo;{ticket.initialRemarks}&rdquo;
            </div>
          </div>
        )}

        {/* Location & Raiser Metadata Grid */}
        <div className="mt-6 pt-5 border-t border-charcoal-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="flex items-start gap-2.5">
            <div className="p-2 rounded-lg bg-charcoal-100 text-charcoal-600 shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-[11px] font-bold text-charcoal-500 uppercase tracking-wider">
                Location
              </span>
              <span className="font-semibold text-charcoal-900">{ticket.location}</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="p-2 rounded-lg bg-charcoal-100 text-charcoal-600 shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-[11px] font-bold text-charcoal-500 uppercase tracking-wider">
                Raised By
              </span>
              <span className="font-semibold text-charcoal-900">{ticket.raisedBy}</span>
              <span className="block text-[11px] text-charcoal-500 font-mono">
                {ticket.raisedByEmail}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="p-2 rounded-lg bg-charcoal-100 text-charcoal-600 shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-[11px] font-bold text-charcoal-500 uppercase tracking-wider">
                Port Facility
              </span>
              <span className="font-semibold text-charcoal-900">{ticket.terminalName}</span>
              <span className="block text-[11px] text-charcoal-500">
                Origin: {ticket.sourceDepartment} Dept
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Conditional Content: Issuer View vs Assigned Department Staff View */}
      {isIssuer || !isAssignedStaff ? (
        /* TO ISSUER: Do not give ticket status workflow, remove audit history & conversation/remarks form. Simply show remarks if there are any. */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-charcoal-100 mb-4">
            <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-charcoal-900">
                Remarks & Department Updates
              </h3>
              <p className="text-xs text-charcoal-500">
                Read-only view of remarks from {ticket.assignedDepartment} Department regarding this ticket.
              </p>
            </div>
          </div>

          {hasAnyRemarks ? (
            <div className="space-y-4">
              {ticket.initialRemarks && (
                <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
                    Your Initial Remark
                  </span>
                  <p className="text-xs text-charcoal-800 leading-relaxed italic">
                    &ldquo;{ticket.initialRemarks}&rdquo;
                  </p>
                </div>
              )}

              {ticket.conversation && ticket.conversation.length > 0 && (
                <div className="space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 block">
                    Replies from {ticket.assignedDepartment}
                  </span>
                  {ticket.conversation.map((msg) => (
                    <div
                      key={msg.id}
                      className="p-4 rounded-2xl bg-charcoal-50 border border-charcoal-200"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-charcoal-900">
                            {msg.authorName}
                          </span>
                          <span className="text-[10px] font-semibold bg-brand-100 text-brand-700 px-2 py-0.5 rounded">
                            {msg.authorDepartment} Dept
                          </span>
                        </div>
                        <span className="text-[10px] text-charcoal-400">
                          {formatDateTime(msg.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-charcoal-800 whitespace-pre-wrap leading-relaxed">
                        {msg.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {statusNotes.length > 0 && (
                <div className="space-y-2 mt-4 pt-3 border-t border-charcoal-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 block">
                    Status Update Notes
                  </span>
                  {statusNotes.map((entry) => (
                    <div
                      key={entry.id}
                      className="p-3 rounded-xl bg-sky-50/60 border border-sky-100 text-xs text-charcoal-700 flex items-start justify-between gap-3"
                    >
                      <div>
                        <span className="font-semibold text-brand-900 mr-2">
                          {entry.updatedBy} ({entry.department}):
                        </span>
                        <span className="italic">&ldquo;{entry.note}&rdquo;</span>
                      </div>
                      <span className="text-[10px] text-charcoal-400 shrink-0">
                        {formatDateTime(entry.timestamp)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="py-8 text-center text-charcoal-400 bg-charcoal-50/50 rounded-2xl border border-dashed border-charcoal-200">
              <MessageSquare className="w-7 h-7 mx-auto mb-1 text-charcoal-300" />
              <p className="text-xs font-semibold text-charcoal-600">No remarks yet</p>
              <p className="text-[11px] text-charcoal-400 mt-0.5">
                When the receiving department updates or adds notes to this ticket, they will appear here.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* FOR ASSIGNED DEPARTMENT STAFF: Full workflow, status control, audit history & conversation reply tool */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-6">
            <TicketStatusSelect ticket={ticket} />
            <TicketHistoryTimeline
              history={ticket.statusHistory}
              createdAt={ticket.createdAt}
              raisedBy={ticket.raisedBy}
              sourceDepartment={ticket.sourceDepartment}
            />
          </div>

          <div className="lg:col-span-7">
            <TicketConversation ticket={ticket} />
          </div>
        </div>
      )}
    </div>
  );
};
