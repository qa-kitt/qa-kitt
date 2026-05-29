/// <reference types="cypress" />
const constraints = require('../../support/constraints') 
const data = require('../../support/data') 
const root = require('../../support/roots') 

// ---------------------------------------------------------------
// OVERVIEW - Verify CUSTOMER PORTAL as Viewer in STG
// ---------------------------------------------------------------

constraints.users.forEach((user, index) => {
    describe(`${index + 1} OVERVIEW: Customer Portal - as_${user.type.toUpperCase()}_in_STG`, () => {
        before(() => {
            cy.visit(constraints.ENV_URL)
        })
        
        beforeEach(() => {
            cy.portal_AuthorizeViewer(constraints.ENV_URL, user.token)
            cy.log("Token 🔐 = VERIFIED")
            cy.log("Cookie 🍪 = CRUNCHED")
            cy.log("VIEWER 🤖 Access Granted ✅")
        })   

        it('Customer Portal - Menu', () => {
            cy.portal_VerifyMenu()
        })

        it('Customer Portal - Styling', () => {
            cy.title().should('eq', data.metaData.title)
            cy.get('meta[name="description"]').should('have.attr', 'content', data.metaData.description)
            cy.get('meta[name="theme-color"]').should('have.attr', 'content', data.metaData.themeColor)
            cy.get('link[rel="stylesheet"]').should('exist')
        })
        
        it('Explore Our Products - Headers', () => {
            cy.get('h2').contains(data.homeTitle).should('be.visible')
            cy.contains(data.btnExplore).should('be.visible')
            cy.contains('Holdings').should('be.visible')
            cy.xpath(`${root.contactRoot}//h4`).contains('Not sure where to start?').should('have.prop', 'hidden', false)
        })

        it('Explore Our Products - Hyperlinks', () => {
            cy.verifyHyperlinks()
        })

        it('Explore Our Products - Contents', () => {
            cy.xpath(`${root.exploreRoot}//div[contains(@class,'styles_Text')]`).each(($a, index) => {
                cy.wrap($a).invoke('text').should('eq', data.rctProducts[index])
            })

            cy.xpath(`${root.exploreRoot}//div[contains(@class, "styles_SubText")]`).each(($a, index) => {
                cy.wrap($a).invoke('text').should('eq', data.productDesc[index])
            })
        })

        it('Nature Based RCT® - Contents', () => {
            cy.verifyProductContents(data.rctProducts[0], data.productDesc[0], data.projPromise)
        })

        it('Super Pollutant RCT® - Contents', () => {
            cy.verifyProductContents(data.rctProducts[1], data.productDesc[1], data.projPromise)
        })

        it('Carbon Removals RCT® - Contents', () => {
            cy.verifyProductContents(data.rctProducts[2], data.productDesc[2], data.projPromise)
        })

        it('Rubicon Ratedd Tonne (RRT) - Contents', () => {
            cy.verifyProductContents(data.rctProducts[3], data.productDesc[3], data.projPromise)
        })

        it('Build Your Own RCT® - Contents', () => {
            cy.contains(data.rctProducts[4]).click()
            cy.contains(data.productDesc[4]).should('be.visible')
            cy.contains(data.rct).should('be.visible')

            // Step 1
            cy.contains(data.rct01).should('be.visible')
            cy.contains(data.rct01Desc[0]).should('be.visible')
            cy.contains(data.rct01Desc[1]).should('be.visible')

            // Step 2
            cy.contains(data.rct02).should('be.visible')
            cy.contains(data.rct02Desc).should('be.visible')

            // Step 3
            cy.contains(data.rct03).should('be.visible')
            cy.contains(data.rct03Desc).should('be.visible')
            cy.contains(data.rctButtons).should('be.visible')
        }) 
    })
})
