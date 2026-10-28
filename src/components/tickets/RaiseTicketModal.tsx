import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTickets } from '../../context/TicketContext';
import { Department, DEPARTMENTS, TerminalId, TERMINALS } from '../../types';
import { validateRequired } from '../../utils/validation';
import { X, Send, AlertCircle, Building2, MapPin, User, FileText, ArrowRight } from 'lucide-react';

export const RaiseTicketModal: React.FC = () => {
  const { currentUser } = useAuth();
  const {
    isRaiseModalOpen,
    raiseModalDefaults,
    closeRaiseModal,
    createTicket,
  } = useTickets();
  const navigate = useNavigate();

  const [terminalId, setTerminalId] = useState<TerminalId>('container-terminal');
  const [sourceDepartment, setSourceDepartment] = useState<Department>('Operations');
  const [assignedDepartment, setAssignedDepartment] = useState<Department>('IT');
  const [location, setLocation] = useState('');
  const [issueDetails, setIssueDetails] = useState('');
  const [initialRemarks, setInitialRemarks] = useState('');

  // Form error state
  const [errors, setErrors] = useState<{
    location?: string;
    issueDetails?: string;
    departmentMatch?: string;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize or reset form based on modal opening and defaults
  useEffect(() => {
    if (isRaiseModalOpen) {
      const defaultTerm = raiseModalDefaults.terminalId || currentUser?.terminalId || 'container-terminal';
      const defaultSource = raiseModalDefaults.sourceDepartment || currentUser?.department || 'Operations';
      
      // Default assistTo: pick IT or another department different from source
      let defaultAssigned: Department = raiseModalDefaults.assignedDepartment || 'IT';
      if (defaultAssigned === defaultSource) {
        defaultAssigned = defaultSource === 'IT' ? 'Operations' : 'IT';
      }

      setTerminalId(defaultTerm);
      setSourceDepartment(defaultSource);
      setAssignedDepartment(defaultAssigned);

      // Default location sample based on terminal
      if (!location) {
        setLocation(
          defaultTerm === 'container-terminal'
            ? 'Container Terminal - Gate Complex / Office 2'
            : 'Coal Terminal - Control Room'
        );
      }
      setErrors({});
    }
  }, [isRaiseModalOpen, raiseModalDefaults, currentUser]);

  if (!isRaiseModalOpen) return null;

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!validateRequired(issueDetails)) {
      newErrors.issueDetails = 'Please provide details of the issue.';
    } else if (issueDetails.trim().length < 10) {
      newErrors.issueDetails = 'Please describe the issue in at least 10 characters.';
    }

    if (!validateRequired(location)) {
      newErrors.location = 'Specific location is required (e.g. Office 2, Crane Berth 3).';
    }

    if (sourceDepartment === assignedDepartment) {
      newErrors.departmentMatch =
        'Source and receiving departments must be different. Please select a distinct department in "Assist To".';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const newTicket = createTicket({
        terminalId,
        sourceDepartment,
        assignedDepartment,
        issueDetails,
        location,
        initialRemarks,
      });

      if (newTicket) {
        // Reset form
        setIssueDetails('');
        setInitialRemarks('');
        closeRaiseModal();
        navigate(`/tickets/${newTicket.id}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal-900/60 backdrop-blur-xs transition-opacity"
        onClick={closeRaiseModal}
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-charcoal-200 z-10 animate-fade-in my-8">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-charcoal-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-brand-50 text-brand-600 rounded-lg">
                <FileText className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-charcoal-900">Raise New Ticket</h2>
            </div>
            <p className="text-xs text-charcoal-500 mt-1">
              Log an operational, technical, or facility issue for department resolution.
            </p>
          </div>

          <button
            type="button"
            onClick={closeRaiseModal}
            className="text-charcoal-400 hover:text-charcoal-600 p-1.5 rounded-lg hover:bg-charcoal-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Creator Name (Auto-filled & Read-only) & Terminal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-charcoal-400" />
                <span>Raised By (Auto-filled)</span>
              </label>
              <input
                type="text"
                readOnly
                value={currentUser ? `${currentUser.name} (${currentUser.email})` : 'Guest User'}
                className="w-full text-xs font-medium bg-charcoal-50 border border-charcoal-200 rounded-lg px-3 py-2.5 text-charcoal-600 cursor-not-allowed select-none focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-charcoal-400" />
                <span>Port Terminal <span className="text-red-500">*</span></span>
              </label>
              <select
                value={terminalId}
                onChange={(e) => setTerminalId(e.target.value as TerminalId)}
                className="w-full text-xs font-medium bg-white border border-charcoal-300 rounded-lg px-3 py-2.5 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              >
                {Object.values(TERMINALS).map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Department Routing: Source Department -> Assist To (Receiving) */}
          <div className="bg-brand-50/50 p-4 rounded-xl border border-brand-100">
            <div className="flex items-center justify-between text-xs font-bold text-brand-900 mb-3">
              <span>Department Routing Matrix</span>
              <span className="text-[10px] text-brand-600 font-normal">
                Routes ticket directly to destination queue
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                  Source Department <span className="text-red-500">*</span>
                </label>
                <select
                  value={sourceDepartment}
                  onChange={(e) => setSourceDepartment(e.target.value as Department)}
                  className="w-full text-xs font-semibold bg-white border border-charcoal-300 rounded-lg px-3 py-2 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-charcoal-500 mt-1 block">
                  Origin of the issue
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1 flex items-center justify-between">
                  <span>
                    Assist To (Receiving Dept) <span className="text-red-500">*</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-brand-500 inline" />
                </label>
                <select
                  value={assignedDepartment}
                  onChange={(e) => setAssignedDepartment(e.target.value as Department)}
                  className={`w-full text-xs font-semibold bg-white border rounded-lg px-3 py-2 text-charcoal-900 focus:outline-none focus:ring-2 ${
                    errors.departmentMatch
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-charcoal-300 focus:ring-brand-500'
                  }`}
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-charcoal-500 mt-1 block">
                  Actioning department
                </span>
              </div>
            </div>

            {errors.departmentMatch && (
              <div className="mt-2 text-xs font-medium text-red-600 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.departmentMatch}</span>
              </div>
            )}
          </div>

          {/* Location Field */}
          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-charcoal-400" />
              <span>Location / Exact Work Area <span className="text-red-500">*</span></span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Container Terminal - Office 2, or Coal Terminal - Control Room"
              className={`w-full text-xs font-medium bg-white border rounded-lg px-3 py-2.5 text-charcoal-900 focus:outline-none focus:ring-2 ${
                errors.location
                  ? 'border-red-400 focus:ring-red-400'
                  : 'border-charcoal-300 focus:ring-brand-500 focus:border-brand-500'
              }`}
            />
            {errors.location && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.location}</span>
              </p>
            )}
          </div>

          {/* Issue Details */}
          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">
              Issue Details <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={issueDetails}
              onChange={(e) => setIssueDetails(e.target.value)}
              placeholder="Describe the issue you are facing..."
              className={`w-full text-xs font-medium bg-white border rounded-lg p-3 text-charcoal-900 focus:outline-none focus:ring-2 resize-y ${
                errors.issueDetails
                  ? 'border-red-400 focus:ring-red-400'
                  : 'border-charcoal-300 focus:ring-brand-500 focus:border-brand-500'
              }`}
            />
            {errors.issueDetails && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.issueDetails}</span>
              </p>
            )}
          </div>

          {/* Optional Remarks */}
          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">
              Remarks (Optional)
            </label>
            <textarea
              rows={2}
              value={initialRemarks}
              onChange={(e) => setInitialRemarks(e.target.value)}
              placeholder="Add any additional information..."
              className="w-full text-xs font-medium bg-white border border-charcoal-300 rounded-lg p-3 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 resize-y"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-charcoal-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeRaiseModal}
              className="px-4 py-2 text-xs font-semibold text-charcoal-700 bg-white border border-charcoal-300 rounded-lg hover:bg-charcoal-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-lg shadow-sm transition-all active:scale-[0.98] disabled:opacity-60"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Raising Ticket...' : 'Submit Ticket'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
