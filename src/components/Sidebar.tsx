import React, { useState } from 'react';
import { Menu, X, BarChart3, Package, Zap, Boxes, Settings, Users, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../i18n';

interface NavItem {
  key: string;
  icon: React.ReactNode;
  id: string;
  adminOnly?: boolean;
}

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const navItems: NavItem[] = [
  { key: 'navDashboard', icon: <BarChart3 size={20} />, id: 'dashboard' },
  { key: 'navMachines', icon: <Zap size={20} />, id: 'oee' },
  { key: 'navProduction', icon: <Package size={20} />, id: 'manufacturing' },
  { key: 'navInventory', icon: <Boxes size={20} />, id: 'inventory' },
  { key: 'navSettings', icon: <Settings size={20} />, id: 'settings' },
  { key: 'navUsers', icon: <Users size={20} />, id: 'users', adminOnly: true },
  { key: 'navReports', icon: <FileText size={20} />, id: 'reports', adminOnly: true },
];

export const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate }) => {
  const { user } = useAuth();
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );

  const visibleItems = navItems.filter(item => !item.adminOnly || user?.role === 'admin');

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-3 left-3 z-50 p-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Container */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white shadow-2xl transition-all duration-300 z-40 flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-amber-500/30 bg-gradient-to-r from-amber-600/10 to-yellow-600/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
              <img
                src={`${process.env.PUBLIC_URL}/sewing-machine-white.png`}
                alt={t('company')}
                className="w-9 h-9 object-contain"
              />
            </div>
            <div>
              <h1 className="text-lg font-bold">{t('company')}</h1>
              <p className="text-xs text-slate-400">🧵 {t('sidebarSub')}</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {visibleItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                if (window.innerWidth < 1024) setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                activePage === item.id
                  ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{t(item.key)}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-amber-500/30 text-sm text-slate-400">
          <p>© 2024 {t('company')}</p>
          <p>{t('version')} 2.1 ✨</p>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
