/// <reference types="cypress" />

context('Client should be able to Create a Gig', () => {
  beforeEach(() => {
    cy.visit('http://localhost:7002/login')
  })

  it('Jobster Apply for Gig', () => {
    cy.get('#userEmail').type('angelotesting21+9@gmail.com')
    cy.get('#userPassword').type('testing21')
    cy.get('#loginBtn').click()
    cy.get('#searchBtn', {timeout: 15000}).click()
    cy.get('#viewWaitingButton', {timeout: 5000}).click()
    cy.get('#apply', {timeout: 10000}).last().click({timeout: 5000})
    cy.get('#confirm', {timeout: 5000}).click({timeout: 5000})
  })
})
