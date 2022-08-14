export async function downloadBlob(blob, fileName) {
    let finalBlob;
    let finalFileName = fileName;
    if (Array.isArray(blob)) {
        // Does not download anything if the list of blobs are empty
        if (blob.length === 0)
            return;
        // Adjusting the final file name
        if (!finalFileName.endsWith(".zip")) {
            finalFileName += ".zip";
        }
        // Creating the ZIP file
        const { default: JSZip } = await import('jszip');
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
        window.navigator.msSaveOrOpenBlob(finalBlob, finalFileName);
    }
    else {
        const a = document.createElement('a');
        document.body.appendChild(a);
        const url = window.URL.createObjectURL(finalBlob);
        a.href = url;
        a.download = finalFileName;
        a.click();
        setTimeout(() => {
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }, 0);
    }
}
