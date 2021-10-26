type SimplifiedMIMEType = 'XML-Download' | 'XML-Read' | 'Excel' | 'PDF' | 'JSON' | 'CSV';

/**
 * Generates a blob object with the appropriate MIME type
 * @param content The contents of the blob file
 * @param type The MIME type of the blob. The final types are taken from https://www.iana.org/assignments/media-types/media-types.xhtml
 * @returns The new generated Blob object
 */
export function generateBlob(content: BlobPart[], type: SimplifiedMIMEType) {
    let finalType: {[key: string]: string} = {
        'Excel': "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        'XML-Download': "application/octet-stream",
        'XML-Read': 'application/xml',
        'PDF': 'application/pdf',
        'JSON': 'application/json',
        'CSV': 'text/csv'
    }
    return new Blob(content, {
        type: finalType[type]
    })
}