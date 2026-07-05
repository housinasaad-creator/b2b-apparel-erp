import React, { useState } from 'react';
import { Sidebar, AlertPanel } from './components';
import { Dashboard, EnhancedOEE, Manufacturing, EnhancedInventory, Settings, Login, UserManagement, Reports } from './pages';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Notification } from './types';
import { initialAlerts } from './data';
import './App.css';

type PageType = 'dashboard' | 'oee' | 'manufacturing' | 'inventory' | 'settings' | 'users' | 'reports';

function AppContent() {
  const { isLoggedIn, user } = useAuth();
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
          <div className="sticky top-0 z-40 bg-gradient-to-r from-amber-600 via-yellow-500 to-orange-600 text-white px-8 py-4 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-4">
              <img src="/sewing-machine-logo.png" alt="شركة النسيج الذهبي" className="w-8 h-8" />
              <div>
                <p className="text-xs opacity-90">مرحباً بك في</p>
                <p className="font-bold text-lg">شركة النسيج الذهبي</p>
              </div>
              <div className="border-l border-white/30 pl-4">
                <p className="text-sm">{user?.name}</p>
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full inline-block">
                  {user?.role === 'admin'
                    ? '👨‍💼 مدير الأحلام'
                    : user?.role === 'manager'
                    ? '📊 مشرف الإنتاج'
                    : '👷 موظف العمليات'}
                </span>
              </div>
            </div>

            {/* Alerts Panel */}
            <div className="flex items-center gap-4">
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
                className="text-xs px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all font-bold"
              >
                🚪 خروج
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
