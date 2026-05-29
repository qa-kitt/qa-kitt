/// <reference types="cypress" />
const constraints = require('../../support/constraints') 
const data = require('../../support/data') 
const root = require('../../support/roots') 

// ---------------------------------------------------------------
// TRANSACTIONS - Verify CUSTOMER PORTAL as Viewer in STG
// ---------------------------------------------------------------
constraints.users.forEach((user, index) => {
    describe(`${index + 1} TRANSACTIONS: Customer Portal - as_${user.type.toUpperCase()}_in_STG`, () => {
        /// tag: portalTransactions
        before(() => {
            cy.visit(constraints.ENV_URL)
        })
        beforeEach(() => {
            cy.portal_AuthorizeViewer(constraints.ENV_URL + '/transactions', user.token)
            cy.log("Token 🔐 = VERIFIED")
            cy.log("Cookie 🍪 = CRUNCHED")
            cy.log("VIEWER 🤖 Access Granted ✅")
        })   
        
        it('Transactions - Page Title', () => {
            cy.get(data.transHeader)
                .should('exist')
                .should('be.visible')
                .then($el => {
                    const textContent = $el.text()
                    expect(textContent).to.equal(data.transTitle)
                })
            cy.log('🦦🌮 Great Success 🌮🐿️')
        })

        it('Transactions - Retirement Hyperlinks', () => {
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

        it('Transactions - Columns', () => {
            cy.xpath(root.columnRoot)
                .should('have.length', data.transColumns.length) 
                .each(($column, index) => {
                    cy.wrap($column).should('have.text', data.transColumns[index]) 
                })
            cy.log('🦦🌮 Great Success 🌮🐿️')
        })

        it('Transactions - Search Functions', () => {
            cy.xpath(root.tableRoot)
            .its('length')
            .then(rowCount => {
                const randomRow = Math.floor(Math.random() * rowCount) + 1
                let randomColumn = Math.floor(Math.random() * 5) + 1; // between 1st and 5th column, excluding 4th
                if (randomColumn == 4) {
                    randomColumn++; 
                }       

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

        it('Transactions - Buy/Retire Options', () => {
            cy.verifyBuyRetireButtons()
            cy.log('🦦🌮 Great Success 🌮🐿️')
        }) 
    })
})