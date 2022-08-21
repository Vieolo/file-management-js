import type { Style, BorderStyle, Column, Fill } from 'exceljs';
export declare type ExcelCellStyle = Style;
export declare type ExcelCellValue = string | number | {
    formula: string;
};
export declare type ExcelCell = {
    value: ExcelCellValue;
    style?: Partial<Style>;
};
export declare type ExcelRow = {
    style?: Partial<Style>;
    height?: number;
    data: ExcelCell[];
};
export declare type ExcelColumn = Partial<Column>;
export declare type ExcelWorksheet = {
    name: string;
    defaultColWidth?: number;
    defaultRowHeight?: number;
    rows: ExcelRow[];
    columns: ExcelColumn[];
};
/**
 * A class containing many static functions that return common styles for cells
 */
export declare class ExcelCommonStyle {
    static EURO_NUM_FMT: string;
    /**
     * Generates a common solid background color for the excel cell
     * @param color Either in `#f2f2f2` or `FFf2f2f2` format. Do not shorten the hex color like `#ddd`
     */
    static cellSolidFill(color: string): Fill;
    /**
     * Generates a common border style for all 4 borders of the cell
     * @param color Either in `#f2f2f2` or `FFf2f2f2` format. Do not shorten the hex color like `#ddd`
     * @param borderStyle The style of borders
     */
    static cellAllBorders(color: string, borderStyle?: BorderStyle): {
        top: {
            style: BorderStyle | undefined;
            color: {
                argb: string;
            };
        };
        left: {
            style: BorderStyle | undefined;
            color: {
                argb: string;
            };
        };
        bottom: {
            style: BorderStyle | undefined;
            color: {
                argb: string;
            };
        };
        right: {
            style: BorderStyle | undefined;
            color: {
                argb: string;
            };
        };
    };
}
export default class ExcelGen {
    data: {
        creator: string;
        createdAt: Date;
        /** Whether the application shall perform a full recalculation when the Excel file is opened */
        fullCalcOnLoad: boolean;
    };
    worksheets: ExcelWorksheet[];
    static colIndex: string[];
    constructor(data: {
        creator: string;
        createdAt: Date;
        /** Whether the application shall perform a full recalculation when the Excel file is opened */
        fullCalcOnLoad: boolean;
    });
    generate(): Promise<import("exceljs").Workbook>;
    getBlob(): Promise<Blob>;
    download(fileName: string): Promise<void>;
}
