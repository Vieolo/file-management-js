import ExcelGen, { 
    ExcelCell as ExcelCellTemp,
    ExcelCellStyle as ExcelCellStyleTemp,
    ExcelCellValue as ExcelCellValueTemp,
    ExcelColumn as ExcelColumnTemp,
    ExcelRow as ExcelRowTemp,
    ExcelWorksheet as ExcelWorksheetTemp,
    ExcelCommonStyle
} from "./excel_gen";

import {
    readExcelContent,
    ParsedExcelCellType as ParsedExcelCellTypeTemp,
    ParsedExcelCellValueType as ParsedExcelCellValueTypeTemp,
    ParsedExcelDocType as ParsedExcelDocTypeTemp,
    ParsedExcelRowType as ParsedExcelRowTypeTemp,
    ParsedExcelWorksheetType as ParsedExcelWorksheetTypeTemp
} from './excel_read';

export {
    ExcelGen,
    ExcelCommonStyle,
    readExcelContent
}

export type ExcelCell = ExcelCellTemp
export type ExcelCellStyle = ExcelCellStyleTemp
export type ExcelCellValue = ExcelCellValueTemp
export type ExcelColumn = ExcelColumnTemp
export type ExcelRow = ExcelRowTemp
export type ExcelWorksheet = ExcelWorksheetTemp

export type ParsedExcelCellType = ParsedExcelCellTypeTemp
export type ParsedExcelCellValueType = ParsedExcelCellValueTypeTemp
export type ParsedExcelDocType = ParsedExcelDocTypeTemp
export type ParsedExcelRowType = ParsedExcelRowTypeTemp
export type ParsedExcelWorksheetType = ParsedExcelWorksheetTypeTemp