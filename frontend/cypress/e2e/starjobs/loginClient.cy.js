/// <reference types="cypress"/>

describe('Client Should login to homepage', () => {



 
    it('Client login', () => {

        cy.visit('http://localhost:7002/login   ')
        cy.get('#useremail').type('migquintos32@gmail.com');
        cy.get('#userpassword').type('miguel23');
        cy.get('#loginBtn').click();
        cy.get('#jobsterName').should('have.text','Miguel Quintos')
    })

})
