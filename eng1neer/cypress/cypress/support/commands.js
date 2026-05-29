// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
import "@testing-library/cypress/add-commands";
import "@cypress-audit/pa11y/commands";
import "@cypress-audit/lighthouse/commands";

import * as data from "./data";
import * as root from "./roots";

// ---------------------------------------------------------------
// COMMON
// ---------------------------------------------------------------

Cypress.on("uncaught:exception", (err, _runnable) => {
  if (err.message.includes("Modal is transitioning")) {
    return false;
  }
});

// ---------------------------------------------------------------
// RANDOM
// ---------------------------------------------------------------
Cypress.Commands.add("rand0m_AuthorizeTester", function (url, token) {
  cy.setCookie("auth-token", token);
  cy.visit(url, {
    headers: {
      "Accept-Encoding": "gzip, deflate",
    },
    onBeforeLoad(window) {
      window.localStorage.setItem("auth-token", token);
      window.localStorage.setItem("guidedTour", JSON.stringify(data.tour));
      cy.window().its("localStorage.auth-token").should("eq", token);
      cy.window()
        .its("localStorage.guidedTour")
        .should("eq", JSON.stringify(data.tour));
    },
  });
  cy.getCookie("auth-token").should("have.property", "value", token);
});

Cypress.Commands.add("rand0m_VerifyMenu", function () {
  // Verify hompage menu items
  cy.xpath(root.menuBtnRoot).each(($p, index) => {
    cy.wrap($p).invoke("text").should("eq", data.overviewMenu[index]);
  });

  cy.xpath(root.menuBtnRoot + "//a").each(($a) => {
    const message = $a.text();
    expect($a, message).to.have.attr("href").not.contain("undefined");
  });
});

Cypress.Commands.add("verifyHyperlinks", function () {
  cy.xpath(root.clientRoot).each(($el) => {
    cy.wrap($el)
      .find("a")
      .invoke("attr", "href")
      .then((href) => {
        cy.request(href).its("status").should("eq", 200);
      });
  });
});

// ---------------------------------------------------------------
// KNIGHTS
// ---------------------------------------------------------------
Cypress.Commands.add("kn1ghts_AuthorizeAdmin", function (url, token) {
  cy.visit(url, {
    onBeforeLoad(window) {
      window.localStorage.setItem("admin-auth-token", token);
      cy.window().its("localStorage.admin-auth-token").should("eq", token);
    },
  });
});

Cypress.Commands.add("kn1ghts_VerifyAdminMenu", function () {
  // Verify hompage menu items as ADMIN
  const itemsToVerify = [
    "Internal Platform",
    "My Positions",
    "Trading",
    "Inventory Management",
    "Retirements & Transfers",
    "Customer Management",
    "Projects",
    "Market Intelligence",
    "Data Management",
    "Notifications",
  ];
  const menuRoot = "//ul[contains(@class, 'MuiList-root')]/li";
  cy.xpath(menuRoot).each(($li, index) => {
    cy.wrap($li).invoke("text").should("eq", itemsToVerify[index]);
  });

  cy.xpath(menuRoot + "//a").each(($a) => {
    const message = $a.text();
    expect($a, message).to.have.attr("href").not.contain("undefined");
  });
});
