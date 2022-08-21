// React
import React from 'react';

// File Management
import ExcelGen, { ExcelCommonStyle } from '../../../src/excel/excel_gen'

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
            columns: [
                {},
                { width: 60 }
            ],
            rows: [
                { data: [{ value: "Something" }, { value: 123 }, { value: 2500, style: { numFmt: ExcelCommonStyle.EURO_NUM_FMT } }] },
                { data: ["zz", "aa", "ss", "cc"].map(z => {return {value: z}}), style: { fill: ExcelCommonStyle.cellSolidFill("#dddddd") } },
                { data: [{ value: "xx", style: { fill: ExcelCommonStyle.cellSolidFill("#dddddd") } }] }
            ]
        }
    ]

    excel.download("xx")
}