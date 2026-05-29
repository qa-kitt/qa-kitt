//USEUNIT BackOfficeMAIN
//USEUNIT BackOfficeSQL
//USEUNIT CommonDDT
//USEUNIT CommonMAIN
//USEUNIT CommonSQL
//USEUNIT PortalFX
//USEUNIT PortalMAIN
//USEUNIT PortalSEN
//USEUNIT PortalSQL

/***************************************************************
Name: Sen_SUITE
Description: Automated test cases - Portal: SEN Transfers
Author: Kitt Random
Creation Date: 01/31/2022
***************************************************************/

function senSuiteLogin() {
  // login to portal as trader
  ProjectSuite.Variables.ActiveTestSuite = "SEN";
  CommonMAIN.sgbRefresh();
  if (!equal(ProjectSuite.Variables.ActiveUserType, "Trader")) {
    CommonMAIN.sgbLogout();
    PortalMAIN.loginPortalTrader();
  }
}

// TC25305 > SEN: Transfer Limits
/***************************************************************/
function testCase_25305() {
  // refresh test data
  ProjectSuite.Variables.ServiceType = "SEN Transfer";
  ProjectSuite.Variables.TransactionType = "Transfer";

  // refresh test data and account
  CommonMAIN.sgbRefresh();
  CommonMAIN.sgbTestAccount();

  // open profile services and login as admin
  BackOfficeMAIN.navigateBackOffice("profiles");
  if (equal(ProjectSuite.Variables.ActiveUserType, "Trader")) {
    BackOfficeMAIN.sgbSwitchBackOfficeUser();
  }

  // update service limit and save changes
  BackOfficeADMIN.adminProfileNavigation("Services");
  BackOfficeADMIN.adminVerifyProfileServices("Transaction Limit", 1, "Save");

  // switch profiles and approve request
  BackOfficeMAIN.sgbSwitchBackOfficeUser();
  BackOfficeADMIN.adminApprovalAction("Profiles", "Approve", "0");

  // request transfer > new limit
  PortalSEN.senRequestTransfer("Limit Test");
}

// TC17538 > SEN: Insufficient Funds
/***************************************************************/
function testCase_17538() {
  // set sen transaction type
  ProjectSuite.Variables.ServiceType = "SEN Transfer";
  ProjectSuite.Variables.TransactionType = "Transfer";

  // refresh test data and account
  CommonMAIN.sgbRefresh();
  CommonMAIN.sgbTestAccount();

  // request transfer
  PortalSEN.senRequestTransfer("Over Limit");
}

// TC17539 > SEN: Transfer Eligibility
/***************************************************************/
function testCase_17539() {
  // refresh test data
  ProjectSuite.Variables.ServiceType = "SEN Transfer";
  ProjectSuite.Variables.TransactionType = "Transfer";

  // refresh test data and account
  CommonMAIN.sgbRefresh();
  CommonMAIN.sgbTestAccount();

  // open profile admin
  PortalMAIN.sgbSwitchPortalUser();
  BackOfficeADMIN.adminProfileNavigation("Services");

  // verify sen service
  BackOfficeADMIN.adminVerifyProfileServices("Transaction Limit", 1, "Save");

  // request transfer > new limit
  PortalSEN.senRequestTransfer(1);
}

// TC17540 > SEN: Back Office Connections
/***************************************************************/
function testCase_17540() {
  // refresh test data
  ProjectSuite.Variables.ServiceType = "SEN Transfer";
  ProjectSuite.Variables.TransactionType = "Transfer";

  // refresh test data and account
  CommonMAIN.sgbRefresh();
  CommonMAIN.sgbTestAccount();

  // open profile admin
  PortalMAIN.sgbSwitchPortalUser();
  BackOfficeADMIN.adminProfileNavigation("Services");

  // verify sen service
  BackOfficeADMIN.adminVerifyProfileServices("Transaction Limit", 1, "Save");

  // request transfer > new limit
  PortalSEN.senRequestTransfer(1);
}

// TC17538 > SEN: Limits
/***************************************************************/
function testCase_17543() {
  // refresh test data
  ProjectSuite.Variables.ServiceType = "SEN Transfer";
  ProjectSuite.Variables.TransactionType = "Transfer";

  // refresh test data and account
  CommonMAIN.sgbRefresh();
  CommonMAIN.sgbTestAccount();

  // open profile services and login as admin
  BackOfficeMAIN.navigateBackOffice("profiles");
  if (equal(ProjectSuite.Variables.ActiveUserType, "Trader")) {
    BackOfficeMAIN.sgbSwitchBackOfficeUser();
  }

  // update service limit and save changes
  BackOfficeADMIN.adminProfileNavigation("Services");
  BackOfficeADMIN.adminVerifyProfileServices("Transaction Limit", 1, "Save");

  // switch profiles and approve request
  BackOfficeMAIN.sgbSwitchBackOfficeUser();
  BackOfficeADMIN.adminApprovalAction("Profiles", "Approve", "0");

  // request transfer > new limit
  PortalSEN.senRequestTransfer("Limit Test");
}

// TC16217 > SEN Transfer Confirmation
function testCase_16217() {
  // set sen transaction type
  ProjectSuite.Variables.ServiceType = "SEN Transfer";
  ProjectSuite.Variables.TransactionType = "Transfer";

  // refresh test data and account
  CommonMAIN.sgbRefresh();
  CommonMAIN.sgbTestAccount();

  // request transfer
  PortalSEN.senRequestTransfer(1);
}

// TC15671 > SEN: Transfer Limits
/***************************************************************/
function testCase_15671() {
  // refresh test data
  ProjectSuite.Variables.ServiceType = "SEN Transfer";
  ProjectSuite.Variables.TransactionType = "Transfer";

  // refresh test data and account
  CommonMAIN.sgbRefresh();
  CommonMAIN.sgbTestAccount();

  // open profile services and login as admin
  BackOfficeMAIN.navigateBackOffice("profiles");
  if (equal(ProjectSuite.Variables.ActiveUserType, "Trader")) {
    BackOfficeMAIN.sgbSwitchBackOfficeUser();
  }

  // update service limit and save changes
  BackOfficeADMIN.adminProfileNavigation("Services");
  BackOfficeADMIN.adminVerifyProfileServices("Transaction Limit", 1, "Save");

  // switch profiles and approve request
  BackOfficeMAIN.sgbSwitchBackOfficeUser();
  BackOfficeADMIN.adminApprovalAction("Profiles", "Approve", "0");

  // request transfer > new limit
  PortalSEN.senRequestTransfer("Limit Test");
}

function senSuiteLogout() {
  // refresh test data for logout
  CommonMAIN.sgbRefresh();
}
