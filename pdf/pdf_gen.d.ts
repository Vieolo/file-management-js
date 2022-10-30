import type { ContentBase, Content, ContextPageSize, ImageCover, ContentTable, Dash, Size, DynamicRowSize, Style, ContentColumns, ContentStack, ContentCanvas, TDocumentDefinitions, TDocumentInformation, StyleDictionary, DynamicBackground, Margins, PageSize, Watermark, TableCellProperties, PatternFill } from 'pdfmake/interfaces';
interface IPDFGenElement {
    getObject: () => Content;
}
export declare type PDFGenElement = IPDFGenElement | string;
export declare type PDFGenDocumentHeaderAndFooter = (currentPage: number, pageCount: number, pageSize: ContextPageSize) => PDFGenElement | null | undefined;
export declare class PDFGenEmptySpace implements IPDFGenElement {
    getObject(): string;
}
export declare class PDFGenText implements IPDFGenElement {
    data: (ContentBase & {
        text: string;
    }) | string;
    constructor(data: (ContentBase & {
        text: string;
    }) | string);
    getObject(): ContentBase & {
        text: string;
    };
}
export declare class PDFGenTableCell implements IPDFGenElement {
    data: {
        element: PDFGenElement;
        cellProperties?: TableCellProperties;
    };
    constructor(data: {
        element: PDFGenElement;
        cellProperties?: TableCellProperties;
    });
    getObject(): any;
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
declare type DynamicLayout<T> = (rowIndex: number, node: ContentTable) => T | null;
export declare type VerticalDynamicLayout<T> = (columnIndex: number, node: ContentTable) => T | null;
declare type DynamicCellLayout<T> = (rowIndex: number, node: ContentTable, columnIndex: number) => T | null;
export declare type VerticalDynamicCellLayout<T> = (columnIndex: number, node: ContentTable, rowIndex: number) => T | null;
export declare type PDFGenTableLayout = 'noBorders' | 'headerLineOnly' | 'lightHorizontalLines' | {
    /**
     * Width of horizontal lines in `pt` depending on the row number
     * (0 = line above the first row).
     *
     * **Note**: Does not allow an explicit value of `undefined`.
     *
     * Defaults to `1`.
     */
    hLineWidth?: DynamicLayout<number>;
    /**
     * Width of vertical lines in `pt` depending on the column number
     * (0 = line to the left of the left-most column).
     *
     * **Note**: Does not allow an explicit value of `undefined`.
     *
     * Defaults to `1`.
     */
    vLineWidth?: VerticalDynamicLayout<number>;
    /**
     * Color of horizontal lines, optionally depending on the row (0 = line above
     * the top row) and column number (0 = left-most column).
     *
     * Can be overridden for each cell via {@link TableCellProperties.borderColor}.
     *
     * Defaults to `black`.
     */
    hLineColor?: DynamicCellLayout<string>;
    /**
     * Color of vertical lines, optionally depending on the column (0 = line left
     * of the left-most column) and row number (0 = top row).
     *
     * Can be overridden for each cell via {@link TableCellProperties.borderColor}.
     *
     * Defaults to `black`.
     */
    vLineColor?: VerticalDynamicCellLayout<string>;
    /**
     * Style of horizontal lines depending on the row number
     * (0 = line above the top row).
     *
     * **Note**: Does not allow an explicit value of `undefined`.
     *
     * Defaults to a solid line.
     */
    hLineStyle?: DynamicLayout<{
        dash: Dash;
    }>;
    /**
     * Style of vertical lines depending on the column number
     * (0 = line to the left of the left-most column).
     *
     * **Note**: Does not allow an explicit value of `undefined`.
     *
     * Defaults to a solid line.
     */
    vLineStyle?: VerticalDynamicLayout<{
        dash: Dash;
    }>;
    /**
     * Padding in `pt` to the left of each column
     * (0 = left-most column).
     *
     * **Note**: Does not allow an explicit value of `undefined`.
     *
     * Defaults to `4`.
     */
    paddingLeft?: VerticalDynamicLayout<number>;
    /**
     * Padding in `pt` to the right of each column
     * (0 = left-most column).
     *
     * **Note**: Does not allow an explicit value of `undefined`.
     *
     * Defaults to `4`.
     */
    paddingRight?: VerticalDynamicLayout<number>;
    /**
     * Padding in `pt` at the top of each cell of a row
     * (0 = top row).
     *
     * **Note**: Does not allow an explicit value of `undefined`.
     *
     * Defaults to `2`.
     */
    paddingTop?: DynamicLayout<number>;
    /**
     * Padding in `pt` at the bottom of each cell of a row
     * (0 = top row).
     *
     * **Note**: Does not allow an explicit value of `undefined`.
     *
     * Defaults to `2`.
     */
    paddingBottom?: DynamicLayout<number>;
    /**
     * Background color the table's cells are filled with.
     *
     * Supports well-known color names like `blue` or hexadecimal color strings like `#ccffcc`,
     * as well as a reference to a pattern.
     */
    fillColor?: DynamicCellLayout<string | PatternFill>;
    /**
     * Opacity of the {@link fillColor}.
     * Must be between 0 (fully transparent) and 1 (fully opaque).
     *
     * Defaults to `1`.
     */
    fillOpacity?: DynamicCellLayout<number>;
    /**
     * Controls whether the table has any borders by default.
     *
     * If set to `false`, borders can only be added to cells via their `border` property.
     *
     * Defaults to `true`.
     */
    defaultBorder?: boolean | undefined;
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
        /**
         * If the `fonts` is omitted, the `Roboto` font from `CDN` is automatically used.
         * The default font is `Roboto`. This value can be changed via `defaultStyle.font`
         */
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
        /**
         * If the `fonts` is omitted, the `Roboto` font from `CDN` is automatically used.
         * The default font is `Roboto`. This value can be changed via `defaultStyle.font`
         */
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
