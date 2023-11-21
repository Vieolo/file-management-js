import { PDFGenElement, PDFGenStack, PDFGenTable, PDFGenTableCell, PDFGenText } from "../pdf_gen";


/**
 * Generates the top two row of the chart, containing the week, number of day, and day of the week.
 * 
 * The returning object also contains an array of indices of the vertical lines to be bold to indicate the boundaries of a week
 * @param title The title of the Y axis of the chart
 * @param dayCount The total number of days in the month
 * @param firstDayWeekday The weekday number of the first day of the month
 * @param startingWeekNumber The number of the first week of the month
 * @returns Returns an object containing the header rows and the index of the vertical lines to be bold
 */
function getDayCounts(title: string, dayCount: number, firstDayWeekday: number, startingWeekNumber: number,): {boldVertLines: number [], dayRows: PDFGenElement[][]} {
    let weekDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    // The week row
    let weeks: PDFGenElement[] = [
        new PDFGenTableCell({
            cellProperties: {
                rowSpan: 2,
            },
            element: new PDFGenText({ text: title, marginTop: 15 })
        })
    ]

    // The days row
    let days: PDFGenElement[] = [" "];
    
    // The first and last lines are always bold
    let boldVertLines = [1, dayCount + 1];
    
    // Keeping track of the week
    let currentWeek = startingWeekNumber;

    for (let i = 1; i <= dayCount; i++) {
        let thisWeekday = weekDay[(firstDayWeekday + (i - 1)) % 7]
        days.push(
            new PDFGenTableCell({
                element: new PDFGenStack({
                    stack: [
                        new PDFGenText({ text: i > 9 ? i.toString() : `0${i}`, fontSize: 10, bold: true, marginBottom: 3 }),
                        new PDFGenText({ text: thisWeekday[0], alignment: "center", fillColor: 'white', fontSize: 10, color: 'gray' })
                    ]
                })
            })
        )
        
        // Starting the week if the first day of the month or a monday
        if (i === 1 || thisWeekday === "Mon") {
            // The col span of the cell
            let colSpan = 1;
            
            if ((i + 6) > dayCount) {
                // If the end of the week is later than the end of the month
                colSpan = dayCount - i + 1;
                boldVertLines.push(i)
            } else if (i === 1) {
                // If the first day of the month
                let weekDayIndex = weekDay.indexOf(thisWeekday);
                colSpan = weekDayIndex === 0 ? 1 : 8 - weekDayIndex
            } else {
                // If monday
                colSpan = 7
                boldVertLines.push(i)
            }
            weeks.push(new PDFGenTableCell({
                cellProperties: {
                    colSpan: colSpan
                },
                element: currentWeek.toString(),
            }))
            currentWeek += 1;
        } else {
            // If in the middle of the week, we still need to push an empty cell
            // to cover the col span of the first day of the week
            weeks.push("")
        }
    }
    
    return {
        boldVertLines: boldVertLines,
        dayRows:[weeks, days]
    }
}


/**
 * Generates a single row of the chart with the given marked days
 * @param title The title of the row, displayed in the first column
 * @param totalDays The total number of days in the month
 * @param workingDays The days to be marked on the chart 
 * @param markColor The color used to mark the cells
 * @returns Returns a single row
 */
function getMarkedDays(title: string, totalDays: number, markedDays: number[], markColor?: string): PDFGenElement[] {
    let days: PDFGenElement[] = [
        new PDFGenText({ text: title, fontSize: 11, bold: true }),
    ];

    for (let i = 0; i < totalDays; i++) {
        days.push(
            new PDFGenText({ text: " ", fillColor: markedDays.includes(i + 1) ? markColor || 'coral' : undefined })
        )
    }

    return days;
}


/**
 * Creates table for the given month with a similar layout to a Gantt Chart
 */
export function monthGantt(options: {
    /** The number of days in the month */
    dayCount: number,
    /** The day of the week of the first day of the month, obtained by `getDay` function */
    firstDayWeekDay: number,
    /** The number of the first week of the month */
    firstWeekNumber: number,
    yAxisTitle: string,
    data: { title: string, markedDays: number[] }[],
    /** default: `coral` */
    markColor?: string
}): PDFGenTable {
    
    let { boldVertLines, dayRows } = getDayCounts(options.yAxisTitle, options.dayCount, options.firstDayWeekDay, options.firstWeekNumber);

    let body: PDFGenElement[][] = [
        ...dayRows,
    ]

    for (let i = 0; i < options.data.length; i++) {
        const row = options.data[i];
        body.push(
            getMarkedDays(row.title, options.dayCount, row.markedDays, options.markColor)
        )
    }

    return new PDFGenTable({
        body: body,
        widths: new Array(options.dayCount + 1).fill(12).map((z, i) => i === 0 ? "*" : z),
        layout: {
            vLineColor: (i, n, r) => {
                if (i === 0 || boldVertLines.includes(i)) return 'black'
                return "#666666"
            },
            vLineWidth: (i, n) => {
                if (i === 0 || boldVertLines.includes(i)) return 1
                return 0.3
            }
        }
    })
}