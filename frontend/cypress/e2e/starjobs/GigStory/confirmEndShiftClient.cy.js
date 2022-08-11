/// <reference types="cypress" />

context('Client should be able to Create a Gig', () => {
  beforeEach(() => {
    cy.visit('http://localhost:7002/login', {timeout: 10000})
  })

  it('Should redirect to Pending Category after creating a gig', () => {
    cy.get('#userEmail').type('migquintos32@gmail.com')
    cy.get('#userPassword').type('miguel23')
    cy.get('#loginBtn').click()
    cy.get('#jobsterName').should('have.text', 'Miguel Quintos')
    cy.get('#gigsContainer', {timeout: 15000}).click({timeout: 10000})
    cy.get('#gigCategorySelect').select('Restaurant Services')
    cy.get('#gigInProgressTab', {timeout: 5000}).click({timeout: 10000})
    cy.get('#clientCurrentCardContainer').contains('Click to Confirm End Shift').click({timeout: 10000})
    cy.get('#mui-35', {timeout: 5000}).click({timeout: 10000})
    cy.get('#confirmEndShiftButton').contains('Yes, Confirm End Shift').click({timeout: 10000})
    cy.get('#mui-22', {timeout: 5000}).type('testing')
    cy.get('#skipRatingButton', {timeout: 5000}).click({timeout: 10000})
    cy.findByRole('tab', {name: /FOR BILLING/i}).click()
  })
})
