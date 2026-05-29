/// <reference types="cypress" />

// ---------------------------------------------------------------
// BYO_RCT® Selection - Verify CUSTOMER PORTAL as Viewer
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
    'Project',
    'Vintage',
    'Rubicon Carbon Integrity Grade',
    '',
    'UN SDGs',
    'Source',
    'Country'
]
const staticFilters = [
    'Emissions Impact',
    'Geography',
    'Categories',
    'Eligibility & Accreditations',
    'Integrity Grade'
]

users.forEach((user, index) => {
    describe(`${index + 1} BYO_RCT® Selection: Customer Portal - as_${user.type.toUpperCase()}`, () => {
        /// tag: portalBYORCT_Selection
        before(() => {
            cy.visit(Cypress.env("test"))
        })
        beforeEach(() => {
            cy.portal_AuthorizeViewer(url, user.token)
            cy.log("Token 🔐 = VERIFIED")
            cy.log("Cookie 🍪 = CRUNCHED")
            cy.log("VIEWER 🤖 Access Granted ✅")
        })   
        
        it('Build Your Own RCT® - Mapbox: Default Selection', () => {
            cy.get('#project-selection')
                .should('exist')
                .should('be.visible')
                
            cy.window().then(win => {
                const mapBoxContainer = win.document.getElementById('project-selection')
                expect(mapBoxContainer.isConnected).to.be.true
            })
            cy.get('#project-selection button').should('have.length', 0)
            cy.log("✅ Mapbox | Default Selection - None")
        })

        it('Build Your Own RCT® - Cart: Default Selection', () => {
            cy.xpath("//div[contains(@class, 'styles_cart')]//button")
                .should('exist')
                .each($button => {
                    cy.wrap($button)
                        .should('be.disabled') 
                        .should('have.prop', 'isConnected', true)
                })
            cy.contains('Please select between 5-12 projects')
                .should('be.visible')
                .should('have.prop', 'isConnected', true)
            cy.log("✅ Cart | Default Selection - Empty")
        })  

        it('Build Your Own RCT® - Project Selection: Default Filters', () => {
            cy.get('thead tr:nth-of-type(1) th label').each(($label, index) => {
                expect($label.text().trim()).to.equal(staticFilters[index])
                cy.log("✅ Table Header | Filter Options - " + staticFilters[index])
            })
        })

        it('Build Your Own RCT® - Project Selection: Filter Options', () => {
            cy.get('thead tr:nth-of-type(1)').within(() => {
                cy.get('button').eq(0)
                    .should('contain', 'Apply')
                    .should('be.visible')
                    .should('be.enabled')
                cy.log("✅ Table Header | Filters & Buttons")
            })
        })

        it('Build Your Own RCT® - Project Selection: Default Columns', () => {
            cy.get('thead tr:nth-of-type(2)').within(() => {
                staticColumns.forEach((columnTitle, index) => {
                    cy.get('th').eq(index).should('contain', columnTitle)
                    cy.log("✅ Table Header | Column Options" + staticColumns[index])
                })
            })
            cy.log('🦦🌮 Great Success 🌮🐿️')
        })

        it('Build Your Own RCT® - Project Selection: Checkbox', () => {
            cy.get('tbody tr').each($row => {
                cy.wrap($row).within(() => {
                    cy.get('td').eq(0).find('input[type="checkbox"]').should('exist')
                    cy.log("✅ Project Selection Checkbox | Column Content")
                })
            }) 
            cy.log('🦦🌮 Great Success 🌮🐿️')
        })

        it('Build Your Own RCT® - Project Selection: Project Name & Link', () => {
            cy.get('tbody tr').each($row => {
                cy.wrap($row).within(() => {
                    cy.get('td').eq(1).find('a')
                        .should('exist')
                        .should('have.attr', 'href')
                    cy.get('td').eq(1).find('a p').should('exist')
                    cy.log("✅ Project Name & Hyperlinks | Column Content")
                })
            })
            cy.log('🦦🌮 Great Success 🌮🐿️') 
        })

        it('Build Your Own RCT® - Project Selection: Rubicon Score', () => {
            cy.get('tbody tr').each($row => {
                cy.wrap($row).within(() => {
                    cy.get('td').eq(3).find('svg') // 4th column
                        .should('exist')
                        .should('have.prop', 'isConnected', true)
                    cy.log("✅ Rubicon Score | Column Content")
                })
            })
            cy.log('🦦🌮 Great Success 🌮🐿️') 
        })

        it('Build Your Own RCT® - Project Selection: Water.org', () => {
            cy.get('tbody tr').each($row => {
                cy.wrap($row).within(() => {
                    cy.get('td').eq(4).should('exist').should('have.prop', 'isConnected', true)
                    cy.log("✅ Water.org | Column Content") 
                })
            }) 
        })

        it('Build Your Own RCT® - Project Selection: UN SDGs', () => {
            cy.get('tbody tr').each($row => {
                cy.wrap($row).within(() => {
                    cy.get('td').eq(5).find('img').should('exist')
                    cy.log("✅ UN SDGs | Column Content")
                })
            }) 
            cy.log('🦦🌮 Great Success 🌮🐿️')
        })

        it('Build Your Own RCT® - Project Selection: Source', () => {
            cy.get('tbody tr').each($row => {
                cy.wrap($row).within(() => {
                    cy.get('td').eq(6).invoke('text').should('not.be.empty')
                    cy.log("✅ Source | Column Content")
                })
            }) 
            cy.log('🦦🌮 Great Success 🌮🐿️')
        })

        it('Build Your Own RCT® - Project Selection: Country', () => {
            cy.get('tbody tr').each($row => {
                cy.wrap($row).within(() => {
                    cy.xpath('//*[name()="svg" and contains(@data-testid, "PlaceIcon")]')
                        .should('exist')
                        .should('have.prop', 'isConnected', true)
                    cy.log("✅ Country | Column Content")
                })
            }) 
            cy.log('🦦🌮 Great Success 🌮🐿️')
        })

        it('Build Your Own RCT® - Cart: Add Products UNDER 5-12 Threshold', () => {
            cy.get('tbody tr').then($rows => {
                // Get number of available projects
                const availableByoProjects = $rows.length
                cy.log(`LOG| Available BYO Projects: ${availableByoProjects}`)
                const selectByoProjects = Cypress._.random(1, 4) // UNDER threshold
                cy.log(`LOG| Select BYO Projects: ${selectByoProjects}`)
        
                // Start select projects
                cy.selectByoCheckboxes(selectByoProjects, availableByoProjects)
                
                // Start verify projects
                cy.get('tbody input[type="checkbox"]:checked').its('length').should('eq', selectByoProjects)
                cy.xpath("//div[contains(@class, 'styles_cart')]//button").should('be.disabled')
                cy.verifyByoProjectSelection()
                cy.contains('Please select between 5-12 projects').should('be.visible')
                cy.log('✅ Visible Warning: Please Select 5-12 Projects.')
            })
            cy.log('🦦🌮 Great Success 🌮🐿️')
        })
        
        it('Build Your Own RCT® - Cart: Add Products OVER 5-12 Threshold', () => {
            cy.get('tbody tr').then($rows => {
                // Get number of available projects
                const availableByoProjects = $rows.length
                cy.log(`LOG| Available BYO Projects: ${availableByoProjects}`)
                const selectByoProjects = Cypress._.random(13, availableByoProjects) // OVER threshold
                cy.log(`LOG| Select BYO Projects: ${selectByoProjects}`)
        
                // Start select projects
                cy.selectByoCheckboxes(selectByoProjects, availableByoProjects)
        
                // Start verify projects
                cy.get('tbody input[type="checkbox"]:checked').its('length').should('eq', selectByoProjects)
                cy.xpath("//div[contains(@class, 'styles_cart')]//button").should('be.disabled')
                cy.verifyByoProjectSelection()
                cy.contains('Please select between 5-12 projects').should('be.visible')
                cy.log('✅ Visible Warning: Please Select 5-12 Projects.')
            })
            cy.log('🦦🌮 Great Success 🌮🐿️')
        })
        
        it('Build Your Own RCT® - Cart: Add Products WITHIN 5-12 Threshold', () => {
            cy.get('tbody tr').then($rows => {
                // Get number of available projects
                const availableByoProjects = $rows.length
                cy.log(`LOG| Available BYO Projects: ${availableByoProjects}`)
                const selectByoProjects = Cypress._.random(5, 12) // WITHIN threshold
                cy.log(`LOG| Select BYO Projects: ${selectByoProjects}`)
        
                // Start select projects
                cy.selectByoCheckboxes(selectByoProjects, availableByoProjects)
        
                // Start verify projects
                cy.get('tbody input[type="checkbox"]:checked').its('length').should('eq', selectByoProjects)
                cy.xpath("//div[contains(@class, 'styles_cart')]//button").should('be.enabled')
                cy.verifyByoProjectSelection()
                cy.contains('Please select between 5-12 projects').should('not.exist')
                cy.log('✅ Warning Hidden')
            })
            cy.log('🦦🌮 Great Success 🌮🐿️')
        })
    })
})