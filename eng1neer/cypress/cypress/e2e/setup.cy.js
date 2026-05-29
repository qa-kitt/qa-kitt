const axios = require("axios");
const fs = require("fs");

const apiUrl = "http://your-api-url.com"; // Replace with your API base URL
const adminEmail = "admin@rand0m.ai"; // Admin user email
const viewerEmail = "eng1neer@rand0m.ai"; // Viewer user email

// Function to generate a random 8-digit number for salesforceIdentifier
function generateRandomNumber() {
  return Math.floor(10000000 + Math.random() * 90000000);
}

// Function to make a GET request
async function getRequest(endpoint, params) {
  try {
    const response = await axios.get(apiUrl + endpoint, { params });
    return response.data;
  } catch (error) {
    console.error("GET request failed:", error);
    throw error;
  }
}

// Function to make a POST request
async function postRequest(endpoint, data) {
  try {
    const response = await axios.post(apiUrl + endpoint, data);
    return response.data;
  } catch (error) {
    console.error("POST request failed:", error);
    throw error;
  }
}

// Function to update Cypress environment variables in cypress.env.json
function updateCypressEnvFile(envData) {
  try {
    fs.writeFileSync("cypress.env.json", JSON.stringify(envData, null, 2));
  } catch (error) {
    console.error("Failed to update Cypress environment variables:", error);
    throw error;
  }
}

// Main setup function
async function setup() {
  try {
    // Step 1: Obtain Organization and User IDs
    const demoAccount = await getRequest("/api/admin/organizations", {
      name: "Demo Account",
    });
    const orgId = demoAccount[0].id;

    const defaultAdmin = await getRequest(
      `/api/admin/organizations/${orgId}/users`,
      { name: "Default Admin" },
    );
    const acctMgrId = defaultAdmin[0].id;

    // Step 2: Create a New Organization
    const salesforceIdentifier = "SFID-" + generateRandomNumber();
    const newOrgData = {
      isEnabled: true,
      name: "Automation",
      purchaseFlowTypes: ["otc_spot"],
      salesforceIdentifier,
      rubiconManagerId: acctMgrId,
    };
    const newOrg = await postRequest("/api/admin/organizations", newOrgData);

    const newOrgId = newOrg.id;

    // Step 3: Add New Users to the Organization
    // const newUser0Data = {
    //   firstName: 'Test',
    //   lastName: 'Automation',
    //   email: 'automation@gmail.com',
    //   organizationId: newOrgId,
    //   organizationRoles: ['transactor']
    // };
    const newUser1Data = {
      firstName: "Staging",
      lastName: "Automation",
      email: "automation@gmail.com",
      organizationId: newOrgId,
      organizationRoles: ["transactor"],
    };
    const newUser2Data = {
      firstName: "Viewer",
      lastName: "Automation",
      email: "automation+viewer@gmail.com",
      organizationId: newOrgId,
      organizationRoles: ["viewer"],
    };
    // await postRequest('/api/admin/users', newUser0Data);
    await postRequest("/api/admin/users", newUser1Data);
    await postRequest("/api/admin/users", newUser2Data);

    // Step 4: Generate New Authentication Tokens
    const adminToken = await generateToken(adminEmail);
    const viewerToken = await generateToken(viewerEmail);

    // Step 5: Update Cypress environment variables
    const envData = {
      admin_token: adminToken,
      viewer_token: viewerToken,
    };
    updateCypressEnvFile(envData);

    console.log("Setup completed successfully.");
  } catch (error) {
    console.error("Setup failed:", error);
  }
}

// Function to generate authentication token
async function generateToken(email) {
  try {
    const response = await axios.post(apiUrl + "/api/dev/generate-token", {
      email,
    });
    return response.data.token;
  } catch (error) {
    console.error("Failed to generate token for", email, ":", error);
    throw error;
  }
}

// Run setup
setup();
