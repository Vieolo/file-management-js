interface IPDFGenElement {
    getObject: () => import('pdfmake/interfaces').Content;
}
declare type PDFGenElement = IPDFGenElement | string;
export declare type PDFGenDocumentHeaderAndFooter = (currentPage: number, pageCount: number, pageSize: import('pdfmake/interfaces').ContextPageSize) => PDFGenElement | null | undefined;
export declare class PDFGenEmptySpace implements IPDFGenElement {
    constructor();
    getObject(): string;
}
export declare class PDFGenText implements IPDFGenElement {
    data: import('pdfmake/interfaces').ContentBase & {
        text: string;
    };
    constructor(data: import('pdfmake/interfaces').ContentBase & {
        text: string;
    });
    getObject(): import("pdfmake/interfaces").ContentBase & {
        text: string;
    };
}
export declare class PDFGenImage implements IPDFGenElement {
    data: import('pdfmake/interfaces').ContentBase & {
        image: string;
        width?: number;
        height?: number;
        fit?: [number, number];
        cover?: import('pdfmake/interfaces').ImageCover;
    };
    constructor(data: import('pdfmake/interfaces').ContentBase & {
        image: string;
        width?: number;
        height?: number;
        fit?: [number, number];
        cover?: import('pdfmake/interfaces').ImageCover;
    });
    getObject(): import("pdfmake/interfaces").ContentBase & {
        image: string;
        width?: number | undefined;
        height?: number | undefined;
        fit?: [number, number] | undefined;
        cover?: import("pdfmake/interfaces").ImageCover | undefined;
    };
}
export declare type PDFGenTableLayout = 'noBorders' | 'headerLineOnly' | 'lightHorizontalLines' | {
    hLineWidth?: (i: number, node: import('pdfmake/interfaces').ContentTable) => number;
    vLineWidth?: (i: number, node: import('pdfmake/interfaces').ContentTable) => number;
    hLineColor?: (i: number, node: import('pdfmake/interfaces').ContentTable) => string;
    vLineColor?: (i: number, node: import('pdfmake/interfaces').ContentTable) => string;
    hLineStyle?: (i: number, node: import('pdfmake/interfaces').ContentTable) => {
        dash: import('pdfmake/interfaces').Dash;
    };
    vLineStyle?: (i: number, node: import('pdfmake/interfaces').ContentTable) => {
        dash: import('pdfmake/interfaces').Dash;
    };
    paddingLeft?: (i: number, node: import('pdfmake/interfaces').ContentTable) => number;
    paddingRight?: (i: number, node: import('pdfmake/interfaces').ContentTable) => number;
    paddingTop?: (i: number, node: import('pdfmake/interfaces').ContentTable) => number;
    paddingBottom?: (i: number, node: import('pdfmake/interfaces').ContentTable) => number;
    fillColor?: (rowIndex: number, node: import('pdfmake/interfaces').ContentTable, columnIndex: number) => number | null;
};
export declare class PDFGenTable implements IPDFGenElement {
    data: {
        body: PDFGenElement[][];
        widths?: "*" | "auto" | import('pdfmake/interfaces').Size[];
        heights?: number | 'auto' | Array<number | 'auto'> | import('pdfmake/interfaces').DynamicRowSize;
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
        style?: import('pdfmake/interfaces').Style;
    };
    constructor(data: {
        body: PDFGenElement[][];
        widths?: "*" | "auto" | import('pdfmake/interfaces').Size[];
        heights?: number | 'auto' | Array<number | 'auto'> | import('pdfmake/interfaces').DynamicRowSize;
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
        style?: import('pdfmake/interfaces').Style;
    });
    getObject(): import("pdfmake/interfaces").ContentTable;
}
export declare type PDFGenColumnsCol = {
    /** (default: "*") */
    width?: import('pdfmake/interfaces').Size;
    element: PDFGenElement;
};
export declare class PDFGenColumns implements IPDFGenElement {
    data: import('pdfmake/interfaces').ContentBase & {
        columns: PDFGenColumnsCol[];
    };
    constructor(data: import('pdfmake/interfaces').ContentBase & {
        columns: PDFGenColumnsCol[];
    });
    getObject(): import("pdfmake/interfaces").ContentColumns;
}
export declare class PDFGenStack implements IPDFGenElement {
    data: import('pdfmake/interfaces').ContentBase & {
        stack: PDFGenElement[];
    };
    constructor(data: import('pdfmake/interfaces').ContentBase & {
        stack: PDFGenElement[];
    });
    getObject(): import("pdfmake/interfaces").ContentStack;
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
    getObject(): import("pdfmake/interfaces").ContentCanvas;
}
export default class PDFGen {
    data: {
        /** The meta data of the PDF document */
        metaData?: import('pdfmake/interfaces').TDocumentInformation;
        /** The page orientation of the document. (default: `portrait`) */
        pageOrientation?: import("pdfmake/interfaces").PageOrientation;
        defaultStyle?: import('pdfmake/interfaces').Style;
        styles?: import('pdfmake/interfaces').StyleDictionary;
        background?: import('pdfmake/interfaces').DynamicBackground | import('pdfmake/interfaces').Content;
        footer?: PDFGenDocumentHeaderAndFooter;
        header?: PDFGenDocumentHeaderAndFooter;
        images?: {
            [name: string]: string;
        };
        pageMargins?: import('pdfmake/interfaces').Margins;
        pageSize?: import('pdfmake/interfaces').PageSize;
        watermark?: import('pdfmake/interfaces').Watermark | string;
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
        metaData?: import('pdfmake/interfaces').TDocumentInformation;
        /** The page orientation of the document. (default: `portrait`) */
        pageOrientation?: import("pdfmake/interfaces").PageOrientation;
        defaultStyle?: import('pdfmake/interfaces').Style;
        styles?: import('pdfmake/interfaces').StyleDictionary;
        background?: import('pdfmake/interfaces').DynamicBackground | import('pdfmake/interfaces').Content;
        footer?: PDFGenDocumentHeaderAndFooter;
        header?: PDFGenDocumentHeaderAndFooter;
        images?: {
            [name: string]: string;
        };
        pageMargins?: import('pdfmake/interfaces').Margins;
        pageSize?: import('pdfmake/interfaces').PageSize;
        watermark?: import('pdfmake/interfaces').Watermark | string;
        fonts?: {
            [name: string]: {
                normal?: string;
                bold?: string;
                italics?: string;
                bolditalics?: string;
            };
        };
    });
    makeDocument(): import('pdfmake/interfaces').TDocumentDefinitions;
    createPDF(): Promise<import("pdfmake/build/pdfmake").TCreatedPdf>;
    downloadPDF(fileName: string): Promise<void>;
    getBase64(): Promise<string>;
}
export {};
