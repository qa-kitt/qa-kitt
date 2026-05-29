/// <reference types="cypress" />

// ---------------------------------------------------------------
// BYO_RCT® Summary - Verify CUSTOMER PORTAL as Viewer
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
const submitRoot = "//div[contains(@class, 'styles_rctContainer')]"
const submitOptions = "//p[contains(@class, 'styles_tonnesSummaryLabel')]"
const optionsTrue = [
    'Risk adjustment is included.',
    'I will retire my RCTs immediately.'
]
const optionsFalse = [
    'Risk adjustment is not included.',
    'I want to hold my RCTs for retirement later.'
]
const optionsSplitA = [
    'Risk adjustment is included.',
    'I want to hold my RCTs for retirement later.'
]
const optionsSplitB = [
    'Risk adjustment is not included.',
    'I will retire my RCTs immediately.'
]

users.forEach((user, index) => {
    describe(`${index + 1} BYO_RCT® Submission: Customer Portal - as_${user.type.toUpperCase()}`, () => {
        /// tag: portalBYORCT_Submission
        before(() => {
            cy.visit(Cypress.env("test"))
        })
        beforeEach(() => {
            cy.portal_AuthorizeViewer(url, user.token)
            cy.log("Token 🔐 = VERIFIED")
            cy.log("Cookie 🍪 = CRUNCHED")
            cy.log("VIEWER 🤖 Access Granted ✅")
        })

        it('Build Your Own RCT® - Submission: Request Live Quote', () => {
            cy.selectRandomByoProjects()
            cy.verifyByoProjectConfig_Autofill()      
            cy.selectRadioButton('includeRiskAdj', false) // decline
            cy.selectRadioButton('retireAtPurchase', false) // decline

            cy.get('button').contains('Next: Get Price Estimate').click()
            cy.wait(800)
            cy.xpath(submitRoot).then(($div) => {
                cy.verifyByoQuote_Request()
                cy.wrap($div).within(() => {
                    cy.xpath(submitRoot + submitOptions).each(($p, index) => {
                        cy.wrap($p).invoke('text').should('eq', optionsFalse[index])
                    })
                })
                cy.verifyByoQuote_Submission('Continue') // ---SUBMIT
            })
            cy.log('🦦🌮 Great Success 🌮🐿️')
        })

        it('Build Your Own RCT® - Submission: Request Live Quote | MIN', () => {
            cy.selectRandomByoProjects()
            cy.verifyByoProjectConfig_Autofill('min')      
            cy.selectRadioButton('includeRiskAdj', false) // decline
            cy.selectRadioButton('retireAtPurchase', false) // decline

            cy.get('button').contains('Next: Get Price Estimate').click()
            cy.wait(800)
            cy.xpath(submitRoot).then(($div) => {
                cy.verifyByoQuote_Request()
                cy.wrap($div).within(() => {
                    cy.xpath(submitRoot + submitOptions).each(($p, index) => {
                        cy.wrap($p).invoke('text').should('eq', optionsFalse[index])
                    })
                })
                cy.verifyByoQuote_Submission('Continue') // ---SUBMIT
            })
            cy.log('🦦🌮 Great Success 🌮🐿️')
        })

        it('Build Your Own RCT® - Submission: Request Live Quote | MAX', () => {
            cy.selectRandomByoProjects()
            cy.verifyByoProjectConfig_Autofill('max')      
            cy.selectRadioButton('includeRiskAdj', true) // accept
            cy.selectRadioButton('retireAtPurchase', true) // accept

            cy.get('button').contains('Next: Get Price Estimate').click()
            cy.wait(800)
            cy.xpath(submitRoot).then(($div) => {
                cy.verifyByoQuote_Request()
                cy.wrap($div).within(() => {
                    cy.xpath(submitRoot + submitOptions).each(($p, index) => {
                        cy.wrap($p).invoke('text').should('eq', optionsTrue[index])
                    })
                })
                cy.verifyByoQuote_Submission('View') // ---SUBMIT+VIEW
            })
            cy.log('🦦🌮 Great Success 🌮🐿️')
        })
    })
})