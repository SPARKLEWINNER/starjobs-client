/// <reference types="cypress"/>

describe('Should be able to edit profile ', () => {
  it('login, change profile and save', () => {
    const email="angelotesting21+9@gmail.com";
    const password="testing212";
    const newPassword="testing21";
    const confirmNewPassword="testing21";


    cy.visit('http://localhost:7002/login')
    cy.get('#useremail').type(email);
    cy.get('#userpassword').type(password);
    cy.get('#loginBtn').click();
    cy.wait(1000);
    cy.get('#menu').click();
    cy.wait(1000);
    cy.get('#changePass').click();

    cy.get('#oldPassword').type(password);
    cy.get('#newPassword').type(newPassword);
    cy.get('#confirmNewPassword').type(confirmNewPassword);
    cy.get('#save').click();

    cy.wait(1000);
    cy.get('#menu').click();
    cy.wait(1000);
    cy.get('#signout').click();

    // test new password
    cy.visit('http://localhost:7002/login')
    cy.get('#useremail').type(email);
    cy.get('#userpassword').type(newPassword);
    cy.get('#loginBtn').click();





  })
})
  