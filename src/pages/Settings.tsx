import React, { useState } from 'react';
import { Header, Alert } from '../components';
import { Settings as SettingsIcon, Save } from 'lucide-react';

interface PricingConfig {
  pricePerUnit: number;
  rawMaterialsCost: number;
  laborCost: number;
  operationalOverhead: number;
  dailyProduction: number;
  discountPercent: number;
}

export const Settings: React.FC = () => {
  const [pricing, setPricing] = useState<PricingConfig>({
    pricePerUnit: 25, // سعر القطعة الواحدة
    rawMaterialsCost: 5000, // تكلفة المواد الخام اليومية
    laborCost: 2000, // تكلفة الأجور اليومية
    operationalOverhead: 800, // النفقات العامة
    dailyProduction: 45320, // الإنتاج اليومي
    discountPercent: 5, // نسبة الخصم
  });

  const [savedMessage, setSavedMessage] = useState(false);

  // حسابات الربح
  const totalRevenue = pricing.pricePerUnit * pricing.dailyProduction; // الإيرادات الإجمالية
  const discount = (totalRevenue * pricing.discountPercent) / 100; // الخصم
  const netRevenue = totalRevenue - discount; // الإيرادات الصافية
  const totalCost = pricing.rawMaterialsCost + pricing.laborCost + pricing.operationalOverhead; // التكلفة الإجمالية
  const profit = netRevenue - totalCost; // الربح
  const profitMargin = ((profit / netRevenue) * 100).toFixed(2); // نسبة الربح

  const handleInputChange = (key: keyof PricingConfig, value: number) => {
    setPricing({ ...pricing, [key]: value });
  };

  const handleSave = () => {
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div className="space-y-8">
      <Header title="الإعدادات والأسعار" />

      <div className="px-8 py-6 space-y-8">
        {/* Success Message */}
        {savedMessage && (
          <Alert
            type="success"
            title="تم الحفظ بنجاح!"
            message="تم تحديث الأسعار والإعدادات بنجاح"
            onClose={() => setSavedMessage(false)}
          />
        )}

        {/* Explanation Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
            <SettingsIcon size={24} />
            كيف يتم حساب الربح؟
          </h3>
          <div className="space-y-3 text-blue-800">
            <p className="font-semibold">المعادلة الأساسية:</p>
            <div className="bg-white rounded-lg p-4 font-mono text-sm border-l-4 border-blue-600">
              <p className="mb-2">
                <span className="text-green-600 font-bold">الربح اليومي</span> = الإيرادات الصافية - التكلفة الإجمالية
              </p>
              <p className="text-slate-600">Profit = (Price × Quantity - Discount) - (Materials + Labor + Overhead)</p>
            </div>
            <p className="text-sm">
              ✏️ عدّل القيم أدناه لتحديث الحسابات تلقائياً
            </p>
          </div>
        </div>

        {/* Main Pricing Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
            <h3 className="text-xl font-bold text-slate-900 mb-6 border-b-2 border-indigo-600 pb-3">
              📊 أدخل البيانات
            </h3>

            {/* Production Data */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 space-y-4">
              <p className="font-bold text-purple-900">🏭 بيانات الإنتاج</p>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  الإنتاج اليومي (عدد القطع)
                </label>
                <input
                  type="number"
                  value={pricing.dailyProduction}
                  onChange={(e) => handleInputChange('dailyProduction', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg font-bold"
                />
                <p className="text-xs text-slate-600 mt-1">كم قطعة تنتج يومياً؟</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  سعر البيع للقطعة الواحدة ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={pricing.pricePerUnit}
                  onChange={(e) => handleInputChange('pricePerUnit', parseFloat(e.target.value))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg font-bold"
                />
                <p className="text-xs text-slate-600 mt-1">كم سعر بيع القطعة الواحدة؟</p>
              </div>
            </div>

            {/* Cost Data */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 space-y-4">
              <p className="font-bold text-orange-900">💰 التكاليف اليومية</p>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  تكلفة المواد الخام ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={pricing.rawMaterialsCost}
                  onChange={(e) => handleInputChange('rawMaterialsCost', parseFloat(e.target.value))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg font-bold"
                />
                <p className="text-xs text-slate-600 mt-1">تكلفة القماش والخيوط والأزرار وغيرها</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  تكلفة الأجور واليد العاملة ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={pricing.laborCost}
                  onChange={(e) => handleInputChange('laborCost', parseFloat(e.target.value))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg font-bold"
                />
                <p className="text-xs text-slate-600 mt-1">رواتب العمال والموظفين</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  النفقات العامة والتشغيلية ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={pricing.operationalOverhead}
                  onChange={(e) => handleInputChange('operationalOverhead', parseFloat(e.target.value))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg font-bold"
                />
                <p className="text-xs text-slate-600 mt-1">كهرباء، صيانة، إيجار، إلخ</p>
              </div>
            </div>

            {/* Discount */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4">
              <p className="font-bold text-red-900 mb-4">🏷️ الخصومات والعروض</p>
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  نسبة الخصم (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={pricing.discountPercent}
                  onChange={(e) => handleInputChange('discountPercent', parseFloat(e.target.value))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-lg font-bold"
                />
                <p className="text-xs text-slate-600 mt-1">نسبة الخصم على الإيرادات الكلية</p>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105 font-bold flex items-center justify-center gap-2 mt-4"
            >
              <Save size={20} />
              حفظ الإعدادات
            </button>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Calculation Breakdown */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-6 border-b-2 border-green-600 pb-3">
                📈 الحسابات والنتائج
              </h3>

              {/* Step 1: Revenue */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 mb-4 border-l-4 border-blue-600">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-bold text-blue-900">1️⃣ الإيرادات الإجمالية (قبل الخصم)</p>
                  <p className="text-2xl font-bold text-blue-600">${totalRevenue.toLocaleString()}</p>
                </div>
                <p className="text-xs text-blue-800 font-mono">
                  = {pricing.pricePerUnit} $ × {pricing.dailyProduction.toLocaleString()} قطعة
                </p>
              </div>

              {/* Step 2: Discount */}
              {pricing.discountPercent > 0 && (
                <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-4 mb-4 border-l-4 border-red-600">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-bold text-red-900">2️⃣ الخصم المطبق</p>
                    <p className="text-2xl font-bold text-red-600">-${discount.toLocaleString()}</p>
                  </div>
                  <p className="text-xs text-red-800 font-mono">
                    = ${totalRevenue.toLocaleString()} × {pricing.discountPercent}%
                  </p>
                </div>
              )}

              {/* Step 3: Net Revenue */}
              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 mb-4 border-l-4 border-green-600">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-bold text-green-900">3️⃣ الإيرادات الصافية</p>
                  <p className="text-2xl font-bold text-green-600">${netRevenue.toLocaleString()}</p>
                </div>
                <p className="text-xs text-green-800 font-mono">
                  = ${totalRevenue.toLocaleString()} - ${discount.toLocaleString()}
                </p>
              </div>

              <div className="my-4 border-t-2 border-slate-300"></div>

              {/* Costs */}
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4 mb-4 border-l-4 border-orange-600">
                <div className="flex justify-between items-center mb-3">
                  <p className="font-bold text-orange-900">4️⃣ التكاليف الإجمالية</p>
                  <p className="text-2xl font-bold text-orange-600">${totalCost.toLocaleString()}</p>
                </div>
                <div className="space-y-1 text-xs text-orange-800 font-mono bg-white rounded p-2">
                  <p>المواد الخام: ${pricing.rawMaterialsCost.toLocaleString()}</p>
                  <p>الأجور: ${pricing.laborCost.toLocaleString()}</p>
                  <p>النفقات: ${pricing.operationalOverhead.toLocaleString()}</p>
                </div>
              </div>

              <div className="my-4 border-t-2 border-slate-300"></div>

              {/* Final Profit */}
              <div className={`rounded-lg p-4 border-l-4 ${
                profit > 0
                  ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-600'
                  : 'bg-gradient-to-r from-red-50 to-red-100 border-red-600'
              }`}>
                <div className="flex justify-between items-center mb-2">
                  <p className={`font-bold ${profit > 0 ? 'text-emerald-900' : 'text-red-900'}`}>
                    5️⃣ الربح النهائي 🎯
                  </p>
                  <p className={`text-3xl font-bold ${profit > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {profit > 0 ? '+' : '-'}${Math.abs(profit).toLocaleString()}
                  </p>
                </div>
                <p className={`text-xs font-mono ${profit > 0 ? 'text-emerald-800' : 'text-red-800'}`}>
                  = ${netRevenue.toLocaleString()} - ${totalCost.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Profit Margin */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl shadow-lg p-6">
              <p className="text-sm opacity-90 mb-2">نسبة الربح الصافي</p>
              <p className="text-5xl font-bold mb-2">{profitMargin}%</p>
              <p className="text-sm opacity-90">
                من كل دولار إيراد، الربح هو {profitMargin} سنت
              </p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-100 rounded-lg p-4">
                <p className="text-xs text-slate-600">إيراد القطعة</p>
                <p className="text-2xl font-bold text-indigo-600">${pricing.pricePerUnit}</p>
              </div>
              <div className="bg-slate-100 rounded-lg p-4">
                <p className="text-xs text-slate-600">تكلفة القطعة</p>
                <p className="text-2xl font-bold text-orange-600">
                  ${(totalCost / pricing.dailyProduction).toFixed(2)}
                </p>
              </div>
              <div className="bg-slate-100 rounded-lg p-4">
                <p className="text-xs text-slate-600">ربح القطعة</p>
                <p className="text-2xl font-bold text-green-600">
                  ${(profit / pricing.dailyProduction).toFixed(2)}
                </p>
              </div>
              <div className="bg-slate-100 rounded-lg p-4">
                <p className="text-xs text-slate-600">الإنتاج</p>
                <p className="text-2xl font-bold text-purple-600">
                  {pricing.dailyProduction.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
