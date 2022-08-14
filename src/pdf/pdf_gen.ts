interface IPDFGenElement {
    getObject: () => import('pdfmake/interfaces').Content
}

type PDFGenElement = IPDFGenElement | string
export type PDFGenDocumentHeaderAndFooter = (currentPage: number, pageCount: number, pageSize: import('pdfmake/interfaces').ContextPageSize) => PDFGenElement | null | undefined;


export class PDFGenEmptySpace implements IPDFGenElement {
    constructor() { }

    getObject() {
        return " "
    };
}

export class PDFGenText implements IPDFGenElement {
    constructor(public data: import('pdfmake/interfaces').ContentBase & {text: string}) { }

    getObject() {
        return this.data
    };
}

export class PDFGenImage implements IPDFGenElement {
    constructor(public data: import('pdfmake/interfaces').ContentBase & {
        image: string,
        width?: number,    
        height?: number,
        fit?: [number, number],    
        cover?: import('pdfmake/interfaces').ImageCover,
    }) { }

    getObject() {
        return this.data
    };
}

export type PDFGenTableLayout = 'noBorders' | 'headerLineOnly' | 'lightHorizontalLines' | {
    hLineWidth?: (i: number, node: import('pdfmake/interfaces').ContentTable) => number,
    vLineWidth?: (i: number, node: import('pdfmake/interfaces').ContentTable) => number
    hLineColor?: (i: number, node: import('pdfmake/interfaces').ContentTable) => string,
    vLineColor?: (i: number, node: import('pdfmake/interfaces').ContentTable) => string
    hLineStyle?: (i: number, node: import('pdfmake/interfaces').ContentTable) => { dash: import('pdfmake/interfaces').Dash },
    vLineStyle?: (i: number, node: import('pdfmake/interfaces').ContentTable) => { dash: import('pdfmake/interfaces').Dash },    
    paddingLeft?: (i: number, node: import('pdfmake/interfaces').ContentTable) => number,
    paddingRight?: (i: number, node: import('pdfmake/interfaces').ContentTable) => number,
    paddingTop?: (i: number, node: import('pdfmake/interfaces').ContentTable) => number,
    paddingBottom?: (i: number, node: import('pdfmake/interfaces').ContentTable) => number,
    fillColor?: (rowIndex: number, node: import('pdfmake/interfaces').ContentTable, columnIndex: number) => number | null
}

export class PDFGenTable implements IPDFGenElement {
    constructor(public data: {
        body: PDFGenElement[][],
        widths?: "*" | "auto" | import('pdfmake/interfaces').Size[],
        heights?: number | 'auto' | Array<number | 'auto'> | import('pdfmake/interfaces').DynamicRowSize,
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
        style?: import('pdfmake/interfaces').Style
    }) { }

    getObject() {
        return {
            table: {
                body: this.data.body,
                dontBreakRows: this.data.dontBreakRows,
                headerRows: this.data.headerRows,
                heights: this.data.heights,
                keepWithHeaderRows: this.data.keepWithHeaderRows,
                widths: this.data.widths
            },
            ...(this.data.style || {})
        } as import('pdfmake/interfaces').ContentTable
    }
}

export type PDFGenColumnsCol = {
    /** (default: "*") */
    width?: import('pdfmake/interfaces').Size,
    element: PDFGenElement
}

export class PDFGenColumns implements IPDFGenElement {
    constructor(public data: import('pdfmake/interfaces').ContentBase & {columns: PDFGenColumnsCol[]}) { }

    getObject() {
        return {
            ...this.data,
            columns: this.data.columns.map(z => {
                return {
                    width: z.width,
                    ...(typeof z.element === 'string' ? z : (z.element.getObject() as any))
                }
            })
        } as import('pdfmake/interfaces').ContentColumns
    };
}


export class PDFGenStack implements IPDFGenElement {
    constructor(public data: import('pdfmake/interfaces').ContentBase & {stack: PDFGenElement[]}) { }

    getObject() {
        return {
            ...this.data,
            stack: this.data.stack.map(z => {
                return typeof z === 'string' ? z : z.getObject()
            })
        } as import('pdfmake/interfaces').ContentStack
    };
}




export default class PDFGen {
    public content: Array<PDFGenElement> = [];
    constructor(public data: {
        /** The meta data of the PDF document */
        metaData?: import('pdfmake/interfaces').TDocumentInformation,
        /** The page orientation of the document. (default: `portrait`) */
        pageOrientation?: import("pdfmake/interfaces").PageOrientation,
        defaultStyle?: import('pdfmake/interfaces').Style,
        styles?: import('pdfmake/interfaces').StyleDictionary,
        background?: import('pdfmake/interfaces').DynamicBackground | import('pdfmake/interfaces').Content,
        footer?: PDFGenDocumentHeaderAndFooter,
        header?: PDFGenDocumentHeaderAndFooter,
        images?: { [name: string]: string }
        pageMargins?: import('pdfmake/interfaces').Margins,
        pageSize?: import('pdfmake/interfaces').PageSize,
        watermark?: import('pdfmake/interfaces').Watermark | string,
        fonts?: {[name: string]: {            
            normal?: string;    
            bold?: string,    
            italics?: string,    
            bolditalics?: string
        }}

        // The properties that haven't been added
        // pageBreakBefore
        // userPassword
        // ownerPassword
        // permissions
    }) { }

    makeDocument() : import('pdfmake/interfaces').TDocumentDefinitions {        
        function getHF(currentPage: number, pageCount: number, pageSize: import('pdfmake/interfaces').ContextPageSize, target?: PDFGenDocumentHeaderAndFooter, ) {
            if (!target) return undefined;
            
            let t: PDFGenDocumentHeaderAndFooter = target;
            let res = t(currentPage, pageCount, pageSize)
            if (!res) return res
            return typeof res === 'string' ? res : res.getObject()
        }

        return {
            content: this.content.map(z => {
                return typeof z === 'string' ? z : z.getObject()
            }),
            background: this.data.background,
            defaultStyle: this.data.defaultStyle,
            footer: (c, pc, ps) => getHF(c, pc, ps, this.data.footer),
            header: (c, pc, ps) => getHF(c, pc, ps, this.data.header),
            images: this.data.images,
            info: this.data.metaData,
            pageMargins: this.data.pageMargins,
            pageSize: this.data.pageSize,
            styles: this.data.styles,
            watermark: this.data.watermark,
            pageOrientation: this.data.pageOrientation,        
        }
    }  

    async createPDF() {
        let pdfmake = await import('pdfmake/build/pdfmake');
        if (this.data.fonts) pdfmake.fonts = this.data.fonts
        return pdfmake.createPdf(this.makeDocument());
    }

    async downloadPDF(fileName: string) {
        let doc = await this.createPDF()
        doc.download(`${fileName}.pdf`);
    }
    
    
    async getBase64(): Promise<string> {
        let doc = await this.createPDF()
        return new Promise(resolve => {
            doc.getBase64((data: string) => resolve(data));
        });
    }
}
