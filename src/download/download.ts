// Installed Packages
import JSZip from 'jszip';


export type BlobInfo = {
    blob: Blob,
    blobName: string
}

/**
 * Receives a blob and downloads it via the clinet's browser.
 * @param blob The blob to be downloaded
 * @param fileName The name of the file to be downloaded
 */
export async function downloadBlob(blob: Blob, fileName: string) : Promise<void>;
/**
 * Receives multiple blobs and download them inside a ZIP file.
 * @param blob The list of blobs and the name of each
 * @param fileName The name of the ZIP file
 */
export async function downloadBlob(blob: BlobInfo[], fileName: string) : Promise<void>;
export async function downloadBlob(blob: Blob | BlobInfo[], fileName: string) : Promise<void> {
    let finalBlob: Blob;

    if (Array.isArray(blob)) {
        // Does not download anything if the list of blobs are empty
        if (blob.length === 0) return;
        
        // Creating the ZIP file
        let zip = new JSZip();
        
        for (let i = 0; i < blob.length; i++) {
            const b = blob[i];            
            zip.file(
                b.blobName,
                b.blob,
                {
                    binary: true
                }
            )
        }

        // Generating the blob of the ZIP file
        finalBlob = await zip.generateAsync({ type: "blob" });
    }else {
        finalBlob = blob;
    }

    // Downloading the blob
    if ((window.navigator as any).msSaveOrOpenBlob) {
        (window.navigator as any).msSaveOrOpenBlob(finalBlob, fileName);
    } else {
        const a = document.createElement('a');
        document.body.appendChild(a);
        const url = window.URL.createObjectURL(finalBlob);
        a.href = url;
        a.download = fileName;
        a.click();
        setTimeout(() => {
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }, 0)
    }
}
