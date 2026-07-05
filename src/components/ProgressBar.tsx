import React from 'react';

interface ProgressBarProps {
  progress: number;
  label?: string;
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple';
}

const colorClasses = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-green-500 to-green-600',
  orange: 'from-orange-500 to-orange-600',
  red: 'from-red-500 to-red-600',
  purple: 'from-purple-500 to-purple-600',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  color = 'blue',
}) => {
  const getColor = () => {
    if (progress < 33) return colorClasses.red;
    if (progress < 66) return colorClasses.orange;
    return colorClasses.green;
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-slate-700">{label}</span>
          <span className="text-sm font-bold text-slate-900">{progress}%</span>
        </div>
      )}
      <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden shadow-inner">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${getColor()} shadow-lg transition-all duration-500 ease-out`}
          style={{ width: `${progress}%` }}
        >
          <div className="h-full bg-white/20 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};
