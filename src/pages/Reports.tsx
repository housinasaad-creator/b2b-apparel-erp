import React, { useState } from 'react';
import { Header } from '../components';
import { machines as initialMachines } from '../data';
import { BarChart3, Download, Zap } from 'lucide-react';

interface MachineReport {
  machineId: string;
  machineName: string;
  month: string;
  year: number;
  totalRunHours: number;
  totalDowntime: number;
  efficiency: number;
  quality: number;
  availability: number;
  oee: number;
  maintenanceCount: number;
  notes: string;
  createdDate: string;
}

export const Reports: React.FC = () => {
  const [reportType, setReportType] = useState<'daily' | 'monthly' | 'machine'>('daily');
  const [selectedMachine, setSelectedMachine] = useState('1');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [generatedReport, setGeneratedReport] = useState<any>(null);

  // Mock data for reports
  const machineReports: MachineReport[] = [
    {
      machineId: '1',
      machineName: 'ماكينة القص الأوتوماتيكية - 1',
      month: 'يناير',
      year: 2024,
      totalRunHours: 720,
      totalDowntime: 12,
      efficiency: 92,
      quality: 96,
      availability: 98,
      oee: 87,
      maintenanceCount: 2,
      notes: 'أداء ممتاز - صيانة روتينية فقط',
      createdDate: '2024-01-31',
    },
    {
      machineId: '2',
      machineName: 'ماكينة الخياطة - 1',
      month: 'يناير',
      year: 2024,
      totalRunHours: 650,
      totalDowntime: 70,
      efficiency: 88,
      quality: 94,
      availability: 95,
      oee: 79,
      maintenanceCount: 3,
      notes: 'صيانة إضافية مطلوبة في نهاية الشهر',
      createdDate: '2024-01-31',
    },
    {
      machineId: '3',
      machineName: 'ماكينة الخياطة - 2',
      month: 'يناير',
      year: 2024,
      totalRunHours: 620,
      totalDowntime: 100,
      efficiency: 85,
      quality: 90,
      availability: 92,
      oee: 70,
      maintenanceCount: 4,
      notes: 'أداء منخفض - تحتاج فحص شامل',
      createdDate: '2024-01-31',
    },
  ];

  const handleGenerateDailyReport = () => {
    const today = new Date().toISOString().split('T')[0];
    const report = {
      type: 'يومي',
      date: today,
      totalMachines: initialMachines.length,
      runningMachines: initialMachines.filter((m) => m.status === 'Running').length,
      idleMachines: initialMachines.filter((m) => m.status === 'Idle').length,
      maintenanceMachines: initialMachines.filter((m) => m.status === 'Maintenance').length,
      averageOEE: (
        initialMachines.reduce((sum, m) => sum + m.oee, 0) / initialMachines.length
      ).toFixed(2),
      totalProduction: '45,320 قطعة',
      timestamp: new Date().toLocaleTimeString('ar-SA'),
    };
    setGeneratedReport(report);
  };

  const handleGenerateMonthlyReport = () => {
    const monthNames = [
      'يناير',
      'فبراير',
      'مارس',
      'أبريل',
      'مايو',
      'يونيو',
      'يوليو',
      'أغسطس',
      'سبتمبر',
      'أكتوبر',
      'نوفمبر',
      'ديسمبر',
    ];
    const report = {
      type: 'شهري',
      month: monthNames[selectedMonth - 1],
      year: selectedYear,
      totalProduction: '1,289,000 قطعة',
      totalDowntime: '580 دقيقة',
      averageOEE: '81%',
      bestMachine: 'ماكينة القص - 1',
      bestOEE: '87%',
      worstMachine: 'ماكينة الخياطة - 2',
      worstOEE: '70%',
      maintenanceCount: 18,
      timestamp: new Date().toLocaleTimeString('ar-SA'),
    };
    setGeneratedReport(report);
  };

  const handleGenerateMachineReport = () => {
    const selectedMachineData = initialMachines.find((m) => m.id === selectedMachine);
    const machineReport = machineReports.find(
      (r) =>
        r.machineId === selectedMachine &&
        r.month === ['يناير', 'فبراير', 'مارس', 'أبريل'][selectedMonth - 1]
    );

    const report = {
      type: 'تقرير الماكينة',
      machineName: selectedMachineData?.name || 'غير معروف',
      month:
        [
          'يناير',
          'فبراير',
          'مارس',
          'أبريل',
          'مايو',
          'يونيو',
          'يوليو',
          'أغسطس',
          'سبتمبر',
          'أكتوبر',
          'نوفمبر',
          'ديسمبر',
        ][selectedMonth - 1],
      year: selectedYear,
      ...machineReport,
      currentStatus: selectedMachineData?.status,
      currentEfficiency: selectedMachineData?.efficiency,
      currentOEE: selectedMachineData?.oee,
    };
    setGeneratedReport(report);
  };

  const handleExportPDF = () => {
    if (!generatedReport) return;
    alert('🎉 تم تنزيل التقرير بصيغة PDF!\n\n' + JSON.stringify(generatedReport, null, 2));
  };

  const handleExportExcel = () => {
    if (!generatedReport) return;
    alert('🎉 تم تنزيل التقرير بصيغة Excel!\n\n' + JSON.stringify(generatedReport, null, 2));
  };

  return (
    <div className="space-y-8">
      <Header title="📊 التقارير والتحليلات الشهرية" />

      <div className="px-8 py-6 space-y-6">
        {/* Report Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => {
              setReportType('daily');
              setGeneratedReport(null);
            }}
            className={`p-6 rounded-xl transition-all border-2 ${
              reportType === 'daily'
                ? 'border-pink-500 bg-pink-50'
                : 'border-slate-200 bg-white hover:border-pink-300'
            }`}
          >
            <p className="text-2xl mb-2">📅</p>
            <p className="font-bold text-slate-900">تقرير يومي</p>
            <p className="text-sm text-slate-600 mt-1">ملخص اليوم الحالي</p>
          </button>

          <button
            onClick={() => {
              setReportType('monthly');
              setGeneratedReport(null);
            }}
            className={`p-6 rounded-xl transition-all border-2 ${
              reportType === 'monthly'
                ? 'border-pink-500 bg-pink-50'
                : 'border-slate-200 bg-white hover:border-pink-300'
            }`}
          >
            <p className="text-2xl mb-2">📈</p>
            <p className="font-bold text-slate-900">تقرير شهري</p>
            <p className="text-sm text-slate-600 mt-1">ملخص الشهر كاملاً</p>
          </button>

          <button
            onClick={() => {
              setReportType('machine');
              setGeneratedReport(null);
            }}
            className={`p-6 rounded-xl transition-all border-2 ${
              reportType === 'machine'
                ? 'border-pink-500 bg-pink-50'
                : 'border-slate-200 bg-white hover:border-pink-300'
            }`}
          >
            <p className="text-2xl mb-2">⚙️</p>
            <p className="font-bold text-slate-900">تقرير الماكينة</p>
            <p className="text-sm text-slate-600 mt-1">تقرير ماكينة معينة</p>
          </button>
        </div>

        {/* Report Generation Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-pink-600">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">⚙️ خيارات التقرير</h3>

          {reportType === 'daily' && (
            <div className="space-y-4">
              <p className="text-slate-600 mb-4">
                📅 سيتم عرض تقرير يومي شامل لجميع الآلات في الموقع
              </p>
              <button
                onClick={handleGenerateDailyReport}
                className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-bold flex items-center gap-2"
              >
                <BarChart3 size={20} />
                إنشاء التقرير اليومي
              </button>
            </div>
          )}

          {reportType === 'monthly' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">
                    الشهر
                  </label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                      <option key={m} value={m}>
                        {
                          [
                            'يناير',
                            'فبراير',
                            'مارس',
                            'أبريل',
                            'مايو',
                            'يونيو',
                            'يوليو',
                            'أغسطس',
                            'سبتمبر',
                            'أكتوبر',
                            'نوفمبر',
                            'ديسمبر',
                          ][m - 1]
                        }
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">
                    السنة
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    {[2024, 2025, 2026].map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                onClick={handleGenerateMonthlyReport}
                className="w-full px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-bold flex items-center justify-center gap-2"
              >
                <BarChart3 size={20} />
                إنشاء التقرير الشهري
              </button>
            </div>
          )}

          {reportType === 'machine' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">
                    الماكينة
                  </label>
                  <select
                    value={selectedMachine}
                    onChange={(e) => setSelectedMachine(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    {initialMachines.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">
                    الشهر
                  </label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    {[1, 2, 3, 4].map((m) => (
                      <option key={m} value={m}>
                        {['يناير', 'فبراير', 'مارس', 'أبريل'][m - 1]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">
                    السنة
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    {[2024, 2025].map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                onClick={handleGenerateMachineReport}
                className="w-full px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-bold flex items-center justify-center gap-2"
              >
                <Zap size={20} />
                إنشاء تقرير الماكينة
              </button>
            </div>
          )}
        </div>

        {/* Generated Report Display */}
        {generatedReport && (
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl shadow-lg p-8 border-2 border-pink-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 size={28} className="text-pink-600" />
                {generatedReport.type}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={handleExportPDF}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all font-bold flex items-center gap-2"
                >
                  <Download size={18} />
                  PDF
                </button>
                <button
                  onClick={handleExportExcel}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all font-bold flex items-center gap-2"
                >
                  <Download size={18} />
                  Excel
                </button>
              </div>
            </div>

            {/* Report Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(generatedReport).map(([key, value]) => {
                if (key === 'type') return null;
                return (
                  <div key={key} className="bg-white rounded-lg p-4">
                    <p className="text-xs text-slate-600 mb-1 uppercase">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="text-2xl font-bold text-slate-900">{String(value)}</p>
                  </div>
                );
              })}
            </div>

            {/* Report Notes */}
            {generatedReport.notes && (
              <div className="mt-6 bg-white rounded-lg p-4 border-l-4 border-yellow-500">
                <p className="text-sm text-slate-600 mb-2">📝 ملاحظات:</p>
                <p className="text-slate-800">{generatedReport.notes}</p>
              </div>
            )}
          </div>
        )}

        {/* Report Templates */}
        <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-blue-600">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">📋 قوالب التقارير المتاحة</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="font-bold text-blue-900 mb-2">📅 التقرير اليومي</p>
              <p className="text-sm text-blue-700">
                ملخص شامل لحالة جميع الآلات والإنتاج في اليوم
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="font-bold text-green-900 mb-2">📈 التقرير الشهري</p>
              <p className="text-sm text-green-700">
                تحليل شامل لأداء الإنتاج والآلات طوال الشهر
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <p className="font-bold text-purple-900 mb-2">⚙️ تقرير الماكينة</p>
              <p className="text-sm text-purple-700">
                تقرير مفصل لماكينة محددة مع الصيانة والكفاءة
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
