export declare type BlobInfo = {
    blob: Blob;
    blobName: string;
};
/**
 * Receives a blob and downloads it via the clinet's browser.
 * @param blob The blob to be downloaded
 * @param fileName The name of the file to be downloaded
 */
export declare function downloadBlob(blob: Blob, fileName: string): Promise<void>;
/**
 * Receives multiple blobs and download them inside a ZIP file.
 * @param blob The list of blobs and the name of each
 * @param fileName The name of the ZIP file
 */
export declare function downloadBlob(blob: BlobInfo[], fileName: string): Promise<void>;
