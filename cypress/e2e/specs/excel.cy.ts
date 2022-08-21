import path from "path";

describe("Excel", () => {
    it("Generates the Excel File correctly", () => {
        cy.visit("/")

        const downloadsFolder = Cypress.config("downloadsFolder");        
        cy.contains("Excel").click();
        cy.contains("Generate Excel").click();
        
        cy.readFile(path.join(downloadsFolder, "xx.xlsx")).should("exist");
    })
})