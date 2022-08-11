/// <reference types="cypress" />

context('Client should be able to Create a Gig', () => {
  const hours = '6'
  const rate = '70'
  beforeEach(() => {
    cy.visit('http://localhost:7002/login', {timeout: 10000})
  })

  it('Jobster should be able to propose hours and rate', () => {
    cy.get('#userEmail').type('angelotesting21+9@gmail.com')
    cy.get('#userPassword').type('testing21')
    cy.get('#loginBtn').click()
    cy.get('#gigsContainer', {timeout: 15000}).click({timeout: 10000})
    cy.findByRole('tab', {name: /PENDING/i}).click({timeout: 10000})
    cy.findByRole('tab', {name: /INCOMING/i}).click({timeout: 10000})
    //Endhift with Proposed Hours and Gig Rate
    cy.findByRole('tab', {name: /CURRENT/i}).click()
    cy.get('#jobsterCurrentCardContainer', {timeout: 15000}).contains('Click to End Shift').click()
    cy.get('#endShiftButton').click()
    cy.get('#hours').clear().type(hours)
    cy.get('#rate').clear().type(rate)

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(5000)
    cy.get('#confirmEndShiftButton').click()
  })
})
