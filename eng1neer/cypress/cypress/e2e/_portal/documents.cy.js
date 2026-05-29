/// <reference types="cypress" />
const constraints = require('../../support/constraints') 
const data = require('../../support/data') 
const root = require('../../support/roots') 

// ---------------------------------------------------------------
// DOCUMENTS - Verify CUSTOMER PORTAL as Viewer in STG
// ---------------------------------------------------------------
constraints.users.forEach((user, index) => {
    describe(`${index + 1} DOCUMENTS: Customer Portal - as_${user.type.toUpperCase()}in_STG`, () => {
        /// tag: portalDocuments
        before(() => {
            cy.visit(constraints.ENV_URL)
        })
        beforeEach(() => {
            cy.portal_AuthorizeViewer(constraints.ENV_URL + '/documents', user.token)
            cy.log("Token 🔐 = VERIFIED")
            cy.log("Cookie 🍪 = CRUNCHED")
            cy.log("VIEWER 🤖 Access Granted ✅")
        })   
        
        it('Document Center - Page Title', () => {
            cy.get(data.docsHeader)
                .should('exist')
                .should('have.prop', 'hidden', false)
                .then($el => {
                    const textContent = $el.text()
                    expect(textContent).to.equal(data.docsTitle)
                })
            cy.log('🦦🌮 Great Success 🌮🐿️')
        })

        it('User Management - Project Vintage Hyperlinks', () => {
            cy.xpath(`${root.pageRoot}//a`)
            .should('exist')
            .each($a => {
                cy.wrap($a)
                    .should('have.prop', 'isConnected', true) 
                    .should('have.attr', 'download')
            })
            cy.log('🦦🌮 Great Success 🌮🐿️')
        })  

        it('User Management - Columns', () => {
            cy.xpath(root.columnRoot)
            .should('have.length', data.docsColumns.length) 
            .each(($column, index) => {
                cy.wrap($column).should('have.text', data.docsColumns[index]) 
            })
            cy.log('🦦🌮 Great Success 🌮🐿️')
        })

        it('User Management - Download Options', () => {
            cy.xpath(`${root.downloadRoot}`).should('be.visible')
            cy.log('🦦🌮 Great Success 🌮🐿️')
        }) 
    })
})