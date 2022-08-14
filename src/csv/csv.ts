type CSVParseMeta = {
    delimiter: string; // Delimiter used
    linebreak: string; // Line break sequence used
    aborted: boolean; // Whether process was aborted
    fields?: string[]; // Array of field names
    truncated: boolean; // Whether preview consumed all input
    cursor: number;
};
type CSVParseError = {
    type: string; // A generalization of the error
    code: string; // Standardized error code
    message: string; // Human-readable details
    row: number; // Row index of parsed data where error is
};

/**
 * Converts a CSV file to an array of array of strings
 * @param file The uploaded file selected by the user in the browser
 * @returns parsed data, meta, and error (if any)
 */
export async function csvFileToArray(file: File): Promise<{ data: string[][], meta: CSVParseMeta, errors: CSVParseError[]; }> {    
    const Papa = await import("papaparse");
    return new Promise<{ data: string[][], meta: CSVParseMeta, errors: CSVParseError[]; }>((resolve, reject) => {
        Papa.parse(file, {
            trimHeaders: true,
            error: (error) => {
                return reject(error);
            },
            complete: (parsed) => {
                return resolve({
                    data: parsed.data ? parsed.data as string[][] : [],
                    errors: parsed.errors as any,
                    meta: parsed.meta as any
                });
            }
        });
    });

}

/**
 * Converts a CSV file to an array of objects
 * The header row will be the keys and the value of the rows will be the value
 * @param file The uploaded file selected by the user in the browser
 * @returns parsed data, meta, and error (if any)
 */
export async function csvFileToObject(file: File): Promise<{ data: { [key: string]: string; }[], meta: CSVParseMeta, errors: CSVParseError[]; }> {
    const Papa = await import("papaparse");
    return new Promise<{ data: { [key: string]: string; }[], meta: CSVParseMeta, errors: CSVParseError[]; }>((resolve, reject) => {
        Papa.parse(file, {
            trimHeaders: true,
            header: true,
            error: (error) => {
                return reject(error);
            },
            complete: (parsed) => {
                return resolve({
                    data: parsed.data ? parsed.data as { [key: string]: string; }[] : [],
                    errors: parsed.errors as any,
                    meta: parsed.meta as any
                });
            }
        });
    });
}
