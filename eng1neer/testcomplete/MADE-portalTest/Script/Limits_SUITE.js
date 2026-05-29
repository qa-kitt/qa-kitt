//USEUNIT BackOfficeADMIN
//USEUNIT BackOfficeMAIN
//USEUNIT BackOfficeSQL
//USEUNIT PortalINT
//USEUNIT PortalMAIN
//USEUNIT PortalPAY
//USEUNIT PortalSEN
//USEUNIT PortalSQL

/***************************************************************
Name: Limits_SUITE
Description: Automated test cases - Back Office: Limits
Author: Kitt Random
Creation Date: 10/12/2021
***************************************************************/

function limitSuiteLogin() {
  // login to back office as back office admin
  ProjectSuite.Variables.ActiveTestSuite = "Limits";
  BackOfficeMAIN.navigateBackOffice("profiles");
  CommonMAIN.sgbGetCurrentUser();
  if (equal(ProjectSuite.Variables.ActiveUserType, "Trader")) {
    BackOfficeMAIN.sgbSwitchBackOfficeUser();
  }
}

// TC17270 > Transaction Limits: Profile Service Account Enrollment
/***************************************************************/
function testCase_17270() {
  // set int transaction type
  ProjectSuite.Variables.ServiceType = "Internal Transfer";
  ProjectSuite.Variables.TransactionType = "Transfer";

  // refresh test data and account
  CommonMAIN.sgbRefresh();
  CommonMAIN.sgbTestAccount();
  if (equal(ProjectSuite.Variables.ActiveUserType, "Trader")) {
    BackOfficeMAIN.sgbSwitchBackOfficeUser();
  }

  // open profile admin
  BackOfficeADMIN.adminProfileNavigation("Services");

  // set service transaction limit > daily limit - should not work
  BackOfficeADMIN.adminVerifyProfileServices("Transaction Limit", 1, "Cancel");

  // set service daily limit < transaction limit - automatically updates transaction limit to = daily limit
  BackOfficeADMIN.adminVerifyProfileServices("Daily Limit", -1, "Cancel");

  // disable service and save changes
  BackOfficeADMIN.adminVerifyProfileServices("Disable", "", "Save");

  // switch profiles and approve request
  BackOfficeMAIN.sgbSwitchBackOfficeUser();
  BackOfficeADMIN.adminApprovalAction("Profiles", "Approve", "0");

  // verify disabled profile service and re-enable
  BackOfficeADMIN.adminProfileNavigation("Services");
  BackOfficeADMIN.adminVerifyProfileServices("Enable", "", "Save");

  // switch profiles and approve request
  BackOfficeMAIN.sgbSwitchBackOfficeUser();
  BackOfficeADMIN.adminApprovalAction("Profiles", "Approve", "0");
}

// TC17271 > Verify Limits: SEN Updates in Effect
/***************************************************************/
function testCase_17271() {
  // refresh test data
  ProjectSuite.Variables.ServiceType = "SEN Transfer";
  ProjectSuite.Variables.TransactionType = "Transfer";

  // refresh test data
  CommonMAIN.sgbRefresh();
  if (equal(ProjectSuite.Variables.ActiveUserType, "Trader")) {
    BackOfficeMAIN.sgbSwitchBackOfficeUser();
  }

  // open profile admin
  BackOfficeADMIN.adminProfileNavigation("Services");

  // update service limit and save changes
  BackOfficeADMIN.adminVerifyProfileServices("Daily Limit", 0.08, "Save");

  // switch profiles and approve request
  BackOfficeMAIN.sgbSwitchBackOfficeUser();
  BackOfficeADMIN.adminApprovalAction("Profiles", "Approve", "0");

  // get user permissioned service account
  CommonMAIN.sgbTestAccount();

  // verify new service limit
  PortalSEN.senRequestTransfer("Over Limit");

  // refresh test data and account
  CommonMAIN.sgbRefresh();
  CommonMAIN.sgbTestAccount();

  // request transfer > new limit
  PortalSEN.senRequestTransfer(1);
}

// TC17272 > Verify Limits: INT Updates in Effect
/***************************************************************/
function testCase_17272() {
  // refresh test data
  ProjectSuite.Variables.ServiceType = "Internal Transfer";
  ProjectSuite.Variables.TransactionType = "Transfer";

  // refresh test data and account
  CommonMAIN.sgbRefresh();
  CommonMAIN.sgbTestAccount();
  if (equal(ProjectSuite.Variables.ActiveUserType, "Trader")) {
    BackOfficeMAIN.sgbSwitchBackOfficeUser();
  }

  // open profile admin
  BackOfficeADMIN.adminProfileNavigation("Services");

  // update service limit and save changes
  BackOfficeADMIN.adminVerifyProfileServices("Transaction Limit", 0.08, "Save");

  // switch profiles and approve request
  BackOfficeMAIN.sgbSwitchBackOfficeUser();
  BackOfficeADMIN.adminApprovalAction("Profiles", "Approve", "0");

  // request transfer > new limit
  PortalINT.intRequestTransfer("Limit Test");
}

