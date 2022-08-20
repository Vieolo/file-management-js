import type { ContentBase, Content, ContextPageSize, ImageCover, ContentTable, Dash, Size, DynamicRowSize, Style, Table, ContentColumns, ContentStack, ContentCanvas, TDocumentDefinitions, TDocumentInformation, StyleDictionary, DynamicBackground, Margins, PageSize, Watermark } from 'pdfmake/interfaces';

interface IPDFGenElement {
    getObject: () => Content
}

type PDFGenElement = IPDFGenElement | string
export type PDFGenDocumentHeaderAndFooter = (currentPage: number, pageCount: number, pageSize: ContextPageSize) => PDFGenElement | null | undefined;


export class PDFGenEmptySpace implements IPDFGenElement {
    constructor() { }

    getObject() {
        return " "
    };
}

export class PDFGenText implements IPDFGenElement {
    constructor(public data: ContentBase & { text: string }) { }

    getObject() {
        return this.data
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

export type PDFGenTableLayout = 'noBorders' | 'headerLineOnly' | 'lightHorizontalLines' | {
    hLineWidth?: (i: number, node: ContentTable) => number,
    vLineWidth?: (i: number, node: ContentTable) => number
    hLineColor?: (i: number, node: ContentTable) => string,
    vLineColor?: (i: number, node: ContentTable) => string
    hLineStyle?: (i: number, node: ContentTable) => { dash: Dash },
    vLineStyle?: (i: number, node: ContentTable) => { dash: Dash },
    paddingLeft?: (i: number, node: ContentTable) => number,
    paddingRight?: (i: number, node: ContentTable) => number,
    paddingTop?: (i: number, node: ContentTable) => number,
    paddingBottom?: (i: number, node: ContentTable) => number,
    fillColor?: (rowIndex: number, node: ContentTable, columnIndex: number) => number | null
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
                normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
                bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
                italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
                bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
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
