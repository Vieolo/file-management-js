// React
import { useState } from 'react';

// Vieolo UI
import GridContainer from '@vieolo/vieolo-ui/dist/GridContainer';
import Grid from '@vieolo/vieolo-ui/dist/Grid';
import List from '@vieolo/vieolo-ui/dist/List';
import Page from '@vieolo/vieolo-ui/dist/Page';

// Local UI
import PDFPage from '../pdf/pdf';


export default function HomePage(props: {}) {
    let [right, setRight] = useState<string>("")

    let pages: { [key: string]: any } = {
        "pdf": <PDFPage />
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