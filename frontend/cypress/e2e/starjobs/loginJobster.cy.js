/// <reference types="cypress"/>

describe('Jobster Should login to homepage', () => {
  it('Jobster login', () => {
    const email = 'angelotesting21+9@gmail.com'
    const password = 'testing21'

    cy.visit('http://localhost:7002/login')
    cy.get('#userEmail').type(email)
    cy.get('#userPassword').type(password)
    cy.get('#loginBtn').click()

    cy.wait(1000);

  })
})
