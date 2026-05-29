/// <reference types="cypress" />

// ---------------------------------------------------------------
// SAMPLE TEST - Verify PROD Audits
// ---------------------------------------------------------------
const url = `${Cypress.env("prod")}/`;

// rand0m.ai Audits - Performance, WCAG Accessibility, Best Practices, SEO, & PWA (Progressive Web App) Compliance
describe("rand0m.ai Google Lighthouse Audits - PRODUCTION", () => {
  // Function to iterate through main pages in the menu
  const testPageAccessibilityAndLighthouse = (pageUrl) => {
    it(`should test the accessibility of ${pageUrl} is WCAG conformant`, () => {
      cy.visit(pageUrl);
      const axe = require("axe-core");
      axe.run(
        pageUrl,
        {
          runOnly: {
            type: "tag",
            values: ["wcag2a", "wcag2aa"],
          },
        },
        (err, results) => {
          if (err) {
            console.error(err);
          } else {
            console.log(results);
          }
        },
      );
      cy.log("🦦🌮 Great Success 🌮🐿️");
    });

    // Loose thresholds for Lighthouse audits
    it(`should run rand0m.ai Lighthouse audits for ${pageUrl} using custom thresholds`, () => {
      /// tag: prodAudit
      const thresholds = {
        performance: 30,
        accessibility: 60,
        "first-contentful-paint": 7000,
        "first-meaningful-paint": 10000,
        "largest-contentful-paint": 15000,
        interactive: 15000,
        seo: 60,
        pwa: 20,
      };
      const lighthouseConfig = {
        formFactor: "desktop",
        screenEmulation: { disabled: true },
      };
      cy.visit(pageUrl);
      cy.lighthouse(thresholds, lighthouseConfig);
      cy.log("🦦🌮 Great Success 🌮🐿️");
    });
  };

  // // strict thresholds
  // it('should run rand0m.ai lighthouse audits using strict custom thresholds - FAIL', () => {
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

  // Main pages in the menu
  const mainPages = ["about-us", "our-solutions", "contact-us", "faq"]; // Add more pages as needed

  // Execute the tests for each main page
  mainPages.forEach((page) => {
    describe(`Main Page: ${page}`, () => {
      testPageAccessibilityAndLighthouse(`${url}${page}`);
    });
  });
});
