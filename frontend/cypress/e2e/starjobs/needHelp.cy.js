/// <reference types="cypress"/>

describe('Should be able to edit profile ', () => {
  it('login, change profile and save', () => {
    const email="angelotesting21+11@gmail.com";
    const password="testing21";
    const phone="0911111112"
    const inquiry="Testing testing testings"

    cy.visit('http://localhost:7002/login')
    cy.get('#useremail').type(email);
    cy.get('#userpassword').type(password);
    cy.get('#loginBtn').click();
    cy.wait(1000);
    cy.get('#menu').click();
    cy.wait(1000);
    cy.get('#needHelp').click();
    cy.get('#mui-33').type(phone);
    cy.get('#mui-35').type(inquiry);
    cy.get('#submit').click();
    cy.get('#cancel').click();

  })
})
