import type { ContentBase, Content, ContextPageSize, ImageCover, ContentTable, Dash, Size, DynamicRowSize, Style, Table, ContentColumns, ContentStack, ContentCanvas, TDocumentDefinitions, TDocumentInformation, StyleDictionary, DynamicBackground, Margins, PageSize, Watermark, TableCellProperties, PatternFill } from 'pdfmake/interfaces';

interface IPDFGenElement {
    getObject: () => Content
}

export type PDFGenElement = IPDFGenElement | string
export type PDFGenDocumentHeaderAndFooter = (currentPage: number, pageCount: number, pageSize: ContextPageSize) => PDFGenElement | null | undefined;


export class PDFGenEmptySpace implements IPDFGenElement {

    getObject() {
        return " "
    };
}

export class PDFGenText implements IPDFGenElement {
    constructor(public data: (ContentBase & { text: string }) | string) { }

    getObject() {
        return typeof this.data === 'string' ? { text: this.data } : this.data
    };
}

export class PDFGenTableCell implements IPDFGenElement {
    constructor(public data: { element: PDFGenElement, cellProperties?: TableCellProperties }) { }

    getObject() {
        return { ...(typeof this.data.element === 'string' ? { text: this.data.element } : this.data.element.getObject() as any), ...(this.data.cellProperties || {}) }
    };
}

export class PDFGenImage implements IPDFGenElement {
    constructor(public data: ContentBase & {
        image: string,
        width?: number,
        height?: number,
        fit?: [number, number],
        cover?: ImageCover,
    }) { }

    getObject() {
        return this.data
    };
}

type DynamicLayout<T> = (rowIndex: number, node: ContentTable) => T | null;
export type VerticalDynamicLayout<T> = (columnIndex: number, node: ContentTable) => T | null;
type DynamicCellLayout<T> = (
    rowIndex: number,
    node: ContentTable,
    columnIndex: number,
) => T | null;
export type VerticalDynamicCellLayout<T> = (
    columnIndex: number,
    node: ContentTable,
    rowIndex: number,
) => T | null;


export type PDFGenTableLayout = 'noBorders' | 'headerLineOnly' | 'lightHorizontalLines' | {
    /**
     * Width of horizontal lines in `pt` depending on the row number
     * (0 = line above the first row).
     *
     * **Note**: Does not allow an explicit value of `undefined`.
     *
     * Defaults to `1`.
     */
    hLineWidth?: DynamicLayout<number>,
    /**
     * Width of vertical lines in `pt` depending on the column number
     * (0 = line to the left of the left-most column).
     *
     * **Note**: Does not allow an explicit value of `undefined`.
     *
     * Defaults to `1`.
     */
    vLineWidth?: VerticalDynamicLayout<number>,
    /**
     * Color of horizontal lines, optionally depending on the row (0 = line above
     * the top row) and column number (0 = left-most column).
     *
     * Can be overridden for each cell via {@link TableCellProperties.borderColor}.
     *
     * Defaults to `black`.
     */
    hLineColor?: DynamicCellLayout<string>,
    /**
     * Color of vertical lines, optionally depending on the column (0 = line left
     * of the left-most column) and row number (0 = top row).
     *
     * Can be overridden for each cell via {@link TableCellProperties.borderColor}.
     *
     * Defaults to `black`.
     */
    vLineColor?: VerticalDynamicCellLayout<string>,
    /**
     * Style of horizontal lines depending on the row number
     * (0 = line above the top row).
     *
     * **Note**: Does not allow an explicit value of `undefined`.
     *
     * Defaults to a solid line.
     */
    hLineStyle?: DynamicLayout<{ dash: Dash }>,
    /**
     * Style of vertical lines depending on the column number
     * (0 = line to the left of the left-most column).
     *
     * **Note**: Does not allow an explicit value of `undefined`.
     *
     * Defaults to a solid line.
     */
    vLineStyle?: VerticalDynamicLayout<{ dash: Dash }>,
    /**
     * Padding in `pt` to the left of each column
     * (0 = left-most column).
     *
     * **Note**: Does not allow an explicit value of `undefined`.
     *
     * Defaults to `4`.
     */
    paddingLeft?: VerticalDynamicLayout<number>,
    /**
     * Padding in `pt` to the right of each column
     * (0 = left-most column).
     *
     * **Note**: Does not allow an explicit value of `undefined`.
     *
     * Defaults to `4`.
     */
    paddingRight?: VerticalDynamicLayout<number>,
    /**
     * Padding in `pt` at the top of each cell of a row
     * (0 = top row).
     *
     * **Note**: Does not allow an explicit value of `undefined`.
     *
     * Defaults to `2`.
     */
    paddingTop?: DynamicLayout<number>,
    /**
     * Padding in `pt` at the bottom of each cell of a row
     * (0 = top row).
     *
     * **Note**: Does not allow an explicit value of `undefined`.
     *
     * Defaults to `2`.
     */
    paddingBottom?: DynamicLayout<number>,
    /**
     * Background color the table's cells are filled with.
     *
     * Supports well-known color names like `blue` or hexadecimal color strings like `#ccffcc`,
     * as well as a reference to a pattern.
     */
    fillColor?: DynamicCellLayout<string | PatternFill>,
    /**
     * Opacity of the {@link fillColor}.
     * Must be between 0 (fully transparent) and 1 (fully opaque).
     *
     * Defaults to `1`.
     */
    fillOpacity?: DynamicCellLayout<number>
    /**
     * Controls whether the table has any borders by default.
     *
     * If set to `false`, borders can only be added to cells via their `border` property.
     *
     * Defaults to `true`.
     */
    defaultBorder?: boolean | undefined
}

