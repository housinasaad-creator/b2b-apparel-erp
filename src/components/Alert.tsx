import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

interface AlertProps {
  type: 'error' | 'success' | 'warning' | 'info';
  title: string;
  message: string;
  onClose?: () => void;
}

const typeConfig = {
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: <AlertCircle className="text-red-600" size={20} />,
    title: 'text-red-900',
    text: 'text-red-700',
  },
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: <CheckCircle className="text-green-600" size={20} />,
    title: 'text-green-900',
    text: 'text-green-700',
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    icon: <AlertTriangle className="text-yellow-600" size={20} />,
    title: 'text-yellow-900',
    text: 'text-yellow-700',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: <Info className="text-blue-600" size={20} />,
    title: 'text-blue-900',
    text: 'text-blue-700',
  },
};

export const Alert: React.FC<AlertProps> = ({ type, title, message, onClose }) => {
  const config = typeConfig[type];

  return (
    <div
      className={`${config.bg} ${config.border} border rounded-lg p-4 flex gap-3 items-start animate-slideIn`}
    >
      <div className="flex-shrink-0">{config.icon}</div>
      <div className="flex-1">
        <h3 className={`font-bold ${config.title}`}>{title}</h3>
        <p className={`text-sm mt-1 ${config.text}`}>{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={`flex-shrink-0 ${config.text} hover:opacity-70 transition-opacity`}
        >
          ×
        </button>
      )}
    </div>
  );
};
