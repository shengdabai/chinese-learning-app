import React from 'react';
import { BookOpen, CheckCircle, Clock, Star } from 'lucide-react';
import { SRSStats as SRSStatsType } from './srsEngine';

interface SRSStatsProps {
  readonly stats: SRSStatsType;
}

export const SRSStatsPanel: React.FC<SRSStatsProps> = ({ stats }) => {
  const statItems = [
    {
      label: 'Due Now',
      value: stats.dueCards,
      icon: <Clock size={18} />,
      color: stats.dueCards > 0 ? 'text-orange-600 bg-orange-50 border-orange-200' : 'text-slate-500 bg-slate-50 border-slate-200',
    },
    {
      label: 'Learning',
      value: stats.learningCards,
      icon: <BookOpen size={18} />,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    {
      label: 'Mastered',
      value: stats.masteredCards,
      icon: <CheckCircle size={18} />,
      color: 'text-green-600 bg-green-50 border-green-200',
    },
    {
      label: 'New',
      value: stats.newCards,
      icon: <Star size={18} />,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {statItems.map((item) => (
        <div
          key={item.label}
          className={`flex flex-col items-center p-3 rounded-xl border ${item.color}`}
        >
          <div className="mb-1">{item.icon}</div>
          <span className="text-2xl font-bold">{item.value}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5 opacity-70">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};