// TC17274 > Verify Limits: PAY Updates in Effect
/***************************************************************/
function testCase_17274() {
  // set payment transaction type
  ProjectSuite.Variables.ServiceType = "Payment";
  ProjectSuite.Variables.TransactionType = "Foreign Currency Payment";

  // refresh test data and account
  CommonMAIN.sgbRefresh();
  CommonMAIN.sgbTestAccount();
  if (equal(ProjectSuite.Variables.ActiveUserType, "Trader")) {
    BackOfficeMAIN.sgbSwitchBackOfficeUser();
  }

  // open profile admin - admin user 1
  BackOfficeADMIN.adminProfileNavigation("Services");

  // update service limit and save changes
  BackOfficeADMIN.adminVerifyProfileServices("Daily Limit", 888, "Save");

  // switch profiles and approve request - boa user 2
  BackOfficeMAIN.sgbSwitchBackOfficeUser();
  BackOfficeADMIN.adminApprovalAction("Profiles", "Approve", "0");

  // request transfer > new limit
  //PortalPAY.payRequestTransfer("Over Limit"); // PAYMENT NOT PUSHED TO QA
}

// TC17275 > Verify Limits: INT Updates in Effect
function testCase_17275() {
  // refresh test data
  ProjectSuite.Variables.ServiceType = "Internal Transfer";
  ProjectSuite.Variables.TransactionType = "Transfer";

  // refresh test data and account
  CommonMAIN.sgbRefresh();
  CommonMAIN.sgbTestAccount();
  if (equal(ProjectSuite.Variables.ActiveUserType, "Trader")) {
    BackOfficeMAIN.sgbSwitchBackOfficeUser();
  }

  // open profile admin
  BackOfficeADMIN.adminProfileNavigation("Services");

  // update service limit and save changes
  BackOfficeADMIN.adminVerifyProfileServices("Transaction Limit", 0.08, "Save");

  // switch profiles and approve request
  BackOfficeMAIN.sgbSwitchBackOfficeUser();
  BackOfficeADMIN.adminApprovalAction("Profiles", "Approve", "0");

  // request transfer > new limit
  PortalINT.intRequestTransfer("Limit Test");
}

// TC17276 > Verify Limits: INT Updates in Effect
function testCase_17276() {
  // refresh test data
  ProjectSuite.Variables.ServiceType = "Internal Transfer";
  ProjectSuite.Variables.TransactionType = "Transfer";

  // refresh test data and account
  CommonMAIN.sgbRefresh();
  CommonMAIN.sgbTestAccount();
  if (equal(ProjectSuite.Variables.ActiveUserType, "Trader")) {
    BackOfficeMAIN.sgbSwitchBackOfficeUser();
  }

  // open profile admin
  BackOfficeADMIN.adminProfileNavigation("Services");

  // update service limit and save changes
  BackOfficeADMIN.adminVerifyProfileServices("Transaction Limit", 0.08, "Save");

  // switch profiles and approve request
  BackOfficeMAIN.sgbSwitchBackOfficeUser();
  BackOfficeADMIN.adminApprovalAction("Profiles", "Approve", "0");

  // request transfer > new limit
  PortalINT.intRequestTransfer("Limit Test");
}

// TC17277 > Verify Limits: INT Updates in Effect
function testCase_17277() {
  // refresh test data
  ProjectSuite.Variables.ServiceType = "Internal Transfer";
  ProjectSuite.Variables.TransactionType = "Transfer";

  // refresh test data and account
  CommonMAIN.sgbRefresh();
  CommonMAIN.sgbTestAccount();
  if (equal(ProjectSuite.Variables.ActiveUserType, "Trader")) {
    BackOfficeMAIN.sgbSwitchBackOfficeUser();
  }

  // open profile admin
  BackOfficeADMIN.adminProfileNavigation("Services");

  // update service limit and save changes
  BackOfficeADMIN.adminVerifyProfileServices("Transaction Limit", 1, "Save");

  // switch profiles and approve request
  BackOfficeMAIN.sgbSwitchBackOfficeUser();
  BackOfficeADMIN.adminApprovalAction("Profiles", "Approve", "0");

  // request transfer > new limit
  PortalINT.intRequestTransfer("Limit Test");
}

// TC17278 > Verify Limits: INT Updates in Effect
function testCase_17278() {
  // refresh test data
  ProjectSuite.Variables.ServiceType = "Internal Transfer";
  ProjectSuite.Variables.TransactionType = "Transfer";

  // refresh test data and account
  CommonMAIN.sgbRefresh();
  CommonMAIN.sgbTestAccount();
  if (equal(ProjectSuite.Variables.ActiveUserType, "Trader")) {
    BackOfficeMAIN.sgbSwitchBackOfficeUser();
  }

  // open profile admin
  BackOfficeADMIN.adminProfileNavigation("Services");

  // update service limit and save changes
  BackOfficeADMIN.adminVerifyProfileServices("Daily Limit", 1000, "Save");

  // switch profiles and approve request
  BackOfficeMAIN.sgbSwitchBackOfficeUser();
  BackOfficeADMIN.adminApprovalAction("Profiles", "Approve", "0");

  // request transfer > new limit
  PortalINT.intRequestTransfer("Over Limit");
}

