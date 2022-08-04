/// <reference types="cypress"/>

describe('Client should be able to Complete Profile information', () => {
  it('New account should be able to login and complete profile', () => {
    const email="angelotesting21+13@gmail.com";
    const password="testing21";
    //Personal Information
    const firstName="Test";
    const lastName="Testing";
    const middleIni="A";
    const companyName="Testing A inc";
    const brandName="Brand Test"
    const location="Malate"
    const website="www.testin.com"
    const companyPosition="Manager"

    //Company Contact
    const telephone="1111 1111";
    const mobile="09111222211";
    const blkNo="1122";
    const zipCode="1111";
    const streetName="Testing Street";
    const city="Manila";

    //Industry
    const industryType="Food and Restaurant";
    const skillLooking="Food and Restaurant";
    const salesMarketingOthers="Testing testing";

    // Rate and payment
    const accountName="Testing";
    const accountNumber="09111111111";

    cy.visit('http://localhost:7002/login')
    cy.get('#useremail').type(email);
    cy.get('#userpassword').type(password);
    cy.get('#loginBtn').click();
    cy.get('#menu').click();
    cy.get('#completeClient').should('have.text','Complete my details');
    // cy.get('#complete').should('have.text','Complete my details');
    // cy.get('#complete').should('have.text','Complete my details');
    // cy.get('#complete').should('have.text','Complete my details');
    cy.wait(1000);
    cy.get('#completeClient').click();

    //Personal Information
    cy.get('#firstName').clear().type(firstName);
    cy.get('#lastName').clear().type(lastName);
    cy.get('#middleIni').type(middleIni);
    cy.get('#companyName').type(companyName);
    cy.get('#brandName').type(brandName);
    cy.get('#location').type(location);
    cy.get('#website').type(website);
    cy.get('#companyPosition').type(companyPosition);
    cy.get('#continuePersonalForm').click();
    // Company contact
    // cy.get('#companyPosition').check( );
    cy.get('#telephone').type(telephone);
    cy.get('#mobile').type(mobile);
    cy.get('#blkNo').type(blkNo);
    cy.get('#zipCode').type(zipCode);
    cy.get('#streetName').type(streetName);
    cy.get('#city').type(city);
    cy.get('#continueContactForm').click();
    // Industry
    cy.get('#industryTypeSelect').type(`${industryType}{enter}`);
    cy.get('#skillLooking').type(`${skillLooking}{enter}`);
    cy.get('#skills').check();
    cy.get('#salesMarketingOthers').type(salesMarketingOthers);
    cy.get('#continueIndustryForm').click();

    //   //Rate and Payment
    cy.get('#walletSelect').select('GCash');
    cy.get('#accountName').type(accountName);
    cy.get('#accountNumber').type(accountNumber);
    cy.get('#mui-34').click();
    // Profile
    cy.get('#uploadProfileContainer')
    .attachFile('starjobsLogo.png', { subjectType: 'drag-n-drop' });
    cy.get('#file')
    .attachFile('document.pdf', { subjectType: 'drag-n-drop' });
    cy.wait(5000);
    cy.get('#mui-35').click();
    cy.get('#mui-36').click();

  })
})
  