// Vieolo UI
import Button from '@vieolo/vieolo-ui/dist/Button';

// File Management
import ExcelGen from '../../../src/excel/excel_gen'

export default function ExcelPage(props: {}) {
    return <div>
        <Button 
            color='primary'
            emphasis='low-normal'
            text='Generate Excel'
            onClick={() => generateExcel()}
        />
    </div>
}


async function generateExcel() {
    let excel = new ExcelGen({
        creator: "Vieolo",
        createdAt: new Date(),
        fullCalcOnLoad: true
    });

    excel.worksheets = [
        {
            name: "First Sheet",
            columns: [],
            rows: [
                {data: [{value: "Something"}]}
            ]
        }
    ]

    excel.download("xx")
}