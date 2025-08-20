import { Gasto } from "../../../database/classes/Gasto.js"

import fs from 'fs';
import PDFDocument from 'pdfkit';

function generarPDF(ctx, data) {
    // Datos de la tabla
  
  // Crear un nuevo documento PDF
  const doc = new PDFDocument({
    size: [700, 900], // Aseguramos que la página sea de tamaño A4
    margin: 50, // Márgenes de la página
  });
  
  // Configurar el archivo de salida
  doc.pipe(fs.createWriteStream('resumen.pdf'));
  
  // Establecer el estilo de texto
  doc.fontSize(12);
  const columnWidths = [90, 90, 20, 250, 100, 80]; // Anchos de las columnas
  let y = 70; // Empezar debajo de los encabezados
  
  // Títulos de la tabla
  doc.text('FECHA', 50, 50, { width: columnWidths[0] });
    doc.text('FECHA PAGO', 50 + columnWidths[0], 50, { width: columnWidths[1] });
    doc.text('A', 50 + columnWidths[0] + columnWidths[1], 50, { width: columnWidths[2] });
    doc.text('DESCRIPCION', 50 + columnWidths[0] + columnWidths[1] + columnWidths[2], 50, { width: columnWidths[3] });
    doc.text('CATEGORIA', 50 + columnWidths[0] + columnWidths[1] + columnWidths[2] + columnWidths[3], 50, { width: columnWidths[4] });
    doc.text('MONTO', 50 + columnWidths[0] + columnWidths[1] + columnWidths[2] + columnWidths[3] + columnWidths[4], 50, { width: columnWidths[5] });

  // Línea separadora
  doc.moveTo(50, 60)
     .lineTo(650, 60)
     .stroke();
  
  // Función para dibujar los datos
  const drawRow = (row, yPosition) => {
    let x = 50;
    doc.text(new Date(row.FECHA).toLocaleDateString(), x, yPosition, { width: columnWidths[0] });
    x += columnWidths[0];
    doc.text(new Date(row['FECHA PAGO']).toLocaleDateString(), x, yPosition, { width: columnWidths[1] });
    x += columnWidths[1];
    doc.text(row.A, x, yPosition, { width: columnWidths[2] });
    x += columnWidths[2];
    doc.text(row.DESCRIPCION, x, yPosition, { width: columnWidths[3] });
    x += columnWidths[3];
    doc.text(row.CATEGORIA, x, yPosition, { width: columnWidths[4] });
    x += columnWidths[4];
    doc.text(`$${row.MONTO.toLocaleString()}`, x, yPosition, { width: columnWidths[5] });
  };
  
  // Dibujar los datos
  data.forEach((row, index) => {
    if (y > 750) { // Si se pasa de la altura máxima de la página
      doc.addPage(); // Añadir nueva página
      y = 50; // Resetear la posición Y para la nueva página
    }
  
    drawRow(row, y); // Dibujar la fila
    y += 20; // Mover hacia abajo para la siguiente fila
  });
  
  // Finalizar el archivo PDF
  doc.end();
  
  
}

export function resumen(ctx, esCron = false) {

    const gastos = new Gasto()

    gastos.consultarResumenMensual().then(async data => {
        await generarPDF(ctx, data)
        
        await ctx.replyWithDocument({ source: 'resumen.pdf' });
    })
}