export class PDFGenTable implements IPDFGenElement {
    constructor(public data: {
        body: PDFGenElement[][],
        widths?: "*" | "auto" | Size[],
        heights?: number | 'auto' | Array<number | 'auto'> | DynamicRowSize,
        headerRows?: number,
        /** Controls whether the contents of a table row should be kept together on the same page. (default: false) */
        dontBreakRows?: boolean,
        /**
         * Number of rows after the given headerRows that should be kept together with
         * the header rows, without a page break in between.
         *
         * Defaults to `0`.
         */
        keepWithHeaderRows?: number,
        layout?: PDFGenTableLayout,
        style?: Style
    }) { }

    getObject() {
        let t: Table = {
            body: this.data.body.map(z => {
                return z.map(x => typeof x === 'string' ? x : x.getObject())
            }),
        }

        if (this.data.dontBreakRows) t.dontBreakRows = this.data.dontBreakRows
        if (this.data.headerRows) t.headerRows = this.data.headerRows
        if (this.data.heights) t.heights = this.data.heights
        if (this.data.keepWithHeaderRows) t.keepWithHeaderRows = this.data.keepWithHeaderRows
        if (this.data.widths) t.widths = this.data.widths

        return {
            table: t,
            layout: this.data.layout,
            ...(this.data.style || {})
        } as ContentTable
    }
}

export type PDFGenColumnsCol = {
    /** (default: "*") */
    width?: Size,
    element: PDFGenElement
}

export class PDFGenColumns implements IPDFGenElement {
    constructor(public data: ContentBase & { columns: PDFGenColumnsCol[] }) { }

    getObject() {
        return {
            ...this.data,
            columns: this.data.columns.map(z => {
                return {
                    width: z.width,
                    ...(typeof z.element === 'string' ? z : (z.element.getObject() as any))
                }
            })
        } as ContentColumns
    };
}


export class PDFGenStack implements IPDFGenElement {
    constructor(public data: ContentBase & { stack: PDFGenElement[] }) { }

    getObject() {
        return {
            ...this.data,
            stack: this.data.stack.map(z => {
                return typeof z === 'string' ? z : z.getObject()
            })
        } as ContentStack
    };
}

