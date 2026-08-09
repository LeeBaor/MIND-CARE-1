import { AlertTriangle, Users, HeartPulse, Calendar } from "lucide-react";

interface KPICardsProps {
  data: {
    ptrend: number;       // Tỷ lệ biến động rủi ro (%)
    coverage: number;     // Tỷ lệ bao phủ (%)
    sosPending: number;   // Ca SOS chưa xử lý
    daysToSurvey: number; // Đếm ngược khảo sát
  };
}

export function KPICards({ data }: KPICardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Card 1: Tỷ lệ rủi ro */}
      <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">Biến động rủi ro (Ptrend)</p>
          <h3 className={`text-2xl font-bold ${data.ptrend > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {data.ptrend > 0 ? `+${data.ptrend}%` : `${data.ptrend}%`}
          </h3>
        </div>
        <div className="p-3 bg-red-50 text-red-500 rounded-lg">
          <HeartPulse className="w-6 h-6" />
        </div>
      </div>

      {/* Card 2: Tỷ lệ tiếp cận */}
      <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">Tỷ lệ bao phủ</p>
          <h3 className="text-2xl font-bold text-gray-800">{data.coverage}%</h3>
        </div>
        <div className="p-3 bg-blue-50 text-blue-500 rounded-lg">
          <Users className="w-6 h-6" />
        </div>
      </div>

      {/* Card 3: SOS Chờ xử lý */}
      <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">Tín hiệu SOS mới</p>
          <h3 className="text-2xl font-bold text-red-600">{data.sosPending} ca</h3>
        </div>
        <div className="p-3 bg-amber-50 text-amber-500 rounded-lg animate-pulse">
          <AlertTriangle className="w-6 h-6" />
        </div>
      </div>

      {/* Card 4: Đếm ngược khảo sát */}
      <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">Đợt khảo sát tới</p>
          <h3 className="text-2xl font-bold text-gray-800">{data.daysToSurvey} ngày</h3>
        </div>
        <div className="p-3 bg-purple-50 text-purple-500 rounded-lg">
          <Calendar className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}