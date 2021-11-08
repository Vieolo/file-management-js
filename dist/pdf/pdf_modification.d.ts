/**
 * Merge multiple PDF files into one
 * @param files The array of files
 * @returns The merged PDF file in blob format
 */
export declare function pdfMerge(files: File[]): Promise<Blob>;
/**
 * Splits the given PDF files into individual files, each containing only 1 page
 * @param files The PDF files
 * @returns An array containing the separated PDF pages
 */
export declare function pdfSplit(files: File[]): Promise<Blob[]>;
