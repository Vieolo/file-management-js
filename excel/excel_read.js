function getCellActualValue(value) {
    if (!value || !value.valueOf())
        return { value: null, type: 'null', stringRepresentation: "" };
    let str = value.toString();
    if (typeof value === 'string')
        return { value: value.valueOf(), type: 'string', stringRepresentation: str };
    else if (typeof value === 'number')
        return { value: value.valueOf(), type: 'number', stringRepresentation: str };
    else if (typeof value === 'boolean')
        return { value: value.valueOf(), type: 'boolean', stringRepresentation: str };
    // The value is an object
    else {
        // If the cell is a date
        if (value instanceof Date) {
            let s = value.toISOString().split("T")[1].split(".")[0];
            let t = { hour: +s.split(":")[0], minute: +s.split(":")[1], second: +s.split(":")[2] };
            // If the day of the date is `1899-12-30`, then the value is actually time rather than the whole date
            if (value.getUTCFullYear() === 1899 && value.getUTCMonth() === 11 && value.getUTCDate() === 30) {
                return {
                    value: s,
                    type: 'time',
                    stringRepresentation: value.toISOString(),
                    time: t
                };
            }
            return { value: value.toISOString(), type: 'date', stringRepresentation: value.toISOString(), date: value.toISOString().split("T")[0], time: t };
        }
        // If the value is not of basic types and date, it is an object
        // The following lines check if the existence of unique keys in the object to get the details and type
        // The cell has an error, possible errors are: '#N/A' | '#REF!' | '#NAME?' | '#DIV/0!' | '#NULL!' | '#VALUE!' | '#NUM!'
        else if ("error" in value)
            return { value: value.valueOf().error, type: 'error', stringRepresentation: str };
        else if ("richText" in value)
            return { value: JSON.stringify(value.valueOf().richText), type: 'richText', stringRepresentation: str };
        else if ("hyperlink" in value)
            return { value: value.valueOf().hyperlink, type: 'hyperlink', text: value.valueOf().text, stringRepresentation: str };
        else if ("sharedFormula" in value)
            return { value: value.valueOf().sharedFormula, type: 'sharedFormula', result: JSON.stringify(value.valueOf().result), date1904: value.date1904 || false, formula: value.valueOf().formula, stringRepresentation: str };
        else if ("formula" in value)
            return { value: value.valueOf().formula, type: 'formula', result: JSON.stringify(value.valueOf().result), date1904: value.date1904 || false, formula: value.valueOf().formula, stringRepresentation: str };
    }
    // If the type of the cell is could not be determined, a json representation of the value is returned
    return { value: JSON.stringify(value.valueOf()), type: 'unknown', stringRepresentation: str };
}
/**
 * This function reads and parse the contents of an excel file
 * @param file The Blob/File of the excel files
 */
export async function readExcelContent(file, options) {
    let result = { workSheets: [] };
    // Importing the `exceljs` package and necessary functions
    const Excel = await import('exceljs');
    let fileToArrayBuffer = (await import("../convertors/convertors")).fileToArrayBuffer;
    // Creating the workbook (excel file)
    // This workbook will load the contents of the file
    let workbook = new Excel.Workbook();
    await workbook.xlsx.load(await fileToArrayBuffer(file));
    for (let i = 0; i < workbook.worksheets.length; i++) {
        const rws = workbook.worksheets[i]; // Raw Work Sheet
        rws.unMergeCells();
        // The initial worksheet object
        let ws = {
            rows: [],
            columnCount: rws.columnCount,
            columnWithContentCount: rws.actualColumnCount,
            rowCount: rws.rowCount,
            rowWithContentCount: rws.actualRowCount,
            name: rws.name,
        };
        // Looping through the rows of the worksheet
        rws.eachRow((row, rowNumber) => {
            let r = {
                rowNumber: rowNumber,
                cellCount: row.actualCellCount,
                hasValues: row.hasValues,
                cells: []
            };
            // Looping through the cells of the row
            row.eachCell((cell, collNumber) => {
                // If a cell is merged with others, the value of the merged cells will be recorded only as the left most and top most cells which is the master cell
                // Each cell has a master. If the master is not the same as the current cell, it is part of the merge collection
                // The current cell (which is not the master) will be used to calculate the extent of merge)
                if (cell.isMerged && cell.master && (+cell.master.row !== rowNumber || +cell.master.col !== collNumber)) {
                    // To calculate the extent of the merge of the master cell, first we have to find it
                    // If the row number of the master is the same as the current row, we look into the cells of the current row
                    // If the row number of the master is different, first we have to find the row which contains the master cell first
                    let masterCell;
                    if (+cell.master.row === rowNumber) {
                        masterCell = r.cells.find(z => z.columnNumber === +cell.master.col && z.rowNumber === +cell.master.row);
                    }
                    else {
                        let masterRow = ws.rows.find(z => z.rowNumber === +cell.master.row);
                        if (!masterRow)
                            return;
                        masterCell = masterRow.cells.find(z => z.columnNumber === +cell.master.col && z.rowNumber === +cell.master.row);
                    }
                    if (!masterCell)
                        return;
                    // Since the current cell is the most right and most bottom cell of the merge, the range of the merge is set to the coordinate of the current cell
                    masterCell.mergeCount = { col: +cell.col - +cell.master.col + 1, row: +cell.row - +cell.master.row + 1 };
                    return;
                }
                let c = {
                    columnNumber: collNumber,
                    rowNumber: rowNumber,
                    value: getCellActualValue(cell.value)
                };
                if (c.value.type === 'string' && c.value.stringRepresentation.trim() === "" && options && options.skipEmptyCells)
                    return;
                // Adding the cell to the parsed cells
                r.cells.push(c);
            });
            if (r.cells.length > 0) {
                // Adding the row to the parsed worksheet
                ws.rows.push(r);
            }
        });
        // Adding the parsed worksheet to the result
        result.workSheets.push(ws);
    }
    return result;
}
