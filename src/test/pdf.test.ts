import { PDFGen, PDFGenColumns, PDFGenText, PDFGenEmptySpace, PDFGenStack, PDFGenTable, PDFGenImage } from '../pdf'

describe("PDF", () => {

    it("generates the PDF document definition correctly 1", async () => {

        let expected = {
            pageOrientation: 'portrait',
            content: [
                { text: "John Doe", fontSize: 20 },
                { text: "August 2020", fontSize: 12 },
                " ",
                " ",
                {
                    image: 'sampleImage.jpg',
                    height: 120,
                    width: 120
                },
                {
                    columns: [
                        {
                            width: 100,
                            text: "Left Col"
                        },
                        {
                            width: "*",
                            stack: [
                                { text: "text 1" },
                                { text: "text 2" },
                            ]

                        }
                    ]
                },
                {
                    table: {
                        widths: [100, 70, 70, 70, "*"],
                        headerRows: 1,
                        body: [
                            ["Date", "Work", "Break", "Net", "Note"].map(z => {
                                return { text: z, fontSize: 12, bold: true, fillColor: "#333", color: "white" }
                            }),
                            ["01/08/2020", "12", "2", "10", "Some Note"].map(z => {
                                return { text: z, fontSize: 11 }
                            }),
                            ["Weekly Total", "12", "2", "10", ""].map(z => {
                                return { text: z, fontSize: 13, bold: true, fillColor: "#f2f2f2" }
                            }),
                            ["Grand Total", "12", "2", "10", ""].map(z => {
                                return { text: z, fontSize: 13, bold: true, fillColor: "#ddd" }
                            })
                        ]
                    }
                }
            ]

        }

        // Document creationg
        let pdf = new PDFGen({
            pageOrientation: 'portrait',
        })

        pdf.content = [
            new PDFGenText({ text: 'John Doe', fontSize: 20 }),
            new PDFGenText({ text: 'August 2020', fontSize: 12 }),
            new PDFGenEmptySpace(),
            " ",
            new PDFGenImage({ image: 'sampleImage.jpg', width: 120, height: 120 }),
            new PDFGenColumns({
                columns: [
                    {
                        width: 100,
                        element: new PDFGenText({text: "Left Col"})
                    },
                    {
                        width: '*',
                        element: new PDFGenStack({
                            stack: [
                                new PDFGenText({text: "text 1"}),
                                new PDFGenText({text: "text 2"}),
                            ]
                        })
                    }
                ]
            }),
            new PDFGenTable({
                widths: [100, 70, 70, 70, "*"],
                headerRows: 1,
                body: [
                    ["Date", "Work", "Break", "Net", "Note"].map(z => {
                        return new PDFGenText({ text: z, fontSize: 12, bold: true, fillColor: "#333", color: "white" })
                    }),
                    ["01/08/2020", "12", "2", "10", "Some Note"].map(z => {
                        return new PDFGenText({ text: z, fontSize: 11 })
                    }),
                    ["Weekly Total", "12", "2", "10", ""].map(z => {
                        return new PDFGenText({ text: z, fontSize: 13, bold: true, fillColor: "#f2f2f2" })
                    }),
                    ["Grand Total", "12", "2", "10", ""].map(z => {
                        return new PDFGenText({ text: z, fontSize: 13, bold: true, fillColor: "#ddd" })
                    })
                ]
            })
        ]

        expect(pdf.makeDocument()).toEqual(expected)

    })

})