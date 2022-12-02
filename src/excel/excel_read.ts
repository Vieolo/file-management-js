// Importing related excel types
// These imports won't be included in the final JS output
import type { CellErrorValue, CellFormulaValue, CellHyperlinkValue, CellRichTextValue, CellSharedFormulaValue, CellValue } from 'exceljs'

export type ParsedExcelCellValueType = {
    value: null | number | string | boolean | Date | undefined,
    stringRepresentation: string,
    /** Used in the case of hyperlink */
    text?: string,
    /** The date, in YYYY-MM-DD format. Helps to use the date without needing to worry about the timezone */
    date?: string,
    /** The values of the time */
    time?: {
        hour: number,
        minute: number,
        second: number,
    },
    /** Used in the cases of formula and sharedFormula */
    result?: string,
    /** Used in the cases of formula and sharedFormula */
    date1904?: boolean,
    /** Used in the cases of formula and sharedFormula */
    formula?: string,
    type: 
        | "null" | "number" | "string" | "hyperlink" | "boolean" | "date" | "time" | "error" | "richText" | "formula" | "sharedFormula" | "unknown"
}

/** Type containing all the parsed data of an excel cell */
export type ParsedExcelCellType = {
    columnNumber: number,
    rowNumber: number,
    value: ParsedExcelCellValueType
}

/** Type containing all the parsed data of an excel row */
export type ParsedExcelRowType = {
    rowNumber: number,
    /** Number of cells in the row that are not empty */
    cellCount: number,
    hasValues: boolean,
    cells: ParsedExcelCellType[]
}

/** Type containing all the parsed data of an excel sheet */
export type ParsedExcelWorksheetType = {
    rows: ParsedExcelRowType[],
    /** The actual number of columns that have values */
    columnWithContentCount: number,
    /** The number of columns of the document, including those in the middle without value */
    columnCount: number,
    /** The actual number or rows that have values */
    rowWithContentCount: number,
    /** The number of row of the document, including those in the middle without value */
    rowCount: number,
    /** The name of the worksheet (not the file) */
    name: string
}

/** Type containing all the parsed data of an excel file */
export type ParsedExcelDocType = {
    workSheets: ParsedExcelWorksheetType[]
}


function getCellActualValue(value: CellValue) : ParsedExcelCellValueType {
    if (!value || !value.valueOf()) return {value: null, type: 'null', stringRepresentation: ""}

    let str = value.toString()
    
    if (typeof value === 'string') return {value: value.valueOf() as string, type: 'string', stringRepresentation: str}
    else if (typeof value === 'number') return {value: value.valueOf() as number, type: 'number', stringRepresentation: str}
    else if (typeof value === 'boolean') return {value: value.valueOf() as boolean, type: 'boolean', stringRepresentation: str}
    // The value is an object
    else {
        // If the cell is a date
        if (value instanceof Date) {
            let s = value.toISOString().split("T")[1].split(".")[0];
            let t = {hour: +s.split(":")[0], minute: +s.split(":")[1], second: +s.split(":")[2]}
            
            // If the day of the date is `1899-12-30`, then the value is actually time rather than the whole date
            if (value.getUTCFullYear() === 1899 && value.getUTCMonth() === 11 && value.getUTCDate() === 30) {
                return {
                    value: s, 
                    type: 'time', 
                    stringRepresentation: value.toISOString(),
                    time: t
                }    
            }
            return {value: (value as Date).toISOString(), type: 'date', stringRepresentation: value.toISOString(), date: value.toISOString().split("T")[0], time: t}
        }

        // If the value is not of basic types and date, it is an object
        // The following lines check if the existence of unique keys in the object to get the details and type

        // The cell has an error, possible errors are: '#N/A' | '#REF!' | '#NAME?' | '#DIV/0!' | '#NULL!' | '#VALUE!' | '#NUM!'
        else if ("error" in (value as Object)) return {value: (value.valueOf() as CellErrorValue).error, type: 'error', stringRepresentation: str}
        else if ("richText" in (value as Object)) return {value: JSON.stringify((value.valueOf() as CellRichTextValue).richText), type: 'richText', stringRepresentation: str}
        else if ("hyperlink" in (value as Object)) return {value: (value.valueOf() as CellHyperlinkValue).hyperlink, type: 'hyperlink', text: (value.valueOf() as CellHyperlinkValue).text, stringRepresentation: str}
        else if ("sharedFormula" in (value as Object)) return {value: (value.valueOf() as CellSharedFormulaValue).sharedFormula, type: 'sharedFormula', result: JSON.stringify((value.valueOf() as CellSharedFormulaValue).result), date1904: (value as CellSharedFormulaValue).date1904 || false, formula: (value.valueOf() as CellSharedFormulaValue).formula, stringRepresentation: str}
        else if ("formula" in (value as Object)) return {value: (value.valueOf() as CellFormulaValue).formula, type: 'formula', result: JSON.stringify((value.valueOf() as CellFormulaValue).result), date1904: (value as CellFormulaValue).date1904 || false, formula: (value.valueOf() as CellFormulaValue).formula, stringRepresentation: str}
    }

    // If the type of the cell is could not be determined, a json representation of the value is returned
    return {value: JSON.stringify(value.valueOf()), type: 'unknown', stringRepresentation: str}
}


/**
 * This function reads and parse the contents of an excel file
 * @param file The Blob/File of the excel files 
 */
export async function readExcelContent(file: Blob, options?: {skipEmptyCells?: boolean}) : Promise<ParsedExcelDocType> {
    let result: ParsedExcelDocType = {workSheets: []}

    // Importing the `exceljs` package and necessary functions
    const Excel = await import('exceljs');
    let fileToArrayBuffer = (await import("../convertors/convertors")).fileToArrayBuffer

    // Creating the workbook (excel file)
    // This workbook will load the contents of the file
    let workbook = new Excel.Workbook();
    await workbook.xlsx.load(await fileToArrayBuffer(file));

    for (let i = 0; i < workbook.worksheets.length; i++) {
        const rws = workbook.worksheets[i]; // Raw Work Sheet
        rws.unMergeCells()
        
        // The initial worksheet object
        let ws: ParsedExcelWorksheetType = {
            rows: [],
            columnCount: rws.columnCount,
            columnWithContentCount: rws.actualColumnCount,
            rowCount: rws.rowCount,
            rowWithContentCount: rws.actualRowCount,
            name: rws.name,            
        }   

        // Looping through the rows of the worksheet
        rws.eachRow((row, rowNumber) => {
            let r: ParsedExcelRowType = {
                rowNumber: rowNumber, 
                cellCount: row.actualCellCount,
                hasValues: row.hasValues,
                cells: []
            }
            
            // Looping through the cells of the row
            row.eachCell((cell, collNumber) => {
                let c: ParsedExcelCellType = {
                    columnNumber: collNumber,
                    rowNumber: rowNumber,
                    value: getCellActualValue(cell.value)
                }

                if (c.value.type === 'string' && c.value.stringRepresentation.trim() === "" && options && options.skipEmptyCells) return

                // Adding the cell to the parsed cells
                r.cells.push(c)
            })


            // Adding the row to the parsed worksheet
            ws.rows.push(r)
        })
        
        
        // Adding the parsed worksheet to the result
        result.workSheets.push(ws)
    }

    return result
}