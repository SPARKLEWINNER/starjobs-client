/// <reference types="cypress" />
import moment from 'moment'

context('Client should be able to Create a Gig', () => {
  const workType = 'Test'
  const location= "testing"
  const contact = "09386045414"
  const area = "Manila"
  const m = moment()

  beforeEach(() => {
    cy.visit('http://localhost:7002/login')
  })

  it('Client creates Gig', () => {
    cy.get('#useremail').type('migquintos32@gmail.com')
    cy.get('#userpassword').type('miguel23')
    cy.get('#loginBtn').click()
    cy.get('#jobsterName').should('have.text','Miguel Quintos')
    cy.get('#gigsContainer').click()
    // cy.get('#gigCategorySelect').select('Restaurant Services');
    // cy.get('#workType').type(`${workType}`);
    // cy.get('#location').type(`${location}`);
    // cy.get('#contactNumber').type(`${contact}`);
    // cy.get('#areaNotifSelect').type(`${area}`);
    // cy.get('#startDate').type(`${m.format('MMM D YYYY')} 1:00 PM"`);
    // cy.get('#endDate').type(`${m.format('MMM D YYYY')} 6:00 PM`);
    // cy.get('#shiftSelect').select('Mid Shift');
    // cy.get('#inputGigFee').type(`67`);
    // cy.get('#locationRateSelect').select(`NCR/Manila Rate`);
    // cy.get('#instruction').type(`service crew`);
    // cy.get('#continueGigForm').click();
    // cy.get('#postGigButton').click();
    // cy.get('#gigcontinueGigSubmitCon').click();
  })

  it('Jobster Apply for Gig', () => {
    cy.get('#useremail').type('angelotesting21+9@gmail.com')
    cy.get('#userpassword').type('testing21')
    cy.get('#loginBtn').click()
    // cy.get('#jobsterName').should('have.text','Miguel Quintos')
    // cy.get('#searchBtn',{timeout:5000}).click();
    // cy.get('#viewGig',{timeout:5000}).click();
    // cy.get('#apply',{timeout:5000}).click();
    // cy.get('#confirm',{timeout:5000}).click();
    // cy.get('#viewGigInProgressButton',{timeout:5000}).click();
  })

  it('Client accept Applicant', () => {
    cy.get('#useremail').type('migquintos32@gmail.com');
    cy.get('#userpassword').type('miguel23')
    cy.get('#loginBtn').click()
    // cy.get('#jobsterName').should('have.text','Miguel Quintos')
    cy.get('#gigsContainer', {timeout: 5000}).click()
    // cy.get('#viewGig', {timeout: 5000}).click()
    cy.get('##mui-p-39846-T-2', {timeout: 5000}).click()
    cy.get('#mui-p-73028-T-3', {timeout: 5000}).click()
    cy.get('#viewBtn', {timeout: 5000}).click()
  })
})
