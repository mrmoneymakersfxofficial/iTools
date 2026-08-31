"use client";

import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { generateExcelReport } from "@/lib/reports/generateExcel";
import { generatePDFReport } from "@/lib/reports/generatePDF";

interface ExportButtonsProps {
  orders: any[];
  topProducts: any[];
}

export function ExportButtons({ orders, topProducts }: ExportButtonsProps) {
  
  const handleExportExcel = () => {
    const excelData = orders.map(o => ({
      "ID Pedido": o.orderNumber || o.id,
      "Fecha": new Date(o.createdAt).toLocaleDateString("es-PE"),
      "Cliente": o.user?.name || "N/A",
      "Total": o.total,
      "Estado": o.status
    }));
    generateExcelReport(excelData, "iTools_Reporte_Ventas");
  };

  const handleExportPDF = () => {
    const columns = ["N° Pedido", "Fecha", "Cliente", "Total", "Estado"];
    const pdfData = orders.map(o => [
      o.orderNumber || o.id.slice(0,8),
      new Date(o.createdAt).toLocaleDateString("es-PE"),
      o.user?.name || "N/A",
      `S/ ${o.total.toFixed(2)}`,
      o.status
    ]);
    generatePDFReport("Reporte de Ventas", columns, pdfData, "iTools_Reporte_Ventas");
  };

  return (
    <div className="flex items-center gap-2">
      <button 
        onClick={handleExportExcel}
        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
      >
        <FileSpreadsheet className="w-4 h-4" />
        Excel
      </button>
      <button 
        onClick={handleExportPDF}
        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
      >
        <FileText className="w-4 h-4" />
        PDF
      </button>
    </div>
  );
}
