import React from 'react';
import './App.css';
import PDFGen from '../../src/pdf/pdf_gen'

function App() {

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

  return (
    <div className="App">
      <button onClick={handleGeneratePDF}>Generate PDF</button>
    </div>
  );
}

export default App;
