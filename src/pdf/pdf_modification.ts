// Internal
import { fileToArrayBuffer } from '../convertors/convertors';
import { generateBlob } from '../generators/generators';


// converting the jpg to pdf
export async function convertImageToPDF(files: File[], scale: number) {
    const { PDFDocument } = await import("pdf-lib");
    const pdfDoc = await PDFDocument.create()
    
    for (let imgFile of files) {
         
        // Embed the image bytes
        const img = await pdfDoc.embedJpg(await fileToArrayBuffer(imgFile))
           
        const imgDims = img.scale(scale)
        
        // Add a blank page to the document
        const page = pdfDoc.addPage()
        
        // Draw the JPG image in the center of the page
        page.drawImage(img, {
            x: page.getWidth() / 2 - imgDims.width / 2,
            y: page.getHeight() / 2 - imgDims.height / 2,
            width: imgDims.width,
            height: imgDims.height,
        })        
    }
    return generateBlob([await pdfDoc.save()], 'PDF')
}

/**
 * Merge multiple PDF files into one
 * @param files The array of files
 * @returns The merged PDF file in blob format
 */
export async function pdfMerge(files: File[], convertNonPDFFiles?: {
    /** Min: 0.0, Max: 1.0 */
    scale: number
}): Promise<Blob> {
    // Creating an empty document for the merged file
    const { PDFDocument } = await import("pdf-lib");
    const mergedPdf = await PDFDocument.create();

    for (let f of files) {
        let fi: File;
        if (f.type !== 'application/pdf' && convertNonPDFFiles) {
            fi = new File([await convertImageToPDF([f], convertNonPDFFiles.scale)], f.name)
        } else {
            fi = f
        }
        
        // Loading the file
        let document = await PDFDocument.load(
            await fileToArrayBuffer(fi)
        );

        // The merged file has to copy the pages of the file
        // before being able to add the page to its document
        const copiedPages = await mergedPdf.copyPages(
            document,
            document.getPageIndices()
        );

        // Add pages to the merged PDF
        copiedPages.forEach((page) => mergedPdf.addPage(page));
    }
    return generateBlob([await mergedPdf.save()], 'PDF');
}



/**
 * Splits the given PDF files into individual files, each containing only 1 page
 * @param files The PDF files
 * @returns An array containing the separated PDF pages
 */
export async function pdfSplit(files: File[]) : Promise<Blob[]> {       
    const { PDFDocument } = await import("pdf-lib"); 
    let documents = [];

    // Loading each file and add it to the `documents` array
    for (let i = 0; i < files.length; i++) {
        const f = files[i];
        documents.push(await PDFDocument.load(
            await fileToArrayBuffer(f)
        ));
    }

    // This array holds the final splitted PDF files
    let splitedFiles: Blob[] = [];

    for (let i = 0; i < documents.length; i++) {
        const doc = documents[i];

        // Looping through the pages of the PDF file
        for (let z = 0; z < doc.getPageCount(); z++) {
            // Creating a document for the single page document
            const singleDoc = await PDFDocument.create();
            
            // The single page has to be copied by the singleDoc to be able to be added as a page
            let copiedPages = await singleDoc.copyPages(
                doc, [z]
            )
            singleDoc.addPage(copiedPages[0]);
            
            // Generating the blob and pushing to `splitedFiles` to be returned
            splitedFiles.push(generateBlob([await singleDoc.save()], 'PDF'));
        }
    }

    return splitedFiles
}
