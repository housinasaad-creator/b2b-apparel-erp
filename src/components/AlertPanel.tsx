import React, { useState } from 'react';
import { AlertCircle, X, Check } from 'lucide-react';
import { Notification } from '../types';

interface AlertPanelProps {
  alerts: Notification[];
  onMarkAsRead?: (alertId: string) => void;
  onDismiss?: (alertId: string) => void;
}

export const AlertPanel: React.FC<AlertPanelProps> = ({ alerts, onMarkAsRead, onDismiss }) => {
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

    if (diffMins < 1) return 'للتو';
    if (diffMins < 60) return `قبل ${diffMins} دقيقة`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `قبل ${diffHours} ساعة`;

    const diffDays = Math.floor(diffHours / 24);
    return `قبل ${diffDays} يوم`;
  };

  return (
    <div className="relative">
      {/* Alert Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-all"
        title="التنبيهات والإشعارات"
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
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2">
              <AlertCircle size={20} />
              التنبيهات والإشعارات
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
              <p className="text-lg">✨ لا توجد تنبيهات</p>
              <p className="text-sm mt-2">كل شيء يعمل بشكل طبيعي</p>
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
                        <p className="font-bold text-sm">{alert.title}</p>
                        <p className="text-xs opacity-75">{getTimeAgo(alert.timestamp)}</p>
                      </div>
                    </div>
                    {!alert.read && (
                      <div className="w-2 h-2 bg-red-600 rounded-full mt-1"></div>
                    )}
                  </div>

                  {/* Alert Message */}
                  <p className="text-sm mb-3 ml-8">{alert.message}</p>

                  {/* Alert Actions */}
                  <div className="flex gap-2 ml-8">
                    {!alert.read && onMarkAsRead && (
                      <button
                        onClick={() => onMarkAsRead(alert.id)}
                        className="flex items-center gap-1 text-xs px-2 py-1 bg-white/50 hover:bg-white rounded transition-all"
                      >
                        <Check size={14} />
                        قراءة
                      </button>
                    )}
                    {onDismiss && (
                      <button
                        onClick={() => onDismiss(alert.id)}
                        className="flex items-center gap-1 text-xs px-2 py-1 bg-white/50 hover:bg-white rounded transition-all"
                      >
                        <X size={14} />
                        إغلاق
                      </button>
                    )}
                    {alert.actionUrl && (
                      <a
                        href={alert.actionUrl}
                        className="flex items-center gap-1 text-xs px-2 py-1 bg-white/50 hover:bg-white rounded transition-all"
                      >
                        عرض →
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
                <p>{unreadCount} تنبيهات غير مقروءة</p>
              ) : (
                <p>✓ تمت قراءة جميع التنبيهات</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
