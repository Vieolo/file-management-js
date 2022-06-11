# File Management
The package offering different utility functions to manage files

## Install
to install, add the following to the `dependency` key of the `package.json` file of the project.

```json
"@vieolo/file-management": "github:Vieolo/file-management-js.git#0.2.6"
```

## Usage
In the target package, the functions can be imported as followed
```JS
import {  } from '@vieolo/file-management';
```

## Importing individual functions
The import paths are set to be relative within library to decrease bundle size. The functions can be imports as follows by traversing through child libray
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


## Version Bump
While bumping the version, the following files should be modified:
- package.json
- changelog.md (The user-facing change log for the user)
- README.md (The version of the installation key-value pair)