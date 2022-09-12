/// <reference types="cypress" />

context('Client should be able to Create a Gig', () => {
  beforeEach(() => {
    cy.visit('http://localhost:7002/login')
  })

  it('Filter Gigs', () => {
    cy.get('#userEmail').type('angelotesting21+9@gmail.com')
    cy.get('#userPassword').type('testing21')
    cy.get('#loginBtn').click()
    cy.get('#searchBtn', {timeout: 15000}).click()
    cy.get('#filterButton', {timeout: 5000}).click()
    cy.get('[value="O-N"]', {timeout: 5000}).click()
    cy.get('[value="N-O"]', {timeout: 5000}).click()
    cy.get('[value="O-N"]', {timeout: 5000}).click()
    cy.get('#runSortButton', {timeout: 5000}).click()
  })
})
