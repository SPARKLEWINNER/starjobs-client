/// <reference types="cypress" />

context('Client should be able to Create a Gig', () => {
  beforeEach(() => {
    cy.visit('http://localhost:7002/login', {timeout: 10000})
  })

  it('Jobster Confirm Push Through , confirm Arrival and End Shift', () => {
    cy.get('#userEmail').type('angelotesting21+9@gmail.com')
    cy.get('#userPassword').type('testing21')
    cy.get('#loginBtn').click()
    cy.get('#gigsContainer', {timeout: 15000}).click({timeout: 10000})
    cy.findByRole('tab', {name: /PENDING/i}).click({timeout: 10000})
    cy.findByRole('tab', {name: /INCOMING/i}).click({timeout: 10000})
    cy.get('#incomingCard', {timeout: 15000}).contains('Click to push through').click({timeout: 10000})
    cy.get('#mui-12').click()
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(5000)
    cy.findByRole('tab', {name: /CURRENT/i}).click()
    //Confirm Arrival
    cy.get('#jobsterCurrentCardContainer', {timeout: 15000}).contains('Click to confirm your arrival').click()
    cy.get('#confirmArrivedButton').click()
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(5000)
  })
})
