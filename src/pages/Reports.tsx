import React, { useRef, useState } from 'react';
import { Header, ReportDocument, ReportModel } from '../components';
import { machines as initialMachines, inventoryItems } from '../data';
import { BarChart3, Zap, FileDown, Boxes } from 'lucide-react';
import { useI18n } from '../i18n';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const MONTHS_AR = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
];

interface MachineMonthly {
  machineId: string;
  totalRunHours: number;
  totalDowntime: number;
  efficiency: number;
  quality: number;
  availability: number;
  oee: number;
  maintenanceCount: number;
  notes: string;
}

const machineMonthly: MachineMonthly[] = [
  { machineId: '1', totalRunHours: 720, totalDowntime: 12, efficiency: 92, quality: 96, availability: 98, oee: 87, maintenanceCount: 2, notes: 'أداء ممتاز - صيانة روتينية فقط' },
  { machineId: '2', totalRunHours: 650, totalDowntime: 70, efficiency: 88, quality: 94, availability: 95, oee: 79, maintenanceCount: 3, notes: 'صيانة إضافية مطلوبة في نهاية الشهر' },
  { machineId: '3', totalRunHours: 620, totalDowntime: 100, efficiency: 85, quality: 90, availability: 92, oee: 70, maintenanceCount: 4, notes: 'أداء منخفض - تحتاج فحص شامل' },
];

