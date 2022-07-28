/// <reference types="cypress" />
import moment from 'moment'


context('Client should be able to Create a Gig', () => {


    beforeEach(() => {
        // cy.visit('https://example.cypress.io/commands/actions')
      }) 
      

      it('displays two todo items by default', () => {
        const workType="Test";
        const location="test";
        const contact = "09386045414";
        const area = "Manila";
        const startDate = "July 26, 2022 3:00 PM";
        const endDate = "July 26, 2022 5:00 PM";
        const m = moment()
         
        cy.visit('http://localhost:7002/login   ')
        cy.get('#useremail').type('migquintos32@gmail.com');
        cy.get('#userpassword').type('miguel23');
        cy.get('#loginBtn').click();
        cy.get('#jobsterName').should('have.text','Miguel Quintos')
        cy.get('#gigsBtn').click();
        cy.get('#createGig').select('Restaurant Services');
        cy.get('#workType').type(`${workType}`);
        cy.get('#location').type(`${location}`);
        cy.get('#contactNumber').type(`${contact}`);
        cy.get('#area').type(`${area}`);
        cy.get('#startDate').type(`${m.format('MMM D YYYY')} 3:00 PM"`);
        cy.get('#endDate').type(`${endDate}`);
        // cy.get('#shifts')
        // .parent()
        // .click()
        // .get('option[data-value="Morning Shift"]')
        // .click();
        cy.get('#shifts').select('Mid Shift');
        // cy.get('#hours').should('have.value','2.00');
        cy.get('#inputFee').type(`67`);
        cy.get('#locRate').select(`NCR/Manila Rate`);
        cy.get('#instruction').type(`service crew`);
        cy.get('#continue').click();
        cy.get('#postGig').click();
        cy.get('#gigCon').click();


        // cy.get('#goBack').click();
        
          //  cy.get('#shifts').get('option[data-value="Morning Shift"]')


        // cy.get('#shifts').select('Mid Shift');
        

      })
    

 }

 )
