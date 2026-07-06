import React, { useState } from 'react';
import { Sidebar, AlertPanel } from './components';
import { Dashboard, EnhancedOEE, Manufacturing, EnhancedInventory, Settings, Login, UserManagement, Reports } from './pages';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Notification } from './types';
import { initialAlerts } from './data';
import { useI18n, LanguageSwitcher } from './i18n';
import './App.css';

type PageType = 'dashboard' | 'oee' | 'manufacturing' | 'inventory' | 'settings' | 'users' | 'reports';

function AppContent() {
  const { isLoggedIn, user } = useAuth();
  const { t, td } = useI18n();
  const [activePage, setActivePage] = useState<PageType>('dashboard');
  const [alerts, setAlerts] = useState<Notification[]>(initialAlerts);

  const handleMarkAsRead = (alertId: string) => {
    setAlerts(alerts.map((a) => (a.id === alertId ? { ...a, read: true } : a)));
  };

  const handleDismissAlert = (alertId: string) => {
    setAlerts(alerts.filter((a) => a.id !== alertId));
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'oee':
        return <EnhancedOEE />;
      case 'manufacturing':
        return <Manufacturing />;
      case 'inventory':
        return <EnhancedInventory />;
      case 'settings':
        return <Settings />;
      case 'users':
        return user?.role === 'admin' ? <UserManagement /> : <Dashboard />;
      case 'reports':
        return user?.role === 'admin' ? <Reports /> : <Dashboard />;
      default:
        return <Dashboard />;
    }
  };

  if (!isLoggedIn) {
    return <Login onLoginSuccess={() => {}} />;
  }

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar */}
      <Sidebar activePage={activePage} onNavigate={(page) => setActivePage(page as PageType)} />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 overflow-y-auto">
        <div className="min-h-screen pb-12">
          {/* Top Bar with User Info & Alerts */}
          <div className="sticky top-0 z-40 bg-gradient-to-r from-amber-600 via-yellow-500 to-orange-600 text-white px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-2 shadow-lg pl-16 lg:pl-8">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <img
                  src={`${process.env.PUBLIC_URL}/sewing-machine-white.png`}
                  alt={t('company')}
                  className="w-7 h-7 object-contain"
                />
              </div>
              <div className="hidden sm:block min-w-0">
                <p className="text-xs opacity-90">{t('welcomeTo')}</p>
                <p className="font-bold text-base sm:text-lg truncate">{t('company')}</p>
              </div>
              <div className="border-r border-white/30 pr-3 min-w-0">
                <p className="text-sm truncate">{td(user?.name || '')}</p>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full inline-block whitespace-nowrap">
                  {user?.role === 'admin'
                    ? `👨‍💼 ${t('roleAdmin')}`
                    : user?.role === 'manager'
                    ? `📊 ${t('roleManager')}`
                    : `👷 ${t('roleStaff')}`}
                </span>
              </div>
            </div>

            {/* Alerts Panel */}
            <div className="flex items-center gap-2 sm:gap-3">
              <LanguageSwitcher />
              <AlertPanel
                alerts={alerts}
                onMarkAsRead={handleMarkAsRead}
                onDismiss={handleDismissAlert}
              />
              <button
                onClick={() => {
                  setActivePage('dashboard');
                  window.location.href = '/';
                }}
                className="text-xs px-3 sm:px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all font-bold whitespace-nowrap"
              >
                🚪 {t('logout')}
              </button>
            </div>
          </div>

          {/* Page Content */}
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
