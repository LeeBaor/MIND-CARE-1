'use client';

import { FileSpreadsheet, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export function ExportButtons() {
  // Xuất Excel
  const exportToExcel = () => {
    const data = [
      { ID: 'HS001', Ten: 'Nguyễn Văn A', Lop: '10A1', MucDo: 'Rất nặng' },
      { ID: 'HS002', Ten: 'Trần Thị B', Lop: '11B2', MucDo: 'Vừa' },
    ];
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'DS_Rui_Ro');
    XLSX.writeFile(workbook, 'Bao_Cao_Tam_Ly_MindCare.xlsx');
  };

  // Xuất PDF Toàn trang Dashboard
  const exportToPDF = async () => {
    const element = document.getElementById('dashboard-content');
    if (!element) return;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save('Bao_Cao_MindCare.pdf');
  };

  return (
    <div className="flex gap-2">
      <button onClick={exportToExcel} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-sm font-medium">
        <FileSpreadsheet className="w-4 h-4" /> Xuất Excel
      </button>
      <button onClick={exportToPDF} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium">
        <FileText className="w-4 h-4" /> Xuất PDF
      </button>
    </div>
  );
}