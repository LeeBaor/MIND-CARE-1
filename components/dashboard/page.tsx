import { KPICards } from "@/components/dashboard/kpi-cards";
import { ChartsSection } from "@/components/dashboard/charts-section";
import { StudentTable } from "@/components/dashboard/student-table";

import { ExportButtons } from "@/components/dashboard/export-buttons";

export default function DashboardPage() {
  const kpiData = { ptrend: 0, coverage: 0, sosPending: 0, daysToSurvey: 0 };

  return (
    <div id="dashboard-content" className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bảng điều khiển Mind-Care</h1>
          <p className="text-sm text-gray-500">Giám sát & Sàng lọc sức khỏe tinh thần học sinh</p>
        </div>
        <ExportButtons />
      </div>

      <KPICards data={kpiData} />
      <ChartsSection />
      <StudentTable />
    </div>
  );
}
