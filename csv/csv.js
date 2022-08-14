/**
 * Converts a CSV file to an array of array of strings
 * @param file The uploaded file selected by the user in the browser
 * @returns parsed data, meta, and error (if any)
 */
export async function csvFileToArray(file) {
    const Papa = await import("papaparse");
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            trimHeaders: true,
            error: (error) => {
                return reject(error);
            },
            complete: (parsed) => {
                return resolve({
                    data: parsed.data ? parsed.data : [],
                    errors: parsed.errors,
                    meta: parsed.meta
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
export async function csvFileToObject(file) {
    const Papa = await import("papaparse");
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            trimHeaders: true,
            header: true,
            error: (error) => {
                return reject(error);
            },
            complete: (parsed) => {
                return resolve({
                    data: parsed.data ? parsed.data : [],
                    errors: parsed.errors,
                    meta: parsed.meta
                });
            }
        });
    });
}
