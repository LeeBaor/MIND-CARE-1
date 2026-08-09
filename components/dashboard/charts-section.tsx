'use client';

import dynamic from 'next/dynamic';

// Dynamic import để tránh lỗi SSR với ApexCharts
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export function ChartsSection() {
  // Cấu hình Biểu đồ đường (Xu hướng 12 tháng)
  const lineChartOptions = {
    chart: { id: 'dass21-trend', toolbar: { show: false } },
    xaxis: { categories: ['T9', 'T10', 'T11', 'T12', 'T1', 'T2', 'T3', 'T4', 'T5', 'T6'] },
    colors: ['#ef4444', '#f59e0b', '#10b981'],
    stroke: { curve: 'smooth' as const, width: 3 },
  };

  const lineChartSeries = [
    { name: 'Trầm cảm', data: [12, 15, 18, 22, 20, 25, 28, 24, 21, 19] },
    { name: 'Lo âu', data: [20, 22, 25, 30, 28, 35, 32, 29, 27, 25] },
    { name: 'Căng thẳng', data: [15, 18, 20, 25, 22, 28, 30, 26, 23, 20] },
  ];

  // Cấu hình Biểu đồ tròn (Phân bổ DASS-21)
  const pieChartOptions = {
    labels: ['Bình thường', 'Nhẹ', 'Vừa', 'Nặng', 'Rất nặng'],
    colors: ['#10b981', '#3b82f6', '#f59e0b', '#f97316', '#ef4444'],
    legend: { position: 'bottom' as const },
  };

  const pieChartSeries = [55, 20, 12, 8, 5]; // Tỷ lệ %

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
        <h4 className="font-bold text-gray-800 mb-4">Xu hướng tổn thương tâm lý theo năm học</h4>
        <Chart options={lineChartOptions} series={lineChartSeries} type="line" height={300} />
      </div>

      <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
        <h4 className="font-bold text-gray-800 mb-4">Phân bổ mức độ DASS-21</h4>
        <Chart options={pieChartOptions} series={pieChartSeries} type="pie" height={300} />
      </div>
    </div>
  );
}