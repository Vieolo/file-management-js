/**
 * A class containing many static functions that return common styles for cells
 */
export class ExcelCommonStyle {
    /**
     * Generates a common solid background color for the excel cell
     * @param color Either in `#f2f2f2` or `FFf2f2f2` format. Do not shorten the hex color like `#ddd`
     */
    static cellSolidFill(color) {
        let c = color;
        if (c[0] === "#")
            c = c.replace("#", "FF");
        return {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: c },
            bgColor: { argb: c }
        };
    }
    /**
     * Generates a common border style for all 4 borders of the cell
     * @param color Either in `#f2f2f2` or `FFf2f2f2` format. Do not shorten the hex color like `#ddd`
     * @param borderStyle The style of borders
     */
    static cellAllBorders(color, borderStyle) {
        let c = color;
        if (c[0] === "#")
            c = c.replace("#", "FF");
        let b = { style: borderStyle, color: { argb: c } };
        return { top: b, left: b, bottom: b, right: b };
    }
}
ExcelCommonStyle.EURO_NUM_FMT = '"€"#,##0.00';
export default class ExcelGen {
    constructor(data) {
        this.data = data;
        this.worksheets = [];
    }
    async generate() {
        const Excel = await import('exceljs');
        // Creating the workbook (excel file)
        let workbook = new Excel.Workbook();
        workbook.creator = this.data.creator;
        workbook.created = this.data.createdAt;
        workbook.calcProperties.fullCalcOnLoad = this.data.fullCalcOnLoad;
        // Creating the worksheets (Each sheet of the file)
        this.worksheets.forEach(ws => {
            let worksheet = workbook.addWorksheet(ws.name, {
                properties: {
                    defaultColWidth: ws.defaultColWidth,
                    defaultRowHeight: ws.defaultRowHeight,
                },
            });
            worksheet.columns = ws.columns;
            let valueRows = [];
            for (let i = 0; i < ws.rows.length; i++) {
                const row = ws.rows[i];
                valueRows.push(row.data.map(z => z.value));
            }
            worksheet.addRows(valueRows);
            for (let i = 0; i < ws.rows.length; i++) {
                const row = ws.rows[i];
                valueRows.push(row.data.map(z => z.value));
                if (row.style) {
                    let wr = worksheet.getRow(i + 1);
                    if (row.height) {
                        wr.height = row.height;
                    }
                    wr.eachCell((c, col) => {
                        c.style = row.style;
                    });
                }
                for (let k = 0; k < row.data.length; k++) {
                    const style = row.data[k].style;
                    if (!style)
                        continue;
                    let c = worksheet.getCell(`${ExcelGen.colIndex[k]}${i + 1}`);
                    c.style = style;
                }
            }
        });
        return workbook;
    }
    async getBlob() {
        let v = await (await this.generate()).xlsx.writeBuffer();
        return new Blob([v], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    }
    async download(fileName) {
        let blob = await this.getBlob();
        let n = fileName;
        if (!n.toLowerCase().endsWith(".xlsx"))
            n += ".xlsx";
        let db = (await import("../download/download")).downloadBlob;
        db(blob, n);
    }
}
ExcelGen.colIndex = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
