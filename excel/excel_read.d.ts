export declare type ParsedExcelCellValueType = {
    value: null | number | string | boolean | Date | undefined;
    stringRepresentation: string;
    /** Used in the case of hyperlink */
    text?: string;
    /** The date, in YYYY-MM-DD format. Helps to use the date without needing to worry about the timezone */
    date?: string;
    /** The values of the time */
    time?: {
        hour: number;
        minute: number;
        second: number;
    };
    /** Used in the cases of formula and sharedFormula */
    result?: string;
    /** Used in the cases of formula and sharedFormula */
    date1904?: boolean;
    /** Used in the cases of formula and sharedFormula */
    formula?: string;
    type: "null" | "number" | "string" | "hyperlink" | "boolean" | "date" | "time" | "error" | "richText" | "formula" | "sharedFormula" | "unknown";
};
/** Type containing all the parsed data of an excel cell */
export declare type ParsedExcelCellType = {
    columnNumber: number;
    rowNumber: number;
    value: ParsedExcelCellValueType;
};
/** Type containing all the parsed data of an excel row */
export declare type ParsedExcelRowType = {
    rowNumber: number;
    /** Number of cells in the row that are not empty */
    cellCount: number;
    hasValues: boolean;
    cells: ParsedExcelCellType[];
};
/** Type containing all the parsed data of an excel sheet */
export declare type ParsedExcelWorksheetType = {
    rows: ParsedExcelRowType[];
    /** The actual number of columns that have values */
    columnWithContentCount: number;
    /** The number of columns of the document, including those in the middle without value */
    columnCount: number;
    /** The actual number or rows that have values */
    rowWithContentCount: number;
    /** The number of row of the document, including those in the middle without value */
    rowCount: number;
    /** The name of the worksheet (not the file) */
    name: string;
};
/** Type containing all the parsed data of an excel file */
export declare type ParsedExcelDocType = {
    workSheets: ParsedExcelWorksheetType[];
};
/**
 * This function reads and parse the contents of an excel file
 * @param file The Blob/File of the excel files
 */
export declare function readExcelContent(file: Blob): Promise<ParsedExcelDocType>;
