import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { ManufacturingOrder, Material, InventoryItem } from '../types';
import { useI18n } from '../i18n';

interface SmartOrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (order: ManufacturingOrder, materials: Material[]) => void;
  editingOrder?: ManufacturingOrder | null;
  inventory: InventoryItem[];
}

export const SmartOrderForm: React.FC<SmartOrderFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingOrder,
  inventory,
}) => {
  const { t, td } = useI18n();
  const [productName, setProductName] = useState(editingOrder?.productName || '');
  const [quantity, setQuantity] = useState(editingOrder?.quantity || 0);
  const [unit, setUnit] = useState(editingOrder?.unit || 'قطعة');
  const [pricePerUnit, setPricePerUnit] = useState(25);
  const [startDate, setStartDate] = useState(
    editingOrder?.startDate || new Date().toISOString().split('T')[0]
  );
  const [expectedDate, setExpectedDate] = useState(editingOrder?.expectedDate || '');
  const [currentStage, setCurrentStage] = useState(editingOrder?.currentStage || 'Pending');
  const [progress, setProgress] = useState(editingOrder?.progress || 0);

  const [selectedMaterials, setSelectedMaterials] = useState<Material[]>(
    editingOrder?.materials || []
  );

  const [selectedInventoryId, setSelectedInventoryId] = useState<string>('');
  const [materialQuantity, setMaterialQuantity] = useState(0);

  const totalRevenue = quantity * pricePerUnit;
  const totalMaterialCost = selectedMaterials.reduce((sum, m) => sum + (m.quantity * 5), 0);
  const profit = totalRevenue - totalMaterialCost;

  const handleAddMaterial = () => {
    if (!selectedInventoryId || materialQuantity <= 0) {
      alert(t('selectMaterialQtyAlert'));
      return;
    }

    const inventoryItem = inventory.find((item) => item.id === selectedInventoryId);
    if (!inventoryItem) return;

    if (materialQuantity > inventoryItem.quantity) {
      alert(
        t('qtyMoreThanAvail', {
          req: materialQuantity,
          avail: inventoryItem.quantity,
          unit: td(inventoryItem.unit),
        })
      );
      return;
    }

    const newMaterial: Material = {
      id: Date.now().toString(),
      name: inventoryItem.name,
      quantity: materialQuantity,
      unit: inventoryItem.unit,
    };

    setSelectedMaterials([...selectedMaterials, newMaterial]);
    setSelectedInventoryId('');
    setMaterialQuantity(0);
  };

  const handleRemoveMaterial = (id: string) => {
    setSelectedMaterials(selectedMaterials.filter((m) => m.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!productName || !quantity || !expectedDate || selectedMaterials.length === 0) {
      alert(t('fillAllOrderAlert'));
      return;
    }

    const newOrder: ManufacturingOrder = {
      id: editingOrder?.id || Date.now().toString(),
      orderNumber:
        editingOrder?.orderNumber ||
        `PO-${new Date().getFullYear()}-${Math.random()
          .toString(36)
          .substr(2, 9)
          .toUpperCase()}`,
      productName,
      quantity,
      unit,
      currentStage: currentStage as any,
      progress,
      startDate,
      expectedDate,
      materials: selectedMaterials,
    };

    onSubmit(newOrder, selectedMaterials);
    handleReset();
  };

  const handleReset = () => {
    setProductName('');
    setQuantity(0);
    setUnit('قطعة');
    setPricePerUnit(25);
    setStartDate(new Date().toISOString().split('T')[0]);
    setExpectedDate('');
    setCurrentStage('Pending');
    setProgress(0);
    setSelectedMaterials([]);
    setSelectedInventoryId('');
    setMaterialQuantity(0);
    onClose();
  };

  if (!isOpen) return null;

  const materialsByCategory = inventory.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    },
    {} as { [key: string]: InventoryItem[] }
  );

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fadeIn"
        onClick={handleReset}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl my-8 animate-scaleIn">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white rounded-t-xl">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              ➕ {t('smartOrderTitle')}
            </h2>
            <button
              onClick={handleReset}
              className="p-2 hover:bg-slate-100 rounded-lg transition-all duration-200"
            >
              <X size={24} className="text-slate-600" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            {/* Row 1: Product Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  📝 {t('productNameLabel')} *
                </label>
                <input
                  type="text"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder={t('productNamePh')}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  📊 {t('requiredQty')} *
                </label>
                <input
                  type="number"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  placeholder="1500"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg font-bold text-indigo-600"
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
                  <option value="قطعة">{t('unitPiece')}</option>
                  <option value="صندوق">{t('unitBox')}</option>
                  <option value="رزمة">{t('unitPack')}</option>
                </select>
              </div>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-2 border-green-200">
              <div>
                <label className="block text-sm font-bold text-green-900 mb-2">
                  💵 {t('sellPricePiece')}
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-green-600">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={pricePerUnit}
                    onChange={(e) => setPricePerUnit(parseFloat(e.target.value))}
                    className="flex-1 px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-lg font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-green-900 mb-2">
                  💰 {t('totalRevenueLabel')}
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-green-600">$</span>
                  <input
                    type="text"
                    disabled
                    value={totalRevenue.toLocaleString()}
                    className="flex-1 px-4 py-2 bg-white border-2 border-green-400 rounded-lg text-lg font-bold text-green-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-green-900 mb-2">
                  📈 {t('expectedProfit')}
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-green-600">$</span>
                  <input
                    type="text"
                    disabled
                    value={profit.toLocaleString()}
                    className="flex-1 px-4 py-2 bg-white border-2 border-green-400 rounded-lg text-lg font-bold text-green-600"
                  />
                </div>
              </div>
            </div>

            {/* Dates & Stage */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  📅 {t('startDate')}
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  ⏰ {t('expectedDate')}
                </label>
                <input
                  type="date"
                  required
                  value={expectedDate}
                  onChange={(e) => setExpectedDate(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  🎯 {t('stageLabel')}
                </label>
                <select
                  value={currentStage}
                  onChange={(e) => setCurrentStage(e.target.value as any)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Pending">{t('stagePending')}</option>
                  <option value="Cutting">{t('stageCutting')}</option>
                  <option value="Sewing">{t('stageSewing')}</option>
                  <option value="QA_Inspection">{t('stageQA')}</option>
                  <option value="Packaging">{t('stagePackaging')}</option>
                  <option value="Completed">{t('stageCompleted')}</option>
                </select>
              </div>
            </div>

            {/* Progress */}
            <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
              <label className="block text-sm font-bold text-blue-900 mb-3">
                📊 {t('progressLabel')}: {progress}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(parseInt(e.target.value))}
                className="w-full h-2 bg-blue-300 rounded-lg"
              />
              <div className="w-full bg-slate-200 rounded-full h-2 mt-3">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Smart Materials Selection */}
            <div className="border-t-2 border-slate-300 pt-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                📦 {t('selectMaterials')}
              </h3>

              {/* Material Selection */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 mb-4 border-2 border-purple-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                  {/* Category Select */}
                  <div>
                    <label className="block text-xs font-bold text-purple-900 mb-2">
                      📂 {t('materialCategory')}
                    </label>
                    <select
                      onChange={() => {
                        setSelectedInventoryId('');
                        setMaterialQuantity(0);
                      }}
                      className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                      defaultValue=""
                    >
                      <option value="">{t('chooseCategory')}</option>
                      {Object.keys(materialsByCategory).map((category) => (
                        <option key={category} value={category}>
                          {td(category)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Material Select */}
                  <div>
                    <label className="block text-xs font-bold text-purple-900 mb-2">
                      🏷️ {t('materialNameAvail')}
                    </label>
                    <select
                      value={selectedInventoryId}
                      onChange={(e) => {
                        setSelectedInventoryId(e.target.value);
                        setMaterialQuantity(0);
                      }}
                      className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    >
                      <option value="">{t('chooseMaterial')}</option>
                      {inventory.map((item) => (
                        <option key={item.id} value={item.id}>
                          {td(item.name)} ({item.quantity} {td(item.unit)})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quantity Input */}
                  <div>
                    <label className="block text-xs font-bold text-purple-900 mb-2">
                      📊 {t('requiredQty')}
                    </label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={materialQuantity}
                        onChange={(e) => setMaterialQuantity(parseFloat(e.target.value))}
                        placeholder="0"
                        className="flex-1 px-2 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                      />
                      {selectedInventoryId && (
                        <span className="text-xs text-purple-700 font-bold">
                          {td(inventory.find((i) => i.id === selectedInventoryId)?.unit || '')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Add Button */}
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={handleAddMaterial}
                      className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-all duration-200 font-bold text-sm flex items-center justify-center gap-2"
                    >
                      <Plus size={16} />
                      {t('add')}
                    </button>
                  </div>
                </div>

                {/* Info Text */}
                {selectedInventoryId && (
                  <div className="bg-white rounded p-2 text-xs text-slate-600">
                    ℹ️ {t('available')}: {inventory.find((i) => i.id === selectedInventoryId)?.quantity}{' '}
                    {td(inventory.find((i) => i.id === selectedInventoryId)?.unit || '')}
                  </div>
                )}
              </div>

              {/* Selected Materials List */}
              {selectedMaterials.length > 0 && (
                <div className="space-y-2 mb-4">
                  <p className="text-sm font-bold text-slate-600">✅ {t('addedMaterials')}</p>
                  {selectedMaterials.map((material) => (
                    <div
                      key={material.id}
                      className="flex items-center justify-between bg-gradient-to-r from-emerald-100 to-emerald-50 rounded-lg p-4 border-l-4 border-emerald-600"
                    >
                      <div>
                        <p className="font-semibold text-slate-900">{td(material.name)}</p>
                        <p className="text-sm text-slate-600">
                          {material.quantity} {td(material.unit)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveMaterial(material.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {selectedMaterials.length === 0 && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-red-700 font-bold">⚠️ {t('atLeastOneMaterial')}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6 border-t border-slate-200">
              <button
                type="submit"
                disabled={selectedMaterials.length === 0}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105 font-bold disabled:opacity-50"
              >
                ✅ {t('addOrderBtn')}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 bg-slate-200 text-slate-900 py-3 rounded-lg hover:bg-slate-300 transition-all font-bold"
              >
                ❌ {t('cancel')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
