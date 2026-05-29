/// <reference types="cypress" />

// ---------------------------------------------------------------
// BYO_RCT® Configuration - Verify CUSTOMER PORTAL as Viewer
// ---------------------------------------------------------------
const url = `${Cypress.env("test") + '/products/byo-rct/custom-rct'}`
const viewer = {
    token: `${Cypress.env("viewer_token")}`,
    type: 'Viewer'
}
const trader = {
    token: `${Cypress.env("tmanager_token")}`,
    type: 'T-Manager'
}
const users = [viewer] //, trader
const staticColumns = [
    '',
    'Project/Vintage',
    'Rubicon Carbon Integrity Grade',
    'Country',
    'Vintage',
    'Carbon Credits',
    '% of RCT®'
]

users.forEach((user, index) => {
    describe(`${index + 1} BYO_RCT® Configuration: Customer Portal - as_${user.type.toUpperCase()}`, () => {
        /// tag: portalBYORCT_Configuration
        before(() => {
            cy.visit(Cypress.env("test"))
        })
        beforeEach(() => {
            cy.portal_AuthorizeViewer(url, user.token)
            cy.log("Token 🔐 = VERIFIED")
            cy.log("Cookie 🍪 = CRUNCHED")
            cy.log("VIEWER 🤖 Access Granted ✅")
        }) 
        
        it('Build Your Own RCT® - Configuration: Default Columns', () => {
            cy.selectRandomByoProjects()
            cy.verifyByoProjectConfig_Autofill()
            cy.get('thead tr').within(() => {
                staticColumns.forEach((columnTitle, index) => {
                    cy.get('th').eq(index).should('contain', columnTitle)
                    cy.log("✅ Table Header | Column Options" + staticColumns[index])
                })
            })
            cy.log('🦦🌮 Great Success 🌮🐿️')
        })

        it('Build Your Own RCT® - Configuration: Enter Total OVER 100,000 Threshold', () => {
            cy.selectRandomByoProjects()
            cy.verifyByoProjectConfig_Autofill('over')
            cy.log('🦦🌮 Great Success 🌮🐿️')
        })

        it('Build Your Own RCT® - Configuration: Enter Total UNDER 1,000 Threshold', () => {
            cy.selectRandomByoProjects()
            cy.verifyByoProjectConfig_Autofill('under')
            cy.log('🦦🌮 Great Success 🌮🐿️')
        })

        it('Build Your Own RCT® - Configuration: Enter Total AT 1,000 Threshold', () => {
            cy.selectRandomByoProjects()
            cy.verifyByoProjectConfig_Autofill('min')
            cy.log('🦦🌮 Great Success 🌮🐿️')
        })

        it('Build Your Own RCT® - Configuration: Enter Total AT 100,000 Threshold', () => {
            cy.selectRandomByoProjects()
            cy.verifyByoProjectConfig_Autofill('max')
            cy.log('🦦🌮 Great Success 🌮🐿️')
        })

        it('Build Your Own RCT® - Configuration: Enter Total WITHIN Threshold', () => {
            cy.selectRandomByoProjects()
            cy.verifyByoProjectConfig_Autofill()
            cy.get('button').contains('Next: Get Price Estimate').should('not.be.enabled')
            cy.log('🦦🌮 Great Success 🌮🐿️')
        })

        it('Build Your Own RCT® - Configuration: Enter Risk Option Only', () => {
            cy.selectRandomByoProjects()
            cy.verifyByoProjectConfig_Autofill()      
            cy.selectRadioButton('includeRiskAdj', true)
            cy.get('button').contains('Next: Get Price Estimate').should('not.be.enabled')
            cy.log('🦦🌮 Great Success 🌮🐿️')
        })

        it('Build Your Own RCT® - Configuration: Enter Retire Option Only', () => {
            cy.selectRandomByoProjects()
            cy.verifyByoProjectConfig_Autofill()      
            cy.selectRadioButton('retireAtPurchase', true)
            cy.get('button').contains('Next: Get Price Estimate').should('not.be.enabled')
            cy.log('🦦🌮 Great Success 🌮🐿️')
        })

        it('Build Your Own RCT® - Configuration: Enter Options | Risk Adjusted/Retirement = True', () => {
            cy.selectRandomByoProjects()
            cy.verifyByoProjectConfig_Autofill()      
            cy.selectRadioButton('includeRiskAdj', true)
            cy.selectRadioButton('retireAtPurchase', true)
            cy.get('button').contains('Next: Get Price Estimate').should('be.enabled')
            cy.log('🦦🌮 Great Success 🌮🐿️')
        })

        it('Build Your Own RCT® - Configuration: Enter Options | Risk Adjusted/Retirement = False', () => {
            cy.selectRandomByoProjects()
            cy.verifyByoProjectConfig_Autofill()      
            cy.selectRadioButton('includeRiskAdj', false);
            cy.selectRadioButton('retireAtPurchase', false)
            cy.get('button').contains('Next: Get Price Estimate').should('be.enabled')
            cy.log('🦦🌮 Great Success 🌮🐿️')
        })

        it('Build Your Own RCT® - Configuration: Enter Options | Risk Adjusted/Retirement = SplitA', () => {
            cy.selectRandomByoProjects()
            cy.verifyByoProjectConfig_Autofill()      
            cy.selectRadioButton('includeRiskAdj', true)
            cy.selectRadioButton('retireAtPurchase', false)
            cy.get('button').contains('Next: Get Price Estimate').should('be.enabled')
            cy.log('🦦🌮 Great Success 🌮🐿️')
        })

        it('Build Your Own RCT® - Configuration: Enter Options | Risk Adjusted/Retirement = SplitB', () => {
            cy.selectRandomByoProjects()
            cy.verifyByoProjectConfig_Autofill()      
            cy.selectRadioButton('includeRiskAdj', false)
            cy.selectRadioButton('retireAtPurchase', true)
            cy.get('button').contains('Next: Get Price Estimate').should('be.enabled')
            cy.log('🦦🌮 Great Success 🌮🐿️')
        })
    })
})