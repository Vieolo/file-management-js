// React
import React from 'react'

// File Management
import PDFGen, { PDFGenTable, PDFGenTableCell, PDFGenText } from '../../pdf/pdf_gen'

export default function PDFPage(props: {}) {

    async function handleGeneratePDF() {
        let pdf = new PDFGen({
          fonts: {
            "Barlow": {
              normal: window.location.origin + '/static/fonts/BarlowCondensed-Regular.ttf',
              bold: window.location.origin + '/static/fonts/BarlowCondensed-SemiBold.ttf',
              italics: window.location.origin + '/static/fonts/BarlowCondensed-Italic.ttf',
              bolditalics: window.location.origin + '/static/fonts/BarlowCondensed-SemiBoldItalic.ttf',
            }
          },
          defaultStyle: {
            font: "Barlow"
          }
        })
        pdf.content = [
          "PDF File",
          new PDFGenTable({
            widths: ["*", "*"],
            body: [
              [new PDFGenTableCell({element: "Text", cellProperties: {colSpan: 2}}), " "],
              [new PDFGenTableCell({element: new PDFGenText("Something"), cellProperties: {rowSpan: 2}}), " "],
              [" ", " "],
              [new PDFGenTableCell({element: new PDFGenText({text: "Something else"})}), ""],
            ],
            layout: {
              fillColor: (i, n, c) => {
                if (i === 0) return '#f2f2f2'
                return null
              }
            }
          })
        ]
        await pdf.downloadPDF("ss")
      }

    return <div>
        <button onClick={handleGeneratePDF}>Generate PDF</button>
    </div>
}