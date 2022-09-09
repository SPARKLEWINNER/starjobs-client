/// <reference types="cypress" />

context('Client should be able to Create a Gig', () => {
  beforeEach(() => {
    cy.visit('http://localhost:7002/login', {timeout: 10000})
  })

  it('Jobster Confirm Push Through , confirm Arrival and End Shift', () => {
    cy.get('#useremail').type('angelotesting21+9@gmail.com')
    cy.get('#userPassword').type('testing21')
    cy.get('#loginBtn').click()
    cy.get('#gigsContainer', {timeout: 15000}).click({timeout: 10000})
    cy.findByRole('tab', {name: /PENDING/i}).click({timeout: 10000})
    cy.findByRole('tab', {name: /INCOMING/i}).click({timeout: 10000})
    //Endhift with Proposed Hours and Gig Rate
    cy.findByRole('tab', {name: /CURRENT/i}).click()
    cy.get('#jobsterCurrentCardContainer', {timeout: 15000}).contains('Click to End Shift').click()
    cy.get('#endShiftButton').click()
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(5000)
    cy.get('#confirmEndShiftButton').click()
  })
})
