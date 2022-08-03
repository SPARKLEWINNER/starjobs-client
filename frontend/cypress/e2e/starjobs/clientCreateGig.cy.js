/// <reference types="cypress" />
import moment from 'moment'

context('Client should be able to Create a Gig', () => {
  const workType="Test";
  const location="test";
  const contact = "09386045414";
  const area = "Manila";
  const m = moment()

  beforeEach(() => {
    cy.visit('http://localhost:7002/login')
  })

  it('Client creates Gig', () => {
    cy.get('#useremail').type('migquintos32@gmail.com');
    cy.get('#userpassword').type('miguel23');
    cy.get('#loginBtn').click();
    cy.get('#jobsterName').should('have.text','Miguel Quintos')
    cy.get('#gigsBtn').click();
    // cy.get('#createGig').select('Restaurant Services');
    // cy.get('#workType').type(`${workType}`);
    // cy.get('#location').type(`${location}`);
    // cy.get('#contactNumber').type(`${contact}`);
    // cy.get('#area').type(`${area}`);
    // cy.get('#startDate').type(`${m.format('MMM D YYYY')} 1:00 PM"`);
    // cy.get('#endDate').type(`${m.format('MMM D YYYY')} 6:00 PM`);
    // cy.get('#shifts').select('Mid Shift');
    // cy.get('#inputFee').type(`67`);
    // cy.get('#locRate').select(`NCR/Manila Rate`);
    // cy.get('#instruction').type(`service crew`);
    // cy.get('#continue').click();
    // cy.get('#postGig').click();
    // cy.get('#gigCon').click();
  })

  it('Jobster Apply for Gig', () => {
    cy.get('#useremail').type('angelotesting21+9@gmail.com');
    cy.get('#userpassword').type('testing21');
    cy.get('#loginBtn').click();
    // cy.get('#jobsterName').should('have.text','Miguel Quintos')
    cy.get('#search',{timeout:5000}).click();
    cy.get('#viewGig',{timeout:5000}).click();
    cy.get('#apply',{timeout:5000}).click();


   
  })
}

)
