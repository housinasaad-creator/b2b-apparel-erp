import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle } from 'lucide-react';
import { useI18n, LanguageSwitcher } from '../i18n';

interface LoginProps {
  onLoginSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showCredentials, setShowCredentials] = useState(false);
  const { login } = useAuth();
  const { t } = useI18n();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError(t('errEmpty'));
      return;
    }

    const success = login(username, password);
    if (success) {
      onLoginSuccess();
    } else {
      setError(t('errInvalid'));
      setPassword('');
    }
  };

  const handleQuickLogin = (quickUsername: string, quickPassword: string) => {
    setUsername(quickUsername);
    setPassword(quickPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Language Switcher */}
        <div className="flex justify-center mb-6">
          <LanguageSwitcher />
        </div>

        {/* Logo & Title */}
        <div className="text-center mb-8">
          <img
            src={`${process.env.PUBLIC_URL}/weave-badge.png`}
            alt={t('company')}
            className="inline-block w-24 h-24 object-contain mb-4 rounded-3xl shadow-2xl"
          />
          <h1 className="text-4xl font-bold text-white mb-2">{t('company')}</h1>
          <p className="text-amber-200 text-lg">🧵 {t('loginSubtitle')}</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="text-red-600" size={20} />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Username Input */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                {t('username')}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t('usernamePlaceholder')}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                {t('password')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('passwordPlaceholder')}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-bold rounded-lg hover:shadow-lg transition-all active:scale-95"
            >
              ✨ {t('loginBtn')}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-600">{t('quickLogin')}</span>
            </div>
          </div>

          {/* Quick Login Options */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin', '0000')}
              className="w-full py-2 px-4 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-all font-bold text-sm"
            >
              👨‍💼 {t('roleAdmin')} (Admin)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('manager', '0000')}
              className="w-full py-2 px-4 bg-green-50 text-green-600 border border-green-200 rounded-lg hover:bg-green-100 transition-all font-bold text-sm"
            >
              📊 {t('roleManager')} (Manager)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('staff', '0000')}
              className="w-full py-2 px-4 bg-orange-50 text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-100 transition-all font-bold text-sm"
            >
              👷 {t('roleStaff')} (Staff)
            </button>
          </div>

          {/* Show/Hide Credentials */}
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setShowCredentials(!showCredentials)}
              className="text-xs text-slate-600 hover:text-slate-900 underline"
            >
              {showCredentials ? `▼ ${t('hideCreds')}` : `▶ ${t('showCreds')}`}
            </button>
            {showCredentials && (
              <div className="mt-3 p-4 bg-slate-50 rounded-lg text-xs space-y-2 text-slate-700">
                <div>
                  <strong>👨‍💼 {t('roleAdmin')}:</strong>
                  <br />
                  {t('username')}: admin
                  <br />
                  {t('password')}: 0000
                  <br />
                  {t('permAll')}
                </div>
                <div className="border-t pt-2">
                  <strong>📊 {t('roleManager')}:</strong>
                  <br />
                  {t('username')}: manager
                  <br />
                  {t('password')}: 0000
                  <br />
                  {t('permAdvanced')}
                </div>
                <div className="border-t pt-2">
                  <strong>👷 {t('roleStaff')}:</strong>
                  <br />
                  {t('username')}: staff
                  <br />
                  {t('password')}: 0000
                  <br />
                  {t('permViewOnly')}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-amber-200 text-sm">
          <p>✨ {t('company')}</p>
          <p>🧵 {t('loginFooter')}</p>
        </div>
      </div>
    </div>
  );
};
