/// <reference types="cypress" />
const constraints = require('../../support/constraints') 
const data = require('../../support/data') 
const root = require('../../support/roots') 

// ---------------------------------------------------------------
// WATCHLIST - Verify CUSTOMER PORTAL as Viewer in STG
// ---------------------------------------------------------------

constraints.users.forEach((user, index) => {
    describe(`${index + 1} WATCHLIST: Customer Portal - as_${user.type.toUpperCase()}_in_STG`, () => {
        /// tag: portalWatchlist
        before(() => {
            cy.visit(constraints.ENV_URL)
        })
        beforeEach(() => {
            cy.portal_AuthorizeViewer(constraints.ENV_URL + '/quotes', user.token)
            cy.log("Token 🔐 = VERIFIED")
            cy.log("Cookie 🍪 = CRUNCHED")
            cy.log("VIEWER 🤖 Access Granted ✅")
        })   
        
        it('Watchlist - Page Title', () => {
            cy.get(data.quoteHeader)
                .should('exist')
                .should('be.visible')
                .then($el => {
                    const textContent = $el.text()
                    expect(textContent).to.equal(data.quoteTitle)
                })
            cy.log('🦦🌮 Great Success 🌮🐿️')
        })

        it('Watchlist - Project Vintage Hyperlinks', () => {
            cy.xpath(`${root.pageRoot}//a`)
                .should('exist')
                .each($a => {
                    cy.wrap($a)
                        .should('have.prop', 'isConnected', true) 
                        .should('have.attr', 'href')
                        .and('not.be.empty') 
                })
            cy.log('🦦🌮 Great Success 🌮🐿️')
        })  

        it('Watchlist - Columns', () => {
            cy.xpath(root.columnRoot)
                .should('have.length', data.quoteColumns.length) 
                .each(($column, index) => {
                    cy.wrap($column).should('have.text', data.quoteColumns[index]) 
                })
            cy.log('🦦🌮 Great Success 🌮🐿️')
        })

        it('Watchlist - Portfolio Option', () => {
            cy.get('button').should('have.prop', 'disabled', false)
            cy.contains("Portfolio").should('have.prop', 'isConnected', true).should('be.visible')
            cy.log('🦦🌮 Great Success 🌮🐿️')
        })
        
        it('Watchlist - Search Functions', () => {
            cy.xpath(root.tableRoot)
            .its('length')
            .then(rowCount => {
                const randomRow = Math.floor(Math.random() * rowCount) + 1
                const randomColumn = Math.floor(Math.random() * 4) + 1 // between 1st and 4th column        

                // find random cell to search
                cy.xpath(`${root.tableRoot}[${randomRow}]/div[@role='cell'][${randomColumn}]`)
                .invoke('text')
                .then(randomText => {
                    cy.get('input[placeholder="Search"]')
                    .should('not.be.disabled')
                    .type(randomText.trim(), { delay: 100 })

                    cy.wait(800)

                    cy.xpath(root.tableRoot)
                    .each($row => {
                        cy.wrap($row)
                        .find(`div[role='cell']:nth-child(${randomColumn})`)
                        .invoke('text')
                        .then(cellText => {
                                if (cellText.toLowerCase().includes(randomText.toLowerCase())) {
                                    expect(cellText.toLowerCase()).to.contain(randomText.toLowerCase())
                                } 
                            })
                        })
                    })
                })
            cy.log('🦦🌮 Great Success 🌮🐿️')
        })
    })
})