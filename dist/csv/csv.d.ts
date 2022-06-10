import * as Papa from "papaparse";
declare type CSVParseMeta = Papa.ParseMeta;
declare type CSVParseError = Papa.ParseError;
/**
 * Converts a CSV file to an array of array of strings
 * @param file The uploaded file selected by the user in the browser
 * @returns parsed data, meta, and error (if any)
 */
export declare function csvFileToArray(file: File): Promise<{
    data: string[][];
    meta: CSVParseMeta;
    errors: CSVParseError[];
}>;
/**
 * Converts a CSV file to an array of objects
 * The header row will be the keys and the value of the rows will be the value
 * @param file The uploaded file selected by the user in the browser
 * @returns parsed data, meta, and error (if any)
 */
export declare function csvFileToObject(file: File): Promise<{
    data: {
        [key: string]: string;
    }[];
    meta: CSVParseMeta;
    errors: CSVParseError[];
}>;
export {};
