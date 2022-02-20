export {
	base64ToBlob,
	fileToArrayBuffer,
	fileToBase64,
	remoteFileToBase64
} from './convertors/convertors';

export {
	downloadBlob
} from './download/download';

export {
	generateBlob
} from './generators/generators';


export {
	pdfMerge,
	pdfSplit
} from './pdf/pdf_modification';


// Types
import { SimplifiedMIMEType as SimplifiedMIMETypeTemp } from './generators/generators';
import { BlobInfo as BlobInfoTemp } from './download/download';

export type SimplifiedMIMEType = SimplifiedMIMETypeTemp;
export type BlobInfo = BlobInfoTemp;
