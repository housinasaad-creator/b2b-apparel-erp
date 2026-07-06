import React from 'react';
import { Header, StatsCard, Chart } from '../components';
import { dashboardStats, weeklyChartData } from '../data';
import { useI18n } from '../i18n';

export const Dashboard: React.FC = () => {
  const { t, td } = useI18n();

  // Translate weekday names on the X axis
  const chartData = weeklyChartData.map((d) => ({ ...d, name: td(d.name) }));
  const seriesLabels = { sales: t('seriesSales'), production: t('seriesProduction') };

  return (
    <div className="space-y-8">
      <Header title={t('dashboardTitle')} />

      {/* Statistics Cards */}
      <div className="px-4 sm:px-8 py-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">{t('dailyStats')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardStats.map((stat, idx) => (
            <StatsCard
              key={idx}
              title={td(stat.title)}
              value={stat.value}
              unit={stat.unit ? td(stat.unit) : undefined}
              icon={stat.icon}
              color={stat.color}
              trend={stat.trend}
            />
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="px-4 sm:px-8 py-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Chart */}
          <Chart
            title={t('salesWeekly')}
            data={chartData}
            type="line"
            dataKeys={['sales']}
            labels={seriesLabels}
          />

          {/* Production Chart */}
          <Chart
            title={t('productionWeekly')}
            data={chartData}
            type="bar"
            dataKeys={['production']}
            labels={seriesLabels}
          />
        </div>

        {/* Combined Chart */}
        <Chart
          title={t('salesVsProduction')}
          data={chartData}
          type="line"
          dataKeys={['sales', 'production']}
          labels={seriesLabels}
        />
      </div>

      {/* Quick Stats */}
      <div className="px-4 sm:px-8 py-6 mx-4 sm:mx-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
        <h3 className="text-lg font-bold text-slate-900 mb-4">{t('quickSummary')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-slate-600">{t('productivity')}</p>
            <p className="text-2xl font-bold text-indigo-600">94%</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-slate-600">{t('completedOrders')}</p>
            <p className="text-2xl font-bold text-green-600">85%</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-slate-600">{t('productQuality')}</p>
            <p className="text-2xl font-bold text-purple-600">98%</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-slate-600">{t('onTimeDelivery')}</p>
            <p className="text-2xl font-bold text-orange-600">92%</p>
          </div>
        </div>
      </div>
    </div>
  );
};