export class PDFGenLine implements IPDFGenElement {
    constructor(public data: {
        /** (default: 0) */
        x1?: number,
        /** (default: 520) */
        x2?: number,
        /** (default: 4) */
        y1?: number,
        /** (default: 4) */
        y2?: number,
        /** (default: 1) */
        thickness?: number
    }) { }
    getObject() {
        return {
            canvas: [{
                type: 'line',
                x1: this.data.x1 || 0, y1: this.data.y1 || 4,
                x2: this.data.x2 || 520, y2: this.data.y2 || 4,
                lineWidth: this.data.thickness || 1
            }]
        } as ContentCanvas
    }
}




export default class PDFGen {
    public content: Array<PDFGenElement> = [];
    constructor(public data: {
        /** The meta data of the PDF document */
        metaData?: TDocumentInformation,
        /** The page orientation of the document. (default: `portrait`) */
        pageOrientation?: import("pdfmake/interfaces").PageOrientation,
        defaultStyle?: Style,
        styles?: StyleDictionary,
        background?: DynamicBackground | Content,
        footer?: PDFGenDocumentHeaderAndFooter,
        header?: PDFGenDocumentHeaderAndFooter,
        images?: { [name: string]: string }
        pageMargins?: Margins,
        pageSize?: PageSize,
        watermark?: Watermark | string,
        /** 
         * If the `fonts` is omitted, the `Roboto` font from `CDN` is automatically used.
         * The default font is `Roboto`. This value can be changed via `defaultStyle.font`
         */
        fonts?: {
            [name: string]: {
                normal?: string;
                bold?: string,
                italics?: string,
                bolditalics?: string
            }
        }

        // The properties that haven't been added
        // pageBreakBefore
        // userPassword
        // ownerPassword
        // permissions
    }) { }

    makeDocument(): TDocumentDefinitions {
        function getHF(currentPage: number, pageCount: number, pageSize: ContextPageSize, target?: PDFGenDocumentHeaderAndFooter,) {
            if (!target) return undefined;

            let t: PDFGenDocumentHeaderAndFooter = target;
            let res = t(currentPage, pageCount, pageSize)
            if (!res) return res
            return typeof res === 'string' ? res : res.getObject()
        }

        let dd: TDocumentDefinitions = {
            content: this.content.map(z => {
                return typeof z === 'string' ? z : z.getObject()
            })
        }

        if (this.data.background) dd.background = this.data.background
        if (this.data.defaultStyle) dd.defaultStyle = this.data.defaultStyle
        if (this.data.footer) dd.footer = (c, pc, ps) => getHF(c, pc, ps, this.data.footer)
        if (this.data.header) dd.header = (c, pc, ps) => getHF(c, pc, ps, this.data.header)
        if (this.data.images) dd.images = this.data.images
        if (this.data.metaData) dd.info = this.data.metaData
        if (this.data.pageMargins) dd.pageMargins = this.data.pageMargins
        if (this.data.pageSize) dd.pageSize = this.data.pageSize
        if (this.data.styles) dd.styles = this.data.styles
        if (this.data.watermark) dd.watermark = this.data.watermark
        if (this.data.pageOrientation) dd.pageOrientation = this.data.pageOrientation

        return dd;
    }

    async createPDF() {
        let pdfmake = await import('pdfmake/build/pdfmake');
        let fonts = this.data.fonts || {
            Roboto: {
                normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.6/fonts/Roboto/Roboto-Regular.ttf',
                bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.6/fonts/Roboto/Roboto-Medium.ttf',
                italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.6/fonts/Roboto/Roboto-Italic.ttf',
                bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.6/fonts/Roboto/Roboto-MediumItalic.ttf'
            },
        }
        return pdfmake.createPdf(this.makeDocument(), undefined, fonts);
    }

    async downloadPDF(fileName: string) {
        let doc = await this.createPDF()
        let fn = fileName
        if (!fn.toLowerCase().endsWith(".pdf")) fn += ".pdf"
        doc.download(fn);
    }


    async getBase64(): Promise<string> {
        let doc = await this.createPDF()
        return new Promise(resolve => {
            doc.getBase64((data: string) => resolve(data));
        });
    }
}
