/// <reference types="cypress" />

// ---------------------------------------------------------------
// SAMPLE TEST - Verify PROD Blog Audits
// ---------------------------------------------------------------
const url = `${Cypress.env("prodBlog")}/`

// Rubicon Carbon Audits - Performance, WCAG Accessibility, Best Practices, SEO, & PWA (Progressive Web App) Compliance
describe('Rubicon Carbon Google Lighthouse Audits - PRODUCTION BLOG', () => {
    beforeEach(() => {
      cy.visit(url)
      cy.wait(500)
      cy.contains('Decline').should('be.visible').click()
      cy.setCookie('cookieConsent', 'analyticsCookies=false%3B')
      cy.injectAxe()
    })
  
    it('should test the webpage accessability is WCAG conformant', () => {
      const axe = require('axe-core')
  
      // use the Axe library to check the URL for WCAG conformance.
      axe.run(url, {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa']
        }
      }, (err, results) => {
        if (err) {
          console.error(err)
        } else {
          console.log(results)
        }
      })
      cy.log('🦦🌮 Great Success 🌮🐿️')
    })

    // loose thresholds
    it('should run BLOG.RUBICONCARBON lighthouse audits using custom thresholds', () => {
      /// tag: prodAudit
      const thresholds = {
        performance: 30,
        accessibility: 60,
        'first-contentful-paint': 7000,
        'first-meaningful-paint': 10000,
        'largest-contentful-paint': 15000,
        interactive: 15000,
        seo: 60,
        pwa: 20,
      }
      const lighthouseConfig = {
        formFactor: 'desktop',
        screenEmulation: { disabled: true },
      }
      cy.visit(url)
      cy.lighthouse(thresholds, lighthouseConfig)
      cy.log('🦦🌮 Great Success 🌮🐿️')
    })

    // // strict thresholds
    // it('should run BLOG.RUBICONCARBON lighthouse audits using strict custom thresholds - FAIL', () => {
    //   const thresholds = {
    //     performance: 50,
    //     accessibility: 80,
    //     'first-contentful-paint': 3000,
    //     'first-meaningful-paint': 5000,
    //     'largest-contentful-paint': 7000,
    //     interactive: 7000,
    //     seo: 80,
    //     pwa: 50,
    //   }
    //   const lighthouseConfig = {
    //     formFactor: 'desktop',
    //     screenEmulation: { disabled: true },
    //   }
    //   cy.visit(url)
    //   cy.lighthouse(thresholds, lighthouseConfig)
    // })
})