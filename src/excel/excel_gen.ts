// File Management
import { downloadBlob } from '../download/download'

// Installed Packages
import type { Style, BorderStyle, Column } from 'exceljs'


// Cell Types
export type ExcelCellStyle = Style
export type ExcelCellValue = string | { formula: string }
export type ExcelCell = {
    value: ExcelCellValue,
    style?: Style
}

// Row Types
export type ExcelRow = {
    style?: Style,
    height?: number,
    data: ExcelCell[]
}

// Column Types
export type ExcelColumn = Column

// Worksheet types
export type ExcelWorksheet = {
    name: string,
    defaultColWidth?: number
    defaultRowHeight?: number,
    rows: ExcelRow[],
    columns: ExcelColumn[]
}


/**
 * A class containing many static functions that return common styles for cells
 */
export class ExcelCommonStyle {
    static EURO_NUM_FMT = '"€"#,##0.00';

    /**
     * Generates a common solid background color for the excel cell
     * @param color Either in `#f2f2f2` or `FFf2f2f2` format. Do not shorten the hex color like `#ddd`
     */
    static cellSolidFill(color: string) {
        let c = color;
        if (c[0] === "#") c = c.replace("#", "FF")
        return {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: c },
            bgColor: { argb: c }
        }
    }

    /**
     * Generates a common border style for all 4 borders of the cell
     * @param color Either in `#f2f2f2` or `FFf2f2f2` format. Do not shorten the hex color like `#ddd`
     * @param borderStyle The style of borders
     */
    static cellAllBorders(color: string, borderStyle?: BorderStyle) {
        let c = color;
        if (c[0] === "#") c = c.replace("#", "FF")
        let b = { style: borderStyle, color: { argb: c } }
        return { top: b, left: b, bottom: b, right: b };
    }
}


export default class ExcelGen {
    public worksheets: ExcelWorksheet[] = [];
    static colIndex = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    constructor(public data: {
        creator: string,
        createdAt: Date,
        /** Whether the application shall perform a full recalculation when the Excel file is opened */
        fullCalcOnLoad: boolean
    }) { }

    async generate() {
        const Excel = await import('exceljs');

        // Creating the workbook (excel file)
        let workbook = new Excel.Workbook();

        workbook.creator = this.data.creator;
        workbook.created = this.data.createdAt;

        workbook.calcProperties.fullCalcOnLoad = this.data.fullCalcOnLoad;

        // Creating the worksheets (Each sheet of the file)
        this.worksheets.map(ws => {
            let worksheet = workbook.addWorksheet(ws.name, {
                properties: {
                    defaultColWidth: ws.defaultColWidth,
                    defaultRowHeight: ws.defaultRowHeight,
                },
            });

            worksheet.columns = ws.columns

            let valueRows: ExcelCellValue[][] = []

            for (let i = 0; i < ws.rows.length; i++) {
                const row: ExcelRow = ws.rows[i];
                valueRows.push(row.data.map(z => z.value))
                
                if (row.style) {
                    let wr = worksheet.getRow(i + 1);
                    
                    if (row.height) {
                        wr.height = row.height
                    }
                    
                    wr.eachCell((c, col) => {
                        c.style = row.style!
                    })
                }

                for (let k = 0; k < row.data.length; k++) {
                    const style = row.data[k].style;

                    if (!style) continue;

                    let c = worksheet.getCell(`${ExcelGen.colIndex[k]}${i + 1}`)
                    c.style = style
                }
            }

            worksheet.addRows(valueRows)

        })

        return workbook
    }

    async getBlob() {
        let v = await (await this.generate()).xlsx.writeBuffer();
        return new Blob([v], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    }

    async download(fileName: string) {
        let blob = await this.getBlob()
        let n = fileName
        if (!n.toLowerCase().endsWith(".xlsx")) n += ".xlsx"
        downloadBlob(blob, n)
    }
}

