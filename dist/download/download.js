// Installed Packages
import JSZip from 'jszip';
export async function downloadBlob(blob, fileName) {
    let finalBlob;
    if (Array.isArray(blob)) {
        // Does not download anything if the list of blobs are empty
        if (blob.length === 0)
            return;
        // Creating the ZIP file
        let zip = new JSZip();
        for (let i = 0; i < blob.length; i++) {
            const b = blob[i];
            zip.file(b.blobName, b.blob, {
                binary: true
            });
        }
        // Generating the blob of the ZIP file
        finalBlob = await zip.generateAsync({ type: "blob" });
    }
    else {
        finalBlob = blob;
    }
    // Downloading the blob
    if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(finalBlob, fileName);
    }
    else {
        const a = document.createElement('a');
        document.body.appendChild(a);
        const url = window.URL.createObjectURL(finalBlob);
        a.href = url;
        a.download = fileName;
        a.click();
        setTimeout(() => {
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }, 0);
    }
}
