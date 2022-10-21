// Types
import { SimplifiedMIMEType as SimplifiedMIMETypeTemp } from './generators/generators';
import { BlobInfo as BlobInfoTemp } from './download/download';
import { 
	PDFGenColumnsCol as PDFGenColumnsColTemp, 
	PDFGenDocumentHeaderAndFooter as PDFGenDocumentHeaderAndFooterTemp,
	PDFGenTableLayout as PDFGenTableLayoutTemp
} from './pdf/index';
import { 
    ExcelCell as ExcelCellTemp,
    ExcelCellStyle as ExcelCellStyleTemp,
    ExcelCellValue as ExcelCellValueTemp,
    ExcelColumn as ExcelColumnTemp,
    ExcelRow as ExcelRowTemp,
    ExcelWorksheet as ExcelWorksheetTemp,    
	ParsedExcelCellType as ParsedExcelCellTypeTemp,
    ParsedExcelCellValueType as ParsedExcelCellValueTypeTemp,
    ParsedExcelDocType as ParsedExcelDocTypeTemp,
    ParsedExcelRowType as ParsedExcelRowTypeTemp,
    ParsedExcelWorksheetType as ParsedExcelWorksheetTypeTemp
} from "./excel";

export type SimplifiedMIMEType = SimplifiedMIMETypeTemp;

export type BlobInfo = BlobInfoTemp;

export type PDFGenColumnsCol = PDFGenColumnsColTemp;
export type PDFGenDocumentHeaderAndFooter = PDFGenDocumentHeaderAndFooterTemp;
export type PDFGenTableLayout = PDFGenTableLayoutTemp;

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


export {
	base64ToBlob,
	fileToArrayBuffer,
	fileToBase64,
	remoteFileToBase64
} from './convertors/index';

export {
	downloadBlob
} from './download/index';

export {
	generateBlob
} from './generators/index';

export {
	pdfMerge,
	pdfSplit,
	convertImageToPDF,
	PDFGen,
	PDFGenColumns,
	PDFGenEmptySpace,
	PDFGenImage,
	PDFGenStack,
	PDFGenTable,
	PDFGenText,
	PDFGenLine
} from './pdf/index';

export {
	csvFileToArray,
	csvFileToObject
} from './csv/index';

export {
	ExcelGen,
	ExcelCommonStyle,
	readExcelContent
} from './excel'