// React
import { useState } from 'react';

// Vieolo UI
import GridContainer from '@vieolo/vieolo-ui/dist/GridContainer';
import Grid from '@vieolo/vieolo-ui/dist/Grid';
import List from '@vieolo/vieolo-ui/dist/List';
import Page from '@vieolo/vieolo-ui/dist/Page';

// Local UI
import PDFPage from '../pdf/pdf';
import ExcelPage from '../excel/excel';


export default function HomePage(props: {}) {
    let [right, setRight] = useState<string>("")

    let pages: { [key: string]: any } = {
        "pdf": <PDFPage />,
        "excel": <ExcelPage />,
    }

    return <Page>
        <GridContainer columnGap='one'>
            <Grid xl={3}>
                <List
                    height='100%'
                    items={[
                        {
                            id: "pdf",
                            title: "PDF",
                            selected: false,
                            onClick: () => setRight("pdf")
                        },
                        {
                            id: "excel",
                            title: "Excel",
                            selected: false,
                            onClick: () => setRight("excel")
                        }
                    ]}
                />
            </Grid>

            <Grid xl={9}>
                {
                    pages[right] !== undefined &&
                    <>
                        {pages[right]}
                    </>
                }
            </Grid>
        </GridContainer>
    </Page>
}