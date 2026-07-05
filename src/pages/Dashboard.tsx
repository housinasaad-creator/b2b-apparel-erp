import React from 'react';
import { Header, StatsCard, Chart } from '../components';
import { dashboardStats, weeklyChartData } from '../data';

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <Header title="لوحة التحكم الرئيسية" />

      {/* Statistics Cards */}
      <div className="px-8 py-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">الإحصائيات اليومية</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardStats.map((stat, idx) => (
            <StatsCard
              key={idx}
              title={stat.title}
              value={stat.value}
              unit={stat.unit}
              icon={stat.icon}
              color={stat.color}
              trend={stat.trend}
            />
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="px-8 py-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Chart */}
          <Chart
            title="حركة المبيعات الأسبوعية"
            data={weeklyChartData}
            type="line"
            dataKeys={['sales']}
          />

          {/* Production Chart */}
          <Chart
            title="حركة الإنتاج الأسبوعية"
            data={weeklyChartData}
            type="bar"
            dataKeys={['production']}
          />
        </div>

        {/* Combined Chart */}
        <Chart
          title="المبيعات مقابل الإنتاج (مقارنة أسبوعية)"
          data={weeklyChartData}
          type="line"
          dataKeys={['sales', 'production']}
        />
      </div>

      {/* Quick Stats */}
      <div className="px-8 py-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
        <h3 className="text-lg font-bold text-slate-900 mb-4">ملخص سريع</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-slate-600">معدل الإنتاجية</p>
            <p className="text-2xl font-bold text-indigo-600">94%</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-slate-600">الطلبيات المنجزة</p>
            <p className="text-2xl font-bold text-green-600">85%</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-slate-600">جودة المنتج</p>
            <p className="text-2xl font-bold text-purple-600">98%</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-slate-600">توقت التسليم</p>
            <p className="text-2xl font-bold text-orange-600">92%</p>
          </div>
        </div>
      </div>
    </div>
  );
};