export const Reports: React.FC = () => {
  const { t, td, lang } = useI18n();
  const [reportType, setReportType] = useState<'daily' | 'monthly' | 'machine' | 'warehouse'>('daily');
  const [selectedMachine, setSelectedMachine] = useState('1');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [model, setModel] = useState<ReportModel | null>(null);
  const [busy, setBusy] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const locale = lang === 'ar' ? 'ar-EG' : lang === 'tr' ? 'tr-TR' : 'en-US';

  const machineStatus = (s: string) =>
    s === 'Running' ? t('statusRunning') : s === 'Idle' ? t('statusIdle') : t('statusMaintenance');
  const stockStatus = (s: string) =>
    s === 'Normal' ? t('statusNormal') : s === 'Low' ? t('statusLow') : t('statusCritical');

  const makeReportNo = (code: string) => {
    const d = new Date();
    const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
    const rnd = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `GW-${code}-${ymd}-${rnd}`;
  };

  const nowStr = () => new Date().toLocaleString(locale);

  const buildDaily = (): ReportModel => {
    const running = initialMachines.filter((m) => m.status === 'Running').length;
    const idle = initialMachines.filter((m) => m.status === 'Idle').length;
    const maint = initialMachines.filter((m) => m.status === 'Maintenance').length;
    const avgOee = (initialMachines.reduce((s, m) => s + m.oee, 0) / initialMachines.length).toFixed(1);
    return {
      docTitle: t('repDocDaily'),
      reportNo: makeReportNo('D'),
      period: new Date().toLocaleDateString(locale),
      generatedOn: nowStr(),
      summary: [
        { label: t('oeeRunning'), value: String(running), accent: '#16a34a' },
        { label: t('oeeNeedMaint'), value: String(maint), accent: '#ea580c' },
        { label: t('oeeIdle'), value: String(idle), accent: '#64748b' },
        { label: t('avgOEELabel'), value: `${avgOee}%`, accent: '#2563eb' },
        { label: t('totalProductionLabel'), value: td('45,320 قطعة'), accent: '#7c3aed' },
      ],
      columns: [t('colMachine'), t('statusWord'), t('efficiency'), t('availability'), t('quality'), 'OEE', t('downtime')],
      rows: initialMachines.map((m) => [
        td(m.name),
        machineStatus(m.status),
        `${m.efficiency}%`,
        `${m.availability}%`,
        `${m.quality}%`,
        `${m.oee}%`,
        `${m.downtimeMinutes} ${t('minShort')}`,
      ]),
    };
  };

  const buildMonthly = (): ReportModel => {
    const monthName = td(MONTHS_AR[selectedMonth - 1]);
    return {
      docTitle: t('repDocMonthly'),
      reportNo: makeReportNo('M'),
      period: `${monthName} ${selectedYear}`,
      generatedOn: nowStr(),
      summary: [
        { label: t('totalProductionLabel'), value: td('1,289,000 قطعة'), accent: '#7c3aed' },
        { label: t('avgOEELabel'), value: '81%', accent: '#2563eb' },
        { label: t('bestMachineLabel'), value: `${td('ماكينة القص - 1')} (87%)`, accent: '#16a34a' },
        { label: t('worstMachineLabel'), value: `${td('ماكينة الخياطة - 2')} (70%)`, accent: '#dc2626' },
        { label: t('maintCountLabel'), value: '18', accent: '#ea580c' },
        { label: t('totalDowntimeLabel'), value: td('580 دقيقة'), accent: '#0891b2' },
      ],
      columns: [t('colMachine'), 'OEE', t('efficiency'), t('quality'), t('availability'), t('downtime'), t('maintCountLabel')],
      rows: machineMonthly.map((r) => {
        const m = initialMachines.find((x) => x.id === r.machineId);
        return [
          td(m?.name || ''),
          `${r.oee}%`,
          `${r.efficiency}%`,
          `${r.quality}%`,
          `${r.availability}%`,
          `${r.totalDowntime} ${t('minShort')}`,
          String(r.maintenanceCount),
        ];
      }),
    };
  };

  const buildMachine = (): ReportModel => {
    const m = initialMachines.find((x) => x.id === selectedMachine);
    const r = machineMonthly.find((x) => x.machineId === selectedMachine);
    const monthName = td(MONTHS_AR[selectedMonth - 1]);
    return {
      docTitle: t('repDocMachine'),
      reportNo: makeReportNo('EQ'),
      period: `${td(m?.name || '')} · ${monthName} ${selectedYear}`,
      generatedOn: nowStr(),
      summary: [
        { label: t('statusWord'), value: machineStatus(m?.status || ''), accent: '#16a34a' },
        { label: t('efficiency'), value: `${m?.efficiency ?? 0}%`, accent: '#2563eb' },
        { label: t('availability'), value: `${m?.availability ?? 0}%`, accent: '#7c3aed' },
        { label: t('quality'), value: `${m?.quality ?? 0}%`, accent: '#16a34a' },
        { label: 'OEE', value: `${m?.oee ?? 0}%`, accent: '#b45309' },
        { label: t('productionRate'), value: `${m?.productionRate ?? 0}${t('perHour')}`, accent: '#0891b2' },
        { label: t('downtime'), value: `${m?.downtimeMinutes ?? 0} ${t('minShort')}`, accent: '#ea580c' },
        { label: t('maintCountLabel'), value: String(r?.maintenanceCount ?? 0), accent: '#dc2626' },
      ],
      columns: [t('monthLabel'), 'OEE', t('efficiency'), t('quality'), t('availability'), t('downtime'), t('maintCountLabel')],
      rows: r
        ? [[monthName, `${r.oee}%`, `${r.efficiency}%`, `${r.quality}%`, `${r.availability}%`, `${r.totalDowntime} ${t('minShort')}`, String(r.maintenanceCount)]]
        : [],
      notes: r ? td(r.notes) : undefined,
    };
  };

  const buildWarehouse = (): ReportModel => {
    const totalValue = inventoryItems.reduce((s, i) => s + i.quantity * i.unitCost, 0);
    const normal = inventoryItems.filter((i) => i.status === 'Normal').length;
    const low = inventoryItems.filter((i) => i.status === 'Low').length;
    const critical = inventoryItems.filter((i) => i.status === 'Critical').length;
    return {
      docTitle: t('repDocWarehouse'),
      reportNo: makeReportNo('WH'),
      period: new Date().toLocaleDateString(locale),
      generatedOn: nowStr(),
      summary: [
        { label: t('totalItems'), value: String(inventoryItems.length), accent: '#2563eb' },
        { label: t('totalStockValue'), value: `$${totalValue.toLocaleString()}`, accent: '#16a34a' },
        { label: t('normalMaterials'), value: String(normal), accent: '#16a34a' },
        { label: t('lowMaterials'), value: String(low), accent: '#ea580c' },
        { label: t('criticalMaterials'), value: String(critical), accent: '#dc2626' },
      ],
      columns: [t('colItem'), t('colCategory'), t('colQty'), t('unitLabel'), t('minStockLabel'), t('reorderLabel'), t('statusWord'), t('colUnitCost'), t('totalValueLabel')],
      rows: inventoryItems.map((i) => [
        td(i.name),
        td(i.category),
        i.quantity.toLocaleString(),
        td(i.unit),
        i.minStock.toLocaleString(),
        i.reorderPoint.toLocaleString(),
        stockStatus(i.status),
        `$${i.unitCost}`,
        `$${(i.quantity * i.unitCost).toLocaleString()}`,
      ]),
    };
  };

  const handleGenerate = () => {
    const m =
      reportType === 'daily' ? buildDaily()
      : reportType === 'monthly' ? buildMonthly()
      : reportType === 'machine' ? buildMachine()
      : buildWarehouse();
    setModel(m);
    setTimeout(() => {
      reportRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleDownloadPdf = async () => {
    if (!reportRef.current || !model) return;
    setBusy(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const imgW = pageW;
      const imgH = (canvas.height * imgW) / canvas.width;
      let heightLeft = imgH;
      let position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, imgW, imgH);
      heightLeft -= pageH;
      while (heightLeft > 0) {
        position -= pageH;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgW, imgH);
        heightLeft -= pageH;
      }
      pdf.save(`${model.reportNo}.pdf`);
    } finally {
      setBusy(false);
    }
  };

  const typeCard = (
    type: 'daily' | 'monthly' | 'machine' | 'warehouse',
    emoji: string,
    title: string,
    desc: string
  ) => (
    <button
      onClick={() => {
        setReportType(type);
        setModel(null);
      }}
      className={`p-6 rounded-xl transition-all border-2 text-center ${
        reportType === type
          ? 'border-amber-500 bg-amber-50'
          : 'border-slate-200 bg-white hover:border-amber-300'
      }`}
    >
      <p className="text-2xl mb-2">{emoji}</p>
      <p className="font-bold text-slate-900">{title}</p>
      <p className="text-sm text-slate-600 mt-1">{desc}</p>
    </button>
  );

  return (
    <div className="space-y-8">
      <Header title={t('reportsTitle')} />

      <div className="px-4 sm:px-8 py-6 space-y-6">
        {/* Report Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {typeCard('daily', '📅', t('reportDaily'), t('reportDailyDesc'))}
          {typeCard('monthly', '📈', t('reportMonthly'), t('reportMonthlyDesc'))}
          {typeCard('machine', '⚙️', t('reportMachine'), t('reportMachineDesc'))}
          {typeCard('warehouse', '📦', t('reportWarehouse'), t('reportWarehouseDesc'))}
        </div>

        {/* Report Generation Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border-l-4 border-amber-600">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">⚙️ {t('reportOptions')}</h3>

          {reportType === 'daily' && (
            <div className="space-y-4">
              <p className="text-slate-600 mb-4">📅 {t('dailyReportNote')}</p>
              <button
                onClick={handleGenerate}
                className="px-8 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-lg hover:shadow-lg transition-all font-bold flex items-center gap-2"
              >
                <BarChart3 size={20} />
                {t('genDailyBtn')}
              </button>
            </div>
          )}

          {reportType === 'warehouse' && (
            <div className="space-y-4">
              <p className="text-slate-600 mb-4">📦 {t('reportWarehouseDesc')}</p>
              <button
                onClick={handleGenerate}
                className="px-8 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-lg hover:shadow-lg transition-all font-bold flex items-center gap-2"
              >
                <Boxes size={20} />
                {t('genWarehouseBtn')}
              </button>
            </div>
          )}

          {reportType === 'monthly' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">{t('monthLabel')}</label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                      <option key={m} value={m}>{td(MONTHS_AR[m - 1])}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">{t('yearLabel')}</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {[2024, 2025, 2026].map((y) => (<option key={y} value={y}>{y}</option>))}
                  </select>
                </div>
              </div>
              <button
                onClick={handleGenerate}
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
                  <label className="block text-sm font-bold text-slate-900 mb-2">{t('machineLabel')}</label>
                  <select
                    value={selectedMachine}
                    onChange={(e) => setSelectedMachine(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {initialMachines.map((m) => (<option key={m.id} value={m.id}>{td(m.name)}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">{t('monthLabel')}</label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {[1, 2, 3, 4].map((m) => (<option key={m} value={m}>{td(MONTHS_AR[m - 1])}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">{t('yearLabel')}</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {[2024, 2025].map((y) => (<option key={y} value={y}>{y}</option>))}
                  </select>
                </div>
              </div>
              <button
                onClick={handleGenerate}
                className="w-full px-8 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-lg hover:shadow-lg transition-all font-bold flex items-center justify-center gap-2"
              >
                <Zap size={20} />
                {t('genMachineBtn')}
              </button>
            </div>
          )}
        </div>

        {/* Report Preview + Download */}
        {model && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                onClick={handleDownloadPdf}
                disabled={busy}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg hover:shadow-lg transition-all font-bold flex items-center gap-2 disabled:opacity-60"
              >
                <FileDown size={20} />
                {busy ? t('preparingPdf') : t('repDownloadPdf')}
              </button>
            </div>

            {/* Scrollable preview so it never breaks mobile layout */}
            <div className="overflow-x-auto bg-slate-200 rounded-xl p-3 sm:p-6 flex justify-center">
              <div className="shadow-2xl" style={{ width: 794, flexShrink: 0 }}>
                <ReportDocument ref={reportRef} model={model} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
