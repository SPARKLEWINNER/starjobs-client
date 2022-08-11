/// <reference types="cypress" />

context('Client should be able to Create a Gig', () => {
  beforeEach(() => {
    cy.visit('http://localhost:7002/login', {timeout: 10000})
  })

  it('View For payment ', () => {
    cy.get('#userEmail').type('angelotesting21+9@gmail.com')
    cy.get('#userPassword').type('testing21')
    cy.get('#loginBtn').click()
    cy.get('#gigsContainer', {timeout: 15000}).click({timeout: 10000})
    cy.findByRole('tab', {name: /PENDING/i}).click({timeout: 10000})
    cy.findByRole('tab', {name: /INCOMING/i}).click({timeout: 10000})
    //View For payment
    cy.findByRole('tab', {name: /FOR PAYMENT/i}).click()
    cy.get('h5', {timeout: 15000}).contains('Test').click()
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(5000)
  })
})
