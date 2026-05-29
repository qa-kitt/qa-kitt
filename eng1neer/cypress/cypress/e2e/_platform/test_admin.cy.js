/// <reference types="cypress" />

// ---------------------------------------------------------------
// SAMPLE TEST - Verify INTERNAL PLATFORM as ADMIN
// ---------------------------------------------------------------
const url = `${Cypress.env("testAdmin")}`
const token = `${Cypress.env("admin_token")}`

describe('Verify Internal Platform Homepage - ADMIN', () => {
  
  beforeEach(() => {
    cy.platform_AuthorizeAdmin(url, token)
    cy.log("Token 🔐 = VERIFIED")
    cy.log("ADMIN 🤖 Access Granted ✅")
  })

  it('Verifies Internal Platform Menu as ADMIN', () => {
    /// tag: testadmin
    cy.platform_VerifyAdminMenu()
  })

})