import type { ContentBase, Content, ContextPageSize, ImageCover, ContentTable, Dash, Size, DynamicRowSize, Style, ContentColumns, ContentStack, ContentCanvas, TDocumentDefinitions, TDocumentInformation, StyleDictionary, DynamicBackground, Margins, PageSize, Watermark } from 'pdfmake/interfaces';
interface IPDFGenElement {
    getObject: () => Content;
}
declare type PDFGenElement = IPDFGenElement | string;
export declare type PDFGenDocumentHeaderAndFooter = (currentPage: number, pageCount: number, pageSize: ContextPageSize) => PDFGenElement | null | undefined;
export declare class PDFGenEmptySpace implements IPDFGenElement {
    getObject(): string;
}
export declare class PDFGenText implements IPDFGenElement {
    data: ContentBase & {
        text: string;
    };
    constructor(data: ContentBase & {
        text: string;
    });
    getObject(): ContentBase & {
        text: string;
    };
}
export declare class PDFGenImage implements IPDFGenElement {
    data: ContentBase & {
        image: string;
        width?: number;
        height?: number;
        fit?: [number, number];
        cover?: ImageCover;
    };
    constructor(data: ContentBase & {
        image: string;
        width?: number;
        height?: number;
        fit?: [number, number];
        cover?: ImageCover;
    });
    getObject(): ContentBase & {
        image: string;
        width?: number | undefined;
        height?: number | undefined;
        fit?: [number, number] | undefined;
        cover?: ImageCover | undefined;
    };
}
export declare type PDFGenTableLayout = 'noBorders' | 'headerLineOnly' | 'lightHorizontalLines' | {
    hLineWidth?: (i: number, node: ContentTable) => number;
    vLineWidth?: (i: number, node: ContentTable) => number;
    hLineColor?: (i: number, node: ContentTable) => string;
    vLineColor?: (i: number, node: ContentTable) => string;
    hLineStyle?: (i: number, node: ContentTable) => {
        dash: Dash;
    };
    vLineStyle?: (i: number, node: ContentTable) => {
        dash: Dash;
    };
    paddingLeft?: (i: number, node: ContentTable) => number;
    paddingRight?: (i: number, node: ContentTable) => number;
    paddingTop?: (i: number, node: ContentTable) => number;
    paddingBottom?: (i: number, node: ContentTable) => number;
    fillColor?: (rowIndex: number, node: ContentTable, columnIndex: number) => number | null;
};
export declare class PDFGenTable implements IPDFGenElement {
    data: {
        body: PDFGenElement[][];
        widths?: "*" | "auto" | Size[];
        heights?: number | 'auto' | Array<number | 'auto'> | DynamicRowSize;
        headerRows?: number;
        /** Controls whether the contents of a table row should be kept together on the same page. (default: false) */
        dontBreakRows?: boolean;
        /**
         * Number of rows after the given headerRows that should be kept together with
         * the header rows, without a page break in between.
         *
         * Defaults to `0`.
         */
        keepWithHeaderRows?: number;
        layout?: PDFGenTableLayout;
        style?: Style;
    };
    constructor(data: {
        body: PDFGenElement[][];
        widths?: "*" | "auto" | Size[];
        heights?: number | 'auto' | Array<number | 'auto'> | DynamicRowSize;
        headerRows?: number;
        /** Controls whether the contents of a table row should be kept together on the same page. (default: false) */
        dontBreakRows?: boolean;
        /**
         * Number of rows after the given headerRows that should be kept together with
         * the header rows, without a page break in between.
         *
         * Defaults to `0`.
         */
        keepWithHeaderRows?: number;
        layout?: PDFGenTableLayout;
        style?: Style;
    });
    getObject(): ContentTable;
}
export declare type PDFGenColumnsCol = {
    /** (default: "*") */
    width?: Size;
    element: PDFGenElement;
};
export declare class PDFGenColumns implements IPDFGenElement {
    data: ContentBase & {
        columns: PDFGenColumnsCol[];
    };
    constructor(data: ContentBase & {
        columns: PDFGenColumnsCol[];
    });
    getObject(): ContentColumns;
}
export declare class PDFGenStack implements IPDFGenElement {
    data: ContentBase & {
        stack: PDFGenElement[];
    };
    constructor(data: ContentBase & {
        stack: PDFGenElement[];
    });
    getObject(): ContentStack;
}
export declare class PDFGenLine implements IPDFGenElement {
    data: {
        /** (default: 0) */
        x1?: number;
        /** (default: 520) */
        x2?: number;
        /** (default: 4) */
        y1?: number;
        /** (default: 4) */
        y2?: number;
        /** (default: 1) */
        thickness?: number;
    };
    constructor(data: {
        /** (default: 0) */
        x1?: number;
        /** (default: 520) */
        x2?: number;
        /** (default: 4) */
        y1?: number;
        /** (default: 4) */
        y2?: number;
        /** (default: 1) */
        thickness?: number;
    });
    getObject(): ContentCanvas;
}
export default class PDFGen {
    data: {
        /** The meta data of the PDF document */
        metaData?: TDocumentInformation;
        /** The page orientation of the document. (default: `portrait`) */
        pageOrientation?: import("pdfmake/interfaces").PageOrientation;
        defaultStyle?: Style;
        styles?: StyleDictionary;
        background?: DynamicBackground | Content;
        footer?: PDFGenDocumentHeaderAndFooter;
        header?: PDFGenDocumentHeaderAndFooter;
        images?: {
            [name: string]: string;
        };
        pageMargins?: Margins;
        pageSize?: PageSize;
        watermark?: Watermark | string;
        fonts?: {
            [name: string]: {
                normal?: string;
                bold?: string;
                italics?: string;
                bolditalics?: string;
            };
        };
    };
    content: Array<PDFGenElement>;
    constructor(data: {
        /** The meta data of the PDF document */
        metaData?: TDocumentInformation;
        /** The page orientation of the document. (default: `portrait`) */
        pageOrientation?: import("pdfmake/interfaces").PageOrientation;
        defaultStyle?: Style;
        styles?: StyleDictionary;
        background?: DynamicBackground | Content;
        footer?: PDFGenDocumentHeaderAndFooter;
        header?: PDFGenDocumentHeaderAndFooter;
        images?: {
            [name: string]: string;
        };
        pageMargins?: Margins;
        pageSize?: PageSize;
        watermark?: Watermark | string;
        fonts?: {
            [name: string]: {
                normal?: string;
                bold?: string;
                italics?: string;
                bolditalics?: string;
            };
        };
    });
    makeDocument(): TDocumentDefinitions;
    createPDF(): Promise<import("pdfmake/build/pdfmake").TCreatedPdf>;
    downloadPDF(fileName: string): Promise<void>;
    getBase64(): Promise<string>;
}
export {};
