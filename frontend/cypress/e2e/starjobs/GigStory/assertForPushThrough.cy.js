/// <reference types="cypress" />

context('Client should be able to Create a Gig', () => {
  beforeEach(() => {
    cy.visit('http://localhost:7002/login')
  })

  it('Client accept Applicant', () => {
    cy.get('#userEmail').type('migquintos32@gmail.com')
    cy.get('#userPassword').type('miguel23')
    cy.get('#loginBtn').click()
    cy.get('#jobsterName').should('have.text', 'Miguel Quintos')
    cy.get('#gigsContainer', {timeout: 10000}).click()
    cy.get('#gigInProgressTab', {timeout: 5000}).click()

    //Gig Card should be for push through
    cy.findByRole('tab', {name: /PENDING/i}).click()
    cy.findByRole('tab', {name: /INCOMING/i}).click()
    cy.get('#tab > div > div.MuiBox-root.css-mro3c9 > div > div > div')
      .contains('for pushing through')
      .should('have.text', 'for pushing through')
  })
})
