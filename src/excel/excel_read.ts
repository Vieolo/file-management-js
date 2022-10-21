// Importing related excel types
// These imports won't be included in the final JS output
import type { CellErrorValue, CellFormulaValue, CellHyperlinkValue, CellRichTextValue, CellSharedFormulaValue, CellValue } from 'exceljs'

export type ParsedExcelCellValueType = {
    value: null | number | string | boolean | Date | undefined,
    /** Used in the case of hyperlink */
    text?: string,
    /** Used in the cases of formula and sharedFormula */
    result?: string,
    /** Used in the cases of formula and sharedFormula */
    date1904?: boolean,
    /** Used in the cases of formula and sharedFormula */
    formula?: string,
    type: 
        | "null" | "number" | "string" | "hyperlink" | "boolean" | "date" | "error" | "richText" | "formula" | "sharedFormula" | "unknown"
}

/** Type containing all the parsed data of an excel cell */
export type ParsedExcelCellType = {
    stringValue: string, 
    columnNumber: number,
    actualValue: ParsedExcelCellValueType
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
    columnCount: number,
    /** The actual number or rows that have values */
    rowCount: number,
    /** The name of the worksheet (not the file) */
    name: string
}

/** Type containing all the parsed data of an excel file */
export type ParsedExcelDocType = {
    workSheets: ParsedExcelWorksheetType[]
}


function getCellActualValue(value: CellValue) : ParsedExcelCellValueType {
    if (!value) return {value: null, type: 'null'}
    
    if (typeof value.valueOf === 'string') return {value: value.valueOf, type: 'string'}
    else if (typeof value.valueOf === 'number') return {value: value.valueOf, type: 'number'}
    else if (typeof value.valueOf === 'boolean') return {value: value.valueOf, type: 'boolean'}
    // The value is an object
    else {
        // If the cell is a date
        if (value.valueOf instanceof Date) return {value: value.valueOf, type: 'date'}

        // If the value is not of basic types and date, it is an object
        // The following lines check if the existence of unique keys in the object to get the details and type

        // The cell has an error, possible errors are: '#N/A' | '#REF!' | '#NAME?' | '#DIV/0!' | '#NULL!' | '#VALUE!' | '#NUM!'
        else if ("error" in value.valueOf) return {value: (value.valueOf as CellErrorValue).error, type: 'error'}
        else if ("richText" in value.valueOf) return {value: JSON.stringify((value.valueOf as CellRichTextValue).richText), type: 'richText'}
        else if ("hyperlink" in value.valueOf) return {value: (value.valueOf as CellHyperlinkValue).hyperlink, type: 'hyperlink', text: (value.valueOf as CellHyperlinkValue).text}
        else if ("sharedFormula" in value.valueOf) return {value: (value.valueOf as CellSharedFormulaValue).sharedFormula, type: 'sharedFormula', result: JSON.stringify((value.valueOf as CellSharedFormulaValue).result), date1904: (value.valueOf as CellSharedFormulaValue).date1904, formula: (value.valueOf as CellSharedFormulaValue).formula}
        else if ("formula" in value.valueOf) return {value: (value.valueOf as CellFormulaValue).formula, type: 'formula', result: JSON.stringify((value.valueOf as CellFormulaValue).result), date1904: (value.valueOf as CellFormulaValue).date1904, formula: (value.valueOf as CellFormulaValue).formula}
    }

    // If the type of the cell is could not be determined, a json representation of the value is returned
    return {value: JSON.stringify(value.valueOf), type: 'unknown'}
}


/**
 * This function reads and parse the contents of an excel file
 * @param file The Blob/File of the excel files 
 */
export async function readExcelContent(file: Blob) : Promise<ParsedExcelDocType> {
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
        
        // The initial worksheet object
        let ws: ParsedExcelWorksheetType = {
            rows: [],
            columnCount: rws.actualColumnCount,
            rowCount: rws.actualRowCount,
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
                    stringValue: cell.value ? cell.value.toString() : "",
                    actualValue: getCellActualValue(cell.value)
                }

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