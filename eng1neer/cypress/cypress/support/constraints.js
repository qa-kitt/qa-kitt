// URLs and environment variables
export const ENV_URL = `${Cypress.env("test")}`; // 'test'  <-- change if needed
export const ADMIN_TOKEN = `${Cypress.env("admin_token")}`; // '_test'  <-- change if needed
export const TESTER_TOKEN = `${Cypress.env("tester_token")}`; // '_test'  <-- change if needed

// User roles
export const admin = {
  token: ADMIN_TOKEN,
  type: "Admin",
};

export const tester = {
  token: TESTER_TOKEN,
  type: "Tester",
};

export const users = [admin, tester]; //  <-- change if needed
