/// <reference types="cypress" />
const constraints = require('../../support/constraints') 
const data = require('../../support/data') 
const root = require('../../support/roots') 

// ---------------------------------------------------------------
// BUY - Verify CUSTOMER PORTAL as Viewer
// ---------------------------------------------------------------
constraints.users.forEach((user, index) => {
    describe(`${index + 1} BUY: Customer Portal - as_${user.type.toUpperCase()}`, () => {
        /// tag: portalBuy
        before(() => {
            cy.visit(constraints.ENV_URL)
        })
        
        beforeEach(() => {
            cy.portal_AuthorizeViewer(constraints.ENV_URL, user.token)
            cy.log("Token 🔐 = VERIFIED")
            cy.log("Cookie 🍪 = CRUNCHED")
            cy.log("VIEWER 🤖 Access Granted ✅")
        })  

        // x4 (runs for each product)
        data.rctProducts.forEach((product, index) => {
            it(`Buy - ${product} | Verify Product Modal`, () => {
                cy.get('button').contains('Buy').click({ multiple: true })
                cy.xpath(root.dialogRoot, { timeout: 10000 }).should('be.visible').then(() => {
                    cy.verifyBuyModal(data.rctProducts[index], data.productDesc[index], data.buyTitle)
                })
                cy.xpath(root.dialogRoot + '//a').contains(data.rctProducts[index])
                cy.log('🦦🌮 Great Success 🌮🐿️')
            })
        })

        // // x3 (runs for each non-byo product)
        data.rctProducts.slice(0, -1).forEach((product, index) => {
            it(`Buy - ${product} | Configuration: Enter Total OVER 100,000 Threshold`, () => {
                cy.get('button').contains("Buy").click({ multiple: true })
                cy.verifyBuyModal(data.rctProducts[index], data.productDesc[index], data.buyTitle)
                cy.xpath(root.dialogRoot + '//a').contains(data.rctProducts[index]).click()
                cy.verifyBuy_Config('over')
                cy.log('🦦🌮 Great Success 🌮🐿️')
            })
        
            it(`Buy - ${product} | Configuration: Enter Total UNER 1 Threshold`, () => {
                cy.get('button').contains("Buy").click({ multiple: true })
                cy.verifyBuyModal(data.rctProducts[index], data.productDesc[index], data.buyTitle)
                cy.xpath(root.dialogRoot + '//a').contains(data.rctProducts[index]).click()
                cy.verifyBuy_Config('under')
                cy.log('🦦🌮 Great Success 🌮🐿️')
            })
        
            it(`Buy - ${product} | Configuration: Enter Total AT 1,000 Threshold`, () => {
                cy.get('button').contains("Buy").click({ multiple: true })
                cy.verifyBuyModal(data.rctProducts[index], data.productDesc[index], data.buyTitle)
                cy.xpath(root.dialogRoot + '//a').contains(data.rctProducts[index]).click()
                cy.verifyBuy_Config('min')
                cy.log('🦦🌮 Great Success 🌮🐿️')
            })
        
            it(`Buy - ${product} | Configuration: Enter Total AT 100,000 Threshold`, () => {
                cy.get('button').contains("Buy").click({ multiple: true })
                cy.verifyBuyModal(data.rctProducts[index], data.productDesc[index], data.buyTitle)
                cy.xpath(root.dialogRoot + '//a').contains(data.rctProducts[index]).click()
                cy.verifyBuy_Config('max')
                cy.log('🦦🌮 Great Success 🌮🐿️')
            })
        
            it(`Buy - ${product} | Configuration: Enter Total WITHIN Threshold`, () => {
                cy.get('button').contains("Buy").click({ multiple: true })
                cy.verifyBuyModal(data.rctProducts[index], data.productDesc[index], data.buyTitle)
                cy.xpath(root.dialogRoot + '//a').contains(data.rctProducts[index]).click()
                cy.verifyBuy_Config()
                cy.log('🦦🌮 Great Success 🌮🐿️')
            })
        
            it(`Buy - ${product} | Configuration: Enter Risk Option Only`, () => {
                cy.get('button').contains("Buy").click({ multiple: true })
                cy.verifyBuyModal(data.rctProducts[index], data.productDesc[index], data.buyTitle)
                cy.xpath(root.dialogRoot + '//a').contains(data.rctProducts[index]).click()
                cy.verifyBuy_Config()
                cy.selectRadioButton(data.btnIsRisk, true)
                cy.xpath(root.submitRoot).should('have.prop', 'disabled', true)
                cy.log('🦦🌮 Great Success 🌮🐿️')
            })
        
            it(`Buy - ${product} | Configuration: Enter Retire Option Only`, () => {
                cy.get('button').contains("Buy").click({ multiple: true })
                cy.verifyBuyModal(data.rctProducts[index], data.productDesc[index], data.buyTitle)
                cy.xpath(root.dialogRoot + '//a').contains(data.rctProducts[index]).click()
                cy.verifyBuy_Config()
                cy.selectRadioButton(data.btnIsRetire, true)
                cy.xpath(root.submitRoot).should('have.prop', 'disabled', true)
                cy.log('🦦🌮 Great Success 🌮🐿️')
            })
        
            it(`Buy - ${product} | Risk Adjusted/Retirement = True`, () => {
                cy.get('button').contains("Buy").click({ multiple: true })
                cy.verifyBuyModal(data.rctProductsld[index], data.productDesc[index], data.buyTitle)
                cy.xpath(root.dialogRoot + '//a').contains(data.rctProducts[index]).click()
                cy.verifyBuy_Config()
                cy.selectRadioButton(data.btnIsRisk, true)
                cy.selectRadioButton(data.btnIsRetire, true)
                cy.xpath(root.submitRoot).should('have.prop', 'disabled', false)
                cy.log('🦦🌮 Great Success 🌮🐿️')
            })
        
            it(`Buy - ${product} | Risk Adjusted/Retirement = False`, () => {
                cy.get('button').contains("Buy").click({ multiple: true })
                cy.verifyBuyModal(data.rctProducts[index], data.productDesc[index], data.buyTitle)
                cy.xpath(root.dialogRoot + '//a').contains(data.rctProducts[index]).click()
                cy.verifyBuy_Config()
                cy.selectRadioButton(data.btnIsRisk, false)
                cy.selectRadioButton(data.btnIsRetire, false)
                cy.xpath(root.submitRoot).should('have.prop', 'disabled', false)
                cy.log('🦦🌮 Great Success 🌮🐿️')
            })
        
            it(`Buy - ${product} | Risk Adjusted/Retirement = SplitA`, () => {
                cy.get('button').contains("Buy").click({ multiple: true })
                cy.verifyBuyModal(data.rctProducts[index], data.productDesc[index], data.buyTitle)
                cy.xpath(root.dialogRoot + '//a').contains(data.rctProducts[index]).click()
                cy.verifyBuy_Config()
                cy.selectRadioButton(data.btnIsRisk, true)
                cy.selectRadioButton(data.btnIsRetire, false)
                cy.xpath(root.submitRoot).should('have.prop', 'disabled', false)
                cy.log('🦦🌮 Great Success 🌮🐿️')
            })
        
            it(`Buy - ${product} | Risk Adjusted/Retirement = SplitB`, () => {
                cy.get('button').contains("Buy").click({ multiple: true })
                cy.verifyBuyModal(data.rctProducts[index], data.productDesc[index], data.buyTitle)
                cy.xpath(root.dialogRoot + '//a').contains(data.rctProducts[index]).click()
                cy.verifyBuy_Config()
                cy.selectRadioButton(data.btnIsRisk, false)
                cy.selectRadioButton(data.btnIsRetire, true)
                cy.xpath(root.submitRoot).should('have.prop', 'disabled', false)
                cy.log('🦦🌮 Great Success 🌮🐿️')
            })
        
            it(`Buy - ${product} | Summary: Review Entered Options | Risk Adjusted = False`, () => {
                cy.get('button').contains("Buy").click({ multiple: true })
                cy.verifyBuyModal(data.rctProducts[index], data.productDesc[index], data.buyTitle)
                cy.xpath(root.dialogRoot + '//a').contains(data.rctProducts[index]).click()
                cy.verifyBuy_Config()
                cy.selectRadioButton(data.btnIsRisk, false)
                cy.selectRadioButton(data.btnIsRetire, false)
                cy.contains(data.btnNextReview).should('be.enabled').click()
                cy.verifyBuy_Summary()
                cy.log('🦦🌮 Great Success 🌮🐿️')
            })
        
            it(`Buy - ${product} | Summary: Review Entered Options | Risk Adjusted = True`, () => {
                cy.get('button').contains("Buy").click({ multiple: true })
                cy.verifyBuyModal(data.rctProducts[index], data.productDesc[index], data.buyTitle)
                cy.xpath(root.dialogRoot + '//a').contains(data.rctProducts[index]).click()
                cy.verifyBuy_Config()
                cy.selectRadioButton(data.btnIsRisk, true)
                cy.selectRadioButton(data.btnIsRetire, false)
                cy.get('button').contains(data.btnNextReview).click()
                cy.verifyBuy_Summary()
                cy.log('🦦🌮 Great Success 🌮🐿️')
            })
        
            it(`Buy - ${product} | Submission: Request Buy - MIN`, () => {
                // setup
                cy.get('button').contains("Buy").click({ multiple: true })
                cy.verifyBuyModal(data.rctProducts[index], data.productDesc[index], data.buyTitle)
                cy.xpath(root.dialogRoot + '//a').contains(data.rctProducts[index]).click()
                // config
                cy.verifyBuy_Config('min')
                cy.selectRadioButton(data.btnIsRisk, false)
                cy.selectRadioButton(data.btnIsRetire, false)
                cy.get('button').contains(data.btnNextReview).click()
                // review
                cy.wait(800)
                cy.xpath(root.buyRoot).then(($div) => {
                    cy.wrap($div).within(() => {
                        cy.verifyBuy_Summary()
                        cy.xpath(root.buyRoot + root.rootOptions).each(($p, index) => {
                            cy.wrap($p).invoke('text').should('eq', data.optionsFalse[index])
                        })
                    })
                    cy.get('button').contains(data.btnPrevConfig).should('be.visible')
                    cy.get('button').contains(data.btnNextRequest).click() // ---SUBMIT
                })
                cy.log('🦦🌮 Great Success 🌮🐿️')
            })
        
            it(`Buy - ${product} | Submission: Request Buy - MAX`, () => {
                // setup
                cy.get('button').contains("Buy").click({ multiple: true })
                cy.verifyBuyModal(data.rctProducts[index], data.productDesc[index], data.buyTitle)
                cy.xpath(root.dialogRoot + '//a').contains(data.rctProducts[index]).click()
                // config
                cy.verifyBuy_Config('max')
                cy.selectRadioButton(data.btnIsRisk, true)
                cy.selectRadioButton(data.btnIsRetire, true)
                cy.get('button').contains(data.btnNextReview).click()
                // review
                cy.wait(800)
                cy.xpath(root.buyRoot).then(($div) => {
                    cy.wrap($div).within(() => {
                        cy.verifyBuy_Summary()
                        cy.xpath(root.buyRoot + root.buyOptions).each(($p, index) => {
                            cy.wrap($p).invoke('text').should('eq', data.optionsTrue[index])
                        })
                    })
                    cy.get('button').contains(data.btnPrevConfig).should('be.visible')
                    cy.get('button').contains(data.btnNextRequest).click() // ---SUBMIT
                })
                cy.log('🦦🌮 Great Success 🌮🐿️')
            })
        
            it(`Buy - ${product} | Submission: Request Buy - Random`, () => {
                //setup
                cy.get('button').contains("Buy").click({ multiple: true })
                cy.verifyBuyModal(data.rctProducts[index], data.productDesc[index], data.buyTitle)
                cy.xpath(root.dialogRoot + '//a').contains(data.rctProducts[index]).click()
                // config
                cy.verifyBuy_Config()
                cy.selectRadioButton(data.btnIsRisk, true)
                cy.selectRadioButton(data.btnIsRetire, false)
                cy.contains(data.btnNextReview).should('be.enabled').click()
                // reivew
                cy.wait(800)
                cy.xpath(root.buyRoot).then(($div) => {
                    cy.wrap($div).within(() => {
                        cy.verifyBuy_Summary()
                        cy.xpath(root.buyRoot + root.buyOptions).each(($p, index) => {
                            cy.wrap($p).invoke('text').should('eq', data.optionsSplitA[index])
                        })
                    })
                    cy.get('button').contains(data.btnPrevConfig).should('be.visible')
                    cy.get('button').contains(data.btnNextRequest).click() // ---SUBMIT
                })
                cy.log('🦦🌮 Great Success 🌮🐿️')
            })
        })
    })
})