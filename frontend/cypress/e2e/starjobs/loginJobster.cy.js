/// <reference types="cypress"/>

describe('Client Should login to homepage', () => {



 
    it('Client login', () => {
        const email="angelotesting21+1@gmail.com";
        const password="testing21";
        const code="660302"

        cy.visit('http://localhost:7002/login')
        cy.get('#useremail').type('migquintos23@gmail.com');
        cy.get('#userpassword').type('miguel23');
        cy.get('#loginBtn').click();
        cy.get('#jobsterName').should('have.text','Miguel Quintos')
    })

})
