/// <reference types="cypress"/>

describe('Jobster Should be able to login, verify and fill onboarding form', () => {
  it('New account should be able to login', () => {
    const email = 'angelotesting21+8@gmail.com'
    const password = 'testing21'
    const code = '706709'

    cy.visit('http://localhost:7002/login  ')

    cy.get('#userEmail').type(`${email}`)
    cy.get('#userPassword').type(`${password}`)
    cy.get('#loginBtn').click()
    cy.get('#code').type(`${code}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}${code}`);
    cy.get('#verifyBtn').click()
    cy.get('#next').click()
    cy.get('#next').should('have.text', 'Next')
    cy.get('#next').click()
    cy.get('#skipBtn').click()
    cy.get('#goBtn').click()
  })
})
