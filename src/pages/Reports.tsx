import React, { useState } from 'react';
import { Header } from '../components';
import { machines as initialMachines } from '../data';
import { BarChart3, Download, Zap } from 'lucide-react';
import { useI18n } from '../i18n';

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

const MONTHS_AR = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
];

// Report field labels per language
const FIELD_LABELS: Record<string, { ar: string; en: string; tr: string }> = {
  date: { ar: 'التاريخ', en: 'Date', tr: 'Tarih' },
  totalMachines: { ar: 'إجمالي الآلات', en: 'Total Machines', tr: 'Toplam Makine' },
  runningMachines: { ar: 'الآلات الشغالة', en: 'Running Machines', tr: 'Çalışan Makineler' },
  idleMachines: { ar: 'الآلات المعطلة', en: 'Idle Machines', tr: 'Boştaki Makineler' },
  maintenanceMachines: { ar: 'آلات الصيانة', en: 'Maintenance Machines', tr: 'Bakımdaki Makineler' },
  averageOEE: { ar: 'متوسط OEE', en: 'Average OEE', tr: 'Ortalama OEE' },
  totalProduction: { ar: 'إجمالي الإنتاج', en: 'Total Production', tr: 'Toplam Üretim' },
  timestamp: { ar: 'الوقت', en: 'Time', tr: 'Saat' },
  month: { ar: 'الشهر', en: 'Month', tr: 'Ay' },
  year: { ar: 'السنة', en: 'Year', tr: 'Yıl' },
  bestMachine: { ar: 'أفضل آلة', en: 'Best Machine', tr: 'En İyi Makine' },
  bestOEE: { ar: 'أفضل OEE', en: 'Best OEE', tr: 'En İyi OEE' },
  worstMachine: { ar: 'أضعف آلة', en: 'Worst Machine', tr: 'En Kötü Makine' },
  worstOEE: { ar: 'أضعف OEE', en: 'Worst OEE', tr: 'En Kötü OEE' },
  maintenanceCount: { ar: 'عدد الصيانات', en: 'Maintenance Count', tr: 'Bakım Sayısı' },
  machineId: { ar: 'رقم الآلة', en: 'Machine ID', tr: 'Makine No' },
  machineName: { ar: 'اسم الآلة', en: 'Machine Name', tr: 'Makine Adı' },
  currentStatus: { ar: 'الحالة الحالية', en: 'Current Status', tr: 'Mevcut Durum' },
  currentEfficiency: { ar: 'الكفاءة الحالية', en: 'Current Efficiency', tr: 'Mevcut Verimlilik' },
  currentOEE: { ar: 'OEE الحالي', en: 'Current OEE', tr: 'Mevcut OEE' },
  totalRunHours: { ar: 'ساعات التشغيل', en: 'Run Hours', tr: 'Çalışma Saati' },
  totalDowntime: { ar: 'وقت التوقف', en: 'Downtime', tr: 'Duruş Süresi' },
  efficiency: { ar: 'الكفاءة', en: 'Efficiency', tr: 'Verimlilik' },
  quality: { ar: 'الجودة', en: 'Quality', tr: 'Kalite' },
  availability: { ar: 'التوفر', en: 'Availability', tr: 'Kullanılabilirlik' },
  oee: { ar: 'OEE', en: 'OEE', tr: 'OEE' },
  createdDate: { ar: 'تاريخ الإنشاء', en: 'Created Date', tr: 'Oluşturma Tarihi' },
};

const STATUS_LABELS: Record<string, { ar: string; en: string; tr: string }> = {
  Running: { ar: 'شغالة', en: 'Running', tr: 'Çalışıyor' },
  Idle: { ar: 'معطلة', en: 'Idle', tr: 'Boşta' },
  Maintenance: { ar: 'بدها صيانة', en: 'Maintenance', tr: 'Bakım' },
};

