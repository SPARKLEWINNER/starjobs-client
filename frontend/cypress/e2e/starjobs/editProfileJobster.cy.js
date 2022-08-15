/// <reference types="cypress"/>

describe('Should be able to edit profile ', () => {
  it('login, change profile and save', () => {
    const email="angelotesting21+9@gmail.com";
    const password="testing21";
    const code="660302"

    //Personal Information
    const firstName="newTest";
    const lastName="newTesting";
    const middleInitial="B";
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
    const industry="IT and Computer systems"
    const skills="IT and Computer systems"
    const skillsSelect="UI/UX Designer";
    const otherSkills="testing testing testing"

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
    cy.get('#genderSelect').select("Male");
    cy.get('#religion').clear().type(religion);
    cy.get('#civilStatus').select("Single");
    cy.get('#citizenship').clear().type(citizenship);
    // cy.get('#sameAddress').check( );
    cy.get('#blk').clear().type(blk);
    cy.get('#zipCode').clear().type(zipCode);
    cy.get('#street').clear().type(street);
    cy.get('#city').clear().type(city);
    cy.get('#permanentBlk').clear().type(permanentBlk);
    cy.get('#permanentZip').clear().type(permanentZip);
    cy.get('#permanentStreetName').clear().type(permanentStreetName);
    cy.get('#permanentCity').clear().type(permanentCity);
    cy.get('#emergencyName').clear().type(emergencyName);
    cy.get('#emergencyContact').clear().type(emergencyContact);
    cy.get('#emergencyRelation').clear().type(emergencyRelation);
    cy.get('#continuePersonalForm').click();

    //WOrk Experience
    cy.get('#currentCompany').clear().type(currentCompany)
    cy.get('#currentPosition').clear().type(currentPosition);
    cy.get('#currentStartDate').clear().type(currentStartDate);
    // cy.get('#currentEndDate').clear().type(currentEndDate);
    cy.get('#currentPlaceOfWork').clear().type(currentPlaceOfWork);
    // cy.get('#pastCompany').clear().type(pastCompany);
    // cy.get('#pastPosition').clear().type(pastPosition);
    // cy.get('#pastStartDate').clear().type(pastStartDate);
    // cy.get('#pastEndDate').clear().type(pastEndDate);
    // cy.get('#pastPlaceOfWork').clear().type(currentPlaceOfWork);
    cy.get('#continueEmploymentForm').click();

    //Expertise
    cy.get('#industry').type(`{backspace}${industry}{enter}`);
    cy.get('#skills').type(`{backspace}${skills}{enter}`);
    // cy.findByText('Web Development')
    cy.get(`[value="${skillsSelect}"]`).check();
    cy.get('#otherSkills').clear().type(otherSkills);
    cy.get('#continueExpertiseForm').click();

    //Educational Background
    cy.get('#highSchool').clear().type(highSchool);
    cy.get('#highSchoolYear').clear().type(highSchoolYear);
    cy.get('#highSchoolAwards').clear().type(highSchoolAwards);
    cy.get('#collegeName').clear().type(collegeName);
    cy.get('#collegeYear').clear().type(collegeYear);
    cy.get('#collegeAwards').clear().type(collegeAwards);
    cy.get('#vocationalProgram').clear().type(vocationalProgram);
    cy.get('#vocationalYear').clear().type(vocationalYear);
    cy.get('#vocationalAwards').clear().type(vocationalAwards);
    cy.get('#vocationalProgramSelect').select("Overachiever Award");
    cy.get('#continueEducationForm').click();

    //Rate and Payment
    cy.get('#rateTypeSelect').select('Hourly');
    cy.get('#rateAmount').clear().type(rateAmount);
    cy.get('#walletSelect').select('GCash');
    cy.get('#accountName').clear().type(accountName);
    cy.get('#accountNumber').clear().type(accountNumber);
    cy.get('#continueRateForm').click();
    cy.get('#uploadProfileContainer').attachFile('starjobsLogo.png', { subjectType: 'drag-n-drop' });
    cy.get('#continueUpload').click();
    cy.wait(1000);
    cy.get('#mui-12').click();
  })
})
