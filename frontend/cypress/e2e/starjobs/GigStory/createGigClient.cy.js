/// <reference types="cypress" />
import moment from 'moment'

context('Client should be able to Create a Gig', () => {
  const workType = 'Test'
  const location = 'testing'
  const contact = '09386045414'
  const area = 'Manila'
  const m = moment()

  beforeEach(() => {
    cy.visit('http://localhost:7002/login', {timeout: 10000})
  })

  it('Should redirect to Pending Category after creating a gig', () => {
    cy.get('#userEmail', {timeout: 10000}).type('migquintos32@gmail.com')
    cy.get('#userPassword', {timeout: 10000}).type('miguel23')
    cy.get('#loginBtn').click()
    cy.get('#jobsterName').should('have.text', 'Miguel Quintos')
    cy.get('#gigsContainer', {timeout: 15000}).click()
    cy.get('#gigCategorySelect').select('Restaurant Services')
    cy.get('#workType').type(`${workType}`)
    cy.get('#location').type(`${location}`)
    cy.get('#contactNumber').type(`${contact}`)
    cy.get('#areaNotifSelect').type(`${area}`)
    cy.get('#startDate').type(`${m.format('MMM D YYYY')} 1:00 PM"`)
    cy.get('#endDate').type(`${m.format('MMM D YYYY')} 6:00 PM`)
    cy.get('#shiftSelect').select('Mid Shift')
    cy.get('#inputGigFee').type(`67`)
    cy.get('#locationRateSelect').select(`NCR/Manila Rate`)
    cy.get('#instruction').type(`service crew`)
    cy.get('#continueGigForm').click()
    cy.get('#postGigButton').click()
    cy.get('#continueGigSubmit').click()
  })
})
