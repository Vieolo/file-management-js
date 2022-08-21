import path from "path";

describe("PDF", () => {
    it("Generates the PDF File correctly", () => {
        cy.visit("/")

        const downloadsFolder = Cypress.config("downloadsFolder");        
        cy.contains("PDF").click();
        cy.contains("Generate PDF").click();
        
        cy.readFile(path.join(downloadsFolder, "ss.pdf")).should("exist");
    })
})