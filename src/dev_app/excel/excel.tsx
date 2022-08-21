// React
import React from 'react';

// File Management
import ExcelGen from '../../../src/excel/excel_gen'

export default function ExcelPage(props: {}) {
    return <div>
        <button onClick={() => generateExcel()}>Generate Excel</button>
    </div>
}


async function generateExcel() {
    let excel = new ExcelGen({
        creator: "Vieolo",
        createdAt: new Date(),
        fullCalcOnLoad: true
    });

    excel.worksheets = [
        {
            name: "First Sheet",
            columns: [],
            rows: [
                {data: [{value: "Something"}]}
            ]
        }
    ]

    excel.download("xx")
}