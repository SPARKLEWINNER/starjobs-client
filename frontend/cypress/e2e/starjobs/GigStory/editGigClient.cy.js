/// <reference types="cypress" />
import moment from 'moment'

context('Client should be able to Create a Gig', () => {
  const gigCategory = 'Errands'
  const position = 'Test'
  const m = moment()

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
    cy.get('#viewPendingButton').click()
    cy.get('#editGigDetailsButton').first().click()
    cy.get('#gigCategorySelect').select(gigCategory)
    cy.get('#position').clear().type(position)
    cy.get('#startDate')
      .clear()
      .type(`${m.format('MMM D YYYY')} 1:00 PM`)
    cy.get('#endDate')
      .clear()
      .type(`${m.format('MMM D YYYY')} 6:00 PM`)
    cy.get('#hours').type(' ')
    cy.get('#inputGigFee').clear().type(`67`)
    cy.get('#instructionInput').clear().type(`Test test test`)
    cy.get('#saveNewChangesButton').click({timeout: 5000})
    cy.get('#saveChangesButton').click({timeout: 5000})
    cy.get('#confirmGigChangesButton').click({timeout: 5000})

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(5000)
  })
})
