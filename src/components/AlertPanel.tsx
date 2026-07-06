import React, { useState } from 'react';
import { AlertCircle, X, Check } from 'lucide-react';
import { Notification } from '../types';
import { useI18n } from '../i18n';

interface AlertPanelProps {
  alerts: Notification[];
  onMarkAsRead?: (alertId: string) => void;
  onDismiss?: (alertId: string) => void;
}

export const AlertPanel: React.FC<AlertPanelProps> = ({ alerts, onMarkAsRead, onDismiss }) => {
  const { t, td } = useI18n();
  const unreadCount = alerts.filter((a) => !a.read).length;
  const [isOpen, setIsOpen] = useState(false);

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'bg-red-50 border-l-4 border-red-600 text-red-800';
      case 'warning':
        return 'bg-orange-50 border-l-4 border-orange-600 text-orange-800';
      case 'success':
        return 'bg-green-50 border-l-4 border-green-600 text-green-800';
      case 'info':
        return 'bg-blue-50 border-l-4 border-blue-600 text-blue-800';
      default:
        return 'bg-slate-50 border-l-4 border-slate-600 text-slate-800';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return '🔴';
      case 'warning':
        return '⚠️';
      case 'success':
        return '✅';
      case 'info':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffMs = now.getTime() - alertTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return t('justNow');
    if (diffMins < 60) return t('minAgo', { n: diffMins });

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return t('hourAgo', { n: diffHours });

    const diffDays = Math.floor(diffHours / 24);
    return t('dayAgo', { n: diffDays });
  };

  return (
    <div className="relative">
      {/* Alert Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white hover:bg-white/20 rounded-lg transition-all"
        title={t('alertsTitle')}
      >
        <AlertCircle size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Alerts Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 max-w-[90vw] bg-white rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2">
              <AlertCircle size={20} />
              {t('alertsTitle')}
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-lg transition-all"
            >
              <X size={20} />
            </button>
          </div>

          {/* Alerts List */}
          {alerts.length === 0 ? (
            <div className="p-8 text-center text-slate-600">
              <p className="text-lg">✨ {t('noAlerts')}</p>
              <p className="text-sm mt-2">{t('allNormal')}</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 transition-all ${getAlertColor(alert.type)} ${
                    alert.read ? 'opacity-75' : ''
                  }`}
                >
                  {/* Alert Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getAlertIcon(alert.type)}</span>
                      <div>
                        <p className="font-bold text-sm">{td(alert.title)}</p>
                        <p className="text-xs opacity-75">{getTimeAgo(alert.timestamp)}</p>
                      </div>
                    </div>
                    {!alert.read && (
                      <div className="w-2 h-2 bg-red-600 rounded-full mt-1"></div>
                    )}
                  </div>

                  {/* Alert Message */}
                  <p className="text-sm mb-3 ml-8">{td(alert.message)}</p>

                  {/* Alert Actions */}
                  <div className="flex gap-2 ml-8">
                    {!alert.read && onMarkAsRead && (
                      <button
                        onClick={() => onMarkAsRead(alert.id)}
                        className="flex items-center gap-1 text-xs px-2 py-1 bg-white/50 hover:bg-white rounded transition-all"
                      >
                        <Check size={14} />
                        {t('readBtn')}
                      </button>
                    )}
                    {onDismiss && (
                      <button
                        onClick={() => onDismiss(alert.id)}
                        className="flex items-center gap-1 text-xs px-2 py-1 bg-white/50 hover:bg-white rounded transition-all"
                      >
                        <X size={14} />
                        {t('closeBtn')}
                      </button>
                    )}
                    {alert.actionUrl && (
                      <a
                        href={alert.actionUrl}
                        className="flex items-center gap-1 text-xs px-2 py-1 bg-white/50 hover:bg-white rounded transition-all"
                      >
                        {t('viewBtn')} →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          {alerts.length > 0 && (
            <div className="sticky bottom-0 bg-slate-100 p-3 text-center text-xs text-slate-600 border-t">
              {unreadCount > 0 ? (
                <p>{unreadCount} {t('unreadSuffix')}</p>
              ) : (
                <p>✓ {t('allRead')}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
