const { lighthouse, prepareAudit } = require("@cypress-audit/lighthouse");
const { pa11y } = require("@cypress-audit/pa11y");
const { defineConfig } = require("cypress");

async function setupNodeEvents(on, config) {
  on("before:browser:launch", (_browser = {}, launchOptions) => {
    prepareAudit(launchOptions);
  });

  on("task", {
    lighthouse: lighthouse(),
    pa11y: pa11y(console.log.bind(console)),
  });

  return config;
}

module.exports = defineConfig({
  projectId: "get new one",
  viewportWidth: 1920,
  viewportHeight: 1080,
  chromeWebSecurity: false,

  e2e: {
    specPattern: [
      "cypress/e2e/_portal/*.cy.js",
      "cypress/e2e/_platform/*.cy.js",
      "cypress/e2e/_prod/*.cy.js",
    ],
    setupNodeEvents,
  },
  env: {
    test: "https://portal.testing.rand0m.ai",
    testAdmin: "https://platform.testing.rand0m.ai",
    stg: "https://portal.staging.rand0m.ai",
    stgAdmin: "https://platform.staging.rand0m.ai",
    prod: "https://rand0m.ai",
    prodBlog: "https://blog.rand0m.ai",
  },
});
