/// <reference types="cypress" />

// ---------------------------------------------------------------
// PORTFOLIO WATCHLIST - Verify CUSTOMER PORTAL as Viewer
// ---------------------------------------------------------------
const url = `${Cypress.env("stg") + '/overview'}`
const viewer = {
    token: `${Cypress.env("viewer_token")}`,
    type: 'Viewer'
}
const trader = {
    token: `${Cypress.env("tmanager_token")}`,
    type: 'T-Manager'
}
const users = [viewer] //, trader
const myProducts = [
    'Nature-Based Emissions Reductions',
    'Industrial Emissions Reductions',
    'Custom Automation',
    'Carbon Removals'
]
const staticColumns = [
    'Product',
    'Type',
    'Holding',
    '% of Portfolio',
    'Product'
]
const compositionRoot = "//div[@aria-label='Composition']"
// Generate column headers for the current and previous three quarterly time periods
const currentDate = new Date()
const currentYear = currentDate.getFullYear()
const currentMonth = currentDate.getMonth() + 1
const quarters = ['Q1', 'Q2', 'Q3', 'Q4']
const startQuarterIndex = Math.floor((currentMonth - 1) / 3) - 3 // Adjust to get 3 quarters back
const startYear = currentYear

users.forEach((user, index) => {
    describe(`${index + 1} PORTFOLIO: Customer Portal - as_${user.type.toUpperCase()}`, () => {
        const dynamicColumns = []

        // Generate dynamic column headers starting from the oldest quarter
        for (let i = 0; i < 4; i++) {
            let year = startYear + Math.floor((startQuarterIndex + i) / 4)
            let quarter = quarters[(startQuarterIndex + i + 4) % 4] // Ensure quarter index is valid (0-3)
            dynamicColumns.push(`${year}${quarter}`)
        }

        // Combine static and dynamic column headers
        const portfolioColumns = [...staticColumns, ...dynamicColumns]

        /// tag: portalPortfolio
        before(() => {
            cy.visit(Cypress.env("stg"))
        })
        beforeEach(() => {
            cy.portal_AuthorizeViewer(url, user.token)
            cy.log("Token 🔐 = VERIFIED")
            cy.log("Cookie 🍪 = CRUNCHED")
            cy.log("VIEWER 🤖 Access Granted ✅")
        })  
        
        it('My Portfolio - Page Title', () => {
            cy.get('#portfolio-page-heading')
                .should('exist')
                .should('be.visible')
                .then($el => {
                    const textContent = $el.text()
                    expect(textContent).to.equal('My Portfolio')
                })
            cy.log('🦦🌮 Great Success 🌮🐿️')
        })
        
        it('My Portfolio - Headers', () => {
            cy.get('#portfolio-page-heading').should('be.visible')
            cy.contains('span', 'Portfolio Composition').should('be.visible')
            cy.contains('span', 'Transaction Overview').should('be.visible')
            cy.log('🦦🌮 Great Success 🌮🐿️')
        })

        it('My Portfolio - Composition Hyperlinks', () => {
            cy.xpath(`${compositionRoot}`).each(_$a => {
                cy.verifyHyperlinks()   
            })
            cy.log('🦦🌮 Great Success 🌮🐿️')
        })

        it('My Portfolio - Composition Products', () => {
            cy.xpath(`${compositionRoot}//div[@data-field='product']`).find('a')
                .each(($div, index) => {
                    cy.wrap($div)
                    .find('p')
                    .then(($p) => {
                        const pText = $p.text()
                        expect(pText).to.equal(myProducts[index])
                    })
                })
            cy.log('🦦🌮 Great Success 🌮🐿️')
        })  

        it('My Portfolio - Composition & Transaction Columns', () => {
            cy.xpath("//div[contains(@class, 'columnHeaderTitleContainerContent')]")
            .each(($div, index) => {
            cy.wrap($div)
                .find('div')
                .then(($div) => {
                    const divText = $div.text()
                    expect(divText.trim()).to.equal(portfolioColumns[index])
                })
            })
            cy.log('🦦🌮 Great Success 🌮🐿️')
        })

        it('My Portfolio - Buy/Retire Options', () => {
            cy.verifyBuyRetireButtons()
            cy.log('🦦🌮 Great Success 🌮🐿️')
        }) 
    })
})