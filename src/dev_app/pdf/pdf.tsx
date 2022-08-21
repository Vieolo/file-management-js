// React
import React from 'react'

// File Management
import PDFGen from '../../pdf/pdf_gen'

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
        pdf.content = ["PDF File"]
        await pdf.downloadPDF("ss")
      }

    return <div>
        <button onClick={handleGeneratePDF}>Generate PDF</button>
    </div>
}