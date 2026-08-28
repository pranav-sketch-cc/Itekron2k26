import React from 'react';

interface StatusBadgeProps {
  status: string;
  type?: 'registration' | 'checkin';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'registration' }) => {
  const normalized = status?.toLowerCase() || 'pending';

  let bgClass = 'bg-slate-800 text-slate-300 border-slate-700';

  if (type === 'registration') {
    if (normalized === 'confirmed') bgClass = 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60';
    else if (normalized === 'pending') bgClass = 'bg-amber-950/80 text-amber-400 border-amber-800/60';
    else if (normalized === 'cancelled') bgClass = 'bg-red-950/80 text-red-400 border-red-800/60';
  } else {
    if (normalized === 'checked_in' || normalized === 'yes' || normalized === 'true') {
      bgClass = 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60';
    } else {
      bgClass = 'bg-blue-950/80 text-blue-400 border-blue-800/60';
    }
  }

  const label = normalized === 'checked_in' ? 'Checked In' : normalized.charAt(0).toUpperCase() + normalized.slice(1);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${bgClass}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse" />
      {label}
    </span>
  );
};