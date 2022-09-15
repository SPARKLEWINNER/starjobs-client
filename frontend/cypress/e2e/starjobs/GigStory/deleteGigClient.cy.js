/// <reference types="cypress" />

context('Client should be able to Create a Gig', () => {
  beforeEach(() => {
    cy.visit('http://localhost:7002/login', {timeout: 10000})
  })

  it('Should redirect to Pending Category after creating a gig', () => {
    cy.get('#userEmail', {timeout: 10000}).type('migquintos32@gmail.com')
    cy.get('#userPassword', {timeout: 10000}).type('miguel23')
    cy.get('#loginBtn').click({timeout: 10000})
    cy.get('#jobsterName').should('have.text', 'Miguel Quintos')
    cy.get('#gigsContainer', {timeout: 15000}).click()
    cy.get('#gigInProgressTab').click()
    cy.findByRole('tab', {name: /PENDING/i}).click()
    cy.get('#viewPendingButton').click({timeout: 15000})
    cy.get('#deleteGigButton').first().click({timeout: 15000})
    cy.get('#confirmDeleteButton').first().click({timeout: 15000})

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(5000)
  })
})
