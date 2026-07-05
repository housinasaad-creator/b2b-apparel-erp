import React from 'react';
import { Bell, User, Settings } from 'lucide-react';

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="flex items-center justify-between px-8 py-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
          <p className="text-sm text-slate-500 mt-1">
            آخر تحديث: {new Date().toLocaleDateString('ar-SA')}
          </p>
        </div>

        <div className="flex items-center gap-6">
          {/* Notifications */}
          <button className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200 transform hover:scale-110">
            <Bell size={24} />
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
          </button>

          {/* User Settings */}
          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200 transform hover:scale-110">
              <Settings size={24} />
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:scale-110">
              <User size={20} className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
