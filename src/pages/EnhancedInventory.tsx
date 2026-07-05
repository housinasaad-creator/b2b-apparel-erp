import React, { useState } from 'react';
import { Header, Modal, ProgressBar, AddStockForm } from '../components';
import { inventoryItems as initialInventory } from '../data';
import { InventoryItem } from '../types';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const EnhancedInventory: React.FC = () => {
  const { hasPermission } = useAuth();
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [showAddStock, setShowAddStock] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('الأقمشة');
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const canViewPrices = hasPermission('view_prices');
  const canEdit = hasPermission('edit');

  // تجميع المواد حسب الفئة
  const categorizedInventory = inventory.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    },
    {} as { [key: string]: InventoryItem[] }
  );

  const categories = Object.keys(categorizedInventory).sort();
  const currentCategoryItems = categorizedInventory[selectedCategory] || [];

  // إضافة مادة جديدة
  const handleAddStock = (newItem: InventoryItem) => {
    setInventory([...inventory, newItem]);
    setShowAddStock(false);
  };

  // تعديل مادة
  const handleUpdateItem = (updatedItem: InventoryItem) => {
    setInventory(
      inventory.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
    setEditingItem(null);
    setShowEditModal(false);
  };

  // حذف مادة
  const handleDeleteItem = (itemId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه المادة؟')) {
      setInventory(inventory.filter((item) => item.id !== itemId));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Normal':
        return 'bg-green-100 text-green-700';
      case 'Low':
        return 'bg-orange-100 text-orange-700';
      case 'Critical':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-8">
      <Header title="إدارة المخازن الذكية" />

      <div className="px-8 py-6 space-y-6">
        {/* Top Action Bar */}
        <div className="flex gap-4 items-center justify-between">
          <input
            type="text"
            placeholder="ابحث عن المواد..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          {canEdit && (
            <button
              onClick={() => setShowAddStock(true)}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-bold flex items-center gap-2"
            >
              <Plus size={20} />
              إضافة مادة
            </button>
          )}
        </div>

        {/* Categories Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 border-b-2 border-slate-200">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 font-bold whitespace-nowrap rounded-t-lg transition-all ${
                selectedCategory === category
                  ? 'bg-indigo-600 text-white border-b-4 border-indigo-700'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {category}
              <span className="ml-2 text-sm opacity-75">
                ({categorizedInventory[category].length})
              </span>
            </button>
          ))}
        </div>

        {/* Current Category Items */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-slate-900">
            📦 {selectedCategory}
          </h3>

          {currentCategoryItems.length === 0 ? (
            <div className="bg-slate-50 rounded-lg p-8 text-center">
              <p className="text-slate-600 mb-4">لا توجد مواد في هذه الفئة</p>
              <button
                onClick={() => setShowAddStock(true)}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-bold"
              >
                إضافة مادة الآن
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentCategoryItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-600 hover:shadow-xl transition-all"
                >
                  {/* Header with Name and Status */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 text-lg mb-2">
                        {item.name}
                      </h4>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {item.status === 'Normal'
                          ? '✓ طبيعي'
                          : item.status === 'Low'
                          ? '⚠ منخفض'
                          : '🔴 حرج'}
                      </span>
                    </div>

                    {/* Action Buttons - فقط للمديرين والمشرفين */}
                    {canEdit && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingItem(item);
                            setShowEditModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
                          title="تعديل"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all"
                          title="حذف"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Quantity Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm text-slate-600">الكمية المتاحة</p>
                      <p className="text-lg font-bold text-indigo-600">
                        {item.quantity} {item.unit}
                      </p>
                    </div>
                    <ProgressBar
                      progress={Math.min(
                        100,
                        (item.quantity / item.reorderPoint) * 100
                      )}
                    />
                  </div>

                  {/* Stock Levels */}
                  <div className="space-y-2 mb-4 bg-slate-50 rounded-lg p-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">الحد الأدنى:</span>
                      <span className="font-bold text-slate-900">
                        {item.minStock} {item.unit}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">إعادة الطلب:</span>
                      <span className="font-bold text-slate-900">
                        {item.reorderPoint} {item.unit}
                      </span>
                    </div>
                    {canViewPrices && (
                      <div className="flex justify-between text-sm border-t pt-2">
                        <span className="text-slate-600">السعر:</span>
                        <span className="font-bold text-green-600">${item.unitCost}</span>
                      </div>
                    )}
                  </div>

                  {/* Total Value - فقط للمديرين والمشرفين */}
                  {canViewPrices && (
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3 border-l-4 border-indigo-600">
                      <p className="text-xs text-slate-600 mb-1">إجمالي القيمة</p>
                      <p className="text-2xl font-bold text-indigo-600">
                        ${(item.quantity * item.unitCost).toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Statistics - فقط للمديرين والمشرفين */}
        {hasPermission('view_reports') && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-8 border-t-2 border-slate-200">
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6">
              <p className="text-sm opacity-90 mb-2">المواد الطبيعية</p>
              <p className="text-4xl font-bold">
                {inventory.filter((i) => i.status === 'Normal').length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-6">
              <p className="text-sm opacity-90 mb-2">المواد المنخفضة</p>
              <p className="text-4xl font-bold">
                {inventory.filter((i) => i.status === 'Low').length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl p-6">
              <p className="text-sm opacity-90 mb-2">المواد الحرجة</p>
              <p className="text-4xl font-bold">
                {inventory.filter((i) => i.status === 'Critical').length}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Add Stock Modal */}
      <AddStockForm
        isOpen={showAddStock}
        onClose={() => setShowAddStock(false)}
        onSubmit={handleAddStock}
      />

      {/* Edit Item Modal */}
      {editingItem && (
        <Modal
          isOpen={showEditModal}
          onClose={() => {
            setEditingItem(null);
            setShowEditModal(false);
          }}
          title={`تعديل: ${editingItem.name}`}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                الكمية الحالية
              </label>
              <input
                type="number"
                defaultValue={editingItem.quantity}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    quantity: parseFloat(e.target.value),
                  })
                }
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  الحد الأدنى
                </label>
                <input
                  type="number"
                  defaultValue={editingItem.minStock}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      minStock: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  إعادة الطلب
                </label>
                <input
                  type="number"
                  defaultValue={editingItem.reorderPoint}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      reorderPoint: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                سعر الوحدة
              </label>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-slate-600">$</span>
                <input
                  type="number"
                  step="0.01"
                  defaultValue={editingItem.unitCost}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      unitCost: parseFloat(e.target.value),
                    })
                  }
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => handleUpdateItem(editingItem)}
                className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-all font-bold"
              >
                ✅ حفظ التعديلات
              </button>
              <button
                onClick={() => {
                  setEditingItem(null);
                  setShowEditModal(false);
                }}
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
