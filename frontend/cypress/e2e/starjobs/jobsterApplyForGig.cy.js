/// <reference types="cypress" />


 context('Actions', () => {


    beforeEach(() => {
        // cy.visit('https://example.cypress.io/commands/actions')
      }) 
      

      it('displays two todo items by default', () => {
        cy.visit('http://localhost:7002/login   ')
        cy.get('#useremail').type('migquintos23@gmail.com');
        cy.get('#userpassword').type('miguel23');
        cy.get('#loginBtn').click();
        cy.get('#jobsterName').should('have.text','Miguel Quintos')

      })
    

 }

 )
