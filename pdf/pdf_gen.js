export class PDFGenEmptySpace {
    constructor() { }
    getObject() {
        return " ";
    }
    ;
}
export class PDFGenText {
    constructor(data) {
        this.data = data;
    }
    getObject() {
        return this.data;
    }
    ;
}
export class PDFGenImage {
    constructor(data) {
        this.data = data;
    }
    getObject() {
        return this.data;
    }
    ;
}
export class PDFGenTable {
    constructor(data) {
        this.data = data;
    }
    getObject() {
        let t = {
            body: this.data.body.map(z => {
                return z.map(x => typeof x === 'string' ? x : x.getObject());
            }),
        };
        if (this.data.dontBreakRows)
            t.dontBreakRows = this.data.dontBreakRows;
        if (this.data.headerRows)
            t.headerRows = this.data.headerRows;
        if (this.data.heights)
            t.heights = this.data.heights;
        if (this.data.keepWithHeaderRows)
            t.keepWithHeaderRows = this.data.keepWithHeaderRows;
        if (this.data.widths)
            t.widths = this.data.widths;
        return {
            table: t,
            ...(this.data.style || {})
        };
    }
}
export class PDFGenColumns {
    constructor(data) {
        this.data = data;
    }
    getObject() {
        return {
            ...this.data,
            columns: this.data.columns.map(z => {
                return {
                    width: z.width,
                    ...(typeof z.element === 'string' ? z : z.element.getObject())
                };
            })
        };
    }
    ;
}
export class PDFGenStack {
    constructor(data) {
        this.data = data;
    }
    getObject() {
        return {
            ...this.data,
            stack: this.data.stack.map(z => {
                return typeof z === 'string' ? z : z.getObject();
            })
        };
    }
    ;
}
export class PDFGenLine {
    constructor(data) {
        this.data = data;
    }
    getObject() {
        return {
            canvas: [{
                    type: 'line',
                    x1: this.data.x1 || 0, y1: this.data.y1 || 4,
                    x2: this.data.x2 || 520, y2: this.data.y2 || 4,
                    lineWidth: this.data.thickness || 1
                }]
        };
    }
}
export default class PDFGen {
    constructor(data) {
        this.data = data;
        this.content = [];
    }
    makeDocument() {
        function getHF(currentPage, pageCount, pageSize, target) {
            if (!target)
                return undefined;
            let t = target;
            let res = t(currentPage, pageCount, pageSize);
            if (!res)
                return res;
            return typeof res === 'string' ? res : res.getObject();
        }
        let dd = {
            content: this.content.map(z => {
                return typeof z === 'string' ? z : z.getObject();
            })
        };
        if (this.data.background)
            dd.background = this.data.background;
        if (this.data.defaultStyle)
            dd.defaultStyle = this.data.defaultStyle;
        if (this.data.footer)
            dd.footer = (c, pc, ps) => getHF(c, pc, ps, this.data.footer);
        if (this.data.header)
            dd.header = (c, pc, ps) => getHF(c, pc, ps, this.data.header);
        if (this.data.images)
            dd.images = this.data.images;
        if (this.data.metaData)
            dd.info = this.data.metaData;
        if (this.data.pageMargins)
            dd.pageMargins = this.data.pageMargins;
        if (this.data.pageSize)
            dd.pageSize = this.data.pageSize;
        if (this.data.styles)
            dd.styles = this.data.styles;
        if (this.data.watermark)
            dd.watermark = this.data.watermark;
        if (this.data.pageOrientation)
            dd.pageOrientation = this.data.pageOrientation;
        return dd;
    }
    async createPDF() {
        let pdfmake = await import('pdfmake/build/pdfmake');
        if (this.data.fonts)
            pdfmake.fonts = this.data.fonts;
        return pdfmake.createPdf(this.makeDocument());
    }
    async downloadPDF(fileName) {
        let doc = await this.createPDF();
        doc.download(`${fileName}.pdf`);
    }
    async getBase64() {
        let doc = await this.createPDF();
        return new Promise(resolve => {
            doc.getBase64((data) => resolve(data));
        });
    }
}
