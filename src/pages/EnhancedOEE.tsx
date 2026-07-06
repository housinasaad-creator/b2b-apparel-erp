import React, { useState } from 'react';
import { Header, ProgressBar } from '../components';
import { machines as initialMachines } from '../data';
import { Machine } from '../types';
import { ChevronDown, Edit2, Save, X } from 'lucide-react';
import { useI18n } from '../i18n';

type MachineStatus = 'Running' | 'Idle' | 'Maintenance';

interface MachineWithNotes extends Machine {
  notes?: string;
}

export const EnhancedOEE: React.FC = () => {
  const { t, td } = useI18n();
  const [machines, setMachines] = useState<MachineWithNotes[]>(
    initialMachines.map((m) => ({ ...m, notes: '' }))
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<MachineWithNotes>>({});

  const statusOptions: MachineStatus[] = ['Running', 'Idle', 'Maintenance'];
  const statusLabels: { [key in MachineStatus]: string } = {
    Running: t('statusRunning'),
    Idle: t('statusIdle'),
    Maintenance: t('statusMaintenance'),
  };
  const statusColors: { [key in MachineStatus]: string } = {
    Running: 'bg-green-100 text-green-700',
    Idle: 'bg-slate-100 text-slate-700',
    Maintenance: 'bg-orange-100 text-orange-700',
  };

  const handleStartEdit = (machine: MachineWithNotes) => {
    setEditingId(machine.id);
    setEditData({ ...machine });
  };

  const handleSaveEdit = (machineId: string) => {
    setMachines(
      machines.map((m) =>
        m.id === machineId ? { ...m, ...editData } : m
      )
    );
    setEditingId(null);
    setEditData({});
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return 'text-green-600';
    if (efficiency >= 75) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-8">
      <Header title={t('oeeTitle')} />

      <div className="px-4 sm:px-8 py-6 space-y-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6">
            <p className="text-sm opacity-90 mb-2">{t('oeeRunning')}</p>
            <p className="text-4xl font-bold">
              {machines.filter((m) => m.status === 'Running').length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-6">
            <p className="text-sm opacity-90 mb-2">{t('oeeNeedMaint')}</p>
            <p className="text-4xl font-bold">
              {machines.filter((m) => m.status === 'Maintenance').length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-slate-500 to-slate-600 text-white rounded-xl p-6">
            <p className="text-sm opacity-90 mb-2">{t('oeeIdle')}</p>
            <p className="text-4xl font-bold">
              {machines.filter((m) => m.status === 'Idle').length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6">
            <p className="text-sm opacity-90 mb-2">{t('oeeAvgEff')}</p>
            <p className="text-4xl font-bold">
              {(machines.reduce((sum, m) => sum + m.efficiency, 0) / machines.length).toFixed(0)}%
            </p>
          </div>
        </div>

        {/* Machines Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {machines.map((machine) => (
            <div
              key={machine.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all border-l-4 border-indigo-600"
            >
              {/* Header with Status Dropdown */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{td(machine.name)}</h3>

                    {/* Status Dropdown */}
                    {editingId === machine.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{t('statusWord')}:</span>
                        <select
                          value={editData.status || machine.status}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              status: e.target.value as MachineStatus,
                            })
                          }
                          className="px-3 py-1 bg-white text-slate-900 rounded-lg text-sm font-bold"
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {statusLabels[status]}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-4 py-1 rounded-full text-sm font-bold ${
                            statusColors[machine.status as MachineStatus]
                          }`}
                        >
                          {statusLabels[machine.status as MachineStatus]}
                        </span>
                        <button
                          onClick={() => handleStartEdit(machine)}
                          className="p-2 text-white hover:bg-white/20 rounded-lg transition-all"
                          title={t('edit')}
                        >
                          <ChevronDown size={20} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Edit/Save Buttons */}
                  {editingId === machine.id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveEdit(machine.id)}
                        className="p-2 bg-green-500 hover:bg-green-600 rounded-lg transition-all text-white"
                        title={t('save')}
                      >
                        <Save size={20} />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-2 bg-red-500 hover:bg-red-600 rounded-lg transition-all text-white"
                        title={t('cancel')}
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartEdit(machine)}
                      className="p-2 text-white hover:bg-white/20 rounded-lg transition-all"
                      title={t('edit')}
                    >
                      <Edit2 size={20} />
                    </button>
                  )}
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6">
                {/* Efficiency Metrics */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-bold text-slate-600">{t('efficiency')}</p>
                      <p className={`text-2xl font-bold ${getEfficiencyColor(machine.efficiency)}`}>
                        {editingId === machine.id ? (
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={editData.efficiency || machine.efficiency}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                efficiency: parseInt(e.target.value),
                              })
                            }
                            className="w-20 px-2 py-1 border border-slate-300 rounded text-slate-900"
                          />
                        ) : (
                          `${machine.efficiency}%`
                        )}
                      </p>
                    </div>
                    <ProgressBar progress={machine.efficiency} />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-bold text-slate-600">{t('availability')}</p>
                      <p className="text-xl font-bold text-blue-600">
                        {machine.availability}%
                      </p>
                    </div>
                    <ProgressBar progress={machine.availability} />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-bold text-slate-600">{t('quality')}</p>
                      <p className="text-xl font-bold text-green-600">
                        {machine.quality}%
                      </p>
                    </div>
                    <ProgressBar progress={machine.quality} />
                  </div>
                </div>

                {/* OEE Score */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border-l-4 border-indigo-600">
                  <p className="text-sm text-slate-600 mb-2">{t('oeeTotal')}</p>
                  <p className={`text-4xl font-bold ${getEfficiencyColor(machine.oee)}`}>
                    {machine.oee}%
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    {t('oeeFormulaNote')}
                  </p>
                </div>

                {/* Production & Downtime */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-600 mb-1">{t('productionRate')}</p>
                    <p className="text-2xl font-bold text-indigo-600">
                      {machine.productionRate}{t('perHour')}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-600 mb-1">{t('downtime')}</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {editingId === machine.id ? (
                        <input
                          type="number"
                          value={editData.downtimeMinutes || machine.downtimeMinutes}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              downtimeMinutes: parseInt(e.target.value),
                            })
                          }
                          className="w-20 px-2 py-1 border border-slate-300 rounded text-slate-900"
                        />
                      ) : (
                        `${machine.downtimeMinutes} ${t('minShort')}`
                      )}
                    </p>
                  </div>
                </div>

                {/* Notes Section */}
                <div className="border-t-2 border-slate-200 pt-4">
                  <p className="text-sm font-bold text-slate-900 mb-2">📝 {t('notes')}</p>
                  {editingId === machine.id ? (
                    <textarea
                      value={editData.notes || machine.notes || ''}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          notes: e.target.value,
                        })
                      }
                      placeholder={t('notesPlaceholder')}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-normal"
                      rows={3}
                    />
                  ) : (
                    <div className="bg-slate-50 rounded-lg p-3 min-h-20">
                      <p className="text-slate-600 text-sm">
                        {machine.notes ? machine.notes : t('noNotes')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* OEE Formula & Info */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border-2 border-blue-200">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">📊 {t('oeeFormula')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg p-4 border-l-4 border-blue-600">
              <p className="text-sm text-slate-600 mb-2">{t('performanceW')}</p>
              <p className="text-xl font-bold text-blue-600">E</p>
              <p className="text-xs text-slate-500 mt-2">{t('actualSpeed')}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border-l-4 border-purple-600">
              <p className="text-sm text-slate-600 mb-2">{t('availabilityW')}</p>
              <p className="text-xl font-bold text-purple-600">A</p>
              <p className="text-xs text-slate-500 mt-2">{t('uptimeRatio')}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border-l-4 border-green-600">
              <p className="text-sm text-slate-600 mb-2">{t('qualityW')}</p>
              <p className="text-xl font-bold text-green-600">Q</p>
              <p className="text-xs text-slate-500 mt-2">{t('goodRatio')}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 border-2 border-indigo-300">
            <p className="text-center text-2xl font-bold text-indigo-600">
              OEE = (E × A × Q) / 100
            </p>
            <p className="text-center text-sm text-slate-600 mt-3">
              {t('oeeGradeNote')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
