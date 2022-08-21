// React
import React, { useState } from 'react';

// Vieolo UI

// Local UI
import PDFPage from '../pdf/pdf';
import ExcelPage from '../excel/excel';


export default function HomePage(props: {}) {
    let [right, setRight] = useState<string>("")

    let pages: { [key: string]: any } = {
        "pdf": <PDFPage />,
        "excel": <ExcelPage />,
    }

    return <div>
        {
            [
                {
                    id: "pdf",
                    title: "PDF",
                    selected: false,
                    onClick: () => setRight("pdf")
                },
                {
                    id: "excel",
                    title: "Excel",
                    selected: false,
                    onClick: () => setRight("excel")
                }
            ].map(z => {
                return <button key={z.id} onClick={z.onClick}>{z.title}</button>
            })
        }

        {
            pages[right] && pages[right]
        }
    </div>
}