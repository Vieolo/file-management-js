/**
 * Fetches a file from the given url and converts it to base64
 * @param url The url of the file
 */
export declare function remoteFileToBase64(url: string): Promise<string>;
/**
 * Converts the uploaded file object to base64
 * @param file The JS file object
 */
export declare function fileToBase64(file: File): Promise<string>;
/**
 * Converts base64 file to blob
 * @param file The base64 file
 * @param contentType The content type of the file. Defaults to: image/jpeg
 */
export declare function base64ToBlob(file: string, contentType?: string): Promise<Blob>;
/**
 * Converts the uploaded file/blob object to Array Buffer
 * @param file The JS file/blob object
 */
export declare function fileToArrayBuffer(file: Blob): Promise<ArrayBuffer>;
/**
 * Reads the string contents of the uploaded file/blob
 *
 * Useful for reading the contents of a text or json file
 * @param file The JS file/blob object
 */
export declare function fileToText(file: Blob): Promise<string>;
