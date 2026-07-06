import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useI18n } from '../i18n';

interface StatsCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: string;
  color: string;
  trend?: number;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  unit,
  icon,
  color,
  trend,
}) => {
  const { t } = useI18n();
  return (
    <div
      className={`bg-gradient-to-br ${color} rounded-xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 cursor-pointer group`}
    >
      {/* Icon */}
      <div className="text-4xl mb-4 transform transition-transform group-hover:scale-125">
        {icon}
      </div>

      {/* Title */}
      <p className="text-sm font-medium opacity-90 mb-2">{title}</p>

      {/* Value */}
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-3xl font-bold">{value}</span>
        {unit && <span className="text-sm opacity-75">{unit}</span>}
      </div>

      {/* Trend */}
      {trend !== undefined && (
        <div className="flex items-center gap-1 text-sm">
          {trend > 0 ? (
            <>
              <TrendingUp size={16} />
              <span className="font-semibold">{trend}% {t('growth')}</span>
            </>
          ) : (
            <>
              <TrendingDown size={16} />
              <span className="font-semibold">{Math.abs(trend)}% {t('decline')}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};
