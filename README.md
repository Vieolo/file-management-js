# File Management
Offering different utility functions to manage files

## Install

```bash
npm install @vieolo/file-management
```

## Usage
The import paths are set to be relative within library to decrease bundle size. The functions can be imports as follows by traversing through sub directories
```JS
import {
	downloadBlob
} from '@vieolo/file-management/download';
import {
	pdfMerge,
	pdfSplit
} from '@vieolo/file-management/pdf';
import {
	csvFileToArray,
	csvFileToObject
} from '@vieolo/file-management/csv';
import {
	base64ToBlob,
	fileToArrayBuffer,
	fileToBase64,
	remoteFileToBase64
} from '@vieolo/file-management/convertors';
import {
	generateBlob
} from '@vieolo/file-management/generators';
```