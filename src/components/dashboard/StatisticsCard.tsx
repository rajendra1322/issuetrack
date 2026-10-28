import React from 'react';
import { TicketStats } from '../../types';
import { Layers, Clock, Eye, CheckCircle2 } from 'lucide-react';

interface StatisticsCardProps {
  stats: TicketStats;
  titlePrefix?: string;
}

export const StatisticsCard: React.FC<StatisticsCardProps> = ({ stats, titlePrefix = 'All' }) => {
  const cards = [
    {
      label: `${titlePrefix} Tickets`,
      value: stats.total,
      icon: Layers,
      color: 'text-charcoal-700 bg-charcoal-100 border-charcoal-200',
      iconBg: 'bg-charcoal-900 text-white',
    },
    {
      label: 'Pending Resolution',
      value: stats.pending,
      icon: Clock,
      color: 'text-amber-800 bg-amber-50/70 border-amber-200',
      iconBg: 'bg-amber-500 text-white',
    },
    {
      label: 'Under Review / Checked',
      value: stats.checked,
      icon: Eye,
      color: 'text-brand-800 bg-brand-50/70 border-brand-200',
      iconBg: 'bg-brand-500 text-white',
    },
    {
      label: 'Solved / Resolved',
      value: stats.solved,
      icon: CheckCircle2,
      color: 'text-emerald-800 bg-emerald-50/70 border-emerald-200',
      iconBg: 'bg-emerald-500 text-white',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`p-4 sm:p-5 rounded-2xl border shadow-xs transition-all hover:shadow-md bg-white ${card.color}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-charcoal-600 truncate">{card.label}</span>
              <div className={`p-2 rounded-xl shadow-xs ${card.iconBg}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
                {card.value}
              </span>
              <span className="text-[11px] text-charcoal-500 font-medium">
                {card.value === 1 ? 'ticket' : 'tickets'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
