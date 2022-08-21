import ExcelGen, { 
    ExcelCell as ExcelCellTemp,
    ExcelCellStyle as ExcelCellStyleTemp,
    ExcelCellValue as ExcelCellValueTemp,
    ExcelColumn as ExcelColumnTemp,
    ExcelRow as ExcelRowTemp,
    ExcelWorksheet as ExcelWorksheetTemp,
    ExcelCommonStyle
} from "./excel_gen";

export {
    ExcelGen,
    ExcelCommonStyle
}

export type ExcelCell = ExcelCellTemp
export type ExcelCellStyle = ExcelCellStyleTemp
export type ExcelCellValue = ExcelCellValueTemp
export type ExcelColumn = ExcelColumnTemp
export type ExcelRow = ExcelRowTemp
export type ExcelWorksheet = ExcelWorksheetTemp