export const Reports: React.FC = () => {
  const { t, td, lang } = useI18n();
  const [reportType, setReportType] = useState<'daily' | 'monthly' | 'machine'>('daily');
  const [selectedMachine, setSelectedMachine] = useState('1');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [generatedReport, setGeneratedReport] = useState<any>(null);

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
      timestamp: new Date().toLocaleTimeString(),
    };
    setGeneratedReport(report);
  };

  const handleGenerateMonthlyReport = () => {
    const report = {
      type: 'شهري',
      month: MONTHS_AR[selectedMonth - 1],
      year: selectedYear,
      totalProduction: '1,289,000 قطعة',
      totalDowntime: '580 دقيقة',
      averageOEE: '81%',
      bestMachine: 'ماكينة القص - 1',
      bestOEE: '87%',
      worstMachine: 'ماكينة الخياطة - 2',
      worstOEE: '70%',
      maintenanceCount: 18,
      timestamp: new Date().toLocaleTimeString(),
    };
    setGeneratedReport(report);
  };

  const handleGenerateMachineReport = () => {
    const selectedMachineData = initialMachines.find((m) => m.id === selectedMachine);
    const machineReport = machineReports.find(
      (r) => r.machineId === selectedMachine && r.month === MONTHS_AR[selectedMonth - 1]
    );

    const report = {
      type: 'تقرير الماكينة',
      machineName: selectedMachineData?.name || 'غير معروف',
      month: MONTHS_AR[selectedMonth - 1],
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
    alert('🎉 ' + t('pdfDownloaded'));
  };

  const handleExportExcel = () => {
    if (!generatedReport) return;
    alert('🎉 ' + t('excelDownloaded'));
  };

  const fieldLabel = (key: string) =>
    FIELD_LABELS[key] ? FIELD_LABELS[key][lang] : key.replace(/([A-Z])/g, ' $1').trim();

  const fieldValue = (value: any): string => {
    const s = String(value);
    if (STATUS_LABELS[s]) return STATUS_LABELS[s][lang];
    return td(s);
  };

  return (
    <div className="space-y-8">
      <Header title={t('reportsTitle')} />

      <div className="px-4 sm:px-8 py-6 space-y-6">
        {/* Report Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => {
              setReportType('daily');
              setGeneratedReport(null);
            }}
            className={`p-6 rounded-xl transition-all border-2 ${
              reportType === 'daily'
                ? 'border-amber-500 bg-amber-50'
                : 'border-slate-200 bg-white hover:border-amber-300'
            }`}
          >
            <p className="text-2xl mb-2">📅</p>
            <p className="font-bold text-slate-900">{t('reportDaily')}</p>
            <p className="text-sm text-slate-600 mt-1">{t('reportDailyDesc')}</p>
          </button>

          <button
            onClick={() => {
              setReportType('monthly');
              setGeneratedReport(null);
            }}
            className={`p-6 rounded-xl transition-all border-2 ${
              reportType === 'monthly'
                ? 'border-amber-500 bg-amber-50'
                : 'border-slate-200 bg-white hover:border-amber-300'
            }`}
          >
            <p className="text-2xl mb-2">📈</p>
            <p className="font-bold text-slate-900">{t('reportMonthly')}</p>
            <p className="text-sm text-slate-600 mt-1">{t('reportMonthlyDesc')}</p>
          </button>

          <button
            onClick={() => {
              setReportType('machine');
              setGeneratedReport(null);
            }}
            className={`p-6 rounded-xl transition-all border-2 ${
              reportType === 'machine'
                ? 'border-amber-500 bg-amber-50'
                : 'border-slate-200 bg-white hover:border-amber-300'
            }`}
          >
            <p className="text-2xl mb-2">⚙️</p>
            <p className="font-bold text-slate-900">{t('reportMachine')}</p>
            <p className="text-sm text-slate-600 mt-1">{t('reportMachineDesc')}</p>
          </button>
        </div>

        {/* Report Generation Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-amber-600">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">⚙️ {t('reportOptions')}</h3>

          {reportType === 'daily' && (
            <div className="space-y-4">
              <p className="text-slate-600 mb-4">
                📅 {t('dailyReportNote')}
              </p>
              <button
                onClick={handleGenerateDailyReport}
                className="px-8 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-lg hover:shadow-lg transition-all font-bold flex items-center gap-2"
              >
                <BarChart3 size={20} />
                {t('genDailyBtn')}
              </button>
            </div>
          )}

          {reportType === 'monthly' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">
                    {t('monthLabel')}
                  </label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                      <option key={m} value={m}>
                        {td(MONTHS_AR[m - 1])}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">
                    {t('yearLabel')}
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                className="w-full px-8 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-lg hover:shadow-lg transition-all font-bold flex items-center justify-center gap-2"
              >
                <BarChart3 size={20} />
                {t('genMonthlyBtn')}
              </button>
            </div>
          )}

          {reportType === 'machine' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">
                    {t('machineLabel')}
                  </label>
                  <select
                    value={selectedMachine}
                    onChange={(e) => setSelectedMachine(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {initialMachines.map((m) => (
                      <option key={m.id} value={m.id}>
                        {td(m.name)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">
                    {t('monthLabel')}
                  </label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {[1, 2, 3, 4].map((m) => (
                      <option key={m} value={m}>
                        {td(MONTHS_AR[m - 1])}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">
                    {t('yearLabel')}
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                className="w-full px-8 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-lg hover:shadow-lg transition-all font-bold flex items-center justify-center gap-2"
              >
                <Zap size={20} />
                {t('genMachineBtn')}
              </button>
            </div>
          )}
        </div>

        {/* Generated Report Display */}
        {generatedReport && (
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl shadow-lg p-8 border-2 border-amber-300">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 size={28} className="text-amber-600" />
                {td(generatedReport.type)}
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
                if (key === 'type' || key === 'notes') return null;
                return (
                  <div key={key} className="bg-white rounded-lg p-4">
                    <p className="text-xs text-slate-600 mb-1">
                      {fieldLabel(key)}
                    </p>
                    <p className="text-2xl font-bold text-slate-900">{fieldValue(value)}</p>
                  </div>
                );
              })}
            </div>

            {/* Report Notes */}
            {generatedReport.notes && (
              <div className="mt-6 bg-white rounded-lg p-4 border-l-4 border-yellow-500">
                <p className="text-sm text-slate-600 mb-2">📝 {t('notesColon')}</p>
                <p className="text-slate-800">{td(generatedReport.notes)}</p>
              </div>
            )}
          </div>
        )}

        {/* Report Templates */}
        <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-blue-600">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">📋 {t('templatesTitle')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="font-bold text-blue-900 mb-2">📅 {t('reportDaily')}</p>
              <p className="text-sm text-blue-700">
                {t('tmplDailyDesc')}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="font-bold text-green-900 mb-2">📈 {t('reportMonthly')}</p>
              <p className="text-sm text-green-700">
                {t('tmplMonthlyDesc')}
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <p className="font-bold text-purple-900 mb-2">⚙️ {t('reportMachine')}</p>
              <p className="text-sm text-purple-700">
                {t('tmplMachineDesc')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
