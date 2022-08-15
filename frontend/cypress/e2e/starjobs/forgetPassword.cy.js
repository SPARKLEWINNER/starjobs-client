/// <reference types="cypress"/>

describe('User should be able to change password', () => {
  it('User should be able to change password', () => {
    //
    const email="angelotesting21+1@gmail.com";

    //
    cy.visit('http://localhost:7002/login')
    cy.get('#forgot').click()
    cy.get('#mui-3').type(email)
    cy.get('#mui-4').click()
    cy.get('#back').click()
  })
})