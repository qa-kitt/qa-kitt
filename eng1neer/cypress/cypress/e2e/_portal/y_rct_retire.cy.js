/// <reference types="cypress" />

// ---------------------------------------------------------------
// RETIRE - Verify CUSTOMER PORTAL as Viewer
// ---------------------------------------------------------------
const url = `${Cypress.env("test") + '/transactions'}`
const viewer = {
    token: `${Cypress.env("viewer_token")}`,
    type: 'Viewer'
}
const trader = {
    token: `${Cypress.env("tmanager_token")}`,
    type: 'T-Manager'
}
const users = [viewer, trader]
const inputs = ['visibility', 'product', 'amount', 'beneficiary']
const memoTip = 'Please indicate the retirement language you would like to include. For example: "Retired on behalf of Company ABC"'
const formValues = {
    product: 'Custom Automation',
    amount: '1',
    beneficiary: 'Cypress Automation',
    memo: '🤖'
}

users.forEach((user, index) => {
    describe(`${index + 1} RETIRE: Customer Portal - as_${user.type.toUpperCase()}`, () => {
        /// tag: portalRetire
        before(() => {
            cy.visit(Cypress.env("test"))
        })

        beforeEach(() => {
            cy.portal_AuthorizeViewer(url, user.token)
            cy.log("Token 🔐 = VERIFIED")
            cy.log("Cookie 🍪 = CRUNCHED")
            cy.log("VIEWER 🤖 Access Granted ✅")
        })   

        it('Retire | Verify Product Modal', () => {
            cy.get('button').contains("Retire").click()
            if (user.type === 'Viewer') {
                cy.get('h2').contains('Retire RCTs').should('be.visible')
                cy.xpath("//div[@role='dialog']//a").each($a => {
                    const message = $a.text()
                    expect($a, message).to.have.attr("href").eq("mailto:clientservices@rubiconcarbon.com")
                })
            } else if (user.type === 'T-Manager') {
                cy.get('h2').contains('New Retirement Request').should('be.visible')
                cy.get('form#retirement-request-form').should('exist')         
            }
            cy.get("button").contains("Cancel").click()

            cy.log('🦦🌮 Great Success 🌮🐿️')
        })

        it('Retire | Verify Product Modal for PUBLIC Visibility', () => {
            cy.get('button').contains("Retire").click()

            if (user.type === 'T-Manager') {
                cy.xpath("//div[@role='dialog']//h2").contains('New Retirement Request').should('be.visible')
                cy.get('form#retirement-request-form').should('exist')

                // Select 'Public' visibility
                cy.get('#visibility-dropdown').click()
                cy.get('li[data-value="Public"]').click()
                cy.get('input[name="visibility"]').should('have.value', 'Public')
                cy.get('p#memo-field-error-message').should('be.visible')
                cy.wait(100)

                // Fill in the rest of the form
                cy.get('#product-dropdown').click()
                cy.xpath("//li[@role='option']").contains(formValues.product).click()
                cy.get('input[name="amount"]').type(formValues.amount)
                cy.get('input[name="beneficiary"]').type(formValues.beneficiary)

                // Memo field should be optional for 'Public'
                cy.xpath("//textarea[@name='memo']").should('have.attr', 'aria-invalid', 'true').type(formValues.memo)
                cy.get('p#memo-field-helper-text').should('contain', memoTip)

                // Ensure submit button is enabled
                cy.get('button[type="submit"]').should('not.be.disabled')
            } else if (user.type === 'Viewer') {
                cy.xpath("//div[@role='dialog']//h2").contains('New Retirement Request').should('be.visible')
            }
            cy.log('🦦🌮 Great Success 🌮🐿️')
        })

        it('Retire | Verify Product Modal for PRIVATE Visibility', () => {
            cy.get('button').contains("Retire").click()

            if (user.type === 'T-Manager') {
                cy.xpath("//div[@role='dialog']//h2").should('be.visible')
                cy.get('form#retirement-request-form').should('exist')

                // Select 'Private' visibility
                cy.get('#visibility-dropdown').click()
                cy.get('li[data-value="Private"]').click()
                cy.get('input[name="visibility"]').should('have.value', 'Private')

                // Fill in the rest of the form
                cy.get('#product-dropdown').click()
                cy.xpath("//li[@role='option']").contains(formValues.product).click()
                cy.get('input[name="amount"]').type(formValues.amount)
                cy.get('input[name="beneficiary"]').type(formValues.beneficiary)

                // Memo field is not required for 'Private'
                cy.xpath("//textarea[@name='memo']").should('have.attr', 'aria-invalid', 'false').type(formValues.memo)

                // Ensure submit button is enabled
                cy.get('button[type="submit"]').should('not.be.disabled')
            }

            cy.log('🦦🌮 Great Success 🌮🐿️')
        })
    })
})