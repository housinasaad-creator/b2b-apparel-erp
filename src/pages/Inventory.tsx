import React, { useState } from 'react';
import { Header, Alert, Modal, ProgressBar, AddStockForm } from '../components';
import { inventoryItems as initialInventory, purchaseOrders } from '../data';
import { InventoryItem } from '../types';
import { ShoppingCart, Plus } from 'lucide-react';

export const Inventory: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showAddStock, setShowAddStock] = useState(false);
  const [purchaseOrderList, setPurchaseOrderList] = useState(purchaseOrders);
  const [searchTerm, setSearchTerm] = useState('');

  const criticalItems = inventory.filter((item) => item.status === 'Critical');
  const lowItems = inventory.filter((item) => item.status === 'Low');

  const handleAddStock = (newItem: InventoryItem) => {
    setInventory([...inventory, newItem]);
    setShowAddStock(false);
  };

  const handleCreatePurchaseOrder = (item: InventoryItem) => {
    const newPO = {
      id: `PO-2024-INV-${Math.random().toString(36).substr(2, 9)}`,
      itemId: item.id,
      itemName: item.name,
      quantity: Math.max(0, item.reorderPoint - item.quantity) * 2,
      unit: item.unit,
      supplier: 'قيد التحديث',
      estimatedCost: (Math.max(0, item.reorderPoint - item.quantity) * 2) * item.unitCost,
      status: 'Draft' as const,
      createdDate: new Date().toISOString().split('T')[0],
    };
    setPurchaseOrderList([...purchaseOrderList, newPO]);
  };

  const filteredItems = inventory.filter((item) =>
    item.name.includes(searchTerm) || item.category.includes(searchTerm)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Normal':
        return 'text-green-600 bg-green-50';
      case 'Low':
        return 'text-orange-600 bg-orange-50';
      case 'Critical':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-slate-600 bg-slate-50';
    }
  };

  return (
    <div className="space-y-8">
      <Header title="إدارة المخازن الذكية" />

      <div className="px-8 py-6 space-y-8">
        {/* Critical Stock Alert */}
        {criticalItems.length > 0 && (
          <Alert
            type="error"
            title="تنبيه حرج"
            message={`هناك ${criticalItems.length} مادة في حالة حرجة وتحتاج لإعادة طلب فوري!`}
          />
        )}

        {lowItems.length > 0 && (
          <Alert
            type="warning"
            title="تحذير مخزون منخفض"
            message={`هناك ${lowItems.length} مادة بكمية منخفضة، يفضل إعادة طلب قريباً.`}
          />
        )}

        {/* Search and Filter */}
        <div className="bg-white rounded-xl p-4 shadow-lg flex gap-4">
          <input
            type="text"
            placeholder="ابحث عن المواد..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={() => setShowAddStock(true)}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 transform hover:scale-105 font-bold flex items-center gap-2">
            <Plus size={20} />
            إضافة مادة جديدة
          </button>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
                <tr>
                  <th className="px-6 py-4 text-right text-sm font-bold">المادة</th>
                  <th className="px-6 py-4 text-right text-sm font-bold">الفئة</th>
                  <th className="px-6 py-4 text-right text-sm font-bold">الكمية الحالية</th>
                  <th className="px-6 py-4 text-right text-sm font-bold">الحد الأدنى</th>
                  <th className="px-6 py-4 text-right text-sm font-bold">التوفر</th>
                  <th className="px-6 py-4 text-right text-sm font-bold">الحالة</th>
                  <th className="px-6 py-4 text-right text-sm font-bold">السعر الوحدة</th>
                  <th className="px-6 py-4 text-center text-sm font-bold">الإجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 transition-all duration-200 cursor-pointer"
                    onClick={() => setSelectedItem(item)}
                  >
                    <td className="px-6 py-4 font-semibold text-slate-900">{item.name}</td>
                    <td className="px-6 py-4 text-slate-600">{item.category}</td>
                    <td className="px-6 py-4 font-bold text-indigo-600">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {item.minStock} {item.unit}
                    </td>
                    <td className="px-6 py-4">
                      <ProgressBar
                        progress={Math.min(100, (item.quantity / item.reorderPoint) * 100)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {item.status === 'Normal'
                          ? '✓ طبيعي'
                          : item.status === 'Low'
                          ? '⚠ منخفض'
                          : '🔴 حرج'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-green-600">${item.unitCost}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (item.status !== 'Normal') {
                            handleCreatePurchaseOrder(item);
                          }
                        }}
                        disabled={item.status === 'Normal'}
                        className={`p-2 rounded-lg transition-all duration-200 transform hover:scale-110 ${
                          item.status !== 'Normal'
                            ? 'bg-red-100 text-red-600 hover:bg-red-200'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <ShoppingCart size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Purchase Orders Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <ShoppingCart size={28} className="text-blue-600" />
            طلبيات الشراء ({purchaseOrderList.length})
          </h3>
          <div className="space-y-3">
            {purchaseOrderList.map((po) => (
              <div
                key={po.id}
                className="bg-white rounded-lg p-4 flex items-center justify-between shadow-sm hover:shadow-lg transition-all duration-200"
              >
                <div className="flex-1">
                  <p className="font-bold text-slate-900">{po.itemName}</p>
                  <p className="text-sm text-slate-600">
                    رقم الطلب: {po.id} | الكمية: {po.quantity} {po.unit}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">${po.estimatedCost.toFixed(2)}</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-1 ${
                      po.status === 'Draft'
                        ? 'bg-slate-100 text-slate-700'
                        : po.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {po.status === 'Draft'
                      ? 'مسودة'
                      : po.status === 'Pending'
                      ? 'قيد الانتظار'
                      : 'مؤكد'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6">
            <p className="text-sm opacity-90 mb-2">المواد الطبيعية</p>
            <p className="text-4xl font-bold">
              {inventory.filter((i) => i.status === 'Normal').length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-6">
            <p className="text-sm opacity-90 mb-2">المواد المنخفضة</p>
            <p className="text-4xl font-bold">{lowItems.length}</p>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl p-6">
            <p className="text-sm opacity-90 mb-2">المواد الحرجة</p>
            <p className="text-4xl font-bold">{criticalItems.length}</p>
          </div>
        </div>
      </div>

      {/* Add Stock Modal */}
      <AddStockForm
        isOpen={showAddStock}
        onClose={() => setShowAddStock(false)}
        onSubmit={handleAddStock}
      />

      {/* Item Details Modal */}
      <Modal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title={selectedItem?.name || 'تفاصيل المادة'}
      >
        {selectedItem && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-600">الفئة</p>
                <p className="text-lg font-bold text-slate-900">{selectedItem.category}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">الحالة</p>
                <p
                  className={`text-lg font-bold ${
                    selectedItem.status === 'Normal'
                      ? 'text-green-600'
                      : selectedItem.status === 'Low'
                      ? 'text-orange-600'
                      : 'text-red-600'
                  }`}
                >
                  {selectedItem.status}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-slate-600">الكمية المتاحة</p>
              <ProgressBar progress={Math.min(100, (selectedItem.quantity / selectedItem.reorderPoint) * 100)} />
              <p className="text-2xl font-bold text-indigo-600">
                {selectedItem.quantity} {selectedItem.unit}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-slate-600">الحد الأدنى</p>
                <p className="text-2xl font-bold text-slate-900">{selectedItem.minStock}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-slate-600">نقطة إعادة الطلب</p>
                <p className="text-2xl font-bold text-slate-900">{selectedItem.reorderPoint}</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
              <p className="text-sm text-slate-600 mb-1">سعر الوحدة</p>
              <p className="text-3xl font-bold text-green-600">${selectedItem.unitCost}</p>
            </div>

            {selectedItem.status !== 'Normal' && (
              <button
                onClick={() => {
                  handleCreatePurchaseOrder(selectedItem);
                  setSelectedItem(null);
                }}
                className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-all duration-200 transform hover:scale-105 font-bold flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} />
                إنشاء طلب شراء
              </button>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
