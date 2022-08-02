/// <reference types="cypress"/>

describe('Should be able to edit profile ', () => {
  it('login, change profile and save', () => {
    const email="angelotesting21+13@gmail.com";
    const password="testing21";
    const code="660302"

    //Personal Information
    const firstName="newTest";
    const lastName="newTesting";
    const middleInitial="B";
    const companyName="newTesting A inc";
    const brandName="newBrand Test"
    const location="newMalate"
    const website="www.newtestin.com"
    const companyPosition="newManager"

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
    const skills="Cook";

    // Rate and payment
    const accountName="Testing AccountName";
    const accountNumber="0911111112";

    cy.visit('http://localhost:7002/login')
    cy.get('#useremail').type(email);
    cy.get('#userpassword').type(password);
    cy.get('#loginBtn').click();
    cy.wait(1000);
    cy.get('#menu').click();
    cy.wait(1000);
    cy.get('#editProfile').click();

    //Personal Information
    cy.get('#firstName').clear().type(firstName);
    cy.get('#lastName').clear().type(lastName);
    cy.get('#middleInitial').clear().type(middleInitial);
    cy.get('#companyName').clear().type(companyName);
    cy.get('#brandName').clear().type(brandName);
    cy.get('#location').clear().type(location);
    cy.get('#website').clear().type(website);
    cy.get('#companyPosition').clear().type(companyPosition);
    cy.get('#continue').click();

    // Company contact
    // cy.get('#companyPosition').check( );
    cy.get('#telephone').clear().type(telephone);
    cy.get('#mobile').clear().type(mobile);
    cy.get('#blkNo').clear().type(blkNo);
    cy.get('#zipCode').clear().type(zipCode);
    cy.get('#streetName').clear().type(streetName);
    cy.get('#city').clear().type(city);
    cy.get('#continueCont').click();

    // Industry
    cy.get('#industryType').type(`{backspace}${industryType}{enter}`);
    cy.get('#skillLooking').type(`{backspace}${skillLooking}{enter}`);
    cy.get(`[value=${skills}]`).check();
    cy.get('#salesMarketingOthers').clear().type(salesMarketingOthers);
    cy.get('#contunueInd').click();

    //   //Rate and Payment
    cy.get('#wallet').select('GCash');
    cy.get('#accountName').clear().type(accountName);
    cy.get('#accountNumber').clear().type(accountNumber);
    cy.get('#mui-34').click();

    cy.get('#upload')
    .attachFile('newClientProfile.jpg', { subjectType: 'drag-n-drop' });
    // cy.get('#file')
    // .attachFile('document.pdf', { subjectType: 'drag-n-drop' });
    cy.wait(3000);
    cy.get('#mui-35').click();
    cy.wait(3000);
    cy.get('#mui-36').click();

  })
})
