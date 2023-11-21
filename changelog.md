# Change Log

## v0.4.1 (2023-06-06)
- Updated dependencies

## v0.4.0 (2023-06-05)
- Changed the License to MIT-0

## v0.3.1 (2023-02-11)
- Added `fileToText` function

## v0.3.0 (2022-12-02)
- Added the option to skip the cells with empty strings in Excel

#### Breaking Changes
- While reading Excel files, the merged cells are now only reflected in the first cell (most top and most left) instead of an array with identical cells

## v0.2.14 (2022-10-30)
- Fixed the layout of `PDFGenTable`

## v0.2.13 (2022-10-30)
- Added `PDFGenElement` type to the export
- Added `PDFGenTableCell` class

## v0.2.12 (2022-10-21)
- Added ability to read Excel files

## v0.2.11 (2022-08-22)
- Added `ExcelGen` class to generate Excel files

## v0.2.10 (2022-08-15)
- Fixed the fonts of the `PDFGen`

## v0.2.9 (2022-08-15)
- Added `PDFGen` class to generate PDF documents
- Dependencies are now imported dynamically

## v0.2.8 (2022-07-19)
- Added image to PDF convertion function

## v0.2.7 (2022-06-13)
- Adjusted the exports

## v0.2.6 (2022-06-11)
- Adjusted the exports

## v0.2.5 (2022-06-10)
- Added CSV files management
- Improved the individual imports

## v0.2.4 (2022-02-24)
- Added ".zip" suffix to the zip files even if absent in the file name ([#6](https://github.com/Vieolo/file-management-js/issues/6))

## v0.2.3 (2022-02-20)
- Exported the `SimplifiedMIMEType` type ([#4](https://github.com/Vieolo/file-management-js/issues/4))
- Exported the `BlobInfo` type ([#5](https://github.com/Vieolo/file-management-js/issues/5))

## v0.2.2 (2021-11-08)
- Added `pdfMerge` function ([#2](https://github.com/Vieolo/file-management-js/issues/2))
- Added `pdfSplit` function ([#3](https://github.com/Vieolo/file-management-js/issues/3))

## v0.2.1 (2021-10-26)
- Added `generateBlob` function
- Added `downloadBlob` function
