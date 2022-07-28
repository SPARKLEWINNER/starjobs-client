/// <reference types="cypress" />

describe('Jobster signing-up sample', () => {
it('Sign-up ', () => {
    const firstName="Test";
    const lastName="Testing";
    const email="angelotesting21+9@gmail.com ";
    const phoneNumber="09393231309";
    const password="testing21";


    cy.visit('http://localhost:7002/login')
    cy.get('#createAcc').click();
    cy.get('#firstName').type(`${firstName}`);
    cy.get('#lastName').type(`${lastName}`);
    cy.get('#phoneNumber').type(`${phoneNumber}`);
    cy.get('#email').type(`${email}`);
    cy.get('#password').type(`${password}`);
    cy.get('#confirmPassword').type(`${password}`);
    cy.get('#jobster').click();
    cy.get('#sendEmail').check();
    cy.get('#agreeTerms').check();
    cy.get('#createAccount').click();
    })
})