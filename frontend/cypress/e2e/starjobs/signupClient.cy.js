/// <reference types="cypress" />

describe('Client signing-up sample', () => {
  it('Client Sign-up ', () => {
    const firstName="ClientTest";
    const lastName="Testing";
    const email="angelotesting21+13@gmail.com ";
    const phoneNumber="09111111115";
    const password="testing21";

    cy.visit('http://localhost:7002/login');
    cy.get('#createAcc').click();
    cy.get('#firstName').type(firstName);
    cy.get('#lastName').type(lastName);
    cy.get('#phoneNumber').type(phoneNumber);
    cy.get('#email').type(email);
    cy.get('#password').type(password);
    cy.get('#confirmPassword').type(password);
    cy.get('#client').click();
    cy.get('#sendEmail').check();
    cy.get('#agreeTerms').check();
    cy.wait(2000);
    cy.get('#createAccount').click();
  })
})