/// <reference types="cypress" />

context('Client should be able to Create a Gig', () => {
  beforeEach(() => {
    cy.visit('http://localhost:7002/login', {timeout: 15000})
  })

  it('Client accept Applicant', () => {
    cy.get('#userEmail').type('migquintos32@gmail.com')
    cy.get('#userPassword').type('miguel23')
    cy.get('#loginBtn').click()
    cy.get('#gigsContainer', {timeout: 10000}).click()
    cy.get('#gigInProgressTab', {timeout: 5000}).click()

    cy.findByRole('tab', {name: /PENDING/i}).click()
    cy.get('#tab > div > div.MuiBox-root.css-mro3c9 > div:nth-child(1) > div > div').contains('View ').click()
    cy.findByText('newTest newTesting', {timeout: 15000}).click()
    cy.get('#acceptJobsterProfileButton', {timeout: 10000}).click()
    cy.get('#confirmProposal', {timeout: 5000}).click()

    //Gig Card should be for push through
    cy.findByRole('tab', {name: /PENDING/i}).click()
    cy.findByRole('tab', {name: /INCOMING/i}).click()
    cy.get('#tab > div > div.MuiBox-root.css-mro3c9 > div > div > div')
      .contains('for pushing through')
      .should('have.text', 'for pushing through')
  })
})
