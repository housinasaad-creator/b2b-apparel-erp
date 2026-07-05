import React, { useState } from 'react';
import { Header, ProgressBar, Chart } from '../components';
import { machines } from '../data';
import { Machine } from '../types';
import { Zap, AlertCircle } from 'lucide-react';

export const OEEModule: React.FC = () => {
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(machines[0]);

  const oeeChartData = machines.map((m) => ({
    name: m.name.split(' - ')[1] || m.name,
    efficiency: m.efficiency,
    availability: m.availability,
    quality: m.quality,
    oee: m.oee,
  }));

  return (
    <div className="space-y-8">
      <Header title="نظام حساب كفاءة الآلات (OEE)" />

      <div className="px-8 py-6 space-y-8">
        {/* OEE Formula Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Zap size={24} className="text-blue-600" />
            معادلة حساب OEE
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-slate-600 mb-2">معدل الأداء (Performance)</p>
              <p className="text-xl font-bold text-blue-600">E = Efficiency %</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-slate-600 mb-2">التوفر (Availability)</p>
              <p className="text-xl font-bold text-purple-600">A = Availability %</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-slate-600 mb-2">الجودة (Quality)</p>
              <p className="text-xl font-bold text-green-600">Q = Quality %</p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border-2 border-indigo-300">
            <p className="text-sm text-slate-600 mb-2">الصيغة النهائية</p>
            <p className="text-2xl font-bold text-indigo-600">OEE = (E × A × Q) / 100</p>
          </div>
        </div>

        {/* Machines Grid */}
        <div>
          <h3 className="text-2xl font-bold text-slate-900 mb-6">أداء الآلات</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {machines.map((machine) => (
              <div
                key={machine.id}
                onClick={() => setSelectedMachine(machine)}
                className={`bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer border-2 ${
                  selectedMachine?.id === machine.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-transparent hover:border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">{machine.name}</h4>
                    <p className="text-sm text-slate-600 mt-1">
                      الحالة: <span className="font-bold text-blue-600">{machine.status}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-bold text-indigo-600">{machine.oee}%</p>
                    <p className="text-xs text-slate-500">OEE</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <ProgressBar
                      progress={machine.efficiency}
                      label={`الكفاءة: ${machine.efficiency}%`}
                      color="blue"
                    />
                  </div>
                  <div>
                    <ProgressBar
                      progress={machine.availability}
                      label={`التوفر: ${machine.availability}%`}
                      color="purple"
                    />
                  </div>
                  <div>
                    <ProgressBar
                      progress={machine.quality}
                      label={`الجودة: ${machine.quality}%`}
                      color="green"
                    />
                  </div>
                </div>

                {machine.oee < 75 && (
                  <div className="mt-4 flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <AlertCircle size={16} className="text-orange-600" />
                    <p className="text-sm text-orange-700 font-medium">يتطلب صيانة</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Selected Machine Details */}
        {selectedMachine && (
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-indigo-600">
            <h3 className="text-xl font-bold text-slate-900 mb-6">تفاصيل الآلة المختارة</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                <p className="text-sm text-slate-600 mb-2">معدل الإنتاج</p>
                <p className="text-3xl font-bold text-blue-600">
                  {selectedMachine.productionRate}
                </p>
                <p className="text-xs text-slate-500 mt-1">قطعة/ساعة</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
                <p className="text-sm text-slate-600 mb-2">وقت التوقف</p>
                <p className="text-3xl font-bold text-orange-600">
                  {selectedMachine.downtimeMinutes}
                </p>
                <p className="text-xs text-slate-500 mt-1">دقيقة</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                <p className="text-sm text-slate-600 mb-2">مؤشر الأداء</p>
                <p className={`text-3xl font-bold ${
                  selectedMachine.oee >= 85 ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {selectedMachine.oee >= 85 ? '✓' : '⚠'}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {selectedMachine.oee >= 85 ? 'ممتاز' : 'يحتاج انتباه'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* OEE Chart */}
        <Chart
          title="مقارنة أداء الآلات (OEE, E, A, Q)"
          data={oeeChartData}
          type="bar"
          dataKeys={['efficiency', 'availability', 'quality', 'oee']}
        />

        {/* Cost Calculation Section */}
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-300">
          <h3 className="text-lg font-bold text-slate-900 mb-4">حساب تكلفة الإنتاج</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-slate-600 mb-2">تكلفة المواد الخام</p>
              <input
                type="number"
                defaultValue="5000"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-slate-500 mt-1">دولار</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-slate-600 mb-2">تكلفة العمل</p>
              <input
                type="number"
                defaultValue="2000"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-slate-500 mt-1">دولار</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-slate-600 mb-2">النفقات التشغيلية</p>
              <input
                type="number"
                defaultValue="800"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-slate-500 mt-1">دولار</p>
            </div>
          </div>
          <div className="mt-4 bg-indigo-600 text-white rounded-lg p-4 text-center">
            <p className="text-sm mb-1">إجمالي تكلفة الإنتاج اليومي</p>
            <p className="text-3xl font-bold">$7,800</p>
          </div>
        </div>
      </div>
    </div>
  );
};
