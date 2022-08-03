/// <reference types="cypress"/>

describe('Jobster Should be able to login, verify and fill onboarding form', () => {
  it('New account should be able to login', () => {
    //Personal Information
    const email="angelotesting21+9@gmail.com";
    const password="testing21";
    const firstName="Test";
    const lastName="Testing";
    const middleIni="A";
    const religion="Catholic";
    const citizenship="Filipino"
    const blk="Blk. 21"
    const zipCode="1009"
    const street="Kalayaan"
    const city="Manila";
    const permanentBlk="2514";
    const permanentStreetName="Marcelino";
    const permanentZip="4001";
    const permanentCity="Manila";
    const emergencyName="Testing1"
    const emergencyContact="09111111111"
    const emergencyRelation="Mother";
    //WOrk Experience
    const currentCompany="testing inc.";
    const currentPosition="Junior Developer.";
    const currentStartDate="January 1,2022";
    const currentEndDate="May 30,2022";
    const currentPlaceOfWork="Manila";
    const pastCompany="Testing past company";
    const pastPosition="testing inc";
    const pastStartDate="January 1,2021";
    const pastEndDate="May 30,2021";
    //Educational Background
    const highSchool="Testing High School";
    const highSchoolYear="2017";
    const highSchoolAwards="Best In English";
    const collegeName="Testing College";
    const collegeYear="2021";
    const collegeAwards="Cum Laude"
    const vocationalProgram="Web Design NCIII"
    const vocationalYear="2022"
    const vocationalAwards="Best Design"
    // Rate and payment
    const rateAmount="100"
    const accountName="Testing"
    const accountNumber="09111111111"

    cy.visit('http://localhost:7002/login  ')
    cy.get('#useremail').type(email);
    cy.get('#userpassword').type(password);
    cy.get('#loginBtn').click();
    cy.get('#menu').click();
    cy.get('#complete').should('have.text','Complete my details');
    // cy.get('#complete').should('have.text','Complete my details');
    // cy.get('#complete').should('have.text','Complete my details');
    // cy.get('#complete').should('have.text','Complete my details');
    cy.wait(1000);
    cy.get('#complete').click();

    //Personal Information
    cy.get('#firstName').clear().type(firstName);
    cy.get('#lastName').clear().type(lastName);
    cy.get('#middleIni').type(`${middleIni}`);
    cy.get('#genderSelect').select("Male");
    cy.get('#religion').type(religion);
    cy.get('#civilStatus').select("Single");
    cy.get('#citizenship').type(citizenship);
    // cy.get('#sameAddress').check( );
    cy.get('#blk').type(blk);
    cy.get('#zipCode').type(zipCode);
    cy.get('#city').type(city);
    cy.get('#street').type(street);
    cy.get('#permanentBlk').type(permanentBlk);
    cy.get('#permanentStreetName').type(permanentStreetName);
    cy.get('#permanentZip').type(permanentZip);
    cy.get('#permanentCity').type(permanentCity);
    cy.get('#emergencyName').type(emergencyName);
    cy.get('#emergencyContact').type(emergencyContact);
    cy.get('#emergencyRelation').type(emergencyRelation);
    cy.get('#continue').click();

    //WOrk Experience
    cy.get('#currentCompany').type(currentCompany)
    cy.get('#currentPosition').type(currentPosition);
    cy.get('#currentStartDate').type(currentStartDate);
    cy.get('#currentEndDate').type(currentEndDate);
    cy.get('#currentPlaceOfWork').type(currentPlaceOfWork);
    cy.get('#pastCompany').type(pastCompany);
    cy.get('#pastPosition').type(pastPosition);
    cy.get('#pastStartDate').type(pastStartDate);
    cy.get('#pastEndDate').type(pastEndDate);
    cy.get('#pastPlaceOfWork').type(currentPlaceOfWork);
    cy.get('#continueExp').click();

    //Expertise
    cy.get('#industry').type('IT and Computer systems{enter}');
    cy.get('#skills').type('IT and Computer systems{enter}');
    // cy.findByText('Web Development')
    cy.get('#skillCheck').check();
    cy.get('#otherSkills').type("QA Tester");
    cy.get('#continueEx').click();

    //Educational Background
    cy.get('#highSchool').type(highSchool);
    cy.get('#highSchoolYear').type(highSchoolYear);
    cy.get('#highSchoolAwards').type(highSchoolAwards);
    cy.get('#collegeName').type(collegeName);
    cy.get('#collegeYear').type(collegeYear);
    cy.get('#collegeAwards').type(collegeAwards);
    cy.get('#vocationalProgram').type(vocationalProgram);
    cy.get('#vocationalYear').type(vocationalYear);
    cy.get('#vocationalAwards').type(vocationalAwards);
    cy.get('#program').select("Overachiever Award");
    cy.get('#continueEduc').click();

    //Rate and Payment
    cy.get('#rateType').select('Hourly');
    cy.get('#rateAmount').type(rateAmount);
    cy.get('#wallet').select('GCash');
    cy.get('#accountName').type(accountName);
    cy.get('#accountNumber').type(accountNumber);
    cy.get('#continueRate').click();
    // cy.get('#upload').attachFile("profile.png").;
    cy.get('#upload')
  .attachFile('profile.png', { subjectType: 'drag-n-drop' });
    cy.get('#con').click();
    cy.wait(1000);
    cy.get('#mui-12').click();
})
})