// TC17279 > Verify Limits: SEN Updates in Effect
function testCase_17279() {
  // refresh test data
  ProjectSuite.Variables.ServiceType = "SEN Transfer";
  ProjectSuite.Variables.TransactionType = "Transfer";

  // refresh test data and account
  CommonMAIN.sgbRefresh();
  CommonMAIN.sgbTestAccount();
  if (equal(ProjectSuite.Variables.ActiveUserType, "Trader")) {
    BackOfficeMAIN.sgbSwitchBackOfficeUser();
  }

  // open profile admin
  BackOfficeADMIN.adminProfileNavigation("Services");

  // update service limit and save changes
  BackOfficeADMIN.adminVerifyProfileServices("Transaction Limit", 1, "Save");

  // switch profiles and approve request
  BackOfficeMAIN.sgbSwitchBackOfficeUser();
  BackOfficeADMIN.adminApprovalAction("Profiles", "Approve", "0");

  // request transfer > new limit
  PortalSEN.senRequestTransfer("Limit Test");
}

// TC17280 > Verify Limits: INT Updates in Effect
function testCase_17280() {
  // refresh test data
  ProjectSuite.Variables.ServiceType = "Internal Transfer";
  ProjectSuite.Variables.TransactionType = "Transfer";

  // refresh test data and account
  CommonMAIN.sgbRefresh();
  CommonMAIN.sgbTestAccount();
  if (equal(ProjectSuite.Variables.ActiveUserType, "Trader")) {
    BackOfficeMAIN.sgbSwitchBackOfficeUser();
  }

  // open profile admin
  BackOfficeADMIN.adminProfileNavigation("Services");

  // update service limit and save changes
  BackOfficeADMIN.adminVerifyProfileServices("Daily Limit", 1000, "Save");

  // switch profiles and approve request
  BackOfficeMAIN.sgbSwitchBackOfficeUser();
  BackOfficeADMIN.adminApprovalAction("Profiles", "Approve", "0");

  // request transfer > new limit
  PortalINT.intRequestTransfer("Over Limit");
}

// TC5813 > Verify Daily Limit Permissions on Profile Service Account Enrollment
function testCase_5813() {
  // refresh test data
  ProjectSuite.Variables.ServiceType = "SEN Transfer";
  ProjectSuite.Variables.TransactionType = "Transfer";

  // refresh test data and account
  CommonMAIN.sgbRefresh();
  CommonMAIN.sgbTestAccount();
  if (equal(ProjectSuite.Variables.ActiveUserType, "Trader")) {
    BackOfficeMAIN.sgbSwitchBackOfficeUser();
  }

  // open profile admin
  BackOfficeADMIN.adminProfileNavigation("Services");

  // update service limit and save changes
  BackOfficeADMIN.adminVerifyProfileServices("Transaction Limit", 1, "Save");

  // switch profiles and approve request
  BackOfficeMAIN.sgbSwitchBackOfficeUser();
  BackOfficeADMIN.adminApprovalAction("Profiles", "Approve", "0");

  // request transfer > new limit
  PortalSEN.senRequestTransfer("Limit Test");
}

// TC15517 > Verify INT Transfer - Limit Test
function testCase_15517() {
  // set sen transaction type
  ProjectSuite.Variables.ServiceType = "Internal Transfer";
  ProjectSuite.Variables.TransactionType = "Transfer";

  // refresh test data and account
  CommonMAIN.sgbRefresh();
  CommonMAIN.sgbTestAccount();
  if (equal(ProjectSuite.Variables.ActiveUserType, "Trader")) {
    BackOfficeMAIN.sgbSwitchBackOfficeUser();
  }

  // request transfer
  PortalINT.intRequestTransfer("Over Limit");
}

// TC17204 > Verify Payment Service/Subservice - Limit Test
function testCase_17204() {
  // set fc transaction type
  ProjectSuite.Variables.ServiceType = "Payment";
  ProjectSuite.Variables.TransactionType = "Foreign Currency Payment";

  // refresh test data and account
  CommonMAIN.sgbRefresh();
  CommonMAIN.sgbTestAccount();
  if (!equal(ProjectSuite.Variables.ActiveUserType, "Trader")) {
    PortalMAIN.sgbSwitchToPortalTrader();
  }

  // request foreign currency transfer - limit tests
  PortalPAY.payRequestTransfer("Over Limit");
  PortalPAY.payRequestTransfer("Limit Test");
}

function limitSuiteLogout() {
  // refresh test data for logout
  CommonMAIN.sgbRefresh();
}
