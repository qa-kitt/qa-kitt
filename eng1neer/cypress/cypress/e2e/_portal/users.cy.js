/// <reference types="cypress" />
const constraints = require('../../support/constraints') 
const data = require('../../support/data') 
const root = require('../../support/roots') 

// ---------------------------------------------------------------
// USERS - Verify CUSTOMER PORTAL as Viewer in STG
// ---------------------------------------------------------------
constraints.users.forEach((user, index) => {
    describe(`${index + 1} USERS: Customer Portal - as_${user.type.toUpperCase()}_in_STG`, () => {
        /// tag: portalUsers
        before(() => {
            cy.visit(constraints.ENV_URL)
        })
        beforeEach(() => {
            cy.portal_AuthorizeViewer(constraints.ENV_URL + '/users', user.token)
            cy.log("Token 🔐 = VERIFIED")
            cy.log("Cookie 🍪 = CRUNCHED")
            cy.log("VIEWER 🤖 Access Granted ✅")
        })   
        
        it('User Management - Page Title', () => {
            cy.get(data.userHeader)
                .should('exist')
                .should('be.visible')
                .then($el => {
                    const textContent = $el.text()
                    expect(textContent).to.equal(data.userTitle)
                })
            cy.log('🦦🌮 Great Success 🌮🐿️')
        })

        it('User Management - Project Vintage Hyperlinks', () => {
            cy.xpath(`${root.pageRoot}//a`)
            .should('exist')
            .each($a => {
            cy.wrap($a)
                .should('have.prop', 'isConnected', true) 
                .should('have.attr', 'href')
                .and('include', 'mailto:') 
            })
            cy.log('🦦🌮 Great Success 🌮🐿️')
        })  

        it('User Management - Columns', () => {
            cy.xpath(root.columnRoot)
            .should('have.length', data.userColumns.length) 
            .each(($column, index) => {
            cy.wrap($column).should('have.text', data.userColumns[index]) 
            })
            cy.log('🦦🌮 Great Success 🌮🐿️')
        })

        it('User Management - Retire Option', () => {
            cy.get('button').should('have.prop', 'disabled', false)
            cy.contains("Retire").should('have.prop', 'isConnected', true).should('be.visible')
            cy.log('🦦🌮 Great Success 🌮🐿️')
        }) 
    })
})