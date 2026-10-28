import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Department, TerminalId } from '../../types';
import { useTickets } from '../../context/TicketContext';
import {
  Monitor,
  Zap,
  Ship,
  Compass,
  ShieldAlert,
  FileText,
  Landmark,
  Users,
  ArrowRight,
  Clock,
  Eye,
  CheckCircle2,
} from 'lucide-react';

interface DepartmentCardProps {
  terminalId: TerminalId;
  department: Department;
}

export const DepartmentCard: React.FC<DepartmentCardProps> = ({
  terminalId,
  department,
}) => {
  const navigate = useNavigate();
  const { getDepartmentStats } = useTickets();
  const stats = getDepartmentStats(terminalId, department);

  const deptConfigs: Record<
    Department,
    {
      icon: React.ElementType;
      color: string;
      desc: string;
      borderHover: string;
    }
  > = {
    IT: {
      icon: Monitor,
      color: 'bg-blue-50 text-blue-600',
      borderHover: 'hover:border-blue-400',
      desc: 'Workstations, port networks, TOS, CCTV & RFID systems',
    },
    Electrical: {
      icon: Zap,
      color: 'bg-amber-50 text-amber-600',
      borderHover: 'hover:border-amber-400',
      desc: 'Substations, quay crane power feeds, lighting & conveyors',
    },
    Operations: {
      icon: Ship,
      color: 'bg-sky-50 text-brand-600',
      borderHover: 'hover:border-brand-400',
      desc: 'Berth allocation, vessel loading/unloading & yard equipment',
    },
    Planning: {
      icon: Compass,
      color: 'bg-indigo-50 text-indigo-600',
      borderHover: 'hover:border-indigo-400',
      desc: 'Stowage planning, rail discharge sequencing & vessel turnaround',
    },
    Safety: {
      icon: ShieldAlert,
      color: 'bg-red-50 text-red-600',
      borderHover: 'hover:border-red-400',
      desc: 'HSE compliance, fire suppression, hazard alerts & PPE permits',
    },
    Documentation: {
      icon: FileText,
      color: 'bg-purple-50 text-purple-600',
      borderHover: 'hover:border-purple-400',
      desc: 'Customs release, delivery orders, bills of lading & gate passes',
    },
    Financial: {
      icon: Landmark,
      color: 'bg-emerald-50 text-emerald-600',
      borderHover: 'hover:border-emerald-400',
      desc: 'Tariffs, equipment fuel logs, billing vouchers & operational audits',
    },
    HR: {
      icon: Users,
      color: 'bg-pink-50 text-pink-600',
      borderHover: 'hover:border-pink-400',
      desc: 'Shift operator rostering, biometric attendance & payroll queries',
    },
  };

  const config = deptConfigs[department];
  const Icon = config.icon;
  const openCount = stats.pending + stats.checked;

  return (
    <div
      onClick={() =>
        navigate(`/terminals/${terminalId}/departments/${encodeURIComponent(department)}`)
      }
      className={`group bg-white rounded-2xl p-5 border border-border shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between ${config.borderHover} active:scale-[0.99]`}
    >
      <div>
        <div className="flex items-start justify-between">
          <div className={`p-3 rounded-xl transition-transform group-hover:scale-105 ${config.color}`}>
            <Icon className="w-6 h-6 stroke-[1.8]" />
          </div>

          <div className="flex items-center gap-1">
            {openCount > 0 ? (
              <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                <Clock className="w-3 h-3 text-amber-500" />
                <span>{openCount} Open</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span>All Solved</span>
              </span>
            )}
          </div>
        </div>

        <div className="mt-4">
          <h4 className="text-base font-bold text-charcoal-900 group-hover:text-brand-600 transition-colors">
            {department} Department
          </h4>
          <p className="mt-1 text-xs text-charcoal-500 line-clamp-2 leading-relaxed">
            {config.desc}
          </p>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-charcoal-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-charcoal-500 text-[11px]">
          <span className="text-amber-600 font-semibold">{stats.pending} Pending</span>
          <span>&bull;</span>
          <span className="text-brand-600 font-semibold">{stats.checked} Checked</span>
          <span>&bull;</span>
          <span className="text-emerald-600 font-semibold">{stats.solved} Solved</span>
        </div>

        <div className="text-brand-600 font-bold group-hover:translate-x-0.5 transition-transform flex items-center">
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
