jest.useFakeTimers();

import { csvFileToArray, csvFileToObject } from "../src/csv/csv";

describe("index", () => {
    test("converts CSV file to array of array of string", async () => {

        let file = new File([`Uitgevoerd door;Taakreferentie;Rapport;Laatst bekende taakstatus;Activiteit type;Adres;Starttijd;Duur (ms);Kilometerstand begin;Gereden afstand;Totaal verbruik
        Erkan Ilbey;;Trailernummer: 5833;---;Afkoppelen;Vooruitgangsstraat, 8630 Veurne, BE;8-3-21 0:05;360000;410412,4;0,0;
        Erkan Ilbey;;Trailernummer: 5838;---;Aankoppelen;Vooruitgangsstraat, 8630 Veurne, BE;8-3-21 0:11;480000;410412,4;0,0;
        Erkan Ilbey;;;---;Laden;Vooruitgangsstraat, 8630 Veurne, BE;8-3-21 0:19;1800000;410412,4;0,0;`], 'test.csv', {
            type: 'text/csv'
        });

        expect((await csvFileToArray(file)).data).toEqual([
            ["Uitgevoerd door", "Taakreferentie", "Rapport", "Laatst bekende taakstatus", "Activiteit type", "Adres", "Starttijd", "Duur (ms)", "Kilometerstand begin", "Gereden afstand", "Totaal verbruik"],
            ["        Erkan Ilbey", "", "Trailernummer: 5833", "---", "Afkoppelen", "Vooruitgangsstraat, 8630 Veurne, BE", "8-3-21 0:05", "360000", "410412,4", "0,0", ""],
            ["        Erkan Ilbey", "", "Trailernummer: 5838", "---", "Aankoppelen", "Vooruitgangsstraat, 8630 Veurne, BE", "8-3-21 0:11", "480000", "410412,4", "0,0", ""],
            ["        Erkan Ilbey", "", "", "---", "Laden", "Vooruitgangsstraat, 8630 Veurne, BE", "8-3-21 0:19", "1800000", "410412,4", "0,0", ""]
        ]);

        expect((await csvFileToObject(file)).data).toEqual([{
            "Uitgevoerd door": "        Erkan Ilbey",
            "Taakreferentie": "",
            "Rapport": "Trailernummer: 5833",
            "Laatst bekende taakstatus": "---",
            "Activiteit type": "Afkoppelen",
            "Adres": "Vooruitgangsstraat, 8630 Veurne, BE",
            "Starttijd": "8-3-21 0:05",
            "Duur (ms)": "360000",
            "Kilometerstand begin": "410412,4",
            "Gereden afstand": "0,0",
            "Totaal verbruik": ""
        }, {
            "Uitgevoerd door": "        Erkan Ilbey",
            "Taakreferentie": "",
            "Rapport": "Trailernummer: 5838",
            "Laatst bekende taakstatus": "---",
            "Activiteit type": "Aankoppelen",
            "Adres": "Vooruitgangsstraat, 8630 Veurne, BE",
            "Starttijd": "8-3-21 0:11",
            "Duur (ms)": "480000",
            "Kilometerstand begin": "410412,4",
            "Gereden afstand": "0,0",
            "Totaal verbruik": ""
        }, {
            "Uitgevoerd door": "        Erkan Ilbey",
            "Taakreferentie": "",
            "Rapport": "",
            "Laatst bekende taakstatus": "---",
            "Activiteit type": "Laden",
            "Adres": "Vooruitgangsstraat, 8630 Veurne, BE",
            "Starttijd": "8-3-21 0:19",
            "Duur (ms)": "1800000",
            "Kilometerstand begin": "410412,4",
            "Gereden afstand": "0,0",
            "Totaal verbruik": ""
        }]);

    });
});
