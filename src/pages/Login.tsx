import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showCredentials, setShowCredentials] = useState(false);
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('الرجاء إدخال اسم المستخدم وكلمة المرور');
      return;
    }

    const success = login(username, password);
    if (success) {
      onLoginSuccess();
    } else {
      setError('بيانات الدخول غير صحيحة');
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
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full mb-4 shadow-2xl border-4 border-amber-400/30">
            <img
              src={`${process.env.PUBLIC_URL}/sewing-machine-white.png`}
              alt="شركة النسيج الذهبي"
              className="w-16 h-16 object-contain"
            />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">شركة النسيج الذهبي</h1>
          <p className="text-amber-200 text-lg">🧵 نظام إدارة الإنتاج المتقدم</p>
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
                اسم المستخدم
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="مثل: admin أو manager أو staff"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                كلمة المرور
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="كلمة المرور: 0000"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-bold rounded-lg hover:shadow-lg transition-all active:scale-95"
            >
              ✨ دخول النظام
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-600">دخول سريع</span>
            </div>
          </div>

          {/* Quick Login Options */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin', '0000')}
              className="w-full py-2 px-4 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-all font-bold text-sm"
            >
              👨‍💼 المدير العام (Admin)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('manager', '0000')}
              className="w-full py-2 px-4 bg-green-50 text-green-600 border border-green-200 rounded-lg hover:bg-green-100 transition-all font-bold text-sm"
            >
              📊 مشرف الإنتاج (Manager)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('staff', '0000')}
              className="w-full py-2 px-4 bg-orange-50 text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-100 transition-all font-bold text-sm"
            >
              👷 موظف العمليات (Staff)
            </button>
          </div>

          {/* Show/Hide Credentials */}
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setShowCredentials(!showCredentials)}
              className="text-xs text-slate-600 hover:text-slate-900 underline"
            >
              {showCredentials ? '▼ إخفاء بيانات الدخول' : '▶ عرض جميع بيانات الدخول'}
            </button>
            {showCredentials && (
              <div className="mt-3 p-4 bg-slate-50 rounded-lg text-xs space-y-2 text-slate-700">
                <div>
                  <strong>👨‍💼 المدير العام:</strong>
                  <br />
                  اسم المستخدم: admin
                  <br />
                  كلمة المرور: 0000
                  <br />
                  الصلاحيات: جميع الميزات
                </div>
                <div className="border-t pt-2">
                  <strong>📊 مشرف الإنتاج:</strong>
                  <br />
                  اسم المستخدم: manager
                  <br />
                  كلمة المرور: 0000
                  <br />
                  الصلاحيات: إدارة متقدمة + الأسعار
                </div>
                <div className="border-t pt-2">
                  <strong>👷 موظف العمليات:</strong>
                  <br />
                  اسم المستخدم: staff
                  <br />
                  كلمة المرور: 0000
                  <br />
                  الصلاحيات: عرض فقط (بدون أسعار)
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-amber-200 text-sm">
          <p>✨ شركة النسيج الذهبي</p>
          <p>🧵 نظام إدارة محترف وآمن</p>
        </div>
      </div>
    </div>
  );
};
