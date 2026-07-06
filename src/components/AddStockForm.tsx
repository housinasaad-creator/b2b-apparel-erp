import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { InventoryItem } from '../types';
import { useI18n } from '../i18n';

interface AddStockFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: InventoryItem) => void;
}

const categories = [
  'الأقمشة',
  'الخيوط والإضافات',
  'الأجزاء المعدنية',
  'الأجزاء والديكورات',
  'أخرى',
];

export const AddStockForm: React.FC<AddStockFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { t, td } = useI18n();
  const [name, setName] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [quantity, setQuantity] = useState(0);
  const [unit, setUnit] = useState('متر');
  const [minStock, setMinStock] = useState(0);
  const [unitCost, setUnitCost] = useState(0);
  const [reorderPoint, setReorderPoint] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || quantity <= 0 || unitCost <= 0) {
      alert(t('fillCorrectly'));
      return;
    }

    const newItem: InventoryItem = {
      id: Date.now().toString(),
      name,
      category,
      quantity,
      unit,
      minStock: minStock || quantity / 2,
      unitCost,
      reorderPoint: reorderPoint || quantity,
      status: 'Normal',
    };

    onSubmit(newItem);
    handleReset();
  };

  const handleReset = () => {
    setName('');
    setCategory(categories[0]);
    setQuantity(0);
    setUnit('متر');
    setMinStock(0);
    setUnitCost(0);
    setReorderPoint(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fadeIn"
        onClick={handleReset}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-scaleIn max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              ➕ {t('addStockTitle')}
            </h2>
            <button
              onClick={handleReset}
              className="p-2 hover:bg-slate-100 rounded-lg transition-all"
            >
              <X size={24} className="text-slate-600" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                📝 {t('materialNameLabel')} *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('materialNamePh')}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                📂 {t('categoryLabel')}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {td(cat)}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity & Unit */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  📊 {t('currentQty')} *
                </label>
                <input
                  type="number"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(parseFloat(e.target.value))}
                  placeholder="1000"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  📦 {t('unitLabel')}
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="متر">{t('unitMeter')}</option>
                  <option value="بكرة">{t('unitSpool')}</option>
                  <option value="قطعة">{t('unitPiece')}</option>
                  <option value="كيلو">{t('unitKilo')}</option>
                  <option value="صندوق">{t('unitBox')}</option>
                </select>
              </div>
            </div>

            {/* Min Stock & Reorder Point */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  ⚠️ {t('minStockOptional')}
                </label>
                <input
                  type="number"
                  value={minStock}
                  onChange={(e) => setMinStock(parseFloat(e.target.value))}
                  placeholder="500"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  🔄 {t('reorderOptional')}
                </label>
                <input
                  type="number"
                  value={reorderPoint}
                  onChange={(e) => setReorderPoint(parseFloat(e.target.value))}
                  placeholder="800"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Unit Cost */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                💵 {t('unitCostLabel')} *
              </label>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-slate-600">$</span>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={unitCost}
                  onChange={(e) => setUnitCost(parseFloat(e.target.value))}
                  placeholder="2.50"
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-2 border-blue-200">
              <p className="text-sm text-blue-900 font-bold mb-2">📊 {t('summaryLabel')}</p>
              <div className="space-y-1 text-xs text-blue-800">
                <p>
                  • {t('sumTotalValue')}: <span className="font-bold">${(quantity * unitCost).toFixed(2)}</span>
                </p>
                <p>
                  • {t('minStockLabel')}: <span className="font-bold">{minStock || quantity / 2}</span>
                </p>
                <p>
                  • {t('sumReorder')}: <span className="font-bold">{reorderPoint || quantity}</span>
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg hover:shadow-lg transition-all font-bold flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                {t('addToInventory')}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 bg-slate-200 text-slate-900 py-3 rounded-lg hover:bg-slate-300 transition-all font-bold"
              >
                {t('cancel')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
