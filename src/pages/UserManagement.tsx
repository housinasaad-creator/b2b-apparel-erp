import React, { useState } from 'react';
import { Header, Modal } from '../components';
import { User } from '../types';
import { Plus, Edit2, Trash2 } from 'lucide-react';

interface UserFormData {
  name: string;
  username: string;
  password: string;
  role: 'admin' | 'manager' | 'staff';
  machineNumber?: string;
  department: string;
}

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'المدير العام',
      email: 'admin',
      password: '0000',
      role: 'admin',
      department: 'الإدارة العليا',
      createdAt: '2024-01-01',
    },
    {
      id: '2',
      name: 'مشرف الإنتاج',
      email: 'manager',
      password: '0000',
      role: 'manager',
      department: 'الإنتاج',
      createdAt: '2024-02-01',
    },
    {
      id: '3',
      name: 'موظف العمليات',
      email: 'staff',
      password: '0000',
      role: 'staff',
      department: 'العمليات',
      createdAt: '2024-03-01',
    },
  ]);

  const [showAddUser, setShowAddUser] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    username: '',
    password: '',
    role: 'staff',
    machineNumber: '',
    department: '',
  });
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddUser = () => {
    if (!formData.name || !formData.username || !formData.password) {
      alert('الرجاء ملء جميع الحقول المطلوبة');
      return;
    }

    if (formData.role === 'staff' && !formData.machineNumber) {
      alert('الرجاء تحديد رقم الماكينة للموظف');
      return;
    }

    const newUser: User = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.username,
      password: formData.password,
      role: formData.role,
      department: formData.machineNumber ? `ماكينة ${formData.machineNumber}` : formData.department,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setUsers([...users, newUser]);
    setFormData({
      name: '',
      username: '',
      password: '',
      role: 'staff',
      machineNumber: '',
      department: '',
    });
    setShowAddUser(false);
    alert('تم إنشاء المستخدم بنجاح!');
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      setUsers(users.filter((u) => u.id !== userId));
      alert('تم حذف المستخدم!');
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.includes(searchTerm) || u.email.includes(searchTerm) || u.department.includes(searchTerm)
  );

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return '👨‍💼';
      case 'manager':
        return '📊';
      case 'staff':
        return '👷';
      default:
        return '👤';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'المدير العام';
      case 'manager':
        return 'مشرف الإنتاج';
      case 'staff':
        return 'موظف العمليات';
      default:
        return 'مستخدم';
    }
  };

  return (
    <div className="space-y-8">
      <Header title="⚙️ إدارة المستخدمين والمفاتيح" />

      <div className="px-8 py-6 space-y-6">
        {/* Search Bar */}
        <div className="flex gap-4 items-center justify-between">
          <input
            type="text"
            placeholder="ابحث عن مستخدم..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <button
            onClick={() => setShowAddUser(true)}
            className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-bold flex items-center gap-2"
          >
            <Plus size={20} />
            إضافة مستخدم جديد
          </button>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-pink-600 hover:shadow-xl transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{getRoleIcon(user.role)}</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900">{user.name}</h3>
                    <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full inline-block mt-1">
                      {getRoleLabel(user.role)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2 mb-4 bg-slate-50 rounded-lg p-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">اسم المستخدم:</span>
                  <span className="font-bold text-slate-900">{user.email}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">كلمة المرور:</span>
                  <span className="font-bold text-slate-900">••••••</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">القسم/الماكينة:</span>
                  <span className="font-bold text-slate-900">{user.department}</span>
                </div>
                <div className="flex justify-between text-sm border-t pt-2">
                  <span className="text-slate-600">تاريخ الإنشاء:</span>
                  <span className="font-bold text-slate-900">{user.createdAt}</span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mb-4">
                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full inline-block">
                  ✓ نشط
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => alert('قريباً: تعديل المستخدم')}
                  className="flex-1 py-2 px-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all font-bold text-sm flex items-center justify-center gap-2"
                >
                  <Edit2 size={16} />
                  تعديل
                </button>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="flex-1 py-2 px-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all font-bold text-sm flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} />
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-8 border-t-2 border-slate-200">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6">
            <p className="text-sm opacity-90 mb-2">إجمالي المستخدمين</p>
            <p className="text-4xl font-bold">{users.length}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6">
            <p className="text-sm opacity-90 mb-2">عدد الموظفين</p>
            <p className="text-4xl font-bold">{users.filter((u) => u.role === 'staff').length}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6">
            <p className="text-sm opacity-90 mb-2">المشرفون</p>
            <p className="text-4xl font-bold">{users.filter((u) => u.role === 'manager').length}</p>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <Modal
          isOpen={showAddUser}
          onClose={() => setShowAddUser(false)}
          title="إنشاء مستخدم جديد"
        >
          <div className="space-y-4">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                الاسم الكامل *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="مثل: أحمد محمد"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            {/* Username Input */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                اسم المستخدم *
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="مثل: ahmed123"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                كلمة المرور *
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="0000 أو كلمة قوية"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                الدور *
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.value as 'admin' | 'manager' | 'staff',
                  })
                }
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="staff">👷 موظف العمليات</option>
                <option value="manager">📊 مشرف الإنتاج</option>
                <option value="admin">👨‍💼 المدير العام</option>
              </select>
            </div>

            {/* Machine Number - Show only for Staff */}
            {formData.role === 'staff' && (
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  رقم الماكينة * (للموظفين فقط)
                </label>
                <input
                  type="number"
                  value={formData.machineNumber || ''}
                  onChange={(e) => setFormData({ ...formData, machineNumber: e.target.value })}
                  placeholder="مثل: 1 أو 2 أو 3"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
            )}

            {/* Department - Show for non-staff roles */}
            {formData.role !== 'staff' && (
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  القسم
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="مثل: الإنتاج، الجودة، إلخ"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleAddUser}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 rounded-lg hover:shadow-lg transition-all font-bold"
              >
                ✅ إنشاء المستخدم
              </button>
              <button
                onClick={() => setShowAddUser(false)}
                className="flex-1 bg-slate-200 text-slate-900 py-2 rounded-lg hover:bg-slate-300 transition-all font-bold"
              >
                ❌ إلغاء
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
