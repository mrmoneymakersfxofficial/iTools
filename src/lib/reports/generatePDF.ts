import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generatePDFReport(title: string, columns: string[], data: any[][], filename: string) {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(209, 0, 28); // iTools Red
  doc.text("iTools Perú", 14, 22);
  
  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text(title, 14, 32);
  
  const date = new Date().toLocaleDateString("es-PE");
  doc.setFontSize(10);
  doc.text(`Fecha de emisión: ${date}`, 14, 40);

  autoTable(doc, {
    startY: 45,
    head: [columns],
    body: data,
    theme: "striped",
    headStyles: { fillColor: [17, 17, 17] }, // Dark header
    styles: { fontSize: 9 },
  });

  doc.save(`${filename}.pdf`);
}
