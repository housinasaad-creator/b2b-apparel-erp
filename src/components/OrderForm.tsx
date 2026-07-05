import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { ManufacturingOrder } from '../types';

interface OrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (order: ManufacturingOrder) => void;
  editingOrder?: ManufacturingOrder | null;
}

export const OrderForm: React.FC<OrderFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingOrder,
}) => {
  const [formData, setFormData] = useState<Partial<ManufacturingOrder>>(
    editingOrder || {
      productName: '',
      quantity: 0,
      unit: 'قطعة',
      currentStage: 'Pending',
      progress: 0,
      startDate: new Date().toISOString().split('T')[0],
      expectedDate: '',
      materials: [],
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newOrder: ManufacturingOrder = {
      id: editingOrder?.id || Date.now().toString(),
      orderNumber: editingOrder?.orderNumber || `PO-2024-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      productName: formData.productName || '',
      quantity: formData.quantity || 0,
      unit: formData.unit || 'قطعة',
      currentStage: formData.currentStage || 'Pending',
      progress: formData.progress || 0,
      startDate: formData.startDate || new Date().toISOString().split('T')[0],
      expectedDate: formData.expectedDate || '',
      materials: formData.materials || [],
    };

    onSubmit(newOrder);
    setFormData({
      productName: '',
      quantity: 0,
      unit: 'قطعة',
      currentStage: 'Pending',
      progress: 0,
      startDate: new Date().toISOString().split('T')[0],
      expectedDate: '',
      materials: [],
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white">
            <h2 className="text-2xl font-bold text-slate-900">
              {editingOrder ? 'تعديل الطلبية' : 'إضافة طلبية جديدة'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-all duration-200 transform hover:scale-110"
            >
              <X size={24} className="text-slate-600" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                اسم المنتج
              </label>
              <input
                type="text"
                required
                value={formData.productName || ''}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="مثال: قمصان رجالية أحمر"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Quantity */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  الكمية
                </label>
                <input
                  type="number"
                  required
                  value={formData.quantity || 0}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="1000"
                />
              </div>

              {/* Unit */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  الوحدة
                </label>
                <select
                  value={formData.unit || 'قطعة'}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option>قطعة</option>
                  <option>صندوق</option>
                  <option>متر</option>
                  <option>رزمة</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Start Date */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  تاريخ البدء
                </label>
                <input
                  type="date"
                  required
                  value={formData.startDate || ''}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Expected Date */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  التاريخ المتوقع
                </label>
                <input
                  type="date"
                  required
                  value={formData.expectedDate || ''}
                  onChange={(e) => setFormData({ ...formData, expectedDate: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Current Stage */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                المرحلة الحالية
              </label>
              <select
                value={formData.currentStage || 'Pending'}
                onChange={(e) => setFormData({ ...formData, currentStage: e.target.value as any })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Pending">قيد الانتظار</option>
                <option value="Cutting">القطع</option>
                <option value="Sewing">الخياطة</option>
                <option value="QA_Inspection">فحص الجودة</option>
                <option value="Packaging">التعبئة</option>
                <option value="Completed">مكتمل</option>
              </select>
            </div>

            {/* Progress */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                نسبة التقدم (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.progress || 0}
                onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="mt-2 w-full bg-slate-200 rounded-full h-2">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                  style={{ width: `${formData.progress || 0}%` }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6 border-t border-slate-200">
              <button
                type="submit"
                className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-all duration-200 transform hover:scale-105 font-bold flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                {editingOrder ? 'تحديث الطلبية' : 'إضافة الطلبية'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-slate-200 text-slate-900 py-3 rounded-lg hover:bg-slate-300 transition-all duration-200 font-bold"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
